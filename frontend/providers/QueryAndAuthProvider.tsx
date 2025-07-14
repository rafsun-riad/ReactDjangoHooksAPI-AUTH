"use client";

import BigSpinner from "@/components/bigspinner";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function QueryAndAuthProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);
  const { jwtLogin } = useAuth();

  useEffect(() => {
    (async () => await jwtLogin())();
    setIsLoading(false);
  }, [jwtLogin]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col ">
        <div className="flex-1 flex items-center justify-center">
          <BigSpinner />
        </div>
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryAndAuthProvider;
