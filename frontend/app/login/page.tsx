"use client";

import SmallSpinner from "@/components/smallspinner";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormState } from "@/utils/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialFormState: LoginFormState = {
  email: "",
  password: "",
};

function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LoginFormState>(initialFormState);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(form.email, form.password);
      setLoading(false);
      if (res?.loggedIn) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    } finally {
      setForm(initialFormState);
      // setLoading(false);
    }
  }
  useEffect(() => {
    if (loading) {
      toast.dismiss(); // optional: dismiss existing toasts before showing
      toast(
        <div className="flex items-center">
          <SmallSpinner />
          <p className="text-sm ml-2">Logging in...</p>
        </div>,
        {
          id: "login-loading",
        }
      );
    } else {
      toast.dismiss("login-loading"); // dismiss once loading ends
    }
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="my-6">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-3">
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
