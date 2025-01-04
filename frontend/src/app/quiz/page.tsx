"use client";
import { useSession } from "next-auth/react";
import QuestionCard from "@/components/questionCard";

export default function Quiz() {
  const { data: session } = useSession();
  const questions = [
    {
      question: "What is Next.js?",
      options: ["A framework", "A library", "A runtime", "A browser"],
      correctAnswer: "A framework",
    },
    {
      question: "Which language does Next.js use?",
      options: ["JavaScript", "Python", "Ruby", "Java"],
      correctAnswer: "JavaScript",
    },
  ];
  return (
    <main className=" flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12 -mt-8">
      <div className=" flex flex-col gap-4">
        <p className="text-xl font-semibold">Next JS Crash Course</p>
        {questions.map((q, index) => (
          <QuestionCard
            key={index}
            questionNumber={index + 1}
            question={q.question}
            options={q.options}
            correctAnswer={q.correctAnswer}
          />
        ))}
      </div>
    </main>
  );
}
