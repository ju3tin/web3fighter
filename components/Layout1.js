// app/wiki/[slug]/layout.js
import Link from "next/link";

export default function WikiLayout({ children, params }) {
  const { slug } = params;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Wiki</h1>
        <nav className="mt-2">
          <Link href="/wiki">
            <a className="text-gray-300 hover:text-white">Home</a>
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r">
          <h2 className="font-semibold mb-2">Pages</h2>
          <ul className="space-y-1">
            <li>
              <Link href="/wiki/page1">
                <a className="text-blue-600 hover:underline">Page 1</a>
              </Link>
            </li>
            <li>
              <Link href="/wiki/page2">
                <a className="text-blue-600 hover:underline">Page 2</a>
              </Link>
            </li>
            {/* Add more links dynamically if needed */}
          </ul>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">{slug.replace("-", " ")}</h2>
          <div>{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 p-4 text-center">
        &copy; {new Date().getFullYear()} My Wiki
      </footer>
    </div>
  );
}