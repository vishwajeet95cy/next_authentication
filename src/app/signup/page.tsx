import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/models/UserModel";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/utils";

const Page = () => {
  const signup = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string | undefined;
    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    if (!email || !name || !password)
      throw new Error("Please provide all fields");

    // Connection With Database

    await connectDB();

    const user = await User.findOne({ email });

    if (user) throw new Error("User already exists");

    const hashedPassword = await hash(password, 10);

    // create New User

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    redirect("/login");
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signup} className="flex flex-col gap-4">
            <Input placeholder="Name" type="text" name="name" />
            <Input placeholder="Email" type="email" name="email" />
            <Input placeholder="Password" type="password" name="password" />
            <Button type="submit">Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>Or</span>
          <form action="">
            <Button variant="outline" type="submit">
              Login With Google
            </Button>
          </form>
          <Link href="/login" className="mt-2">
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
