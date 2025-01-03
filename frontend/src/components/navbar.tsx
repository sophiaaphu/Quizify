'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import {
  NavigationMenu,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

export default function Navbar() {
  const { data: session } = useSession();

  // Function to extract the first name from the full name
  const getFirstName = (fullName: string | null | undefined): string => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  return (
    <header className="flex items-center justify-between py-4 px-8 lg:px-24 border-b">
      <Link href="/">
        <Image
          src="/quizify-logo.png"
          alt="quizify-logo"
          width={160}
          height={80}
          className="w-[110px] lg:w-[140px]"
        />
      </Link>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {session && session.user ? (
                <span className="px-4 py-2 text-gray-700">
                  Welcome, {getFirstName(session.user.name)}
                </span>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-[#FF5353] text-white`}
                >
                  <button onClick={() => signIn('google')}>Log in</button>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

