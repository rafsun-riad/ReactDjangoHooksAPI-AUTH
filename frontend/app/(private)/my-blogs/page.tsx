"use client";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { type Category, type BlogFormState, type Blog } from "@/utils/types";
import { useState } from "react";
import BlogCard from "@/components/blogcard";
import BigSpinner from "@/components/bigspinner";
import { toast } from "sonner";
import Link from "next/link";

const initialFormState: BlogFormState = {
  title: "",
  content: "",
  category: "",
};

function BlogPage() {
  const { get, post } = useApi();

  const [form, setForm] = useState<BlogFormState>(initialFormState);

  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: () => get("/my-blogs/"),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => get("/categories/"),
  });

  const mutation = useMutation({
    mutationFn: (newblog: Blog) => post("/blogs/", newblog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog added successfully!");
      setForm(initialFormState);
    },
    onError: () => {
      toast.error("Failed to add blog. Please try again.");
    },
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ ...form });
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mt-3">Blogs</h1>
      <div>
        <h2>Add Blog</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Blog title"
            className="border p-2 rounded"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Blog content"
            className="border p-2 rounded mt-2"
            value={form.content}
            onChange={handleChange}
          />
          {isLoadingCategories ? (
            <p>Loading categories...</p>
          ) : (
            <select
              name="category"
              className="border p-2 rounded mt-2"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories?.data.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="submit"
            className="border border-blue-500 p-2 rounded ml-3 hover:cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <BigSpinner />
        ) : blogs?.data?.length ? (
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
    </div>
  );
}

export default BlogPage;
