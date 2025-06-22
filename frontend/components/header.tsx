"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaRegUser } from "react-icons/fa6";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

function Header() {
  const { user } = useAuth();
  return (
    <div className="bg-blue-500 text-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Blog</h1>
          {user ? (
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-white">
                    <FaRegUser className="mr-2" />
                    Profile
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="p-4">
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
                          href="/blog"
                          className="text-blue-500 hover:underline"
                        >
                          Blog
                        </Link>
                      </li>
                    </ul>
                    <Button variant="destructive" className="w-full mt-4">
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
  );
}

export default Header;
