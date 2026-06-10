import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthCinematicShell } from "@/app/components/auth/AuthCinematicShell";

export const metadata = {
  title: "Create traveller profile | BluePass",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCinematicShell>
      <AuthForm mode="register" nextPath={params?.next ?? null} />
    </AuthCinematicShell>
  );
}
