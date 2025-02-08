import Link from "next/link";
import NavLinks from "./NavLinks";

export default async function Sidenav() {
  return (
    <div className="flex-grow-250 flex h-full max-w-60 flex-col">
      <Link
        href="/"
        className="flex justify-start whitespace-nowrap rounded bg-primary px-3 py-2 text-lg font-bold text-white"
      >
        Finances Dashboard
      </Link>
      <div className="flex-1 p-1">
        <NavLinks />
      </div>
    </div>
  );
}
