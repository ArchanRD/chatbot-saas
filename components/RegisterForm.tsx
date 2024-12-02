"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

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
        setNotification({ message: data.message, type: "success" });
      } else {
        setNotification({ message: data.message, type: "error" });
      }
    } catch {
      setLoading(false);
      setNotification({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };
  return (
    <div className="flex items-center h-screen w-full">
      <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
        {notification && (
          <p
            className={`text-${
              notification.type === "error" ? "red" : "green"
            }-500`}
          >
            {notification.message}
          </p>
        )}
        <span className="block w-full text-xl uppercase font-bold mb-4">
          Create an account
        </span>
        <form className="mb-4" onSubmit={handleSubmit} method="post">
          <div className="mb-4 md:w-full">
            <label htmlFor="email" className="block text-xs mb-1">
              Email
            </label>
            <input
              className="w-full border rounded p-2 outline-none focus:shadow-outline"
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or Email"
              required
            />
          </div>
          <div className="mb-6 md:w-full">
            <label htmlFor="password" className="block text-xs mb-1">
              Password
            </label>
            <input
              className="w-full border rounded p-2 outline-none focus:shadow-outline"
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 disabled:bg-green-100 text-white uppercase text-sm font-semibold px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
        <Link className="text-blue-700 text-center text-sm" href="/login">
          Already have an account?
        </Link>
        <button
          className="bg-black text-white p-3 rounded-lg"
          onClick={() => signOut()}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
