import Logo from "@/components/navbar/Logo";
import NavLinks from "@/components/navbar/NavLinks";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex flex-row p-8 justify-between w-full">
      <Link href="/">
        <Logo />
      </Link>
      <NavLinks />
    </nav>
  );
}
