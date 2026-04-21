import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SUBJECT_COLORS = ["#FF6B35","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#FF9FF3","#54A0FF","#A29BFE"];
const SUBJECT_EMOJIS = ["📚","🔬","🎨","🌍","🔢","📖","🎵","⚽","💻","🧪","🏛️","🌿"];
const XP_LEVELS = [0, 150, 400, 800, 1500, 2500];
const LEVEL_NAMES = ["Schüler","Streber","Ass","Profi","Genie","Legende"];
const LEVEL_EMOJIS = ["😊","😎","🤓","🧠","🚀","🏆"];
const AVATARS = ["🐣","🐱","🦊","🐺","🦁","🐉","🦄","🤖","👾","🧙","🦸","🏆"];
const DIFFICULTIES = [
  { id: "easy", label: "Leicht", sub: "Klasse 1–4", color: "#4ECDC4", emoji: "🌱" },
  { id: "medium", label: "Mittel", sub: "Klasse 5–8", color: "#FFEAA7", emoji: "🔥" },
  { id: "hard", label: "Schwer", sub: "Klasse 9–12", color: "#FF6B35", emoji: "⚡" },
];

const DEFAULT_SUBJECTS = [
  { id: "math", label: "Mathe", emoji: "🔢", color: "#FF6B35", builtin: true },
  { id: "german", label: "Deutsch", emoji: "📖", color: "#4ECDC4", builtin: true },
  { id: "science", label: "Biologie", emoji: "🔬", color: "#45B7D1", builtin: true },
  { id: "history", label: "Geschichte", emoji: "🏛️", color: "#96CEB4", builtin: true },
  { id: "english", label: "Englisch", emoji: "🌍", color: "#FFEAA7", builtin: true },
];

