"use client";

import AuthProvider from "./AuthProvider";

export const ClientAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
