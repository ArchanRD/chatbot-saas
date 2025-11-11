"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";

type Notification = {
  message: string;
  type: string;
};

const RegisterForm = () => {
  const [notification] = useState<Notification>({
    message: "",
    type: "",
  });
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    router.push("/dashboard");
  }
  return (
    <div className="max-w-7xl mx-auto min-h-screen font-inter">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img
              src="/Conversy-logo-white.png"
              className="rounded-full"
              alt="Conversy Logo"
            />
          </div>
          <span className="font-medium text-xl text-black">Conversy</span>
        </Link>
        <Button onClick={()=>router.push("/login")} className="rounded-full bg-black">Login</Button>
      </div>
      <div className="py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {notification.type === "error" && (
            <p className="text-red-500 bg-red-100/50 border border-red-500 p-2 rounded-sm text-center mb-4">
              {notification.message}
            </p>
          )}
          {notification.type === "success" && (
            <p className="text-green-500 bg-green-100/50 border border-green-500 p-2 rounded-sm text-center mb-4">
              {notification.message}
            </p>
          )}
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
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
