"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { Button } from "./ui/button";

type Notification = {
  message: string;
  type: string;
};

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setNotification({
          message: "Account created successfully. Please login.",
          type: "success",
        });
      } else {
        setNotification({
          message: data.message,
          type: "error",
        });
      }
    } catch {
      setLoading(false);
      setNotification({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  if (session.status === "authenticated") {
    router.push("/dashboard");
  }
  return (
    <div className="max-w-7xl mx-auto min-h-screen font-inter px-6 lg:px-8">
      <header className="relative z-10 flex justify-between items-center py-6 md:py-10 ">
        <div>
          <Link href="/" className="text-gray-800 flex items-center gap-2">
            <img
              src="/conversy-black-logo.png"
              className="rounded-full h-11"
              alt=""
            />
            Conversy
          </Link>
        </div>

        <Button onClick={() => router.push("/login")}>Login</Button>
      </header>
      <div className="py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/Conversy-logo-white.png"
            className="mx-auto h-16 w-auto mix-blend-difference"
          />
          <h2 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {notification.type === "error" && (
            <p className="text-red-500 bg-red-100/50 border border-red-500 p-2 rounded-sm text-center">
              {notification?.message}
            </p>
          )}
          {notification.type === "success" && (
            <p className="text-green-500 bg-green-100/50 border border-green-500 p-2 rounded-sm text-center">
              {notification?.message}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            action="#"
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`"flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" + ${
                  loading ? "disabled:bg-indigo-300 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                Create account
              </button>
            </div>
          </form>
          <p className="mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
