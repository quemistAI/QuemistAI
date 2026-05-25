import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Configure body-parser to handle larger file sizes for base64 photo transfers securely
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Initialize Gemini SDK with named parameters & telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Primary System Prompts for Tutoring Concept
const SYSTEM_PROMPTS = {
  general: `You are "Quemist", an expert AI Organic Chemistry Tutor for Organic Chemistry 1 and 2. 
Your tone is encouraging, academically precise, clear, and focused on building student intuition.
When answering student questions:
1. Provide a direct, clear summary answer first.
2. Break down the mechanical steps, electronic effects (e.g., resonance, induction, hyperconjugation), and steric considerations.
3. Use clean chemical naming (IUPAC), write elegant explanations of reaction arrows (nucleophile to electrophile), and detail intermediate states (like carbocations, radical structures, bromonium ions).
4. Do not just give the final answer. Teach them HOW to arrive at the answer using fundamental chemistry concepts (pKa, regiochemistry, stereochemistry: Markovnikov, stereocenters, R/S configurations, nucleophilicity, leaving group ability).
5. Suggest related key rules or mnemonics (e.g., Baeyer Villiger, Zaitsev's rule, anti-coplanar transition states) where applicable.
6. Format your output beautifully using standard Markdown. Use clear headings, bold terms, list items, and represent chemical formulas clearly (e.g. H2SO4, t-BuOK, SN2, CH3CH2OH). Use text-based IUPAC structures or structural formulas (e.g., CH3-CH(OH)-CH3) to represent organic molecules wherever helpful.`,

  photo_analysis: `You are "Quemist", an expert Organic Chemistry Tutor analyzing hand-drawn or digital student work.
Review the user-provided photo of their reaction mechanism, chemical synthesis, stereochemical assignment, or spectroscopy chart.
Structure your detailed feedback as follows:
1. **Identified Content**: Describe what structure, reaction, or mechanism is featured in the image.
2. **Correct Coordinates**: Point out parts of their drawing or solution that are correct (e.g., "Great job pointing the arrow from the alkene lone pair..." or "Correct stereochemical configuration").
3. **Misconceptions & Pitfalls**: Explain any misplaced arrows, formal charges, incorrect stereochemistry (e.g., inversion vs retention in SN2), or regiochemical mistakes (e.g., anti-Markovnikov error).
4. **Step-by-Step Correct Solution**: Provide the solid, mathematically and electronically correct mechanism or structure, detailing:
   - Nucleophile, electrophile, leaving group
   - Intermediate structures (e.g. carbocation, tetrahedral intermediate)
   - Product regiochemistry and stereochemistry (racemic, diastereomers, enantioselective).
5. **Next Step Challenge**: Probe their learning with 1 simple follow-up question related directly to this reaction.
Keep it strictly educational, precise, and supportive. Use bold headings and Markdown formatting.`,

  synthesis: `You are "Quemist", a brilliant Organic Chemistry synthesis architect. You assist students in planning multi-step retro-synthetic and forward-synthetic pathways.
Given a starting material and target product:
1. Break down the synthesis backward (retrosynthesis) and forward.
2. Provide a clear, step-by-step synthetic sequence with reagents (e.g., 1. O3, 2. DMS; or 1. Br2/hv, 2. t-BuOK).
3. Detail the reaction mechanism type (e.g., hydroboration-oxidation, Wittig reaction, Claisen condensation) for every step.
4. Explain WHY each reagent is selected, detailing the regiochemistry (Markovnikov or anti-Markovnikov) and stereoselectivity (syn or anti addition).
5. Call out potential side reactions or competing elimination pathways and how to avoid them.
Ensure beautiful Markdown formatting with high academic value.`,

  spectroscopy: `You are "Quemist", a skilled Spectroscopist specializing in IR, 1H-NMR, 13C-NMR, and Mass Spectrometry for Organic active structure determination.
Analyze the user's spectroscopy query or uploaded spectrum image. Include:
1. **Signal Interpretation**: Table/list of major IR stretches (e.g., 1715 cm-1 carbonyl, 3300 cm-1 alcohol) or NMR peaks (chemical shift, integration, multiplicity/splitting, and neighboring hydrogens).
2. **Degree of Unsaturation (DU/IHD)**: Explicitly calculate Degree of Unsaturation if formula is available.
3. **Fragments and Substructures**: Describe what functional groups are definitely present or absent.
4. **Final Structured Solution**: Propose the structure and explain how all data pieces fit together to confirm that structure.
Provide highly engaging feedback styled with clear Markdown.`
};

