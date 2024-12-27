import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex flex-row items-center text-3xl", className)}>
      <span className="text-primary">Paprika</span>
      <span>Market</span>
      <Image
        src="/paprika_logo.svg"
        alt="Paprika logo"
        height={24}
        width={24}
        className="object-cover inline"
      />
    </div>
  );
}
