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

// List of quizzes with their dates
const quizzes = [
  { title: "Next.js Crash Course", date: "2025-01-06" },
  { title: "React Basics", date: "2025-01-06" },
  { title: "Advanced JavaScript", date: "2024-12-31" },
  { title: "TypeScript Deep Dive", date: "2024-12-10" },
  { title: "CSS Grid Tutorial", date: "2024-04-25" },
];

// Function to format date as "Month Day, Year"
const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  

// Function to determine the period based on the date
const determinePeriod = (dateStr) => {
  const quizDate = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor((today - quizDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 Days";
  if (diffDays <= 30) return "Previous 30 Days";
  return "Earlier";
};

// Group quizzes by period
const groupedQuizzes = quizzes.reduce((acc, quiz) => {
  const period = determinePeriod(quiz.date);
  acc[period] = acc[period] || [];
  acc[period].push(quiz);
  return acc;
}, {});

export default function QuizHistory() {
  const { data: session } = useSession();

  return (
    <main className="flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-24">
      <div className="flex flex-col gap-8">
        {Object.entries(groupedQuizzes).map(([period, quizzes]) => (
          <Table key={period}>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold w-1/2">{period}</TableHead>
                <TableHead className="font-semibold">
                  Last Opened By Me
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz, index) => (
                <TableRow key={index}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{formatDate(quiz.date)}</TableCell>
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
