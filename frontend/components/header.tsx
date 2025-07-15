"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import DarkLightSwitch from "./dark-light-switch";

function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }
  return (
    <div className="bg-blue-500 text-white p-4 dark:bg-gray-800 dark:text-gray-200">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">My Blog</h1>
          </Link>
          <div className="flex items-center space-x-4 ">
            <DarkLightSwitch />
            {user ? (
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-700">
                      <FaRegUser className="mr-2" />
                      Profile
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="text-center">
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/category"
                            className="text-blue-500 hover:underline"
                          >
                            Category
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/my-blogs"
                            className="text-blue-500 hover:underline"
                          >
                            Blog
                          </Link>
                        </li>
                      </ul>
                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className={cn("mt-4 w-full hover:cursor-pointer")}
                      >
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div>
                <Link href="/login">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
