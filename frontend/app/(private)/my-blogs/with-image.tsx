"use client";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { type Category, type User } from "@/utils/types";
import { useRef, useState } from "react";
import BlogCard from "@/components/blogcard";
import BigSpinner from "@/components/bigspinner";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

type BlogFormState = {
  title: string;
  content: string;
  category: string;
  images: string[]; // Array of base64 image strings
};

type Blog = {
  id?: number;
  title: string;
  content: string;
  category: string;
  category_details?: Category;
  author?: string;
  images: string[];
  author_details?: User;
  created_at?: string;
};

const initialFormState: BlogFormState = {
  title: "",
  content: "",
  category: "",
  images: [],
};

function BlogPage() {
  const { get, post } = useApi();
  const [form, setForm] = useState<BlogFormState>(initialFormState);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    mutationFn: (newblog: BlogFormState) => post("/blogs/", newblog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog added successfully!");
      setForm(initialFormState);
      setImagePreviews([]);
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

  function handleRemoveImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (newFiles.length + form.images.length > 5) {
      toast.error("You can upload up to 5 images only.");
      return;
    }

    for (const file of newFiles) {
      const base64 = await toBase64(file);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, base64],
      }));
      setImagePreviews((prev) => [...prev, base64]);
    }

    // ✅ clear the input after processing
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.images.length > 5) {
      toast.error("Cannot submit more than 5 images.");
      return;
    }
    mutation.mutate({ ...form });
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mt-3">My Blogs</h1>
      <div>
        <h2>Add Blog</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full max-w-md"
        >
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
          {imagePreviews.length < 5 && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2"
              ref={fileInputRef}
            />
          )}

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative">
                  <div className="relative w-24 h-24  rounded">
                    <Image src={img} alt={`preview-${index}`} fill={true} />
                  </div>
                  {/* <img
                    src={img}
                    alt={`preview-${index}`}
                    className="w-24 h-24 object-cover rounded"
                  /> */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="border border-blue-500 p-2 rounded mt-2 hover:bg-blue-500 hover:text-white"
          >
            Add
          </button>
        </form>
      </div>

      <div className="mt-6 w-full">
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
