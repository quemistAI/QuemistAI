import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  GraduationCap, 
  MessageSquare, 
  Camera, 
  GitFork, 
  Activity, 
  Send, 
  Upload, 
  Video, 
  VideoOff, 
  RotateCcw, 
  Check, 
  CheckSquare, 
  AlertTriangle, 
  Info, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Search, 
  Layers, 
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { ORGO_TOPICS, PRACTICE_QUESTIONS, CHEMISTRY_TOOLS } from "./data";
import { Topic, PracticeQuestion, ChemistryTool, Message, TutorMode } from "./types";

// Helper function to dynamically replace LaTeX formatting into beautiful Unicode
function cleanMathLatex(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove $$ and $ markers but keep the content
  cleaned = cleaned.replace(/\$\$(.*?)\$\$/g, "$1");
  cleaned = cleaned.replace(/\$(.*?)\$/g, "$1");

  // 2. Clean up \xrightarrow[bottom]{top} or \xrightarrow{top}
  cleaned = cleaned.replace(/\\xrightarrow(?:\[([^\]]*)\])?\{([^\}]*)\}/g, (match, bottom, top) => {
    const cleanTop = top.replace(/\\text\{([^\}]*)\}/g, "$1").replace(/\\/g, "").trim();
    const cleanBottom = bottom ? bottom.replace(/\\text\{([^\}]*)\}/g, "$1").replace(/\\/g, "").trim() : "";
    
    if (cleanBottom) {
      return ` ⎯⎯⎯[${cleanTop} / ${cleanBottom}]⟶ `;
    }
    return ` ⎯⎯⎯[${cleanTop}]⟶ `;
  });

  // 3. Clean up \text{...} to just ...
  cleaned = cleaned.replace(/\\text\{([^\}]*)\}/g, "$1");

  // 4. Convert superscripts (e.g. ^+ or ^- or ^1)
  cleaned = cleaned.replace(/\^([+-]|\d+)/g, (match, val) => {
    const supers: { [key: string]: string } = {
      "+": "⁺", "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
    };
    return val.split("").map((c: string) => supers[c] || c).join("");
  });

  // 5. Convert subscripts only if they are short, e.g. H_2O
  cleaned = cleaned.replace(/_([a-zA-Z0-9+-]+)/g, (match, val) => {
    if (val.length <= 4) {
      const subs: { [key: string]: string } = {
        "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
        "+": "₊", "-": "₋",
        "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ"
      };
      return val.split("").map((c: string) => subs[c] || c).join("");
    }
    return match;
  });

  // 6. Standard arrow and greek letter replacements for chemistry
  cleaned = cleaned.replace(/\\rightarrow/g, "⟶");
  cleaned = cleaned.replace(/\\leftarrow/g, "⟵");
  cleaned = cleaned.replace(/\\rightleftharpoons/g, "⇌");
  cleaned = cleaned.replace(/\\leftrightarrow/g, "↔");
  cleaned = cleaned.replace(/\\Delta/g, "Δ");
  cleaned = cleaned.replace(/\\delta/g, "δ");
  cleaned = cleaned.replace(/\\alpha/g, "α");
  cleaned = cleaned.replace(/\\beta/g, "β");
  cleaned = cleaned.replace(/\\pi/g, "π");
  cleaned = cleaned.replace(/\\sigma/g, "σ");
  cleaned = cleaned.replace(/\\degree/g, "°");
  cleaned = cleaned.replace(/\\circ/g, "°");

  // 7. Strip remaining double backslashes or backslashes
  cleaned = cleaned.replace(/\\+/g, "");

  return cleaned;
}

