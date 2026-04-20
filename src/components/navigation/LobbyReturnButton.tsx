import Link from "next/link";
import { cn } from "@/lib/utils";

export function LobbyReturnButton({ className }: { className?: string }) {
  return (
    <Link
      href="/lobby"
      className={cn(
        "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-coffee-900 px-5 text-sm font-bold text-cream-50 shadow-card transition-colors hover:bg-coffee-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/70",
        className,
      )}
    >
      로비로 돌아가기
    </Link>
  );
}
