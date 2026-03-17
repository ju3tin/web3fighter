// components/CategoryNav.tsx
import Link from "next/link";

export default function CategoryNav() {
  return (
    <nav className="border-b border-zinc-800 pb-4 mb-8">
      <ul className="flex gap-8 text-lg font-medium">
        <li>
          <Link href="/marketplace" className="hover:text-blue-400 transition">
            All
          </Link>
        </li>
        <li>
          <Link href="/marketplace/characters" className="hover:text-blue-400 transition">
            Characters
          </Link>
        </li>
        <li>
          <Link href="/marketplace/moves" className="hover:text-blue-400 transition">
            Moves
          </Link>
        </li>
        <li>
          <Link href="/marketplace/finishing-moves" className="hover:text-blue-400 transition">
            Finishing Moves
          </Link>
        </li>
      </ul>
    </nav>
  );
}