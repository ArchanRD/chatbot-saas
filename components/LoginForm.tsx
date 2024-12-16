"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";

type Notification = {
  message: string;
  type: "error" | "success" | "";
};

const LoginForm = () => {
  const session = useSession();

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

  return (
    <div className="flex items-center h-screen w-full">
      <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
        {notification.type == "error" && (
          <p className="text-red-500">{notification?.message}</p>
        )}
        <span className="block w-full text-xl uppercase font-bold mb-4">
          Login
        </span>
        <form onSubmit={handleSubmit} className="mb-4" method="post">
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
            className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <a className="text-blue-700 text-center text-sm" href="/register">
          Create an account
        </a>
        <div>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg"
            onClick={() => signOut()}
          >
            Logout
          </button>
          {session && <div>Email in session:{session.data?.user.email}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
