import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type BackButtonProps = {
  toPath: string;
};
export default function BackButton({ toPath }: BackButtonProps) {
  return (
    <Button variant="link" asChild>
      <Link href={toPath} className="flex flex-row items-center">
        <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />{" "}
        <span className="text-xl">Back</span>
      </Link>
    </Button>
  );
}
