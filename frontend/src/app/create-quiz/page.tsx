'use client';
import { useSession, signIn} from 'next-auth/react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RiGoogleFill } from "react-icons/ri";

export default function CreateQuiz() {
  const { data: session } = useSession();
  return (
    <main className=" flex flex-col gap-24 px-8 md:px-24 lg:px-36 pb-12">
        <div>
          <h1 className='font-bold text-3xl md:text-4xl'>
            What quiz do you want me to create?
          </h1>
        </div>
    </main>
  );
}