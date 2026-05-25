import { Topic, PracticeQuestion, ChemistryTool } from "./types";

export const ORGO_TOPICS: Topic[] = [
  {
    id: "structure-bonding",
    name: "Chapter 1: Structure, Bonding & Acids",
    level: "Orgo 1",
    description: "Lewis structures, structural hybridizations (sp3/sp2/sp), molecular geometry, bond dipoles, formal charges, and Bronsted & Lewis acid-base theories.",
    tags: ["Hybridization", "pKa", "Acid-Base", "Dipole"]
  },
  {
    id: "alkanes-conformational",
    name: "Chapter 2: Alkanes & Newman Projections",
    level: "Orgo 1",
    description: "Saturated hydrocarbons, nomenclature, and cycloalkanes conformational analysis (chair, boat, eclipse, staggered, gauche, anti).",
    tags: ["Newman Projection", "Chair Conformation", "Steric Strain"]
  },
  {
    id: "stereochemistry",
    name: "Chapter 3: Stereochemistry & Chirality",
    level: "Orgo 1",
    description: "Enantiomers, diastereomers, meso compounds, chiral centers, optical activity, and assigning Cahn-Ingold-Prelog priority R/S configuration nomenclature.",
    tags: ["Chirality", "R/S Nomenclature", "Enantiomers", "Diastereomers"]
  },
  {
    id: "substitution-elimination",
    name: "Chapter 4: Substitution & Elimination (SN1/SN2/E1/E2)",
    level: "Orgo 1",
    description: "Nucleophilic substitutions and beta-elimination mechanisms based on substrate structure, solvent polarity, base strength, and nucleophilicity.",
    tags: ["SN2", "E2", "Carbocations", "Aprotic", "Zaitsev"]
  },
  {
    id: "alkene-addition",
    name: "Chapter 5: Alkene Synthesis & Addition Reactions",
    level: "Orgo 1",
    description: "Markovnikov and anti-Markovnikov additions, oxymercuration, hydroboration, halogenation, ozonolysis, and syn/anti dihydroxylation stereochemistry.",
    tags: ["Markovnikov", "Hydroboration", "Ozonolysis", "Syn-addition"]
  },
  {
    id: "reactions-alkynes",
    name: "Chapter 6: Alkyne Reactivity & Synthesis",
    level: "Orgo 1",
    description: "Hydrations, hydrohalogenations, metal-ammonia reduction to trans alkenes, Lindlar's hydrogenation to cis alkenes, and terminal acetylide additions.",
    tags: ["Alkynes", "Tautomerization", "Acetylides", "Lindlar"]
  },
  {
    id: "radical-reactions",
    name: "Chapter 7: Radicals & Allylic Halogenation",
    level: "Orgo 1",
    description: "Free radical stability, initiation/propagation/termination steps, regioselective bromination with NBS, anti-Markovnikov hydrobromination.",
    tags: ["Radicals", "Bromination", "NBS", "Initiator"]
  },
  {
    id: "alcohols-ethers",
    name: "Chapter 8: Alcohols, Ethers & Epoxides",
    level: "Orgo 1",
    description: "Synthesis of alcohols via Grignard, dehydration mechanisms, Williamson ether synthesis, ring opening of asymmetric epoxides in acid vs base.",
    tags: ["Epoxides", "Grignard", "Williamson Ether", "Dehydration"]
  },
  {
    id: "conjugated-dienes",
    name: "Chapter 9: Conjugated Systems & Diels-Alder",
    level: "Orgo 2",
    description: "Conjugated double bonds, allylic systems, kinetic vs thermodynamic additions (1,2- vs 1,4-), and the [4+2] Diels-Alder cycloaddition mechanism.",
    tags: ["Diels-Alder", "Conjugation", "Kinetic Product", "Diene"]
  },
  {
    id: "aromaticity-eas",
    name: "Chapter 10: Aromaticity & EAS Reactions",
    level: "Orgo 2",
    description: "Hückel's Rule (4n+2), anti-aromatic systems, and electrophilic aromatic substitutions (EAS directing groups, activators, and meta directors).",
    tags: ["Hückel", "EAS", "Meta Directors", "Ortho/Para", "Resonance"]
  },
  {
    id: "structure-spectroscopy",
    name: "Chapter 11: Spectroscopy & Structure Solving",
    level: "Orgo 2",
    description: "Using infrared (IR) spectroscopy, mass spectrometry (MS), and nuclear magnetic resonance (1H/13C-NMR) to determine chemical structures.",
    tags: ["NMR", "IR Spectroscopy", "Chemical Shift", "Integration"]
  },
  {
    id: "carbonyl-addition",
    name: "Chapter 12: Aldehydes & Ketones (Carbonyl Chemistry)",
    level: "Orgo 2",
    description: "Nucleophilic addition at electrophilic carbonyl oxygen/carbon, Grignard reagents, acetal/ketal protection, imine/enamine synthesis, and Wittig olefination.",
    tags: ["Nucleophilic Addition", "Acetals", "Wittig", "Imine"]
  },
  {
    id: "carboxylic-derivatives",
    name: "Chapter 13: Carboxylic Acids & Derivatives",
    level: "Orgo 2",
    description: "Nucleophilic acyl substitutions, Fischer esterification, preparation and reactivity of acid chlorides, anhydrides, esters, and amides.",
    tags: ["Acyl Substitution", "Fischer Ester", "Acid Chloride", "Amides"]
  },
  {
    id: "enolate-chemistry",
    name: "Chapter 14: Enolates & Condensations",
    level: "Orgo 2",
    description: "Acidity of alpha-hydrogens, Aldol addition and condensation, Claisen condensation, Michael addition, and the multi-step Robinson annulation.",
    tags: ["Enolates", "Aldol", "Claisen", "Michael Addition"]
  },
  {
    id: "amines-nitrogen",
    name: "Chapter 15: Amines & Nitrogen Compounds",
    level: "Orgo 2",
    description: "Amine synthesis (Gabriel syntax, reductive amination, Hofmann rearangement), basicity trends of alkyl vs aryl amines, and Diazonium salt coupling.",
    tags: ["Reductive Amination", "Diazonium Salt", "Gabriel Synthesis", "Basicity"]
  },
  {
    id: "biomolecules",
    name: "Chapter 16: Biomolecules (Carbohydrates & Peptides)",
    level: "Orgo 2",
    description: "Monosaccharides (Fischer vs Haworth cyclic structures, anomers, epimers), Kiliani-Fischer synthesis, amino acids zwitterions, and peptide bonds.",
    tags: ["D-Glucose", "Anomer", "Epimer", "Amino Acids"]
  }
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "q-acid-base",
    topicId: "structure-bonding",
    questionText: "Which of the following acidic molecules has the lowest pKa (is the strongest Bronsted acid) due to electronegative induction and charge dispersal?",
    hint: "Think about the resonance and conjugate base stability. Highly electronegative fluorine atoms withdraw electron density inductively, heavily stabilizing the negative conjugate carboxylate charge.",
    options: [
      "Ethanol (CH3CH2OH)",
      "Acetic acid (CH3COOH)",
      "Trifluoroacetic acid (CF3COOH)",
      "Phenol (C6H5OH)"
    ],
    correctAnswer: "Trifluoroacetic acid (CF3COOH)",
    type: "multiple-choice"
  },
  {
    id: "q-newman-conformation",
    topicId: "alkanes-conformational",
    questionText: "In the Newman projection of butane looking down the C2-C3 bond, which conformation represents the absolute highest potential energy (highest steric & torsional strain)?",
    hint: "Torsional strain peaks when bonds are eclipsed. Steric strain peaks when the largest, bulkiest substituted groups (here, the two methyl groups) are forced directly on top of each other.",
    options: [
      "Anti conformation (180° dihedral angle)",
      "Gauche conformation (60° dihedral angle)",
      "Eclipsed methyl-hydrogen (120° dihedral angle)",
      "Fully eclipsed methyl-methyl (0° dihedral angle)"
    ],
    correctAnswer: "Fully eclipsed methyl-methyl (0° dihedral angle)",
    type: "multiple-choice"
  },
  {
    id: "q-stereocentre-assign",
    topicId: "stereochemistry",
    questionText: "Assign priorities to a chiral carbon: 1st priority: -Cl, 2nd priority: -OH, 3rd priority: -CH2CH3, 4th priority: -H (pointing back/dashed). If the arc pointing 1 -> 2 -> 3 goes counterclockwise, what is the designator configuration?",
    hint: "Since priority 4 (H) is already pointing to the back (on a dash), the configuration goes directly by the rotation direction. Clockwise is R, counterclockwise is S.",
    options: [
      "R configuration",
      "S configuration",
      "Achiral / Meso",
      "Z configuration"
    ],
    correctAnswer: "S configuration",
    type: "multiple-choice"
  },
  {
    id: "q-sn2-solvent",
    topicId: "substitution-elimination",
    questionText: "Which solvent would maximize the rate of an SN2 reaction of 1-bromobutane with sodium azide (NaN3)?",
    hint: "SN2 reactions proceed via a single transition state. Polar protic solvents stabilize nucleophiles by hydrogen bonding, which increases the activation energy. Polar aprotic solvents leave nucleophiles naked and highly energetic.",
    options: [
      "Water / Ethanol mixture (Polar protic)",
      "Dimethyl sulfoxide (DMSO) (Polar aprotic)",
      "Hexane (Non-polar)",
      "Acetic acid (Polar protic)"
    ],
    correctAnswer: "Dimethyl sulfoxide (DMSO) (Polar aprotic)",
    type: "multiple-choice"
  },
  {
    id: "q-hydroboration-regio",
    topicId: "alkene-addition",
    questionText: "Explain the stereochemistry and regiochemistry of alkene hydroboration-oxidation (using BH3/THF, then H2O2/NaOH) on 1-methylcyclohexene.",
    hint: "Hydroboration-oxidation is famous for stereochemical syn-addition of water components (-H and -OH add on the same face) and anti-Markovnikov regioselectivity (meaning the -OH ends on the less-substituted carbon). Can you formulate a short answer describing how the syn-coplanar transition state leads to this specific setup?",
    type: "free-response"
  },
  {
    id: "q-alkyne-hydration",
    topicId: "reactions-alkynes",
    questionText: "Which of the following reaction conditions will successfully hydrate a terminal alkyne (like propyne) to yield an aldehyde via anti-Markovnikov addition?",
    hint: "Hydration with mercury results in a Markovnikov enol that tautomerizes to a methyl ketone. Hydroboration-oxidation of a terminal alkyne adds water in an anti-Markovnikov fashion, resulting in an aldehyde.",
    options: [
      "HgSO4, H2SO4, H2O (Mercury-catalyzed hydration)",
      "R2BH (e.g., Disiamylborane), followed by H2O2, NaOH",
      "H2 with Lindlar's Catalyst",
      "Na, liquid NH3 (Dissolving-metal reduction)"
    ],
    correctAnswer: "R2BH (e.g., Disiamylborane), followed by H2O2, NaOH",
    type: "multiple-choice"
  },
  {
    id: "q-radical-halogenation",
    topicId: "radical-reactions",
    questionText: "Which is the major regioselective product when 2-methylpropane (isobutane) is reacted with bromine (Br2) in the presence of UV light (hv)?",
    hint: "Bromine radicals are highly selective compared to chlorine radicals. Bromination selects almost exclusively for abstraction of the weakest C-H bond to yield the most stable tertiary carbon radical intermediate.",
    options: [
      "1-bromo-2-methylpropane (isobutyl bromide)",
      "2-bromo-2-methylpropane (t-butyl bromide)",
      "2-bromobutane",
      "1,2-dibromo-2-methylpropane"
    ],
    correctAnswer: "2-bromo-2-methylpropane (t-butyl bromide)",
    type: "multiple-choice"
  },
  {
    id: "q-alcohol-diol",
    topicId: "alcohols-ethers",
    questionText: "What is the final organic product when 1-methylcyclohexene is treated with m-chloroperoxybenzoic acid (mCPBA), and then subsequent aqueous acid workup (H3O+)?",
    hint: "Reaction of an alkene with mCPBA yields a stable three-membered epoxide. Acid-catalyzed epoxide ring-opening occurs via nucleophilic attack of water on the protonated epoxide, proceeding with anti stereochemical inversion.",
    options: [
      "cis-1-methylcyclohexane-1,2-diol (syn-dihydroxylation)",
      "trans-1-methylcyclohexane-1,2-diol (anti-dihydroxylation)",
      "1-methylcyclohexanol",
      "2-methylcyclohexanone"
    ],
    correctAnswer: "trans-1-methylcyclohexane-1,2-diol (anti-dihydroxylation)",
    type: "multiple-choice"
  },
  {
    id: "q-diels-alder-stereo",
    topicId: "conjugated-dienes",
    questionText: "What is the expected stereochemical arrangement of the anhydride groups in the Diels-Alder product of 1,3-butadiene with maleic anhydride?",
    hint: "Because Diels-Alder is a highly concerted, stereospecific [4+2] cycloaddition, the cis-orientation of carbonyl units in the cyclic dienophile (maleic anhydride) is strictly preserved as a syn/cis configuration in the resulting cyclohexene system.",
    options: [
      "A trans mixture of enantiomers",
      "A syn/cis (meso) arrangement of the carboxyl functions",
      "An acyclic conjugated triene structure",
      "A fully substituted aromatic aniline ring"
    ],
    correctAnswer: "A syn/cis (meso) arrangement of the carboxyl functions",
    type: "multiple-choice"
  },
  {
    id: "q-eas-director",
    topicId: "aromaticity-eas",
    questionText: "What is the major orientation/product direction of electrophilic aromatic nitration (HNO3/H2SO4) on benzoic acid?",
    hint: "Benzoic acid has a carboxylic acid group (-COOH) attached directly to the ring. Carboxylic acid is an electron-withdrawing group via induction and resonance.",
    options: [
      "Ortho product (carboxyl activates ortho)",
      "Para product (carboxyl stabilizes para)",
      "Meta product (carboxyl is a strong deactivating, meta-directing group)",
      "No reaction takes place"
    ],
    correctAnswer: "Meta product (carboxyl is a strong deactivating, meta-directing group)",
    type: "multiple-choice"
  },
  {
    id: "q-spectroscopy-functional",
    topicId: "structure-spectroscopy",
    questionText: "An unknown organic compound showing chemical formula C3H8O yields a broad, intense IR spectral absorbance peak near 3300 cm-1, and no sharp peak at 1715 cm-1. Name the functional group.",
    hint: "Oxygen compounds with formula C3H8O can contain ethers or alcohols. Broadband absorption above 3200 cm-1 is a signature marker of intermolecular O-H hydrogen bonds.",
    options: [
      "Ketone carbonyl",
      "Primary or secondary alcohol",
      "Dialkyl ether",
      "Saturated carboxylic acid"
    ],
    correctAnswer: "Primary or secondary alcohol",
    type: "multiple-choice"
  },
  {
    id: "q-carbonyl-nucleophile",
    topicId: "carbonyl-addition",
    questionText: "Which mechanistic step describes the initiation reaction between a Grignard reagent (such as phenylmagnesium bromide, PhMgBr) and cyclohexanone?",
    hint: "Grignard reagents behave as strong, carbon-based nucleophiles (carbanions) that seek out electrophilic sites. The polar carbonyl carbon is electrophilic due to oxygen's strong electronegative pulling power.",
    options: [
      "Electrophilic attack at the highly acidic alpha carbon",
      "Nucleophilic addition of the phenyl group at the electrophilic carbonyl carbon",
      "Elimination of carbonyl oxygen to make a conjugated polymer",
      "Direct radical halogenation at cyclohexyl positions"
    ],
    correctAnswer: "Nucleophilic addition of the phenyl group at the electrophilic carbonyl carbon",
    type: "multiple-choice"
  },
  {
    id: "q-acyl-reactivity",
    topicId: "carboxylic-derivatives",
    questionText: "Identify the correct order of traditional carboxylic acid derivatives arranged from HIGHEST reactivity to LOWEST reactivity toward nucleophilic acyl substitution.",
    hint: "Reactivity depends on leaving group ability. Acid chlorides contain chloride, a weak conjugate base of HCl. Amides contain nitrogen-based leaving groups, which are extremely poor leaving groups.",
    options: [
      "Acid chloride > Acid anhydride > Ester > Amide",
      "Amide > Ester > Acid anhydride > Acid chloride",
      "Ester > Acid chloride > Amide > Acid anhydride",
      "Acid anhydride > Acid chloride > Ester > Amide"
    ],
    correctAnswer: "Acid chloride > Acid anhydride > Ester > Amide",
    type: "multiple-choice"
  },
  {
    id: "q-aldol-mechanism",
    topicId: "enolate-chemistry",
    questionText: "Write out the first key intermediate produced when acetaldehyde reacts with sodium ethoxide in ethanol to undergo an Aldol self-addition.",
    hint: "Sodium ethoxide acts as a base. It abstracts a highly acidic alpha-hydrogen from acetaldehyde. What is the resonance-stabilized ion produced called, and what is its chemical structural formula?",
    type: "free-response"
  },
  {
    id: "q-amine-basicity",
    topicId: "amines-nitrogen",
    questionText: "Which of the following organic structures exerts the greatest basicity (highest conjugate-acid pKa) in dilute water solvent?",
    hint: "Aliphatic amines are highly basic due to alkyl groups donating electron density by induction. Aniline is weakly basic because nitrogen's lone pair is heavily delocalized into the aromatic ring. Pyrrole is non-basic because the lone pair is required to maintain aromatic resonance.",
    options: [
      "Aniline (C6H5NH2)",
      "Pyrrole (C4H5N)",
      "Diethylamine ((CH3CH2)2NH)",
      "Pyridine (C5H5N)"
    ],
    correctAnswer: "Diethylamine ((CH3CH2)2NH)",
    type: "multiple-choice"
  },
  {
    id: "q-sugar-config",
    topicId: "biomolecules",
    questionText: "In the acyclic Fischer projection representation of D-Glucose, which stereochemical side contains the hydroxyl (-OH) group on the bottom-most stereocenter carbon (C5) that defines its 'D' designation?",
    hint: "Carl Fischer's nomenclature defines sugars as D- or L- based on the chiral carbon furthest from the carbonyl root (C1). D-enantiomers always contain the OH group on the key C5 right-hand face of the vertical backbones.",
    options: [
      "Left side",
      "Right side",
      "Direct horizontal pointing back",
      "Top-most terminal projection"
    ],
    correctAnswer: "Right side",
    type: "multiple-choice"
  }
];

