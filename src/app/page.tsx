import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      <h1>Welcome {session?.user?.name || "Guest"}</h1>
      {session ? (
        <p>Logged in as {session.user.email}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
