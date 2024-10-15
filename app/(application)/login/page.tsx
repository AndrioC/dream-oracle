import { LoginCard } from '@/components/login-card';

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-4">
      <LoginCard />
    </div>
  );
}
