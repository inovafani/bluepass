import { ResetPasswordForm } from "@/app/components/auth/ResetPasswordForm";
import { AuthCinematicShell } from "@/app/components/auth/AuthCinematicShell";

export const metadata = {
  title: "Choose a new password | BluePass",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCinematicShell>
      <ResetPasswordForm token={params?.token ?? null} />
    </AuthCinematicShell>
  );
}