const DEFAULT_QUESTIONS = {
  math: {
    easy: [
      { q: "Was ist 6 + 7?", answers: ["11","12","13","14"], correct: 2, explain: "6 + 7 = 13. Einfach von 6 aus 7 weiterzählen." },
      { q: "Was ist 4 × 3?", answers: ["10","11","12","13"], correct: 2, explain: "4 × 3 = 12. Vier mal drei gleich zwölf." },
      { q: "Was ist die Hälfte von 20?", answers: ["8","9","10","11"], correct: 2, explain: "20 ÷ 2 = 10." },
      { q: "Wie viele Seiten hat ein Dreieck?", answers: ["2","3","4","5"], correct: 1, explain: "Ein Dreieck hat 3 Seiten und 3 Ecken." },
      { q: "Was ist 9 × 9?", answers: ["72","80","81","82"], correct: 2, explain: "9 × 9 = 81. Das kleine Einmaleins!" },
    ],
    medium: [
      { q: "Was ist 7 × 8?", answers: ["54","56","58","64"], correct: 1, explain: "7 × 8 = 56. Merkhilfe: 5, 6, 7, 8 → 56 = 7×8." },
      { q: "Was ist 15% von 200?", answers: ["25","30","35","20"], correct: 1, explain: "15% von 200 = 200 × 0,15 = 30." },
      { q: "Wie viel ist √144?", answers: ["10","11","12","14"], correct: 2, explain: "√144 = 12, weil 12 × 12 = 144." },
      { q: "Was ist 2³?", answers: ["6","8","9","12"], correct: 1, explain: "2³ = 2 × 2 × 2 = 8." },
      { q: "Wie viele Seiten hat ein Hexagon?", answers: ["5","6","7","8"], correct: 1, explain: "Hexagon kommt von griech. 'hexa' = sechs." },
    ],
    hard: [
      { q: "Was ist der Satz des Pythagoras?", answers: ["a+b=c","a²+b²=c²","a×b=c²","a²-b²=c"], correct: 1, explain: "Im rechtwinkligen Dreieck gilt: a² + b² = c², wobei c die Hypotenuse ist." },
      { q: "Was ist die Lösung von 3x + 6 = 21?", answers: ["x=3","x=4","x=5","x=6"], correct: 2, explain: "3x = 21 - 6 = 15, also x = 15 ÷ 3 = 5." },
      { q: "Was ist sin(90°)?", answers: ["0","0,5","1","-1"], correct: 2, explain: "sin(90°) = 1. Der Sinus erreicht bei 90° sein Maximum." },
      { q: "Was ist der Flächeninhalt eines Kreises mit r=5?", answers: ["25π","10π","5π","50π"], correct: 0, explain: "A = π × r² = π × 25 = 25π ≈ 78,54." },
      { q: "Was ist log₂(8)?", answers: ["2","3","4","8"], correct: 1, explain: "log₂(8) = 3, weil 2³ = 8." },
    ],
  },
  german: {
    easy: [
      { q: "Was ist der Plural von 'das Kind'?", answers: ["die Kinde","die Kindern","die Kinder","die Kinds"], correct: 2, explain: "Der Plural von 'das Kind' ist 'die Kinder'." },
      { q: "Welches Wort ist ein Adjektiv?", answers: ["rennen","Haus","schnell","und"], correct: 2, explain: "'Schnell' beschreibt eine Eigenschaft – das ist ein Adjektiv." },
      { q: "Welcher Artikel gehört zu 'Sonne'?", answers: ["der","die","das","ein"], correct: 1, explain: "Es heißt 'die Sonne' – weiblich (feminin)." },
      { q: "Was ist das Gegenteil von 'groß'?", answers: ["lang","breit","klein","hoch"], correct: 2, explain: "Das Antonym (Gegenteil) von 'groß' ist 'klein'." },
      { q: "Wie schreibt man es richtig?", answers: ["das","dass","daß","dasz"], correct: 1, explain: "Seit der Rechtschreibreform 1996 schreibt man 'dass' mit Doppel-s." },
    ],
    medium: [
      { q: "Wie heißt die weibliche Form von 'der Arzt'?", answers: ["die Arzt","die Ärztin","die Ärzten","die Ärzte"], correct: 1, explain: "Feminine Berufsbezeichnungen enden oft auf -in: Arzt → Ärztin." },
      { q: "Was bedeutet 'eloquent'?", answers: ["laut sprechen","schön und gewandt reden","schnell laufen","gut schreiben"], correct: 1, explain: "'Eloquent' bedeutet redegewandt, ausdrucksstark." },
      { q: "Welcher Satz steht im Passiv?", answers: ["Er liest das Buch.","Das Buch wird gelesen.","Er hat gelesen.","Er liest gern."], correct: 1, explain: "Im Passiv steht das Objekt im Mittelpunkt: 'wird gelesen' = Vorgangspassiv." },
      { q: "Was ist ein Synonym für 'mutig'?", answers: ["feige","ängstlich","tapfer","schüchtern"], correct: 2, explain: "'Tapfer' bedeutet dasselbe wie 'mutig' – beides heißt couragiert." },
      { q: "In welchem Fall steht 'dem Mann'?", answers: ["Nominativ","Genitiv","Dativ","Akkusativ"], correct: 2, explain: "'dem' ist der Dativ-Artikel für maskuline Nomen." },
    ],
    hard: [
      { q: "Was ist ein Oxymoron?", answers: ["Wiederholung gleicher Laute","Widerspruch in einem Ausdruck","Übertreibung","Vergleich mit 'wie'"], correct: 1, explain: "Ein Oxymoron verbindet Gegensätze: z.B. 'bitterer Honig', 'lebendiger Tod'." },
      { q: "Welche Epoche schrieb Goethe?", answers: ["Barock","Romantik","Klassik","Naturalismus"], correct: 2, explain: "Goethe gilt als Hauptvertreter der Weimarer Klassik (ca. 1786–1832)." },
      { q: "Was ist ein Hyperbel?", answers: ["Untertreibung","Vergleich","Übertreibung","Metapher"], correct: 2, explain: "Eine Hyperbel ist eine starke Übertreibung, z.B. 'Ich hab's dir tausendmal gesagt'." },
      { q: "Was kennzeichnet den Konjunktiv II?", answers: ["Tatsachen","Möglichkeiten/Irreales","Vergangenheit","Fragen"], correct: 1, explain: "Der Konjunktiv II drückt Irreales, Wünsche oder Möglichkeiten aus: 'Wenn ich König wäre…'" },
      { q: "Wer schrieb 'Die Leiden des jungen Werthers'?", answers: ["Schiller","Kafka","Goethe","Hesse"], correct: 2, explain: "Goethe schrieb diesen Briefroman 1774 – ein Werk des Sturm und Drang." },
    ],
  },
  science: {
    easy: [
      { q: "Was brauchen Pflanzen zum Wachsen?", answers: ["Nur Wasser","Licht, Wasser & CO₂","Nur Erde","Nur Licht"], correct: 1, explain: "Pflanzen brauchen Licht, Wasser und CO₂ für die Photosynthese." },
      { q: "Was ist die kleinste Einheit des Lebens?", answers: ["Atom","Molekül","Zelle","Organ"], correct: 2, explain: "Die Zelle ist die kleinste lebende Einheit aller Lebewesen." },
      { q: "Wie viele Beine hat eine Spinne?", answers: ["6","8","10","12"], correct: 1, explain: "Spinnen sind Spinnentiere und haben 8 Beine – Insekten haben 6." },
      { q: "Was macht die Lunge?", answers: ["Blut pumpen","Nahrung verdauen","Atmen","Denken"], correct: 2, explain: "Die Lunge tauscht Sauerstoff und CO₂ aus – sie ist das Atemorgan." },
      { q: "Was ist Wasser chemisch?", answers: ["CO₂","H₂O","O₂","NaCl"], correct: 1, explain: "Wasser besteht aus 2 Wasserstoff- und 1 Sauerstoffatom: H₂O." },
    ],
    medium: [
      { q: "Wie viele Kammern hat das menschliche Herz?", answers: ["2","3","4","5"], correct: 2, explain: "Das Herz hat 4 Kammern: 2 Vorhöfe und 2 Hauptkammern." },
      { q: "Was ist Photosynthese?", answers: ["Zellteilung","Licht → Energie umwandeln","Blutkreislauf","Atmung"], correct: 1, explain: "Photosynthese: Pflanzen wandeln Licht + CO₂ + H₂O in Glucose + O₂ um." },
      { q: "Welches Gas atmen Pflanzen aus?", answers: ["CO₂","Stickstoff","Sauerstoff","Wasserstoff"], correct: 2, explain: "Bei der Photosynthese geben Pflanzen Sauerstoff (O₂) ab." },
      { q: "Was ist die kleinste Einheit der Erbinformation?", answers: ["Zelle","Chromosom","Gen","DNA"], correct: 2, explain: "Gene sind Abschnitte der DNA, die Erbinformationen codieren." },
      { q: "Was ist Osmose?", answers: ["Nährstofftransport","Wasserbewegung durch Membran","Zellteilung","Photosynthese"], correct: 1, explain: "Osmose: Wasser wandert durch eine semipermeable Membran vom niedrigen zum hohen Konzentrat." },
    ],
    hard: [
      { q: "Was ist die Mitose?", answers: ["Befruchtung","Kernteilung mit 2 Tochterzellen","Meiose","Proteinherstellung"], correct: 1, explain: "Mitose = Zellteilung, bei der 2 identische Tochterzellen entstehen (46 Chromosomen)." },
      { q: "Was ist der Unterschied zwischen DNS und RNS?", answers: ["Kein Unterschied","DNS hat Thymin, RNS Uracil","RNS ist doppelsträngig","DNS ist kurzlebig"], correct: 1, explain: "DNS hat Thymin (T), RNS hat stattdessen Uracil (U). DNS ist doppelsträngig, RNS meist einzelsträngig." },
      { q: "Was beschreibt das Mendelsche Gesetz?", answers: ["Zellbau","Vererbung von Merkmalen","Photosynthese","Evolution"], correct: 1, explain: "Mendel entdeckte die Gesetzmäßigkeiten der Vererbung durch Erbsen-Experimente." },
      { q: "Was ist ATP?", answers: ["Ein Protein","Energieträger der Zelle","Eine Fettsäure","Ein Enzym"], correct: 1, explain: "ATP (Adenosintriphosphat) ist die universelle Energiewährung aller Zellen." },
      { q: "Was ist CRISPR-Cas9?", answers: ["Ein Virus","Genschere/Geneditor","Ein Protein","Eine Zellart"], correct: 1, explain: "CRISPR-Cas9 ist eine molekulare 'Genschere' zur gezielten Veränderung von DNA-Sequenzen." },
    ],
  },
  history: {
    easy: [
      { q: "Wer war der erste Mensch auf dem Mond?", answers: ["Buzz Aldrin","Neil Armstrong","Yuri Gagarin","John Glenn"], correct: 1, explain: "Neil Armstrong betrat am 21. Juli 1969 als erster Mensch den Mond." },
      { q: "Was ist die Hauptstadt von Deutschland?", answers: ["Hamburg","München","Berlin","Frankfurt"], correct: 2, explain: "Berlin ist seit 1990 wieder die Hauptstadt Deutschlands." },
      { q: "Wann fiel die Berliner Mauer?", answers: ["1987","1988","1989","1990"], correct: 2, explain: "Die Berliner Mauer fiel am 9. November 1989." },
      { q: "Wer war Adolf Hitler?", answers: ["Kaiser","Diktator des NS-Regimes","Bundeskanzler","General"], correct: 1, explain: "Hitler war Führer des nationalsozialistischen Deutschlands von 1933–1945." },
      { q: "Was war die DDR?", answers: ["Westdeutschland","Ostdeutschland","Österreich","Schweiz"], correct: 1, explain: "DDR = Deutsche Demokratische Republik, existierte 1949–1990." },
    ],
    medium: [
      { q: "Wann wurde die Berliner Mauer gebaut?", answers: ["1953","1961","1968","1975"], correct: 1, explain: "Die Berliner Mauer wurde in der Nacht vom 12. auf den 13. August 1961 gebaut." },
      { q: "Wer war der erste deutsche Bundeskanzler?", answers: ["Willy Brandt","Konrad Adenauer","Helmut Schmidt","Ludwig Erhard"], correct: 1, explain: "Konrad Adenauer war von 1949 bis 1963 erster Bundeskanzler der BRD." },
      { q: "In welchem Jahr endete der Zweite Weltkrieg?", answers: ["1943","1944","1945","1946"], correct: 2, explain: "Der Zweite Weltkrieg endete am 8. Mai 1945 mit der deutschen Kapitulation." },
      { q: "Was war die Weimarer Republik?", answers: ["Ein Königreich","Erste deutsche Demokratie","NS-Staat","DDR"], correct: 1, explain: "Die Weimarer Republik war 1919–1933 die erste parlamentarische Demokratie in Deutschland." },
      { q: "Was war die Französische Revolution?", answers: ["Ein Krieg gegen England","Sturz der Monarchie 1789","Gründung Frankreichs","Napoleons Krönung"], correct: 1, explain: "Die Französische Revolution begann 1789 mit dem Sturm auf die Bastille." },
    ],
    hard: [
      { q: "Was war der Westfälische Frieden?", answers: ["Ende des 30-jährigen Krieges 1648","Napoleons Niederlage","Gründung Preußens","Ende des 1. WK"], correct: 0, explain: "Der Westfälische Frieden 1648 beendete den Dreißigjährigen Krieg und gilt als Geburtsstunde des modernen Staatensystems." },
      { q: "Was war der Marshall-Plan?", answers: ["Militärstrategie","US-Wiederaufbauhilfe für Europa","Atomwaffenvertrag","Teilung Deutschlands"], correct: 1, explain: "Der Marshall-Plan (1948–1952) war ein US-amerikanisches Hilfsprogramm für den Wiederaufbau Westeuropas nach dem 2. WK." },
      { q: "Was löste den Ersten Weltkrieg aus?", answers: ["Attentat in Sarajevo","Invasion Polens","Russische Revolution","Wirtschaftskrise"], correct: 0, explain: "Das Attentat auf Erzherzog Franz Ferdinand in Sarajevo am 28. Juni 1914 war der unmittelbare Auslöser des 1. Weltkriegs." },
      { q: "Was war die Industrielle Revolution?", answers: ["Politischer Umsturz","Übergang zu Maschinenproduktion","Religionsreform","Kolonialismus"], correct: 1, explain: "Die Industrielle Revolution (ab ~1760 in England) bezeichnet den Übergang von Handarbeit zu mechanisierter Produktion." },
      { q: "Was war das Dritte Reich?", answers: ["1918–1933","1933–1945","1939–1945","1871–1918"], correct: 1, explain: "Das Dritte Reich bezeichnet die NS-Diktatur unter Hitler von 1933 bis zur Kapitulation 1945." },
    ],
  },
  english: {
    easy: [
      { q: "How do you say 'Hund' in English?", answers: ["Cat","Dog","Bird","Fish"], correct: 1, explain: "'Dog' ist das englische Wort für 'Hund'." },
      { q: "What color is the sky?", answers: ["Green","Red","Blue","Yellow"], correct: 2, explain: "The sky is blue – der Himmel ist blau." },
      { q: "How many days are in a week?", answers: ["5","6","7","8"], correct: 2, explain: "There are 7 days in a week: Monday to Sunday." },
      { q: "What is the plural of 'child'?", answers: ["childs","childen","children","child"], correct: 2, explain: "'Children' is an irregular plural – unlike most nouns, no -s is added." },
      { q: "Which word means 'glücklich'?", answers: ["sad","angry","happy","tired"], correct: 2, explain: "'Happy' means glücklich. Sad = traurig, angry = wütend, tired = müde." },
    ],
    medium: [
      { q: "What is the past tense of 'go'?", answers: ["goed","goes","went","gone"], correct: 2, explain: "'Go' is an irregular verb. Past tense = went (not 'goed')." },
      { q: "Which is correct?", answers: ["She don't like it.","She doesn't likes it.","She doesn't like it.","She not like it."], correct: 2, explain: "With he/she/it we use 'doesn't' + infinitive (without -s): She doesn't like it." },
      { q: "How do you say 'Ich liebe Bücher'?", answers: ["I love books.","I like book.","I loves books.","I book love."], correct: 0, explain: "'I love books.' – correct word order: Subject + Verb + Object." },
      { q: "What is the comparative of 'good'?", answers: ["gooder","more good","better","best"], correct: 2, explain: "'Good' is irregular: good → better → best." },
      { q: "What does 'nevertheless' mean?", answers: ["außerdem","trotzdem","deshalb","obwohl"], correct: 1, explain: "'Nevertheless' = trotzdem / dennoch. It shows contrast." },
    ],
    hard: [
      { q: "What is the subjunctive mood used for?", answers: ["Facts","Hypotheticals/wishes","Commands","Questions"], correct: 1, explain: "The subjunctive expresses hypothetical situations: 'If I were you…' (not 'was')." },
      { q: "What is a gerund?", answers: ["A verb tense","Noun formed from verb + -ing","An adjective","A conjunction"], correct: 1, explain: "A gerund is a verb used as a noun: 'Swimming is fun.' Here 'swimming' is a gerund." },
      { q: "Which sentence uses the passive voice?", answers: ["She wrote the letter.","The letter was written by her.","She is writing.","She had written."], correct: 1, explain: "Passive voice: 'was written' – the object becomes the subject. Active: She wrote it." },
      { q: "What does 'ephemeral' mean?", answers: ["Eternal","Short-lived","Important","Hidden"], correct: 1, explain: "'Ephemeral' means lasting for a very short time – e.g. 'an ephemeral trend'." },
      { q: "What is a 'red herring'?", answers: ["A type of fish","Misleading information","Angry person","Old document"], correct: 1, explain: "A 'red herring' is a misleading clue or distraction – used in mysteries and debates." },
    ],
  },
};

