"use client";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RiGoogleFill } from "react-icons/ri";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className=" flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12">
      <div className=" flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className=" font-bold text-3xl md:text-4xl">
            A Better Way to Learn
          </h1>
          <div>
            <p className="hidden md:block">
              Whether you&apos;re studying, teaching, or just curious, our web
              app generates engaging,
            </p>
            <p className="hidden md:block">
              customized quizzes in seconds - making learning smarter, faster,
              and more fun
            </p>
            <p className="md:hidden text-sm">
              Whether you&apos;re studying, teaching, or just curious, our web
              app generates engaging, customized quizzes in seconds - making
              learning smarter, faster, and more fun
            </p>
          </div>
        </div>
        <div>
          {session ? (
            <Button
              className="bg-[#FF0000] hover:bg-[#FF5353] flex items-center gap-2"
              onClick={() => {
                // Redirect to quiz creation page
                window.location.href = "/create-quiz";
              }}
            >
              Create a Quiz
            </Button>
          ) : (
            <Button
              className="bg-[#FF0000] hover:bg-[#FF5353] flex items-center gap-2"
              onClick={() => signIn("google")}
            >
              Sign in with Google
              <RiGoogleFill />
            </Button>
          )}
        </div>
        <div className=" mt-4">
          <Image
            src="/landing-quiz-image.png"
            alt="Description of the image"
            width={500}
            height={300}
            className="w-full rounded-lg drop-shadow-lg"
          />
        </div>
      </div>
      <div className=" flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className=" font-bold text-3xl md:text-4xl">
            Leveraging AI Power
          </h1>
          <p className="text-sm md:text-base">
            Input your quiz topics and any relevant files and your quiz will be
            created in seconds!
          </p>
        </div>
        <div className=" mt-4">
          <Image
            src="/landing-quiz-creation.png"
            alt="Description of the image"
            width={500}
            height={300}
            className="w-full rounded-lg drop-shadow-lg"
          />
        </div>
      </div>
    </main>
  );
}
