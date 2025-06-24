"use client";

import BigSpinner from "@/components/bigspinner";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { Blog } from "@/utils/types";
import { formatDate } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function BlogDetailsPage() {
  const { id } = useParams();
  const { get } = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => get(`/blogs/${id}/`),
  });
  const blog: Blog = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <BigSpinner />;
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Card className="shadow-md rounded-2xl">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">{blog.title}</h1>
          <p className="text-base text-muted-foreground">{blog.content}</p>
          <div className="text-sm text-gray-500 pt-4 border-t flex justify-between">
            <span>By {blog.author_details?.name}</span>
            <span>
              {formatDate(blog.created_at || new Date().toISOString())}
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default BlogDetailsPage;