// POST Tutor Endpoint handles both conversational Q&A and image-based homework checks
app.post("/api/tutor", async (req, res) => {
  try {
    const { message, image, mimeType, mode = "general", history = [] } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image is required." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "Database configuration (GEMINI_API_KEY) is missing. Set it up via Secrets panel first.",
      });
    }

    // Set appropriate instructions based on tutor mode
    let systemInstruction = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;

    // Append a non-negotiable instruction to strictly avoid raw LaTeX / math-mode blocks and require a 'TL;DR' summary
    systemInstruction += "\n\nCRITICAL SPECIFIC FORMATTING RULES:\n" +
      "- ALWAYS start your response with a dedicated and clear '### TL;DR' heading/section at the very top. This should summarize the general answer in 1-3 highly concise, student-friendly sentences, followed immediately by a horizontal separator line ('---'). Do not place any greetings or intro before this TL;DR section.\n" +
      "- NEVER generate LaTeX mathematical equations or blocks (such as $$ ... $$, $ ... $, \\text{...}, or \\xrightarrow{...}).\n" +
      "- Always write chemical structures, reaction formulas, and reaction mechanisms in clean plain-text Unicode formatted strings.\n" +
      "- For reaction equations, write out steps like: 'R-LG ⟶ R+ + LG-' or 'CH3CH2OH + HBr ⟶ CH3CH2Br + H2O'.\n" +
      "- Use standard arrow characters (e.g., ⟶, ⇌, ⟵) for chemical transitions.";

    // Build parts for content payload representation
    const parts: any[] = [];

    // If there is an image, convert to part format
    if (image && mimeType) {
      // Image data from base64 string
      const rawBase64 = image.includes("base64,") ? image.split("base64,")[1] : image;
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: rawBase64,
        },
      });
    }

    // Append the user query or context
    parts.push({
      text: message || "Analyze this organic chemistry work in the image and provide detailed, encouraging feedback.",
    });

    // In model selection, use 'gemini-3.5-flash' for robust, fast, multi-modal organic chemistry tutor responses
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.15, // slightly lower temperature for scientific accuracy & reliable organic mechanism grading
      },
    });

    const outputText = response.text || "I was unable to analyze this properly. Please verify the photo quality and try again.";
    
    return res.json({
      success: true,
      feedback: outputText,
    });
  } catch (error: any) {
    console.error("Tutor request error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during chemical analysis.",
    });
  }
});

// GET or POST Dynamic Question Generation Endpoint
app.post("/api/generate-question", async (req, res) => {
  try {
    const { topicId, topicName, topicLevel } = req.body;

    if (!topicId || !topicName) {
      return res.status(400).json({ error: "topicId and topicName are required." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "Database configuration (GEMINI_API_KEY) is missing. Set it up via Secrets panel first.",
      });
    }

    const generatorPrompt = `Generate a highly creative, unique, and academically rigorous Organic Chemistry practice question for the following topic:
Topic: ${topicName} (Level: ${topicLevel || "Orgo 1 or 2"})

CRITICAL FORMATTING INSTRUCTIONS:
- NEVER generate LaTeX mathematical equations or blocks (such as $$ ... $$, $ ... $, \\text{...}, or \\xrightarrow{...}).
- Use clean plain-text Unicode formatted strings. Always write chemical compounds, reaction formulas, or products in clean plain-text Unicode (e.g., H₂O, CH₃CH₂OH, H⁺, H₃O⁺).
- Randomly choose between "multiple-choice" or "free-response" types.
- If it is multiple-choice, provide exactly 4 distinct options under the 'options' field, and assign 'correctAnswer' to be exactly one of those options.
- If it is free-response, omit the 'options' field, and provide a 1-sentence description under 'correctAnswer' outlining the key mechanism or concepts expected in a correct answer.

Generate your response in raw JSON format matching this schema exactly:
{
  "id": "generated-${Date.now()}",
  "topicId": "${topicId}",
  "questionText": "The actual question body. Make it challenging and interesting.",
  "hint": "A supportive tutor hint outlining the mechanical or structural key to the question.",
  "type": "multiple-choice" or "free-response",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: generatorPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9, // Higher temperature for endless variation and new questions every time
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response from AI question generator.");
    }

    const questionJson = JSON.parse(outputText.trim());
    return res.json({
      success: true,
      question: questionJson,
    });
  } catch (error: any) {
    console.error("Question Generation Error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during dynamic question generation.",
    });
  }
});

// Setup Vite & Static Files handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quemist server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