const BADGES = [
  { id: "first", label: "Erste Antwort!", emoji: "🌟", condition: s => s.totalAnswered >= 1 },
  { id: "streak3", label: "3er Streak!", emoji: "🔥", condition: s => s.maxStreak >= 3 },
  { id: "streak5", label: "5er Streak!", emoji: "⚡", condition: s => s.maxStreak >= 5 },
  { id: "points100", label: "100 Punkte!", emoji: "💯", condition: s => s.points >= 100 },
  { id: "allsubjects", label: "Allrounder!", emoji: "🎓", condition: s => (s.subjectsPlayed||[]).length >= 3 },
  { id: "creator", label: "Ersteller!", emoji: "✏️", condition: s => (s.createdSets||0) >= 1 },
  { id: "daily3", label: "3 Tage Streak!", emoji: "📅", condition: s => (s.dailyStreak||0) >= 3 },
  { id: "points500", label: "500 Punkte!", emoji: "🏆", condition: s => s.points >= 500 },
];

const PARENT_PIN_KEY = "lernheld_parent_pin";
const STATS_KEY = "lernheld_stats";
const CUSTOM_SUBJECTS_KEY = "lernheld_custom_subjects";
const CUSTOM_QUESTIONS_KEY = "lernheld_custom_questions";
const SETTINGS_KEY = "lernheld_settings";
const SESSION_LOG_KEY = "lernheld_sessions";

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getLevel(xp) {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) { if (xp >= XP_LEVELS[i]) return i; }
  return 0;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

// ─── UI Components ────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = "#FF6B35", height = 10 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, max > 0 ? (value / max) * 100 : 0)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 10px ${color}88` }} />
    </div>
  );
}

function StarBurst({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 10, height: 10, borderRadius: "50%", background: ["#FF6B35","#4ECDC4","#FFEAA7","#FF9FF3","#54A0FF"][i % 5], transform: `rotate(${i * 20}deg) translateY(-100px)`, animation: "burst 0.8s ease-out forwards", animationDelay: `${i * 0.03}s` }} />
      ))}
    </div>
  );
}

// ─── AI helpers ───────────────────────────────────────────────────────────────
async function callClaude(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages }),
  });
  const data = await res.json();
  return data.content.map(i => i.text || "").join("");
}

const AI_SUFFIX = `\n\nAntworte NUR mit gültigem JSON-Array (kein Markdown):
[{"q":"Frage?","answers":["A","B","C","D"],"correct":0,"explain":"Kurze Erklärung warum A richtig ist."}]
Erstelle genau 5 Fragen. "correct" ist der 0-basierte Index.`;

