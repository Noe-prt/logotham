import { LoginContent } from "@/components/auth/login-content";

export const metadata = {
  title: "Sign in | Logotham",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12 mt-20">
      <LoginContent />
    </div>
  );
}
