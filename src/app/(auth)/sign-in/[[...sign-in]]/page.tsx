import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign in to Chatnote",
};

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#0F172A",
          },
        }}
      />
    </div>
  );
}
