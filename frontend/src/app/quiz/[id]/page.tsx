"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import QuestionCard from "@/components/questionCard";
interface Question {
  id: number;
  question: string;
  choices: string[];
  answer: string;
}

interface QuizData {
  id: number;
  topic: string;
  questions: Question[];
}

export default function Quiz() {
  const params = useParams();
  const id = params?.id;
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) {
        setError('Quiz ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/get_quiz/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: QuizData = await response.json();
        setQuiz(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) return <div className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12 -mt-8">Loading...</div>;
  if (error) return <div className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12 -mt-8">Error: {error}</div>;
  if (!quiz) return <div className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12 -mt-8">No quiz data available.</div>;

  return (
    <main className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12 -mt-8">
      <div className="flex flex-col gap-4">
        <p className="text-lg lg:text-xl font-semibold">{quiz.topic}</p>
        {quiz.questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            questionNumber={index + 1}
            question={q.question}
            options={q.choices}
            correctAnswer={q.answer}
          />
        ))}
      </div>
    </main>
  );
}

