import { useState } from "react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

interface QuestionCardProps {
  question: string;
  options: string[];
  questionNumber: number;
  correctAnswer: string;
}

export default function QuestionCard({
  question,
  options,
  questionNumber,
  correctAnswer,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex flex-col border p-4 rounded-md md:p-6 gap-2">
      <div>
        <p className="text-base md:text-lg font-semibold">Question {questionNumber}</p>
        <p className="text-sm md:text-base text-neutral-400">{question}</p>
      </div>
      <div className="flex flex-col gap-1">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleOptionClick(option)}
          >
            <RiCheckboxBlankCircleFill
              className={`${
                selectedOption === option
                  ? option === correctAnswer
                    ? "text-green-500"
                    : "text-[#FF0000]"
                  : "text-neutral-300"
              }`}
            />
            <p className="text-sm md:text-base">{option}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

