import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
export default function Navbar() {
  return (
    <header className=" flex items-center justify-between py-4 px-24 border-b">
      <Link href="/">
        <Image
          src="/quizify-logo.png"
          alt="quizify-logo"
          width={160}
          height={80}
          className="w-[100px] lg:w-[140px]"
        ></Image>
      </Link>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/resources" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-[#FF5353] text-white`}>
                  Log in
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
