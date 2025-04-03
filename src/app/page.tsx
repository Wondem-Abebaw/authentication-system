import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex-col justify-center min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Home Page</h1>
      <h1>
        Welcome{" "}
        <span className="font-semibold">{session?.user?.name || ""}</span>
      </h1>
      {session ? (
        <p>
          Logged in as{" "}
          <span className="font-semibold">{session.user.role}</span>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
