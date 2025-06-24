"use client";

import BigSpinner from "@/components/bigspinner";
import BlogCard from "@/components/blogcard";
import { useApi } from "@/hooks/useApi";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const { get } = useApi();

  // Fetch categories using useQuery
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => get("/blogs/"),
  });

  if (isLoading) {
    return <BigSpinner />;
  }

  return (
    <div>
      <h1 className="mt-3 text-center text-2xl">All Blogs</h1>
      {blogs?.data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {blogs.data.map((blog: Blog) => (
            <Link href={`/blog/${blog.id}`} key={blog.id} className="p-4">
              <BlogCard blog={blog} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-gray-500">No blogs available at the moment.</p>
        </div>
      )}
    </div>
  );
}
