"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-5">
      <h1>Welcome, {session?.user?.name}!</h1>
    </div>
  );
}
