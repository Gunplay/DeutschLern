"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Brain } from "lucide-react";

// =============================
// TYPES
// =============================

type Question = {
  id: number;
  sentence: string;
  correct: string;
  options: string[];
};

// =============================
// QUESTIONS
// =============================

const QUESTIONS: Question[] = [
  { id: 1, sentence: "Ich ___ jeden Morgen Kaffee.", correct: "trinke", options: ["trinke", "trinkst", "trinkt", "getrunken", "trinken"] },
  { id: 2, sentence: "Wir ___ heute ins Kino.", correct: "gehen", options: ["geht", "gehen", "ging", "gegangen", "gehst"] },
  { id: 3, sentence: "Er ___ ein neues Auto gekauft.", correct: "hat", options: ["hat", "ist", "war", "haben", "wird"] },
  { id: 4, sentence: "Ich wohne ___ Berlin.", correct: "in", options: ["auf", "an", "in", "bei", "mit"] },
  { id: 5, sentence: "Sie ___ sehr schnell Deutsch.", correct: "lernt", options: ["lernen", "lernt", "lernst", "lernte", "gelernt"] },
  { id: 6, sentence: "Das Buch liegt ___ dem Tisch.", correct: "auf", options: ["unter", "auf", "neben", "zwischen", "über"] },
  { id: 7, sentence: "Wir haben gestern lange ___.", correct: "gearbeitet", options: ["arbeiten", "arbeitet", "gearbeitet", "arbeite", "arbeitete"] },
  { id: 8, sentence: "Kannst du mir bitte ___ helfen?", correct: "heute", options: ["heute", "morgen", "gestern", "jetzt", "später"] },
  { id: 9, sentence: "Ich habe keine ___ Zeit.", correct: "freie", options: ["frei", "freie", "freies", "freien", "freier"] },
  { id: 10, sentence: "Der Hund läuft ___ Park.", correct: "im", options: ["im", "am", "zum", "vom", "ins"] },
  { id: 11, sentence: "Wir fahren ___ Deutschland.", correct: "nach", options: ["zu", "in", "nach", "auf", "bei"] },
  { id: 12, sentence: "Ich möchte ein Brot ___ Butter.", correct: "mit", options: ["mit", "ohne", "für", "gegen", "über"] },
  { id: 13, sentence: "Er ___ jeden Tag Sport.", correct: "macht", options: ["macht", "machen", "machte", "gemacht", "machst"] },
  { id: 14, sentence: "Heute ist das Wetter sehr ___.", correct: "schön", options: ["schön", "schöne", "schönen", "schoner", "schönes"] },
  { id: 15, sentence: "Ich habe Hunger, ___ esse ich.", correct: "also", options: ["aber", "also", "denn", "oder", "weil"] },
  { id: 16, sentence: "Sie kommt ___ 18 Uhr.", correct: "um", options: ["um", "am", "im", "an", "bei"] },
  { id: 17, sentence: "Wir sprechen ___ Deutsch.", correct: "nur", options: ["nur", "schon", "noch", "erst", "immer"] },
  { id: 18, sentence: "Ich habe den Film schon ___ gesehen.", correct: "einmal", options: ["einmal", "zweimal", "oft", "nie", "gern"] },
  { id: 19, sentence: "Das ist ___ bester Freund.", correct: "mein", options: ["mein", "meine", "meinen", "meinem", "meiner"] },
  { id: 20, sentence: "Wir müssen jetzt ___ gehen.", correct: "nach Hause", options: ["nach Hause", "zu Hause", "im Haus", "vom Haus", "am Haus"] },
];

// =============================
// COMPONENT
// =============================

export default function GermanTestPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const score = QUESTIONS.filter((q) => answers[q.id] === q.correct).length;

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* HERO */}
      <div className="relative overflow-hidden border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center text-center gap-6"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="p-4 rounded-3xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-xl"
          >
            <Brain size={42} />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            German Knowledge Challenge
          </h1>

          <p className="text-slate-400 max-w-xl">
            Fill the missing words. Improve grammar intuition and test your German level.
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xl h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* QUESTIONS */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {QUESTIONS.map((q, index) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-indigo-400/40 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">
                      {q.id}. {q.sentence.replace("___", "______")}
                    </p>

                    {submitted && (
                      isCorrect ? (
                        <CheckCircle2 className="text-green-400" />
                      ) : (
                        <XCircle className="text-red-400" />
                      )
                    )}
                  </div>

                  <select
                    value={userAnswer || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className={`w-full p-3 rounded-xl bg-black/40 border transition-all focus:outline-none focus:ring-2 text-white ${
                      submitted
                        ? isCorrect
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : "border-white/20 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Choose word...</option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {submitted && !isCorrect && (
                    <p className="text-sm text-red-400">
                      Correct answer: {q.correct}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* RESULT */}
        <div className="flex flex-col items-center gap-6 pt-6">
          <Button
            size="lg"
            onClick={() => setSubmitted(true)}
            className="rounded-2xl text-lg px-10 py-6 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:scale-105 transition-transform"
          >
            Check Answers
          </Button>

          {submitted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-semibold bg-white/5 px-8 py-4 rounded-2xl border border-white/10"
            >
              Score: {score} / {QUESTIONS.length}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
