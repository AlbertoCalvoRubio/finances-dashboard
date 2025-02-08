import { Bars3Icon, ChartPieIcon, HomeIcon } from "@heroicons/react/24/outline";

import Link from "next/link";

const links = [
  { href: "/", label: "Overview", icon: HomeIcon },
  { href: "/transactions", label: "Transactions", icon: Bars3Icon },
  { href: "/analysis", label: "Analysis", icon: ChartPieIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map(({ href, label, icon: Icon }) => (
        <div key={label} className="flex rounded p-2 hover:bg-primary/50">
          <Link
            href={href}
            className="flex w-full flex-nowrap justify-start py-2 pl-1"
          >
            <Icon className="w-6" />
            <span className="ml-2">{label}</span>
          </Link>
        </div>
      ))}
    </>
  );
}
