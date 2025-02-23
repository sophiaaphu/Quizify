"use client";

import { useSession } from "next-auth/react";
import { RiMore2Fill, RiDeleteBinLine } from "react-icons/ri";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `http://localhost:5000/get_quizzes?user_id=${encodeURIComponent(
            session.user.email
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
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

    if (session?.user?.email) {
      fetchQuizzes();
    }
  }, [session]);

  // Modify determinePeriod to accept an optional date
  const determinePeriod = (dateStr: string | null): string => {
    if (!dateStr) return "Never Opened";

    const quizDate = new Date(dateStr);
    const today = new Date();

    // Reset hours to midnight for accurate day comparison
    today.setHours(0, 0, 0, 0);
    quizDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - quizDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
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

  // Add this delete handler function
  const handleDeleteQuiz = async (quizId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the quiz click handler
    try {
      const response = await fetch(
        `http://localhost:5000/delete_quiz/${quizId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      // Remove the quiz from the local state
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
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
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <RiMore2Fill className="ml-auto" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                        >
                          <div className="flex items-center w-full gap-2 justify-center">
                            <RiDeleteBinLine />
                            Delete
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
