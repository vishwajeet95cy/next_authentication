"use server";

import { signIn, signOut } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

const credentialsLogin = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/",
    });
  } catch (error) {
    const err = error as CredentialsSignin;
    return err.cause;
  }
};

const credentialsLogout = async () => {
  try {
    await signOut({ redirect: true, redirectTo: "/login" });
    redirect("/login");
  } catch (error) {
    const err = error as CredentialsSignin;
    return err.cause;
  }
};

export { credentialsLogin, credentialsLogout };
