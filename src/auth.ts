import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { User } from "./models/UserModel";
import { compare } from "bcryptjs";
import { connectDB } from "./lib/utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log({ credentials });
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password)
          throw new CredentialsSignin({
            cause: "Please provide both email and password",
          });

        if (typeof email !== "string")
          throw new CredentialsSignin({ cause: "Email is not valid" });

        // Connection With Database

        await connectDB();

        const user = await User.findOne({ email }).select(["+password"]);

        console.log({ user });

        if (!user)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });
        if (!user.password)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });

        const isMatch = await compare(password, user.password);

        if (!isMatch)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });

        return { name: user.name, email: user.email, id: user._id };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;

          await connectDB();

          const alreadyUser = await User.findOne({ email });

          if (!alreadyUser)
            await User.create({ email, name, image, googleId: id });

          return true;
        } catch (error) {
          throw new AuthError("Error while creating user");
        }
      }
      return true;
    },
  },
});
