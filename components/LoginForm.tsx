"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Notification = {
  message: string;
  type: "error" | "success" | "";
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setNotification({ message: "Invalid credentials", type: "error" });
    } else {
      window.location.href = "/dashboard";
    }
  };

  if(session.status === "authenticated"){
    router.push("/dashboard")
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

        <Button onClick={() => router.push("/register")}>Create account</Button>
      </header>
      <div className="py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-5 text-center text-3xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {notification.type == "error" && (
            <p className="text-red-500 text-center">{notification?.message}</p>
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
                disabled={loading}
                className={`"flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" + ${
                  loading ? " disabled:bg-indigo-300 cursor-not-allowed" : ""
                }`}
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-5">
            Dont have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