export const CHEMISTRY_TOOLS: ChemistryTool[] = [
  {
    id: "ask",
    name: "General Orgo Tutor",
    description: "Ask about organic reaction mechanisms, definitions, conceptual ideas, or IUPAC nomenclature.",
    icon: "Ask",
    mode: "general",
    placeholder: "e.g., 'Explain why carbocations can rearrange via 1,2-hydride shifts.'"
  },
  {
    id: "photo",
    name: "Mechanism & Homework Photo Analyzer",
    description: "Take or upload a photo of your hand-drawn chemical structure or mechanism and get solid feedback.",
    icon: "Camera",
    mode: "photo_analysis",
    placeholder: "Upload/take a snapshot of your written reaction mechanism..."
  },
  {
    id: "synthesis",
    name: "Retro-Synthesis Architect",
    description: "Submit starting materials and target products to build safe reaction pathways.",
    icon: "GitFork",
    mode: "synthesis",
    placeholder: "e.g., 'Succeed the synthesis of m-bromonitrobenzene starting from benzene.'"
  },
  {
    id: "spec",
    name: "Spectroscopy Signal Decoder",
    description: "Provide IR stretches or 1H/13C-NMR shifts to obtain step-by-step structural assignments.",
    icon: "Activity",
    mode: "spectroscopy",
    placeholder: "e.g., 'Unknown compound C4H8O showing a strong IR stretch at 1715 cm-1 and a singlet integration of 3 at 2.1 ppm...'"
  }
];
