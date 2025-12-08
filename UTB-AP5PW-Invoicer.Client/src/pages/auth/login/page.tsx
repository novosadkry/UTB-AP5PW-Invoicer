import { LoginForm } from "@components/login-form.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 animate-page">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-2">
        <LoginForm />
      </div>
    </main>
  );
}
