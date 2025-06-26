"use client";

import BigSpinner from "@/components/bigspinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Blog } from "@/utils/types";
import { formatDate } from "@/utils/utils";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

function BlogDetailsPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const { get } = useApi();
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number | undefined) => get(`/blogs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      toast.success("Blog deleted successfully!");
      router.back();
    },
    onError: () => {
      toast.error("Failed to delete blog. Please try again.");
    },
  });

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
          <div className="flex items-center justify-between ">
            <div>
              <h1 className="text-2xl font-bold">{blog.title}</h1>
              <span className="text-sm text-gray-500">
                {blog.category_details?.name || "Uncategorized"}
              </span>
            </div>
            {blog.author_details?.id === user?.user?.id && (
              <div>
                <Button
                  asChild
                  size="icon"
                  className="size-8"
                  variant={"ghost"}
                >
                  <Link href={`/blog/edit/${blog.id}`}>
                    <FiEdit className="text-gray-500 hover:text-gray-700" />
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="size-8 hover:bg-red-50"
                      variant={"ghost"}
                    >
                      <MdDelete className="text-red-500 hover:text-red-700" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this blog?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => mutation.mutate(blog?.id)}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
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
