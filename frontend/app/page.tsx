"use client";

import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
export type Category = {
  id?: number;
  name: string;
};

export default function Home() {
  const { get, post } = useApi();
  const [category, setCategory] = useState("");

  const queryClient = useQueryClient();

  // Fetch categories using useQuery
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => get("/categories/"),
  });

  const mutation = useMutation({
    mutationFn: (newCategory: Category) => post("/categories/", newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategory(""); // Clear the input field after successful submission
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ name: category });
  };

  return (
    <div>
      <h1 className="mt-3">Categories</h1>

      <div>
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category name"
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
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
          categories?.map((category: Category) => (
            <div key={category.id} className="border p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
