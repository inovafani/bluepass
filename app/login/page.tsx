import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthCinematicShell } from "@/app/components/auth/AuthCinematicShell";

export const metadata = {
  title: "Log in | BluePass",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCinematicShell>
      <AuthForm mode="login" nextPath={params?.next ?? null} />
    </AuthCinematicShell>
  );
}
