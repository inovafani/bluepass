import { ForgotPasswordForm } from "@/app/components/auth/ForgotPasswordForm";
import { AuthCinematicShell } from "@/app/components/auth/AuthCinematicShell";

export const metadata = {
  title: "Reset password | BluePass",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCinematicShell>
      <ForgotPasswordForm />
    </AuthCinematicShell>
  );
}
