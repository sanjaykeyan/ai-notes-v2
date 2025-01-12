import { SignIn } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    // Get user data from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    // Sync user with our database
    await getOrCreateUser(userId, clerkUser.emailAddresses[0].emailAddress);
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <SignIn
        afterSignInUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl rounded-xl",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-lg",
          },
        }}
      />
    </div>
  );
}
