"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  RiDriveLine,
  RiPushpin2Line,
  RiArrowUpLine,
  RiArrowRightUpLine,
} from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function CreateQuiz() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to the login page if the user is not authenticated
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted prompt:", prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getFirstName = (fullName: string | null | undefined): string => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };
  return (
    <main className="flex flex-col gap-24 px-8 md:px-24 lg:px-36">
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl md:text-4xl">
            {session?.user?.name
              ? `${getFirstName(
                  session.user.name
                )}, what quiz do you want me to create?`
              : "What quiz do you want me to create?"}
          </h1>
          <p className="text-sm md:text-base">
            Enter the quiz topic and insert any relevant files/materials here!
          </p>
        </div>
        <div className=" pt-8">
          <form onSubmit={handleSubmit} className="">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your quiz topic here..."
                className="resize-none overflow-hidden pb-14 min-h-[80px]"
                rows={3}
              />
              <div className="absolute bottom-3 left-3 space-x-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="border-2"
                >
                  <RiPushpin2Line className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="border-2"
                >
                  <RiDriveLine className="h-4 w-4" />
                  <span className="sr-only">Attach from Google Drive</span>
                </Button>
              </div>
              <div className="absolute bottom-3 right-3">
                <Button type="submit" size="icon" disabled={!prompt.trim()}>
                  <RiArrowUpLine className="h-4 w-4" />
                  <span className="sr-only">Submit quiz topic</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-4 md:space-x-2">
          <Badge
            variant="outline"
            className="font-normal rounded-xl bg-neutral-100 border-neutral-300"
          >
            <div className="flex items-center gap-1 hover:gap-4">
              Next.js Concepts
              <RiArrowRightUpLine />
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="font-normal rounded-xl bg-neutral-100 border-neutral-300"
          >
            <div className="flex items-center gap-1 hover:gap-4">
              Eigenvalues and Eigenvectors
              <RiArrowRightUpLine />
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="font-normal rounded-xl bg-neutral-100 border-neutral-300"
          >
            <div className="flex items-center gap-1 hover:gap-4">
              Graph Traversal Algorithms
              <RiArrowRightUpLine />
            </div>
          </Badge>
        </div>
      </div>
    </main>
  );
}
