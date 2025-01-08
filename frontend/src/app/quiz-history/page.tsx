"use client";

import { useSession } from "next-auth/react";
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
  last_opened: string | null;
};

export default function QuizHistory() {
  const { data: session } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_quizzes");
        const data = await response.json();
        // Sort quizzes by last_opened (or created_at if never opened) in descending order
        const sortedQuizzes = data.sort((a: Quiz, b: Quiz) => {
          const timeA = a.last_opened
            ? new Date(a.last_opened).getTime()
            : new Date(a.created_at).getTime();
          const timeB = b.last_opened
            ? new Date(b.last_opened).getTime()
            : new Date(b.created_at).getTime();
          return timeB - timeA;
        });
        setQuizzes(sortedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  // Modify determinePeriod to accept an optional date
  const determinePeriod = (dateStr: string | null): string => {
    if (!dateStr) return "Never Opened";

    const quizDate = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - quizDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return "Previous 7 Days";
    if (diffDays <= 30) return "Previous 30 Days";
    return "Earlier";
  };

  // Group quizzes by last_opened instead of created_at
  const groupedQuizzes = quizzes.reduce<Record<string, Quiz[]>>((acc, quiz) => {
    const period = determinePeriod(quiz.last_opened);
    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(quiz);
    return acc;
  }, {});

  // Handle quiz selection
  const handleQuizClick = async (quizId: number) => {
    try {
      // Update the quiz time before navigation
      await fetch(`http://localhost:5000/update_quiz_time/${quizId}`, {
        method: "PUT",
      });

      // Navigate to the quiz
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error updating quiz time:", error);
      // Still navigate even if the update fails
      router.push(`/quiz/${quizId}`);
    }
  };

  return (
    <main className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12 -mt-8">
      <div className="flex flex-col gap-8">
        {Object.entries(groupedQuizzes).map(([period, periodQuizzes]) => (
          <Table key={period}>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold w-1/2 py-3">
                  {period}
                </TableHead>
                <TableHead className="font-semibold">Last Opened</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodQuizzes.map((quiz) => (
                <TableRow key={quiz.id} className="cursor-pointer">
                  <TableCell
                    onClick={() => handleQuizClick(quiz.id)}
                    className="py-3"
                  >
                    {quiz.topic}
                  </TableCell>
                  <TableCell>
                    {quiz.last_opened
                      ? determinePeriod(quiz.last_opened) === "Today"
                        ? new Date(quiz.last_opened).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                        : new Date(quiz.last_opened).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                      : "Never Opened"}
                  </TableCell>
                  <TableCell className="text-right">
                    <RiMore2Fill className="ml-auto" />
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
