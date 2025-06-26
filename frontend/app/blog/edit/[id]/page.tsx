"use client";

import BigSpinner from "@/components/bigspinner";
import { useApi } from "@/hooks/useApi";
import { Blog, BlogFormState, Category } from "@/utils/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialFormState: BlogFormState = {
  title: "",
  content: "",
  category: "",
};

function BlogEditPage() {
  const { id } = useParams();
  const { get, put } = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<BlogFormState>(initialFormState);

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => get(`/blogs/${id}/`),
  });

  useEffect(() => {
    if (blogData?.data) {
      const blog: Blog = blogData.data;
      setForm({
        title: blog.title,
        content: blog.content,
        category: String(blog.category_details?.id),
      });
    }
  }, [blogData]);

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => get("/categories/"),
  });

  const categories: Category[] = categoriesData?.data;

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

  const mutation = useMutation({
    mutationFn: (updatedBlog: Blog) => put(`/blogs/${id}/`, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      toast.success("Blog updated successfully!");
      router.back();
    },
    onError: () => {
      toast.error("Failed to update blog. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedBlog: Blog = {
      title: form.title,
      content: form.content,
      category: form.category,
    };
    mutation.mutate(updatedBlog);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <BigSpinner />;
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div>
        <h2 className="text-center">Edit Blog</h2>
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
              {categories?.map((cat: Category) => (
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
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogEditPage;
