import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
      <main className="flex flex-col items-center gap-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">Welcome to Doctor Assignment</h1>
        <p className="text-lg text-gray-700 font-medium text-center max-w-xl">
          Manage your appointments efficiently and professionally. Get started by continuing to your dashboard.
        </p>
        <Link href="/dashboard">
          <button className="mt-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg transition-colors">
            Continue to Dashboard
          </button>
        </Link>
      </main>
    </div>
  );
}
