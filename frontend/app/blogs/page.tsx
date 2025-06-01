"use client";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { type Category } from "../page";
import { useState } from "react";

type Blog = {
  id?: number;
  title: string;
  content: string;
  category: string;
  category_details?: Category;
};

type BlogFormState = {
  title: string;
  content: string;
  category: string;
};

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
    queryKey: ["blogs"],
    queryFn: () => get("/blogs/"),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => get("/categories/"),
  });

  const mutation = useMutation({
    mutationFn: (newblog: Blog) => post("/blogs/", newblog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      setForm(initialFormState);
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
    <div>
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
            Add
          </button>
        </form>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          blogs?.map((blog: Blog) => (
            <div key={blog.id} className="border p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="mt-2">{blog.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                Category: {blog.category_details?.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BlogPage;