async function generateFromText(text) {
  const raw = await callClaude([{ role: "user", content: `Lernassistent für Schüler (10-18 J.). Erstelle aus diesem Text 5 Multiple-Choice-Fragen auf Deutsch mit kurzer Erklärung.\n\nTEXT:\n${text}${AI_SUFFIX}` }]);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

async function generateFromImage(base64, mime) {
  const raw = await callClaude([{ role: "user", content: [
    { type: "image", source: { type: "base64", media_type: mime, data: base64 } },
    { type: "text", text: `Analysiere dieses Bild und erstelle 5 Multiple-Choice-Fragen auf Deutsch mit Erklärung.${AI_SUFFIX}` },
  ]}]);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function LernApp() {
  // Persistent state
  const [stats, setStatsRaw] = useState(() => load(STATS_KEY, { points: 0, totalAnswered: 0, maxStreak: 0, subjectsPlayed: [], earnedBadges: [], createdSets: 0, dailyStreak: 0, lastPlayedDate: "", totalSessions: 0, totalMinutes: 0, avatar: "🐣" }));
  const [customSubjects, setCustomSubjectsRaw] = useState(() => load(CUSTOM_SUBJECTS_KEY, []));
  const [customQuestions, setCustomQuestionsRaw] = useState(() => load(CUSTOM_QUESTIONS_KEY, {}));
  const [settings, setSettingsRaw] = useState(() => load(SETTINGS_KEY, { showExplanations: true, difficulty: "medium" }));
  const [sessionLog, setSessionLogRaw] = useState(() => load(SESSION_LOG_KEY, []));

  function setStats(val) { const v = typeof val === "function" ? val(stats) : val; setStatsRaw(v); save(STATS_KEY, v); }
  function setCustomSubjects(val) { const v = typeof val === "function" ? val(customSubjects) : val; setCustomSubjectsRaw(v); save(CUSTOM_SUBJECTS_KEY, v); }
  function setCustomQuestions(val) { const v = typeof val === "function" ? val(customQuestions) : val; setCustomQuestionsRaw(v); save(CUSTOM_QUESTIONS_KEY, v); }
  function setSettings(val) { const v = typeof val === "function" ? val(settings) : val; setSettingsRaw(v); save(SETTINGS_KEY, v); }
  function setSessionLog(val) { const v = typeof val === "function" ? val(sessionLog) : val; setSessionLogRaw(v); save(SESSION_LOG_KEY, v); }

  const allSubjects = [...DEFAULT_SUBJECTS, ...customSubjects];

  // Quiz state
  const [screen, setScreen] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [burst, setBurst] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [mode, setMode] = useState("quiz"); // quiz | flashcard
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const timerRef = useRef(null);

  // Creator state
  const [creatorTab, setCreatorTab] = useState("wiki");
  const [cName, setCName] = useState("");
  const [cEmoji, setCEmoji] = useState("📚");
  const [cColor, setCColor] = useState("#FF6B35");
  const [cText, setCText] = useState("");
  const [cImage, setCImage] = useState(null);
  const [cImageMime, setCImageMime] = useState("");
  const [pendingQs, setPendingQs] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [manualQ, setManualQ] = useState({ q: "", answers: ["","","",""], correct: 0, explain: "" });
  const [wikiUrl, setWikiUrl] = useState("");
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState("");
  const [wikiPreview, setWikiPreview] = useState(null);
  const fileRef = useRef(null);

  // Parent state
  const [parentPin, setParentPinRaw] = useState(() => load(PARENT_PIN_KEY, ""));
  const [parentScreen, setParentScreen] = useState("lock"); // lock | setup | dashboard
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  function setParentPin(v) { setParentPinRaw(v); save(PARENT_PIN_KEY, v); }

  // Daily streak check
  useEffect(() => {
    const today = todayStr();
    if (stats.lastPlayedDate !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      const newStreak = stats.lastPlayedDate === yStr ? (stats.dailyStreak || 0) + 1 : 1;
      setStats(s => ({ ...s, dailyStreak: newStreak, lastPlayedDate: today }));
    }
  }, []);

  // Timer
  useEffect(() => {
    if (timerActive && timeLeft > 0) { timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000); }
    else if (timerActive && timeLeft === 0 && !showFeedback) { handleAnswer(null); }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft, showFeedback]);

  const currentDiff = settings.difficulty;
  const currentQList = selectedSubject
    ? (selectedSubject.builtin
        ? (DEFAULT_QUESTIONS[selectedSubject.id]?.[currentDiff] || DEFAULT_QUESTIONS[selectedSubject.id]?.medium || [])
        : (customQuestions[selectedSubject.id] || []))
    : [];
  const currentQ = currentQList[questionIndex];
  const level = getLevel(stats.points);
  const nextXP = XP_LEVELS[level + 1] || XP_LEVELS[XP_LEVELS.length - 1];

  function awardStats(extra) {
    const ns = { ...stats, ...extra };
    const earned = BADGES.filter(b => !ns.earnedBadges.includes(b.id) && b.condition(ns));
    if (earned.length) { ns.earnedBadges = [...ns.earnedBadges, ...earned.map(b => b.id)]; setNewBadge(earned[0]); setTimeout(() => setNewBadge(null), 3000); }
    setStats(ns);
  }

  function startQuiz(subj, m = "quiz") {
    setSelectedSubject(subj); setMode(m); setQuestionIndex(0); setScore(0); setStreak(0);
    setSelectedAnswer(null); setShowFeedback(false); setFlashcardFlipped(false);
    setTimeLeft(15); setTimerActive(m === "quiz"); setSessionStart(Date.now());
    setScreen(m === "flashcard" ? "flashcard" : "quiz");
  }

  function handleAnswer(idx) {
    if (showFeedback) return;
    setTimerActive(false); setSelectedAnswer(idx); setShowFeedback(true);
    const isCorrect = idx === currentQ.correct;
    const ns = isCorrect ? streak + 1 : 0;
    setStreak(ns);
    if (isCorrect) { setScore(s => s + 1); setBurst(true); setTimeout(() => setBurst(false), 900); }
    const gained = isCorrect ? 10 + (ns >= 3 ? 5 : 0) + Math.ceil(timeLeft / 3) : 0;
    const mins = sessionStart ? Math.round((Date.now() - sessionStart) / 60000) : 0;
    awardStats({ points: stats.points + gained, totalAnswered: stats.totalAnswered + 1, maxStreak: Math.max(stats.maxStreak, ns), subjectsPlayed: [...new Set([...(stats.subjectsPlayed||[]), selectedSubject.id])], totalMinutes: (stats.totalMinutes||0) + mins });
    if (!settings.showExplanations) { setTimeout(() => advanceQuestion(), 1000); }
  }

  function advanceQuestion() {
    if (questionIndex + 1 < currentQList.length) {
      setQuestionIndex(i => i + 1); setSelectedAnswer(null); setShowFeedback(false);
      setFlashcardFlipped(false); setTimeLeft(15); setTimerActive(true);
    } else { logSession(); setScreen("result"); }
  }

  function logSession() {
    const mins = sessionStart ? Math.max(1, Math.round((Date.now() - sessionStart) / 60000)) : 1;
    const entry = { date: todayStr(), time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }), subject: selectedSubject?.label, score, total: currentQList.length, mins };
    setSessionLog(prev => [entry, ...prev].slice(0, 50));
  }

  // Creator helpers
  function openCreator() {
    setCName(""); setCEmoji("📚"); setCColor(SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)]);
    setCText(""); setCImage(null); setPendingQs([]); setAiError(""); setShowPreview(false);
    setWikiUrl(""); setWikiError(""); setWikiPreview(null); setCreatorTab("wiki");
    setScreen("creator");
  }

  function handleImageFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setCImage(reader.result.split(",")[1]); setCImageMime(f.type); };
    reader.readAsDataURL(f);
  }

  async function fetchWikipedia() {
    setWikiLoading(true); setWikiError(""); setWikiPreview(null);
    try {
      let title = wikiUrl.trim(), lang = "de";
      const urlMatch = wikiUrl.match(/([a-z]{2})\.wikipedia\.org\/wiki\/([^#?]+)/);
      if (urlMatch) { lang = urlMatch[1]; title = decodeURIComponent(urlMatch[2].replace(/_/g," ")); }
      const url = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({ action:"query", titles:title, prop:"extracts", exintro:"1", explaintext:"1", redirects:"1", format:"json", origin:"*" });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Netzwerkfehler");
      const data = await res.json();
      const page = Object.values(data.query?.pages || {})[0];
      if (!page || page.missing !== undefined) throw new Error("Artikel nicht gefunden.");
      const extract = (page.extract || "").slice(0, 3000);
      if (extract.length < 80) throw new Error("Zu wenig Text.");
      setWikiPreview({ title: page.title, extract });
      if (!cName.trim()) setCName(page.title);
    } catch (e) { setWikiError(e.message); }
    setWikiLoading(false);
  }

  async function runAI() {
    setAiLoading(true); setAiError("");
    try {
      let qs;
      if (creatorTab === "scan") qs = await generateFromImage(cImage, cImageMime);
      else if (creatorTab === "wiki") qs = await generateFromText(wikiPreview.extract);
      else qs = await generateFromText(cText);
      setPendingQs(prev => [...prev, ...qs]); setShowPreview(true);
    } catch { setAiError("Fehler. Bitte erneut versuchen."); }
    setAiLoading(false);
  }

  function addManual() {
    if (!manualQ.q.trim() || manualQ.answers.some(a => !a.trim())) return;
    setPendingQs(p => [...p, { ...manualQ }]);
    setManualQ({ q: "", answers: ["","","",""], correct: 0, explain: "" });
  }

  function saveSet() {
    if (!cName.trim() || pendingQs.length === 0) return;
    const id = "custom_" + Date.now();
    setCustomSubjects(p => [...p, { id, label: cName.trim(), emoji: cEmoji, color: cColor, builtin: false }]);
    setCustomQuestions(p => ({ ...p, [id]: pendingQs }));
    awardStats({ ...stats, createdSets: (stats.createdSets || 0) + 1 });
    setScreen("home");
  }

  // Parent helpers
  function openParent() {
    setPinInput(""); setPinError("");
    setParentScreen(parentPin ? "lock" : "setup");
    setScreen("parent");
  }

  function checkPin() {
    if (pinInput === parentPin) { setParentScreen("dashboard"); setPinError(""); }
    else { setPinError("Falsche PIN. Bitte erneut versuchen."); setPinInput(""); }
  }

  function savePin() {
    if (newPin.length < 4) { setPinError("PIN muss mindestens 4 Stellen haben."); return; }
    if (newPin !== confirmPin) { setPinError("PINs stimmen nicht überein."); return; }
    setParentPin(newPin); setParentScreen("dashboard"); setNewPin(""); setConfirmPin(""); setPinError("");
  }

  // Styles
  const bg = "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)";
  const card = { background:"rgba(255,255,255,.07)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.12)", borderRadius:20 };

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"'Nunito','Segoe UI',sans-serif", color:"#fff", display:"flex", flexDirection:"column", alignItems:"center", padding:"0 16px 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Boogaloo&display=swap');
        @keyframes burst{0%{opacity:1;transform:rotate(var(--r)) translateY(-80px) scale(1)}100%{opacity:0;transform:rotate(var(--r)) translateY(-200px) scale(0)}}
        @keyframes popIn{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes badgeIn{0%{transform:translateY(80px) scale(.5);opacity:0}70%{transform:translateY(-10px) scale(1.05)}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes flipCard{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
        .card{background:rgba(255,255,255,.07);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:20px}
        .btn{cursor:pointer;border:none;font-family:inherit;font-weight:800;letter-spacing:.5px;transition:all .15s}
        .btn:hover{transform:scale(1.04);filter:brightness(1.1)}
        .btn:active{transform:scale(.97)}
        .ans-btn{width:100%;padding:14px 18px;border-radius:14px;font-size:15px;text-align:left;cursor:pointer;border:2px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-family:inherit;font-weight:600;transition:all .15s;margin-bottom:10px}
        .ans-btn:hover:not(:disabled){border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.12);transform:translateX(4px)}
        input,textarea{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.18);border-radius:12px;color:#fff;font-family:inherit;font-size:14px;padding:11px 14px;outline:none;width:100%;box-sizing:border-box}
        input:focus,textarea:focus{border-color:#4ECDC4;background:rgba(255,255,255,.12)}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,.3)}
        .tab{flex:1;padding:9px 4px;border:none;background:transparent;color:rgba(255,255,255,.4);font-family:inherit;font-weight:700;font-size:12px;cursor:pointer;border-radius:10px;transition:all .2s}
        .tab.on{background:rgba(255,255,255,.15);color:#fff}
        .pin-btn{width:70px;height:70px;border-radius:16px;border:none;background:rgba(255,255,255,.1);color:#fff;font-size:24px;font-weight:800;cursor:pointer;font-family:inherit;transition:all .15s}
        .pin-btn:hover{background:rgba(255,255,255,.2);transform:scale(1.05)}
        .pin-btn:active{transform:scale(.95)}
      `}</style>

      <StarBurst active={burst} />

      {/* Badge toast */}
      {newBadge && (
        <div style={{ position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f093fb,#f5576c)", padding:"14px 24px", borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,.5)", animation:"badgeIn .5s ease-out forwards", zIndex:9998, display:"flex", alignItems:"center", gap:10, whiteSpace:"nowrap" }}>
          <span style={{ fontSize:28 }}>{newBadge.emoji}</span>
          <div><div style={{ fontSize:11, opacity:.8, textTransform:"uppercase", letterSpacing:1 }}>Neues Abzeichen!</div><div style={{ fontWeight:800, fontSize:16 }}>{newBadge.label}</div></div>
        </div>
      )}

      {/* Header */}
      <div style={{ width:"100%", maxWidth:480, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 10px" }}>
        <div style={{ fontFamily:"'Boogaloo',cursive", fontSize:28, cursor:"pointer" }} onClick={() => setScreen("home")}>🎓 <span style={{ color:"#4ECDC4" }}>Lern</span>Held</div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn" onClick={openParent} style={{ background:"rgba(255,255,255,.1)", padding:"8px 12px", borderRadius:99, color:"#fff", fontSize:13 }}>👨‍👩‍👧</button>
          <button className="btn" onClick={() => setScreen("profile")} style={{ background:"rgba(255,255,255,.1)", padding:"8px 14px", borderRadius:99, color:"#fff", fontSize:13 }}>⭐ {stats.points}</button>
        </div>
      </div>

      {/* ── HOME ── */}
      {screen === "home" && (
        <div style={{ width:"100%", maxWidth:480, animation:"slideUp .4s ease" }}>
          {/* Level card */}
          <div className="card" style={{ padding:20, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:12, opacity:.5, textTransform:"uppercase", letterSpacing:1 }}>Dein Level</div>
                <div style={{ fontWeight:900, fontSize:22 }}>{LEVEL_NAMES[level]} <span style={{ fontSize:15, opacity:.7 }}>Lv.{level+1}</span></div>
                <div style={{ fontSize:13, opacity:.5, marginTop:2 }}>🔥 {stats.dailyStreak || 0} Tage Streak</div>
              </div>
              <div style={{ fontSize:48 }}>{stats.avatar || LEVEL_EMOJIS[level]}</div>
            </div>
            <ProgressBar value={stats.points - XP_LEVELS[level]} max={nextXP - XP_LEVELS[level]} color="#4ECDC4" />
            <div style={{ fontSize:11, opacity:.4, marginTop:4 }}>{stats.points - XP_LEVELS[level]} / {nextXP - XP_LEVELS[level]} XP bis Level {level+2}</div>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
            {[{l:"Punkte",v:stats.points,e:"⭐"},{l:"Fragen",v:stats.totalAnswered,e:"✅"},{l:"Badges",v:`${stats.earnedBadges.length}/${BADGES.length}`,e:"🏅"}].map(x => (
              <div key={x.l} className="card" style={{ padding:"12px 8px", textAlign:"center" }}>
                <div style={{ fontSize:18 }}>{x.e}</div>
                <div style={{ fontWeight:900, fontSize:17 }}>{x.v}</div>
                <div style={{ fontSize:11, opacity:.5 }}>{x.l}</div>
              </div>
            ))}
          </div>

          {/* Difficulty selector */}
          <div className="card" style={{ padding:14, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:800, opacity:.7, marginBottom:10 }}>🎯 Schwierigkeitsgrad</div>
            <div style={{ display:"flex", gap:8 }}>
              {DIFFICULTIES.map(d => (
                <button key={d.id} onClick={() => setSettings(s => ({...s, difficulty: d.id}))}
                  style={{ flex:1, padding:"10px 6px", borderRadius:12, border:`2px solid ${settings.difficulty===d.id ? d.color : "rgba(255,255,255,.1)"}`, background:settings.difficulty===d.id ? `${d.color}22` : "transparent", color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                  <div style={{ fontSize:18 }}>{d.emoji}</div>
                  <div style={{ fontWeight:800, fontSize:12 }}>{d.label}</div>
                  <div style={{ fontSize:10, opacity:.6 }}>{d.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanations toggle */}
          <div className="card" style={{ padding:"12px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:800, fontSize:14 }}>💡 Erklärungen nach Fragen</div>
              <div style={{ fontSize:12, opacity:.5 }}>Zeigt warum eine Antwort richtig ist</div>
            </div>
            <div onClick={() => setSettings(s => ({...s, showExplanations: !s.showExplanations}))}
              style={{ width:48, height:26, borderRadius:99, background:settings.showExplanations?"#4ECDC4":"rgba(255,255,255,.15)", cursor:"pointer", position:"relative", transition:"background .3s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left:settings.showExplanations?24:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .3s" }} />
            </div>
          </div>

          {/* Create button */}
          <button className="btn" onClick={openCreator} style={{ width:"100%", padding:16, borderRadius:16, marginBottom:16, background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            ✨ Eigenes Lernset erstellen
          </button>

          {/* Built-in subjects */}
          <div style={{ marginBottom:10, fontWeight:800, fontSize:15, opacity:.8 }}>📚 Fächer</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {DEFAULT_SUBJECTS.map(s => (
              <div key={s.id} style={{ position:"relative" }}>
                <button className="btn" onClick={() => startQuiz(s)} style={{ width:"100%", padding:"16px 14px", borderRadius:16, textAlign:"left", background:`linear-gradient(135deg,${s.color}33,${s.color}11)`, border:`1.5px solid ${s.color}55`, color:"#fff", display:"flex", flexDirection:"column", gap:4 }}>
                  <span style={{ fontSize:28 }}>{s.emoji}</span>
                  <span style={{ fontWeight:900, fontSize:15 }}>{s.label}</span>
                  <span style={{ fontSize:11, opacity:.6 }}>{(DEFAULT_QUESTIONS[s.id]?.[settings.difficulty] || DEFAULT_QUESTIONS[s.id]?.medium || []).length} Fragen</span>
                </button>
                <button onClick={() => startQuiz(s, "flashcard")} style={{ position:"absolute", bottom:8, right:8, background:`${s.color}44`, border:"none", color:"#fff", borderRadius:8, padding:"3px 7px", cursor:"pointer", fontSize:11 }}>🃏</button>
              </div>
            ))}
          </div>

          {/* Custom subjects */}
          {customSubjects.length > 0 && (
            <>
              <div style={{ marginBottom:10, fontWeight:800, fontSize:15, opacity:.8 }}>✏️ Meine Sets</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {customSubjects.map(s => (
                  <div key={s.id} style={{ position:"relative" }}>
                    <button className="btn" onClick={() => startQuiz(s)} style={{ width:"100%", padding:"16px 14px", borderRadius:16, textAlign:"left", background:`linear-gradient(135deg,${s.color}44,${s.color}11)`, border:`1.5px solid ${s.color}66`, color:"#fff", display:"flex", flexDirection:"column", gap:4 }}>
                      <span style={{ fontSize:28 }}>{s.emoji}</span>
                      <span style={{ fontWeight:900, fontSize:14 }}>{s.label}</span>
                      <span style={{ fontSize:11, opacity:.6 }}>{(customQuestions[s.id]||[]).length} Fragen</span>
                    </button>
                    <button onClick={() => { setCustomSubjects(p => p.filter(x => x.id !== s.id)); setCustomQuestions(p => { const n={...p}; delete n[s.id]; return n; }); }}
                      style={{ position:"absolute", top:6, right:6, background:"rgba(255,80,80,.2)", border:"none", color:"#ff6b6b", borderRadius:6, width:22, height:22, cursor:"pointer", fontSize:11 }}>✕</button>
                    <button onClick={() => startQuiz(s,"flashcard")} style={{ position:"absolute", bottom:8, right:8, background:`${s.color}44`, border:"none", color:"#fff", borderRadius:8, padding:"3px 7px", cursor:"pointer", fontSize:11 }}>🃏</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── QUIZ ── */}
      {screen === "quiz" && currentQ && (
        <div style={{ width:"100%", maxWidth:480, animation:"slideUp .3s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button className="btn" onClick={() => setScreen("home")} style={{ background:"rgba(255,255,255,.1)", padding:"6px 12px", borderRadius:99, color:"#fff", fontSize:13 }}>✕</button>
              <span style={{ fontSize:18 }}>{selectedSubject?.emoji}</span>
              <span style={{ fontWeight:700, opacity:.8, fontSize:14 }}>{selectedSubject?.label}</span>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              {streak>=2 && <span style={{ fontSize:13, fontWeight:700, color:"#FF6B35" }}>🔥{streak}</span>}
              <span style={{ fontWeight:700, opacity:.6, fontSize:13 }}>{questionIndex+1}/{currentQList.length}</span>
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, fontSize:12 }}>
              <span style={{ opacity:.4 }}>Zeit</span>
              <span style={{ fontWeight:800, color:timeLeft<=5?"#FF6B35":"#4ECDC4", animation:timeLeft<=5?"pulse .5s infinite":"none" }}>{timeLeft}s</span>
            </div>
            <ProgressBar value={timeLeft} max={15} color={timeLeft<=5?"#FF6B35":"#4ECDC4"} height={8} />
          </div>

          <div className="card" style={{ padding:"22px 18px", marginBottom:14 }}>
            <div style={{ fontSize:11, opacity:.4, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Frage {questionIndex+1}</div>
            <div style={{ fontWeight:800, fontSize:18, lineHeight:1.45 }}>{currentQ.q}</div>
          </div>

          <div>
            {currentQ.answers.map((ans, i) => {
              let bg="rgba(255,255,255,.06)", border="rgba(255,255,255,.15)";
              if (showFeedback) {
                if (i===currentQ.correct){bg="rgba(78,205,196,.2)";border="#4ECDC4";}
                else if (i===selectedAnswer){bg="rgba(255,107,53,.2)";border="#FF6B35";}
              }
              return (
                <button key={i} className="ans-btn" disabled={showFeedback} onClick={() => handleAnswer(i)} style={{ background:bg, borderColor:border }}>
                  <span style={{ marginRight:10, opacity:.5, fontWeight:700 }}>{["A","B","C","D"][i]}</span>
                  {ans}
                  {showFeedback&&i===currentQ.correct&&<span style={{ float:"right" }}>✅</span>}
                  {showFeedback&&i===selectedAnswer&&i!==currentQ.correct&&<span style={{ float:"right" }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation + Weiter */}
          {showFeedback && settings.showExplanations && (
            <div style={{ marginTop:4, animation:"slideUp .3s ease" }}>
              {currentQ.explain && (
                <div style={{ background:"rgba(78,205,196,.1)", border:"1px solid rgba(78,205,196,.3)", borderRadius:14, padding:"12px 16px", marginBottom:10 }}>
                  <div style={{ fontWeight:800, fontSize:13, marginBottom:4, color:"#4ECDC4" }}>💡 Erklärung</div>
                  <div style={{ fontSize:13, lineHeight:1.5, opacity:.85 }}>{currentQ.explain}</div>
                </div>
              )}
              <button onClick={advanceQuestion} style={{ width:"100%", padding:14, borderRadius:14, background:"linear-gradient(135deg,#4ECDC4,#45B7D1)", color:"#fff", fontSize:15, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                {questionIndex + 1 < currentQList.length ? "Weiter →" : "Ergebnis anzeigen 🏆"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── FLASHCARD ── */}
      {screen === "flashcard" && currentQ && (
        <div style={{ width:"100%", maxWidth:480, animation:"slideUp .3s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <button className="btn" onClick={() => setScreen("home")} style={{ background:"rgba(255,255,255,.1)", padding:"6px 12px", borderRadius:99, color:"#fff", fontSize:13 }}>✕</button>
            <div style={{ fontWeight:700, opacity:.7 }}>{questionIndex+1}/{currentQList.length} · {selectedSubject?.emoji} {selectedSubject?.label}</div>
          </div>

          <div onClick={() => setFlashcardFlipped(f => !f)} style={{ cursor:"pointer", minHeight:220, borderRadius:20, border:"1px solid rgba(255,255,255,.15)", background:flashcardFlipped?"rgba(78,205,196,.15)":"rgba(255,255,255,.07)", padding:28, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", transition:"background .3s", backdropFilter:"blur(12px)" }}>
            {!flashcardFlipped ? (
              <>
                <div style={{ fontSize:12, opacity:.4, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Frage – tippen zum Umdrehen</div>
                <div style={{ fontWeight:800, fontSize:19, lineHeight:1.45 }}>{currentQ.q}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:12, opacity:.4, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Antwort</div>
                <div style={{ fontWeight:800, fontSize:18, color:"#4ECDC4", marginBottom:10 }}>{currentQ.answers[currentQ.correct]}</div>
                {currentQ.explain && <div style={{ fontSize:13, opacity:.7, lineHeight:1.5 }}>{currentQ.explain}</div>}
              </>
            )}
          </div>

          <div style={{ display:"flex", gap:10, marginTop:14 }}>
            <button className="btn" onClick={() => { if(questionIndex>0){setQuestionIndex(i=>i-1);setFlashcardFlipped(false);} }} disabled={questionIndex===0} style={{ flex:1, padding:14, borderRadius:14, background:"rgba(255,255,255,.08)", color:"#fff", opacity:questionIndex===0?.4:1 }}>← Zurück</button>
            <button className="btn" onClick={() => { if(questionIndex+1<currentQList.length){setQuestionIndex(i=>i+1);setFlashcardFlipped(false);}else{setScreen("home");} }} style={{ flex:2, padding:14, borderRadius:14, background:"linear-gradient(135deg,#4ECDC4,#45B7D1)", color:"#fff" }}>
              {questionIndex+1<currentQList.length?"Weiter →":"Fertig ✓"}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {screen === "result" && (
        <div style={{ width:"100%", maxWidth:480, textAlign:"center", animation:"popIn .5s ease" }}>
          <div style={{ fontSize:70, marginBottom:8 }}>{score===currentQList.length?"🏆":score>=currentQList.length*.6?"🎉":"💪"}</div>
          <div style={{ fontFamily:"'Boogaloo',cursive", fontSize:34, marginBottom:4 }}>{score===currentQList.length?"Perfekt!":score>=currentQList.length*.6?"Super!":"Weiter so!"}</div>
          <div style={{ fontSize:15, opacity:.7, marginBottom:20 }}>{score} von {currentQList.length} richtig</div>
          <div className="card" style={{ padding:18, marginBottom:18, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[{l:"Richtig",v:score,e:"✅"},{l:"Falsch",v:currentQList.length-score,e:"❌"},{l:"Streak",v:`${streak}🔥`,e:""},{l:"XP verdient",v:`+${score*15}`,e:"⭐"}].map(x=>(
              <div key={x.l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:22 }}>{x.e}</div>
                <div style={{ fontWeight:900, fontSize:19 }}>{x.v}</div>
                <div style={{ fontSize:11, opacity:.5 }}>{x.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn" onClick={() => startQuiz(selectedSubject)} style={{ flex:1, padding:14, borderRadius:14, background:`linear-gradient(135deg,${selectedSubject?.color||"#667eea"},${selectedSubject?.color||"#764ba2"}aa)`, color:"#fff", fontSize:15 }}>🔄 Nochmal</button>
            <button className="btn" onClick={() => setScreen("home")} style={{ flex:1, padding:14, borderRadius:14, background:"rgba(255,255,255,.1)", color:"#fff", fontSize:15 }}>🏠 Home</button>
          </div>
        </div>
      )}

      {/* ── CREATOR ── */}
      {screen === "creator" && (
        <div style={{ width:"100%", maxWidth:480, animation:"slideUp .4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button className="btn" onClick={() => setScreen("home")} style={{ background:"rgba(255,255,255,.1)", padding:"8px 14px", borderRadius:99, color:"#fff", fontSize:14 }}>← Zurück</button>
            <div style={{ fontWeight:900, fontSize:20 }}>✨ Lernset erstellen</div>
          </div>

          <div className="card" style={{ padding:18, marginBottom:14 }}>
            <div style={{ fontWeight:800, marginBottom:10 }}>1. Name & Aussehen</div>
            <input placeholder="Fachname…" value={cName} onChange={e => setCName(e.target.value)} style={{ marginBottom:10 }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
              {SUBJECT_EMOJIS.map(em => <button key={em} onClick={() => setCEmoji(em)} style={{ width:36, height:36, borderRadius:9, border:`2px solid ${cEmoji===em?"#4ECDC4":"transparent"}`, background:cEmoji===em?"rgba(78,205,196,.2)":"rgba(255,255,255,.07)", cursor:"pointer", fontSize:18 }}>{em}</button>)}
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {SUBJECT_COLORS.map(col => <button key={col} onClick={() => setCColor(col)} style={{ width:30, height:30, borderRadius:"50%", background:col, border:`3px solid ${cColor===col?"#fff":"transparent"}`, cursor:"pointer" }} />)}
            </div>
          </div>

          <div className="card" style={{ padding:18, marginBottom:14 }}>
            <div style={{ fontWeight:800, marginBottom:10 }}>2. Inhalt hinzufügen</div>
            <div style={{ display:"flex", background:"rgba(255,255,255,.05)", borderRadius:12, padding:4, marginBottom:16 }}>
              {[{k:"wiki",l:"🌐 Wikipedia"},{k:"scan",l:"📷 Foto"},{k:"text",l:"📝 Text"},{k:"manual",l:"✏️ Manuell"}].map(t=>(
                <button key={t.k} className={`tab ${creatorTab===t.k?"on":""}`} onClick={() => setCreatorTab(t.k)}>{t.l}</button>
              ))}
            </div>

            {/* WIKI */}
            {creatorTab==="wiki" && (
              <div>
                <div style={{ fontSize:13, opacity:.6, marginBottom:10, lineHeight:1.5 }}>Wikipedia-Link oder Suchbegriff eingeben – KI erstellt Fragen daraus.</div>
                <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <input placeholder="z.B. Fotosynthese oder de.wikipedia.org/wiki/…" value={wikiUrl} onChange={e=>{setWikiUrl(e.target.value);setWikiPreview(null);setWikiError("");}} style={{ flex:1 }} />
                  <button className="btn" onClick={fetchWikipedia} disabled={!wikiUrl.trim()||wikiLoading} style={{ padding:"11px 14px", borderRadius:12, background:wikiUrl.trim()?"rgba(78,205,196,.25)":"rgba(255,255,255,.06)", color:"#fff", border:"1px solid rgba(78,205,196,.4)", flexShrink:0, opacity:wikiUrl.trim()?1:.5 }}>
                    {wikiLoading?<div style={{ width:16,height:16,border:"2px solid #4ECDC4",borderTop:"2px solid transparent",borderRadius:"50%",animation:"spin .8s linear infinite" }}/>:"🔍"}
                  </button>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                  {["Fotosynthese","Zweiter Weltkrieg","Pythagoras","Romeo und Julia","Klimawandel"].map(s=>(
                    <button key={s} onClick={()=>{setWikiUrl(s);setWikiPreview(null);setWikiError("");}} style={{ padding:"4px 10px", borderRadius:99, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", color:"rgba(255,255,255,.7)", fontSize:12, cursor:"pointer" }}>{s}</button>
                  ))}
                </div>
                {wikiError && <div style={{ background:"rgba(255,80,80,.12)", border:"1px solid rgba(255,80,80,.3)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#ff9f9f", marginBottom:10 }}>⚠️ {wikiError}</div>}
                {wikiPreview && (
                  <div style={{ background:"rgba(78,205,196,.08)", border:"1px solid rgba(78,205,196,.25)", borderRadius:12, padding:12, marginBottom:10 }}>
                    <div style={{ fontWeight:800, fontSize:14, marginBottom:4 }}>📖 {wikiPreview.title}</div>
                    <div style={{ fontSize:12, opacity:.6, lineHeight:1.5, maxHeight:80, overflow:"hidden" }}>{wikiPreview.extract}</div>
                    <div style={{ fontSize:11, opacity:.4, marginTop:4 }}>{wikiPreview.extract.length} Zeichen ✓</div>
                  </div>
                )}
                {wikiPreview && (aiLoading?<div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"rgba(255,255,255,.06)",borderRadius:12,padding:14 }}><div style={{ width:18,height:18,border:"2px solid #4ECDC4",borderTop:"2px solid transparent",borderRadius:"50%",animation:"spin .8s linear infinite" }}/><span>KI generiert…</span></div>:<button className="btn" onClick={runAI} style={{ width:"100%",padding:13,borderRadius:12,background:"linear-gradient(135deg,#667eea,#764ba2)",color:"#fff",fontSize:14 }}>🤖 Fragen generieren</button>)}
                {aiError && <div style={{ color:"#FF6B35",fontSize:13,marginTop:8 }}>{aiError}</div>}
              </div>
            )}

            {/* SCAN */}
            {creatorTab==="scan" && (
              <div>
                <div style={{ fontSize:13, opacity:.6, marginBottom:10, lineHeight:1.5 }}>Foto von Schulbuch, Tafel oder Notizen – KI liest Inhalt und erstellt Fragen.</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} style={{ display:"none" }} />
                {!cImage?(
                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                    <button className="btn" onClick={()=>{fileRef.current.removeAttribute("capture");fileRef.current.click();}} style={{ padding:13,borderRadius:13,background:"rgba(255,255,255,.1)",color:"#fff",fontSize:14 }}>🖼️ Bild auswählen</button>
                    <button className="btn" onClick={()=>{fileRef.current.setAttribute("capture","environment");fileRef.current.click();}} style={{ padding:13,borderRadius:13,background:"rgba(255,255,255,.1)",color:"#fff",fontSize:14 }}>📷 Kamera öffnen</button>
                  </div>
                ):(
                  <div>
                    <img src={`data:${cImageMime};base64,${cImage}`} alt="preview" style={{ width:"100%",borderRadius:12,marginBottom:10,maxHeight:200,objectFit:"cover" }} />
                    <div style={{ display:"flex",gap:8 }}>
                      <button className="btn" onClick={()=>{setCImage(null);setCImageMime("");}} style={{ flex:1,padding:11,borderRadius:11,background:"rgba(255,80,80,.15)",color:"#ff6b6b",border:"1px solid rgba(255,80,80,.3)" }}>🗑️</button>
                      {aiLoading?<div style={{ flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"rgba(255,255,255,.06)",borderRadius:11,padding:11 }}><div style={{ width:16,height:16,border:"2px solid #4ECDC4",borderTop:"2px solid transparent",borderRadius:"50%",animation:"spin .8s linear infinite" }}/><span style={{ fontSize:13 }}>Analysiere…</span></div>:<button className="btn" onClick={runAI} style={{ flex:2,padding:11,borderRadius:11,background:"linear-gradient(135deg,#667eea,#764ba2)",color:"#fff",fontSize:14 }}>🤖 Fragen generieren</button>}
                    </div>
                    {aiError && <div style={{ color:"#FF6B35",fontSize:13,marginTop:8 }}>{aiError}</div>}
                  </div>
                )}
              </div>
            )}

            {/* TEXT */}
            {creatorTab==="text" && (
              <div>
                <div style={{ fontSize:13,opacity:.6,marginBottom:10 }}>Text einfügen – KI erstellt 5 Fragen daraus.</div>
                <textarea placeholder="Lerntext hier einfügen…" value={cText} onChange={e=>setCText(e.target.value)} rows={6} style={{ marginBottom:10,resize:"vertical" }} />
                {aiLoading?<div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"rgba(255,255,255,.06)",borderRadius:12,padding:13 }}><div style={{ width:16,height:16,border:"2px solid #4ECDC4",borderTop:"2px solid transparent",borderRadius:"50%",animation:"spin .8s linear infinite" }}/><span>KI generiert…</span></div>:<button className="btn" onClick={runAI} disabled={!cText.trim()} style={{ width:"100%",padding:13,borderRadius:12,background:cText.trim()?"linear-gradient(135deg,#667eea,#764ba2)":"rgba(255,255,255,.08)",color:"#fff",fontSize:14,opacity:cText.trim()?1:.5 }}>🤖 Fragen generieren</button>}
                {aiError && <div style={{ color:"#FF6B35",fontSize:13,marginTop:8 }}>{aiError}</div>}
              </div>
            )}

            {/* MANUAL */}
            {creatorTab==="manual" && (
              <div>
                <div style={{ fontSize:13,opacity:.6,marginBottom:10 }}>Eigene Frage eingeben. Kreis = richtige Antwort.</div>
                <input placeholder="Frage…" value={manualQ.q} onChange={e=>setManualQ(m=>({...m,q:e.target.value}))} style={{ marginBottom:8 }} />
                {manualQ.answers.map((a,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,marginBottom:7,alignItems:"center" }}>
                    <button onClick={()=>setManualQ(m=>({...m,correct:i}))} style={{ width:32,height:32,borderRadius:"50%",border:`2px solid ${manualQ.correct===i?"#4ECDC4":"rgba(255,255,255,.2)"}`,background:manualQ.correct===i?"rgba(78,205,196,.25)":"transparent",cursor:"pointer",color:"#fff",fontSize:12,flexShrink:0 }}>{["A","B","C","D"][i]}</button>
                    <input placeholder={`Antwort ${["A","B","C","D"][i]}`} value={a} onChange={e=>{const arr=[...manualQ.answers];arr[i]=e.target.value;setManualQ(m=>({...m,answers:arr}));}} />
                  </div>
                ))}
                <input placeholder="Erklärung (optional)" value={manualQ.explain} onChange={e=>setManualQ(m=>({...m,explain:e.target.value}))} style={{ marginBottom:10 }} />
                <button className="btn" onClick={addManual} disabled={!manualQ.q.trim()||manualQ.answers.some(a=>!a.trim())} style={{ width:"100%",padding:11,borderRadius:11,background:manualQ.q.trim()&&manualQ.answers.every(a=>a.trim())?"rgba(78,205,196,.25)":"rgba(255,255,255,.06)",color:"#fff",border:"1px solid rgba(78,205,196,.4)",fontSize:13,opacity:manualQ.q.trim()&&manualQ.answers.every(a=>a.trim())?1:.5 }}>➕ Frage hinzufügen</button>
              </div>
            )}
          </div>

          {/* Preview */}
          {pendingQs.length>0 && (
            <div className="card" style={{ padding:14,marginBottom:14 }}>
              <div style={{ fontWeight:800,fontSize:13,marginBottom:10,display:"flex",justifyContent:"space-between" }}>
                <span>✅ {pendingQs.length} Frage(n)</span>
                <button onClick={()=>setShowPreview(p=>!p)} style={{ background:"none",border:"none",color:"#4ECDC4",cursor:"pointer",fontSize:13 }}>{showPreview?"▲":"▼"}</button>
              </div>
              {showPreview&&pendingQs.map((q,i)=>(
                <div key={i} style={{ marginBottom:12,paddingBottom:12,borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                  <div style={{ fontWeight:700,fontSize:13,marginBottom:5 }}>{i+1}. {q.q}</div>
                  {q.answers.map((a,j)=><div key={j} style={{ fontSize:12,padding:"3px 8px",borderRadius:6,marginBottom:2,background:j===q.correct?"rgba(78,205,196,.2)":"rgba(255,255,255,.04)",border:j===q.correct?"1px solid #4ECDC4":"1px solid transparent" }}>{["A","B","C","D"][j]}. {a}{j===q.correct&&" ✅"}</div>)}
                  <button onClick={()=>setPendingQs(p=>p.filter((_,idx)=>idx!==i))} style={{ marginTop:5,background:"none",border:"none",color:"#ff6b6b",cursor:"pointer",fontSize:12 }}>🗑️ Entfernen</button>
                </div>
              ))}
            </div>
          )}

          {pendingQs.length>0 && (
            <button className="btn" onClick={saveSet} disabled={!cName.trim()} style={{ width:"100%",padding:15,borderRadius:15,background:cName.trim()?`linear-gradient(135deg,${cColor},${cColor}99)`:"rgba(255,255,255,.1)",color:"#fff",fontSize:16,opacity:cName.trim()?1:.6 }}>
              💾 Speichern – {pendingQs.length} Fragen
            </button>
          )}
        </div>
      )}

      {/* ── PROFILE ── */}
      {screen === "profile" && (
        <div style={{ width:"100%", maxWidth:480, animation:"slideUp .4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button className="btn" onClick={() => setScreen("home")} style={{ background:"rgba(255,255,255,.1)", padding:"8px 14px", borderRadius:99, color:"#fff", fontSize:14 }}>← Zurück</button>
            <div style={{ fontWeight:900, fontSize:20 }}>Mein Profil</div>
          </div>

          {/* Avatar selector */}
          <div className="card" style={{ padding:20, marginBottom:14, textAlign:"center" }}>
            <div style={{ fontSize:60, marginBottom:8 }}>{stats.avatar || "🐣"}</div>
            <div style={{ fontWeight:900, fontSize:22 }}>{LEVEL_NAMES[level]}</div>
            <div style={{ opacity:.5, fontSize:13, marginBottom:12 }}>Level {level+1} · {stats.dailyStreak||0} Tage Streak 🔥</div>
            <ProgressBar value={stats.points-XP_LEVELS[level]} max={nextXP-XP_LEVELS[level]} color="#4ECDC4" />
            <div style={{ fontSize:11,opacity:.4,marginTop:4 }}>{stats.points} / {nextXP} XP</div>
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:12, opacity:.5, marginBottom:8 }}>Avatar wählen:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                {AVATARS.map(av=><button key={av} onClick={()=>setStats(s=>({...s,avatar:av}))} style={{ width:40,height:40,borderRadius:10,border:`2px solid ${stats.avatar===av?"#4ECDC4":"transparent"}`,background:stats.avatar===av?"rgba(78,205,196,.2)":"rgba(255,255,255,.07)",cursor:"pointer",fontSize:22 }}>{av}</button>)}
              </div>
            </div>
          </div>

          <div style={{ fontWeight:800, fontSize:14, marginBottom:10, opacity:.8 }}>🏅 Abzeichen</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
            {BADGES.map(b=>{const earned=stats.earnedBadges.includes(b.id);return(
              <div key={b.id} className="card" style={{ padding:"14px 8px",textAlign:"center",opacity:earned?1:.3,background:earned?"rgba(255,255,255,.12)":"rgba(255,255,255,.04)" }}>
                <div style={{ fontSize:26,filter:earned?"none":"grayscale(1)" }}>{b.emoji}</div>
                <div style={{ fontSize:10,fontWeight:700,marginTop:3 }}>{b.label}</div>
              </div>
            );})}
          </div>

          <div style={{ fontWeight:800, fontSize:14, marginBottom:10, opacity:.8 }}>📊 Statistiken</div>
          <div className="card" style={{ padding:18, marginBottom:14 }}>
            {[["Gesamt XP",`${stats.points} ⭐`],["Fragen beantwortet",stats.totalAnswered],["Beste Streak",`${stats.maxStreak} 🔥`],["Tage-Streak",`${stats.dailyStreak||0} 📅`],["Fächer gespielt",(stats.subjectsPlayed||[]).length],["Eigene Sets",stats.createdSets||0],["Lernminuten",`${stats.totalMinutes||0} min`]].map(([l,v])=>(
              <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                <span style={{ opacity:.6 }}>{l}</span><span style={{ fontWeight:800 }}>{v}</span>
              </div>
            ))}
          </div>

          <button className="btn" onClick={()=>{ if(window.confirm("Alle Daten wirklich zurücksetzen?")){ setStats({points:0,totalAnswered:0,maxStreak:0,subjectsPlayed:[],earnedBadges:[],createdSets:0,dailyStreak:0,lastPlayedDate:"",totalSessions:0,totalMinutes:0,avatar:"🐣"}); setScreen("home"); } }} style={{ width:"100%",padding:12,borderRadius:12,background:"rgba(255,80,80,.15)",color:"#ff6b6b",border:"1px solid rgba(255,80,80,.3)",fontSize:13 }}>
            🗑️ Alle Daten zurücksetzen
          </button>
        </div>
      )}

      {/* ── PARENT ── */}
      {screen === "parent" && (
        <div style={{ width:"100%", maxWidth:480, animation:"slideUp .4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button className="btn" onClick={() => setScreen("home")} style={{ background:"rgba(255,255,255,.1)", padding:"8px 14px", borderRadius:99, color:"#fff", fontSize:14 }}>← Zurück</button>
            <div style={{ fontWeight:900, fontSize:20 }}>👨‍👩‍👧 Elternbereich</div>
          </div>

          {/* PIN Lock */}
          {parentScreen === "lock" && (
            <div className="card" style={{ padding:28, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
              <div style={{ fontWeight:800, fontSize:18, marginBottom:6 }}>PIN eingeben</div>
              <div style={{ opacity:.5, fontSize:13, marginBottom:24 }}>Elternbereich ist PIN-geschützt</div>
              <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:20 }}>
                {[1,2,3,4].map(i=><div key={i} style={{ width:16,height:16,borderRadius:"50%",background:pinInput.length>=i?"#4ECDC4":"rgba(255,255,255,.2)" }} />)}
              </div>
              {pinError && <div style={{ color:"#FF6B35",fontSize:13,marginBottom:14 }}>{pinError}</div>}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, maxWidth:240, margin:"0 auto" }}>
                {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>(
                  <button key={i} className="pin-btn" onClick={()=>{
                    if(k==="⌫") setPinInput(p=>p.slice(0,-1));
                    else if(k!==""&&pinInput.length<4) setPinInput(p=>p+k);
                  }} style={{ opacity:k===""?0:1 }}>{k}</button>
                ))}
              </div>
              <button className="btn" onClick={checkPin} disabled={pinInput.length<4} style={{ marginTop:20,width:"100%",padding:14,borderRadius:14,background:pinInput.length>=4?"linear-gradient(135deg,#667eea,#764ba2)":"rgba(255,255,255,.1)",color:"#fff",fontSize:15,opacity:pinInput.length>=4?1:.5 }}>Entsperren</button>
            </div>
          )}

          {/* PIN Setup */}
          {parentScreen === "setup" && (
            <div className="card" style={{ padding:24 }}>
              <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:6, textAlign:"center" }}>PIN einrichten</div>
              <div style={{ opacity:.5, fontSize:13, marginBottom:18, textAlign:"center" }}>Schütze den Elternbereich mit einer PIN</div>
              <input placeholder="Neue PIN (min. 4 Stellen)" type="password" value={newPin} onChange={e=>setNewPin(e.target.value.replace(/\D/g,""))} style={{ marginBottom:10 }} />
              <input placeholder="PIN wiederholen" type="password" value={confirmPin} onChange={e=>setConfirmPin(e.target.value.replace(/\D/g,""))} style={{ marginBottom:12 }} />
              {pinError && <div style={{ color:"#FF6B35",fontSize:13,marginBottom:10 }}>{pinError}</div>}
              <button className="btn" onClick={savePin} style={{ width:"100%",padding:14,borderRadius:14,background:"linear-gradient(135deg,#667eea,#764ba2)",color:"#fff",fontSize:15 }}>✓ PIN speichern</button>
            </div>
          )}

          {/* Dashboard */}
          {parentScreen === "dashboard" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {[{l:"Gesamtpunkte",v:`${stats.points} ⭐`,e:""},{l:"Fragen beantwortet",v:stats.totalAnswered,e:"✅"},{l:"Tage-Streak",v:`${stats.dailyStreak||0} Tage`,e:"📅"},{l:"Lernminuten",v:`${stats.totalMinutes||0} min`,e:"⏱️"}].map(x=>(
                  <div key={x.l} className="card" style={{ padding:"14px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:22 }}>{x.e}</div>
                    <div style={{ fontWeight:900, fontSize:18 }}>{x.v}</div>
                    <div style={{ fontSize:11, opacity:.5 }}>{x.l}</div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>📚 Gespielte Fächer</div>
                {(stats.subjectsPlayed||[]).length === 0 ? <div style={{ opacity:.5, fontSize:13 }}>Noch keine Fächer gespielt.</div> :
                  (stats.subjectsPlayed||[]).map(id=>{const s=allSubjects.find(x=>x.id===id); return s?(
                    <div key={id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                      <span style={{ fontSize:20 }}>{s.emoji}</span>
                      <span style={{ fontWeight:700 }}>{s.label}</span>
                    </div>
                  ):null;})}
              </div>

              <div className="card" style={{ padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>🕐 Letzte Lernsessions</div>
                {sessionLog.length===0 ? <div style={{ opacity:.5, fontSize:13 }}>Noch keine Sessions aufgezeichnet.</div> :
                  sessionLog.slice(0,8).map((s,i)=>(
                    <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.07)",fontSize:13 }}>
                      <div>
                        <span style={{ fontWeight:700 }}>{s.subject}</span>
                        <span style={{ opacity:.5 }}> · {s.date} {s.time}</span>
                      </div>
                      <div style={{ opacity:.8 }}>{s.score}/{s.total} · {s.mins}min</div>
                    </div>
                  ))}
              </div>

              <button className="btn" onClick={()=>{setParentPin("");setParentScreen("lock");}} style={{ width:"100%",padding:12,borderRadius:12,background:"rgba(255,80,80,.15)",color:"#ff6b6b",border:"1px solid rgba(255,80,80,.3)",fontSize:13,marginBottom:10 }}>
                🔓 PIN entfernen
              </button>
              <button className="btn" onClick={()=>setParentScreen("setup")} style={{ width:"100%",padding:12,borderRadius:12,background:"rgba(255,255,255,.08)",color:"#fff",fontSize:13 }}>
                🔐 PIN ändern
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
