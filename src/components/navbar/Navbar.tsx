import Logo from "@/components/navbar/Logo";
import NavLinks from "@/components/navbar/NavLinks";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="grid grid-cols-12 p-4">
      <Link href="/">
        <Logo className="col-span-3" />
      </Link>
      <NavLinks className="col-start-[-1]" />
    </nav>
  );
}