// Dynamic Chemistry Markdown Formatter to render academic feedback elegantly
function ChemistryMarkdown({ text }: { text: string }) {
  if (!text) return null;

  // Clean raw LaTeX or math expressions into beautiful Unicode representation first
  const cleanedText = cleanMathLatex(text);

  // Split content by paragraphs/headers
  const lines = cleanedText.split("\n");

  return (
    <div className="space-y-3 Unicode-Chemistry text-slate-300 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Headers
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-sm font-semibold text-emerald-400 font-display mt-4 mb-2 flex items-center gap-2 border-b border-white/10 pb-1">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm inline-block animate-pulse"></span>
              {trimmed.replace("### ", "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-base font-bold text-emerald-300 font-display mt-5 mb-2 border-b border-white/5 pb-1">
              {trimmed.replace("## ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="text-lg font-bold text-white font-display mt-6 mb-3">
              {trimmed.replace("# ", "")}
            </h2>
          );
        }

        // 2. Horizontal divider
        if (trimmed === "---") {
          return <hr key={idx} className="border-t border-white/10 my-4" />;
        }

        // 3. Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="text-emerald-400 mt-1.5 text-xs">●</span>
              <p className="flex-1 text-slate-300">{parseInlineFormatting(content)}</p>
            </div>
          );
        }

        // 4. Numbered lists
        const numberedMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const content = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold min-w-[20px] text-center mt-0.5 border border-emerald-500/20">
                {num}
              </span>
              <p className="flex-1 text-slate-300">{parseInlineFormatting(content)}</p>
            </div>
          );
        }

        // 5. Code block lines (often representing chemical formulas, mechanisms or NMR peak signals)
        if (trimmed.startsWith("```")) {
          return null; // Ignore start/end tags, we can wrap the text elegantly
        }

        // Standard paragraph
        if (trimmed === "") return <div key={idx} className="h-2"></div>;

        return (
          <p key={idx} className="text-slate-300">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Convert markdown bold (**abc**) or inline code (\`abc\`) or chemical arrows to beautiful nodes
function parseInlineFormatting(str: string) {
  // Regex to split on bold segments
  const parts = str.split(/(\*\*.*?\*\*|`.*?`|->|→)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/10 text-xs">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="font-mono text-xs bg-slate-900 border border-white/10 text-emerald-350 px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part === "->" || part === "→") {
      return (
        <span key={index} className="font-mono font-bold text-emerald-400 mx-1">
          ⟶
        </span>
      );
    }
    return part;
  });
}

export default function App() {
  // Navigation & Workspace states
  const [activeTab, setActiveTab] = useState<"tutor" | "practice" | "cheatsheet">("tutor");
  const [selectedTool, setSelectedTool] = useState<ChemistryTool>(CHEMISTRY_TOOLS[0]);
  const [studentInput, setStudentInput] = useState("");
  
  // Loading & tutor feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [currentScanStep, setCurrentScanStep] = useState<string>("");

  // Photo uploading or capturing states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Practice section states
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<PracticeQuestion | null>(null);
  const [quizChoice, setQuizChoice] = useState<string>("");
  const [quizTextAnswer, setQuizTextAnswer] = useState<string>("");
  const [quizScoreFeedback, setQuizScoreFeedback] = useState<{
    correct: boolean | null;
    analysis: string;
  } | null>(null);
  const [isGradingQuiz, setIsGradingQuiz] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  // References and stream tracking for Webcam capture
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic practice question generator
  const generateNewQuestionForTopic = async (topicId: string) => {
    if (!topicId) return;
    setIsGeneratingQuestion(true);
    setQuizChoice("");
    setQuizTextAnswer("");
    setQuizScoreFeedback(null);

    const topic = ORGO_TOPICS.find(t => t.id === topicId);
    if (!topic) {
      setIsGeneratingQuestion(false);
      return;
    }

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: topic.id,
          topicName: topic.name,
          topicLevel: topic.level,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      if (data.success && data.question) {
        setActiveQuizQuestion(data.question);
      } else {
        throw new Error("Invalid response schema");
      }
    } catch (err) {
      console.warn("Dynamic generation failed, falling back to static questions.", err);
      // Fallback to static practice questions filtering
      const fallbackQs = PRACTICE_QUESTIONS.filter(pq => pq.topicId === topicId);
      if (fallbackQs.length > 0) {
        const randomQ = fallbackQs[Math.floor(Math.random() * fallbackQs.length)];
        setActiveQuizQuestion(randomQ);
      } else {
        setActiveQuizQuestion(null);
      }
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  // Set Default Quiz Topic
  useEffect(() => {
    if (ORGO_TOPICS.length > 0) {
      setSelectedTopicId(ORGO_TOPICS[0].id);
    }
  }, []);

  // Set Quiz Question when selected topic changes
  useEffect(() => {
    if (selectedTopicId) {
      generateNewQuestionForTopic(selectedTopicId);
    }
  }, [selectedTopicId]);

  // Handle Drag & Drop utilities
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const selectFileManual = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file of your chemistry homework.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageMime(file.type);
      // Automatically toggle mode to Photo Homework analysis for enhanced chemistry flow
      const photoTool = CHEMISTRY_TOOLS.find(t => t.mode === "photo_analysis");
      if (photoTool) {
        setSelectedTool(photoTool);
      }
    };
    reader.readAsDataURL(file);
  };

  // Turn on student webcam
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to open device camera. Please make sure camera permissions are enabled, or select/drag any image file from your computer instead.");
      setCameraActive(false);
    }
  };

  // Capture photo snapshot from stream
  const capturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setImageMime("image/jpeg");
        
        // Swap workspace mode to Photo Analysis 
        const photoTool = CHEMISTRY_TOOLS.find(t => t.mode === "photo_analysis");
        if (photoTool) {
          setSelectedTool(photoTool);
        }
      }
      stopCamera();
    }
  };

  // Turn off device camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Clear loaded photo
  const clearPhoto = () => {
    setImagePreview(null);
    setImageMime(null);
    stopCamera();
  };

  // Submit Q&A problem to server-side Gemini API Proxy
  const handleTeacherSubmit = async () => {
    if (!studentInput.trim() && !imagePreview) {
      alert("Please write down an organic chemistry question or upload/take a photo of your exercise.");
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    
    // Nice scanning animation step simulations
    const scanPhases = [
      "Analyzing molecular formulas & stereocenters...",
      "Tracing nucleophile-to-electrophile organic electronic movement...",
      "Validating reaction conditions (pKa, solvents, temperatures)...",
      "Drafting detailed tutor feedback with step-by-step mechanism justification..."
    ];
    
    let currentPhaseIdx = 0;
    setCurrentScanStep(scanPhases[0]);
    const phaseInterval = setInterval(() => {
      currentPhaseIdx++;
      if (currentPhaseIdx < scanPhases.length) {
        setCurrentScanStep(scanPhases[currentPhaseIdx]);
      }
    }, 1800);

    try {
      const requestPayload = {
        message: studentInput,
        image: imagePreview,
        mimeType: imageMime,
        mode: selectedTool.mode,
      };

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      clearInterval(phaseInterval);

      if (!response.ok) {
        throw new Error(data.error || "The server rejected the chemical analysis request.");
      }

      setFeedback(data.feedback);
    } catch (err: any) {
      clearInterval(phaseInterval);
      setFeedback(`### Error\n\n⚠️ **Unable to fetch feedback:** ${err.message || "An unknown network problem occurred. Please check your developer configurations and try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Smart grading for practice quizzes using AI
  const handleQuizSubmit = async () => {
    if (!activeQuizQuestion) return;

    let userAns = "";
    if (activeQuizQuestion.type === "multiple-choice") {
      if (!quizChoice) {
        alert("Please select one of the multiple-choice options.");
        return;
      }
      userAns = quizChoice;
    } else {
      if (!quizTextAnswer.trim()) {
        alert("Please write down your mechanism explanation or answer details.");
        return;
      }
      userAns = quizTextAnswer;
    }

    setIsGradingQuiz(true);
    setQuizScoreFeedback(null);

    try {
      // Craft a short custom request to analyze the practice question
      const prompt = `Review the following student answer for this Organic Chemistry Practice Question.
Topic: ${ORGO_TOPICS.find(t => t.id === selectedTopicId)?.name}
Question: "${activeQuizQuestion.questionText}"
${activeQuizQuestion.correctAnswer ? `Target Answer criteria: "${activeQuizQuestion.correctAnswer}"` : ""}
Student's Submitted Answer: "${userAns}"

Is the student's answer correct, partially correct, or incorrect? 
Provide your grading critique structured inside valid JSON format as follows:
{
  "correct": true or false,
  "analysis": "A brief 2-3 sentence friendly explanation detailing why their choice is correct, or detailing any mechanistic stereocenters or regiochemical factors they missed."
}`;

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          mode: "general"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Quiz evaluation failed.");
      }

      // Try to parse clean JSON block from feedback, else salvage it
      let parsed = { correct: false, analysis: data.feedback };
      try {
        const jsonMatch = data.feedback.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          // If the AI returned standard markdown text, parse criteria
          parsed.correct = userAns === activeQuizQuestion.correctAnswer;
          parsed.analysis = data.feedback;
        }
      } catch (parseErr) {
        console.warn("Failed parsing exact JSON, fallback active.");
      }

      setQuizScoreFeedback(parsed);
    } catch (error: any) {
      setQuizScoreFeedback({
        correct: null,
        analysis: `Could not grade quiz. Reason: ${error.message || "Endpoint error"}`
      });
    } finally {
      setIsGradingQuiz(false);
    }
  };

  // Switch topics during practice mode
  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  // Helper template questions to populate in tutor inputs
  const injectSamplePrompt = (text: string) => {
    setStudentInput(text);
  };

  // Clean workspace
  const handleResetWorkspace = () => {
    setStudentInput("");
    setFeedback(null);
    clearPhoto();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans select-none antialiased selection:bg-emerald-500/20 pb-12 relative overflow-hidden">
      
      {/* 🔮 Frosted Glass Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* ⚛️ Top Elegant Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-500/35 bg-emerald-500/5">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-emerald-400 stroke-emerald-400 fill-none" strokeLinecap="round" strokeLinejoin="round">
              {/* The main hexagon aromatic ring */}
              <polygon points="44,18 66.5,31 66.5,57 44,70 21.5,57 21.5,31" className="stroke-[2.5]" />
              
              {/* The three delocalized double bonds (Kekule form) */}
              <line x1="61.5" y1="34" x2="61.5" y2="54" className="stroke-[2]" />
              <line x1="27" y1="33" x2="44.5" y2="23" className="stroke-[2]" />
              <line x1="43.5" y1="64.5" x2="26" y2="54.5" className="stroke-[2]" />
              
              {/* Substituent bond to methyl group */}
              <line x1="66.5" y1="57" x2="78" y2="68" className="stroke-[2.5]" strokeLinecap="round" />
              
              {/* CH3 methyl label */}
              <text x="79" y="78" className="fill-emerald-450 stroke-none font-sans font-extrabold text-[15px] select-none">CH₃</text>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-white">Quemist</h1>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#10b981] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Orgo 1 & 2 Tutor
              </span>
            </div>
            <p className="text-xs text-slate-400">An immersive AI-powered Organic Chemistry Companion</p>
          </div>
        </div>

        {/* Navigation Tabs (Frosted glass controls) */}
        <div className="flex bg-black/35 p-1 rounded-xl border border-white/10">
          <button 
            id="tab-tutor"
            onClick={() => setActiveTab("tutor")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === "tutor" 
                ? "bg-white/10 text-white shadow-sm border border-white/5" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Chat Tutor
          </button>
          <button 
            id="tab-practice"
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === "practice" 
                ? "bg-white/10 text-white shadow-sm border border-white/5" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Interactive Quizzes
          </button>
          <button 
            id="tab-cheatsheet"
            onClick={() => setActiveTab("cheatsheet")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === "cheatsheet" 
                ? "bg-white/10 text-white shadow-sm border border-white/5" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Study Reference
          </button>
        </div>
      </header>

      {/* 🏢 Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start z-10">
        
        {/* ======================= LEFT WORKSPACE PANEL (Lg: 7 Columns) ======================= */}
        <section id="left-workspace" className={`${activeTab === "cheatsheet" ? "lg:col-span-12" : "lg:col-span-7"} flex flex-col gap-6 w-full`}>
          
          <AnimatePresence mode="wait">
            {activeTab === "tutor" && (
              <motion.div 
                key="tutor-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. TUTOR PROFILE & SHORTCUT TOOLS */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold font-display uppercase tracking-widest text-[#94a3b8] mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Select a Tutoring Sub-Specialty
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CHEMISTRY_TOOLS.map((tool) => {
                      const isSelected = selectedTool.id === tool.id;
                      return (
                        <button
                          key={tool.id}
                          id={`tool-${tool.id}`}
                          onClick={() => {
                            setSelectedTool(tool);
                            // Auto trigger corresponding prompts of interest
                            if (tool.mode === "synthesis") {
                              setStudentInput("Succeed retrosynthesis for: Benzoic acid from Benzene");
                            } else if (tool.mode === "spectroscopy") {
                              setStudentInput("Assign building block structure for formula C4H10O containing sharp peaks around 3300 cm-1 and NMR singlet at 1.2 ppm...");
                            }
                          }}
                          className={`text-left p-3.5 rounded-xl border transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                            isSelected 
                              ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm shadow-emerald-500/5 text-white" 
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              isSelected ? "bg-emerald-500 text-slate-950 font-bold" : "bg-white/5 text-slate-400"
                            }`}>
                              {tool.icon === "Ask" && <MessageSquare className="w-4 h-4" />}
                              {tool.icon === "Camera" && <Camera className="w-4 h-4" />}
                              {tool.icon === "GitFork" && <GitFork className="w-4 h-4" />}
                              {tool.icon === "Activity" && <Activity className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                                isSelected ? "text-emerald-350" : "text-slate-200"
                              }`}>
                                {tool.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. PHOTO CAPTURE & UPLOAD (CRITICAL REQUIREMENT) */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">Mechanism & Homework Photo Scanner</h3>
                    </div>
                    {imagePreview && (
                      <button 
                        onClick={clearPhoto}
                        className="text-[11px] font-semibold text-rose-450 hover:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded cursor-pointer border border-rose-500/20"
                      >
                        Reset Media
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Dropzone area */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center transition-all min-h-[160px] ${
                        dragOver ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <Upload className="w-7 h-7 text-slate-400 mb-2 animate-bounce" />
                      <p className="text-xs font-medium text-slate-200">Drag & drop chemical diagrams</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Supports PNG or JPG snapshots</p>
                      <button 
                        onClick={selectFileManual}
                        className="mt-3 px-3 py-1.5 bg-white/10 text-slate-200 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/15 cursor-pointer shadow-xs"
                      >
                        Choose File
                      </button>
                    </div>

                    {/* Interactive Webcam capturing */}
                    <div className="border border-white/10 rounded-xl p-3 bg-white/5 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                      {cameraActive ? (
                        <div className="w-full h-full flex flex-col items-center">
                          <video 
                            ref={videoRef} 
                            className="w-full max-h-[120px] object-cover rounded-lg border border-white/10" 
                            playsInline 
                            muted
                          />
                          <div className="flex gap-2 mt-2 w-full justify-center">
                            <button 
                              onClick={capturePhoto}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                            >
                              Capture Frame
                            </button>
                            <button 
                              onClick={stopCamera}
                              className="px-3 py-1 bg-white/10 hover:bg-white/15 text-slate-200 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <VideoOff className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                          <h4 className="text-xs font-semibold text-slate-200">Use Laptop / Device Camera</h4>
                          <p className="text-[10px] text-slate-500 mt-1 px-4 leading-normal">Take a live photo of your textbook drawing directly</p>
                          <button 
                            onClick={startCamera}
                            className="mt-3 px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 cursor-pointer flex items-center gap-1.5 mx-auto shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Enable Camera
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Preview attachment bar */}
                  {imagePreview && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={imagePreview} 
                          alt="Homework diagram attachment" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover border border-emerald-500/35 bg-black/40" 
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-emerald-400 truncate">Homework snapshot attached</h5>
                          <p className="text-[10px] text-slate-400">Quemist will process this drawing with AI analysis</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold bg-emerald-500/25 text-emerald-350 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                          Ready to Scan
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 3. STUDENT WRITING INPUT (FORMULATE QUESTIONS) */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold font-display uppercase tracking-widest text-[#94a3b8] flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-emerald-400 rounded"></span>
                        Formulate your question
                      </label>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono">
                        Mode: {selectedTool.name}
                      </span>
                    </div>
                    <textarea
                      id="student-textarea"
                      value={studentInput}
                      onChange={(e) => setStudentInput(e.target.value)}
                      placeholder={selectedTool.placeholder}
                      className="w-full text-sm p-4 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none font-sans leading-relaxed min-h-[120px] text-white placeholder:text-slate-500"
                    />
                  </div>

                  {/* Submission triggers */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <button 
                      onClick={handleResetWorkspace}
                      className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Workspace
                    </button>
                    <button
                      id="btn-ask-tutor"
                      onClick={handleTeacherSubmit}
                      disabled={isLoading}
                      className={`px-5 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black rounded-xl text-xs select-none flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 transition-all ${
                        isLoading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-dashed border-slate-950 animate-spin"></span>
                          Crunching chemical data...
                        </>
                      ) : (
                        <>
                          <Send className="w-4.5 h-4.5" />
                          Consult Quemist AI Tutor
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRACTICE QUIZ TAB */}
            {activeTab === "practice" && (
              <motion.div 
                key="practice-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-base font-bold font-display text-white border-b border-white/10 pb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    Interactive Orgo 1 & 2 Practice Suite
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select any key Orgo topic below to trigger standard difficult synthesis problems, stereochemistry assignment challenges, or elimination mechanisms.
                  </p>
                </div>

                {/* Topic selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Select Chem Topic</label>
                  <select 
                    id="select-quiz-topic"
                    value={selectedTopicId}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="w-full text-xs p-3 bg-white/5 border border-white/10 text-white rounded-lg cursor-pointer max-w-md outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {ORGO_TOPICS.map(topic => (
                      <option key={topic.id} value={topic.id} className="bg-slate-950 text-white">
                        [{topic.level}] {topic.name}
                      </option>
                    ))}
                  </select>
                </div>

                {isGeneratingQuestion ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-white/10 bg-white/5 rounded-2xl space-y-4">
                    <span className="w-8 h-8 rounded-full border-4 border-dashed border-emerald-500 animate-spin"></span>
                    <p className="text-xs font-semibold text-emerald-400 font-mono tracking-wide animate-pulse">
                      Synthesizing a dynamic practice challenge...
                    </p>
                    <p className="text-[11px] text-slate-400 text-center max-w-sm">
                      Our AI organic chemistry module is designing a custom mechanistic problem matching your selected chapter parameters.
                    </p>
                  </div>
                ) : activeQuizQuestion ? (
                  <div className="space-y-4 border border-white/5 bg-white/5 p-5 rounded-2xl">
                    <div className="flex justify-between items-center bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-semibold text-white">
                        {ORGO_TOPICS.find(t => t.id === selectedTopicId)?.name} Question
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                        {ORGO_TOPICS.find(t => t.id === selectedTopicId)?.level}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                        {activeQuizQuestion.questionText}
                      </p>
                    </div>

                    {/* Hint section */}
                    <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-start gap-2.5">
                      <Lightbulb className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">Tutor Hint</span>
                        <p className="text-xs text-amber-200/95 mt-0.5 leading-relaxed">{activeQuizQuestion.hint}</p>
                      </div>
                    </div>

                    {/* Answer choices/inputs */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Solution</label>
                      {activeQuizQuestion.type === "multiple-choice" ? (
                        <div className="space-y-2">
                          {activeQuizQuestion.options?.map((option, idx) => (
                            <label 
                              key={idx} 
                              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                quizChoice === option 
                                  ? "bg-emerald-500/10 border-emerald-500" 
                                  : "bg-white/5 border-white/10 hover:border-white/20"
                              }`}
                            >
                              <input 
                                type="radio" 
                                name="quiz-choice"
                                value={option}
                                checked={quizChoice === option}
                                onChange={() => setQuizChoice(option)}
                                className="mt-1 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 bg-transparent border-white/20"
                              />
                              <span className="text-xs text-slate-250 leading-normal">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea 
                          value={quizTextAnswer}
                          onChange={(e) => setQuizTextAnswer(e.target.value)}
                          placeholder="Formulate your detailed answer (describe functional transitions, nucleophilic arrows, stereocenter naming)..."
                          className="w-full text-xs p-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none min-h-[100px] bg-white/5 text-white placeholder:text-slate-500"
                        />
                      )}
                    </div>

                    <div className="pt-2 flex justify-between items-center gap-3 flex-wrap">
                      <button
                        onClick={() => generateNewQuestionForTopic(selectedTopicId)}
                        disabled={isGradingQuiz}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl text-xs flex items-center gap-1 cursor-pointer border border-white/10 transition disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Skip & Generate New
                      </button>
                      <button 
                        onClick={handleQuizSubmit}
                        disabled={isGradingQuiz}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shadow-emerald-500/20"
                      >
                        {isGradingQuiz ? (
                          <>
                            <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                            Evaluating arrows...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4" />
                            Submit & Grade with AI
                          </>
                        )}
                      </button>
                    </div>

                    {/* Result and Explanation Critique section */}
                    {quizScoreFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${
                          quizScoreFeedback.correct === true 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-200" 
                            : quizScoreFeedback.correct === false 
                              ? "bg-rose-500/10 border-rose-500 text-rose-200"
                              : "bg-white/5 border-white/10 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`p-1 rounded-full text-slate-950 ${
                            quizScoreFeedback.correct === true ? "bg-emerald-400" : "bg-rose-400"
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <h4 className="text-xs font-bold uppercase tracking-wide">
                            {quizScoreFeedback.correct === true ? "Correct Answer (100%)" : "Tutor Feedback & Suggestions"}
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed border-t border-white/10 pt-2 font-medium whitespace-pre-line">
                          {quizScoreFeedback.analysis}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                          <button
                            onClick={() => generateNewQuestionForTopic(selectedTopicId)}
                            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shadow-emerald-500/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Load Next Question
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">No questions loaded for this topic yet.</p>
                )}
              </motion.div>
            )}

            {/* REFERENCE SHEETS TAB */}
            {activeTab === "cheatsheet" && (
              <motion.div 
                key="cheat-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-base font-bold font-display text-white border-b border-white/10 pb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    Essential Orgo Reference Sheets
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Quickly check critical criteria parameters, nucleophilic structures, and electronic properties below.
                  </p>
                </div>

                {/* Grid chart: SN1 / SN2 / E1 / E2 */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Substitution vs Elimination decision matrix (Orgo 1)
                  </h3>
                  <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/5 text-slate-300 border-b border-white/10">
                          <th className="p-3 font-semibold">Substrate Halide</th>
                          <th className="p-3 font-semibold">Strong Base / Strong Nuc (e.g., OH-, EtO-)</th>
                          <th className="p-3 font-semibold">Weak Base / Strong Nuc (e.g., I-, N3-, CN-)</th>
                          <th className="p-3 font-semibold">Strong Bulky Base (e.g., t-BuOK)</th>
                          <th className="p-3 font-semibold">Weak Base / Weak Nuc (e.g., H2O, EtOH)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="p-3 font-semibold text-white bg-white/5">Primary (1°)</td>
                          <td className="p-3 bg-emerald-500/5">SN2 (Major) / E2 (Minor)</td>
                          <td className="p-3">SN2 (Only)</td>
                          <td className="p-3 bg-amber-500/5">E2 (Only - Hoffman)</td>
                          <td className="p-3">No Reaction</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-white bg-white/5">Secondary (2°)</td>
                          <td className="p-3 bg-emerald-500/5">E2 (Major) / SN2 (Minor)</td>
                          <td className="p-3">SN2 (Only)</td>
                          <td className="p-3 bg-amber-500/5">E2 (Only)</td>
                          <td className="p-3">Slow SN1 / E1 (Highly heating)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-white bg-white/5">Tertiary (3°)</td>
                          <td className="p-3 bg-emerald-500/5">E2 (Only)</td>
                          <td className="p-3">E2 (Only)</td>
                          <td className="p-3 bg-amber-500/5">E2 (Only)</td>
                          <td className="p-3">SN1 / E1 (Mix)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Directing Groups Table (Orgo 2) */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    Electrophilic Aromatic Substitution (EAS) Directing Chart (Orgo 2)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20 space-y-2">
                      <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Strong Activators (o,p-directors)</h4>
                      <p className="text-[10px] text-emerald-350 leading-normal font-mono">
                        -NH2, -NHR, -OH, -OR
                      </p>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Donate electron density heavily via lone pair resonance stabilization. Increase ring reactivity.
                      </p>
                    </div>

                    <div className="bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20 space-y-2">
                      <h4 className="text-[11px] font-bold text-[#818cf8] uppercase tracking-wide">Weak Activators / Halogens</h4>
                      <p className="text-[10px] text-indigo-300 leading-normal font-mono">
                        Alkyl groups (-CH3), Halogens (-F, -Cl, -Br, -I) [o,p-directing deactivators]
                      </p>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Alkyls donate via hyperconjugation. Halogens withdraw via induction but direct o,p via lone p resonance feedback.
                      </p>
                    </div>

                    <div className="bg-rose-500/10 rounded-xl p-3 border border-rose-500/20 space-y-2">
                      <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">Strong Deactivators (m-directors)</h4>
                      <p className="text-[10px] text-rose-300 leading-normal font-mono">
                        -NO2, -SO3H, -C=N, -COOH, aldehydes & ketones
                      </p>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Strongly withdraw electron density from core ring via resonance induction. Extremely slow reactive rates.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ======================= RIGHT DETAILED FEEDBACK SCREEN (Lg: 5 Columns) ======================= */}
        {activeTab !== "cheatsheet" && (
          <section id="right-feedback" className="lg:col-span-5 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col min-h-[500px] w-full relative">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse"></span>
              <h2 className="text-xs font-bold font-display uppercase tracking-widest text-[#94a3b8]">
                AI feedback screen
              </h2>
            </div>
            {feedback && !isLoading && (
              <button 
                onClick={() => {
                  window.print();
                }}
                className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/25 cursor-pointer"
              >
                Print Breakdown
              </button>
            )}
          </div>

          {/* Dynamic state representation */}
          <div className="flex-1 overflow-y-auto max-h-[600px] pr-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading-box"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                  <div className="relative">
                    {/* Visual chemistry rotating atoms loop */}
                    <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-emerald-400 animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400 fill-none stroke-current stroke-2 animate-pulse">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quemist AI Thinking...</h3>
                    <p className="text-[11px] font-mono text-[#10b981] animate-pulse uppercase tracking-wide px-4">
                      {currentScanStep}
                    </p>
                  </div>
                </motion.div>
              ) : feedback ? (
                <motion.div 
                  key="feedback-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-emerald-500/10 border border-emerald-550/20 p-4 rounded-2xl flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Detailed Academic Critique</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        Your solution was assessed across Orgo principles. Follow structural mechanics below.
                      </p>
                    </div>
                  </div>

                  {/* Chemistry Markdown Text Container */}
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <ChemistryMarkdown text={feedback} />
                  </div>
                  
                  {/* Additional diagnostic follow-ups */}
                  <div className="border-t border-white/10 pt-4 mt-6 space-y-2.5">
                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Helpful Next Steps</h5>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => {
                          setStudentInput(`Let's go 1 step deeper into this mechanism. Show the exact transitions of formal charges that you stated.`);
                          setSelectedTool(CHEMISTRY_TOOLS[0]); // change to general tutor
                        }}
                        className="text-left w-full text-xs p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-emerald-500/35 text-slate-300 transition flex items-center justify-between cursor-pointer"
                      >
                        <span>Deepen mechanistic details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <button 
                        onClick={() => {
                          setStudentInput(`Give me a custom synthesis practice exercise based on this exact reaction topic.`);
                          setSelectedTool(CHEMISTRY_TOOLS[2]); // change to synthesis
                        }}
                        className="text-left w-full text-xs p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-emerald-500/35 text-slate-300 transition flex items-center justify-between cursor-pointer"
                      >
                        <span>Request custom practice exercise</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-slate-500 border border-white/10">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">No query evaluated yet</h3>
                    <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mx-auto">
                      Choose a tutoring specialty list, draft your question or take/attach a homework diagram photo, and trigger AI assessment!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Little elegant design credit in the frame foot */}
          <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>QUEMIST INTEL x18</span>
            <span>2026 UTC CLOCK</span>
          </div>
        </section>
        )}
        
      </main>
    </div>
  );
}
