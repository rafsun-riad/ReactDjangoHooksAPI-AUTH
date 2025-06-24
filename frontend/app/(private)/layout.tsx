// app/(protected)/layout.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const user = cookieStore.get("jwt-token");

  // If cookie is missing, redirect to login page
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {/* Protected layout structure like a nav, sidebar, etc. */}
      {children}
    </>
  );
}
