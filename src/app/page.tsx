"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("session", session);

  console.log("data", session?.user);
  // if (status === "loading") return <p>Loading...</p>;
  // if (status === "unauthenticated") {
  //   router.push("/login");
  //   return null;
  // }

  return (
    <div className="flex-col space-y-3 flex items-center justify-center pt-8">
      <h1 className="font-bold text-2xl">Home Page</h1>
      <h1>Welcome, {session?.user?.name}!</h1>
    </div>
  );
}
