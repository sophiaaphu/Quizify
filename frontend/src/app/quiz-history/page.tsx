"use client";

import { RiMore2Fill } from "react-icons/ri";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Update Quiz type to match backend structure
type Quiz = {
  id: number;
  topic: string;
  created_at: string;
};

export default function QuizHistory() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_quizzes');
        const data = await response.json();
        // Sort quizzes by created_at in descending order (most recent first)
        const sortedQuizzes = data.sort((a: Quiz, b: Quiz) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setQuizzes(sortedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  // Modify the determinePeriod function to work with ISO dates
  const determinePeriod = (dateStr: string): string => {
    const quizDate = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - quizDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Yesterday";
    if (diffDays <= 7) return "Previous 7 Days";
    if (diffDays <= 30) return "Previous 30 Days";
    return "Earlier";
  };

  // Group quizzes by period
  const groupedQuizzes = quizzes.reduce<Record<string, Quiz[]>>(
    (acc, quiz) => {
      const period = determinePeriod(quiz.created_at);
      if (!acc[period]) {
        acc[period] = [];
      }
      acc[period].push(quiz);
      return acc;
    },
    {}
  );

  // Handle quiz selection
  const handleQuizClick = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <main className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-24">
      <div className="flex flex-col gap-8">
        {Object.entries(groupedQuizzes).map(([period, periodQuizzes]) => (
          <Table key={period}>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold w-1/2">{period}</TableHead>
                <TableHead className="font-semibold">Last Opened By Me</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodQuizzes.map((quiz) => (
                <TableRow 
                  key={quiz.id} 
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell onClick={() => handleQuizClick(quiz.id)}>{quiz.topic}</TableCell>
                  <TableCell>
                    {determinePeriod(quiz.created_at) === "Yesterday" 
                      ? new Date(quiz.created_at).toLocaleString("en-US", {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })
                      : new Date(quiz.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <RiMore2Fill className="ml-auto cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
      </div>
    </main>
  );
}
