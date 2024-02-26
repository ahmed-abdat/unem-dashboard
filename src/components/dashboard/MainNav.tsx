'use client';

import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  
  

  return (
    <nav
      className={cn("flex items-center justify-start w-full gap-x-4", className)}
      {...props}
    >
      <Link
        href="/overview"
        className={cn({
          'text-muted-foreground' : pathname !== "/overview",
        }, "text-sm sm:text-lg font-medium transition-colors hover:text-primary")}
      >
        نظرة عامة
      </Link>
      <Link
        href="/news"
        className={cn({
          'text-muted-foreground' : pathname !== "/news" && pathname !== '/student-space' && pathname !== '/institutions',
        }, "text-sm sm:text-lg font-medium transition-colors hover:text-primary")}
      >
        إدارة المحتوى
      </Link>
    </nav>
  )
}