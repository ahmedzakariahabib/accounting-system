import AuthLayout from "../../components/layout/AuthLayout";
import EmailVerificationForm from "../../features/auth/EmailVerificationForm";

export default function EmailVerification() {
  return (
    <AuthLayout>
      <EmailVerificationForm />
    </AuthLayout>
  );
}
