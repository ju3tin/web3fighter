export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <h1 className="text-7xl font-extrabold tracking-tight">404</h1>

      <p className="mt-4 text-gray-400">
        Lost in space… this page doesn’t exist.
      </p>

      <a
        href="/"
        className="mt-8 rounded-2xl border border-white px-6 py-3 transition hover:bg-white hover:text-black"
      >
        Return Home
      </a>
    </div>
  );
}
