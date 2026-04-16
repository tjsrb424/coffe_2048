import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // 하단 고정 탭바 제거: 과한 bottom padding을 줄인다.
        "mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-4 pb-10 pt-6 sm:px-5 sm:pb-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
