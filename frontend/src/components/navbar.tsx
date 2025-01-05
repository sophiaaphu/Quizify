'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { RiUser3Line, RiLogoutBoxLine } from "react-icons/ri";
import { Button } from './ui/button';

export default function Navbar() {
  const { data: session } = useSession();

  // Function to extract the first name from the full name
  const getFirstName = (fullName: string | null | undefined): string => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  return (
    <header className="flex items-center justify-between py-4 px-8 md:px-16 lg:px-24 border-b">
      <Link href="/">
        <Image
          src="/quizify-logo.png"
          alt="quizify-logo"
          width={160}
          height={80}
          className="w-[110px] lg:w-[140px]"
        />
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {session && session.user ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                Hi, {getFirstName(session.user.name)}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col p-2 w-32">
                  <li className='p-2  hover:bg-gray-100 rounded-md'>
                    <Link href="/profile" passHref>
                      <NavigationMenuLink className="text-sm flex items-center gap-2 text-gray-700">
                        <RiUser3Line/>
                        Profile
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <div className='border-b'></div>
                  <li className='p-2 hover:bg-gray-100 rounded-md'>
                    <button
                      onClick={() => signOut()}
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                      <RiLogoutBoxLine/>
                      Logout
                    </button>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="bg-[#FF5353] text-white px-4 py-2 rounded-md"
              >
                <Button onClick={() => signIn('google')} className=' hover:bg-[#FF0000]'>Log in</Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}