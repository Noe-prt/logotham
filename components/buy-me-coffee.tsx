import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export function BuyMeCoffee() {
  return (
    <Link
      href="https://www.buymeacoffee.com/mathaegon"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "default" }),
        "bg-[#fbbf24] border-none text-black hover:bg-[#f59e0b] shadow-md shadow-yellow-400/40 "
      )}
    >
      <span style={{ fontSize: "1.2em", lineHeight: "1" }}>☕</span>
      <span>Buy me a coffee</span>
    </Link>
  );
}
