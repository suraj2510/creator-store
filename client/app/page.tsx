import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-10 text-center w-[400px]">

        <h1 className="text-3xl font-bold text-gray-800">
          CreatorStore
        </h1>

        <p className="text-gray-500 mt-2">
          Build your own creator storefront
        </p>

        <div className="mt-6 flex gap-4 justify-center">

          <Link href="/login">
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
              Login
            </button>
          </Link>

          <Link href="/signup">
            <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition">
              Signup
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}
