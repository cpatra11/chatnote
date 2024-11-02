import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, User, getAuth, currentUser } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export const metadata = { title: "Chatnote" };

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Chatnote Logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Chatnote
        </span>
      </div>
      <p className="max-w-prose px-2 text-center">
        An intelligent note taking app with AI integration built with OpenAI,
        NextJS, PineCone, Shadcn UI Clerk and more
      </p>
      <Button asChild size="lg">
        <Link href="/notes">Open Notes</Link>
      </Button>
    </main>
  );
}
