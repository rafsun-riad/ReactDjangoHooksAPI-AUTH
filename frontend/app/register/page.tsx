"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type RegsiterUser, type RegisterFormState } from "@/utils/types";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const initialFormState: RegisterFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>(initialFormState);
  const { post } = useApi();
  const { login } = useAuth();

  // for user registration
  const regiserMutation = useMutation({
    mutationFn: (newUser: RegsiterUser) => post("/auth/register/", newUser),
    onSuccess: (data) => {
      console.log("from Success", data);
      toast.success("Registration successful!");
      setForm(initialFormState);
      login(form.email, form.password);
      toast.success("Login successful!");
      router.push("/");
    },
    onError: () => {
      console.log("from Error");
      toast.error("Registration failed.");
      setForm(initialFormState);
    },
  });

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newUser: RegsiterUser = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
    };
    regiserMutation.mutate(newUser);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="my-6">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-3">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.firstName}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.lastName}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.password}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.confirmPassword}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
export default RegisterPage;
