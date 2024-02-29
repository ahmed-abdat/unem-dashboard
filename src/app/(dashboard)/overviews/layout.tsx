import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/dashboard/edit/sidebar-nav"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "الأخبار",
    href: "/overviews/news",
  },
  {
    title: "فضاء الطالب",
    href: "/overviews/student-space",
  },
  {
    title: "مؤسسات التعليم العالي",
    href: "/overviews/institutions",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function EditLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className=" space-y-6 p-4 md:p-10 pb-16 ">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight"> نظرة عامة </h2>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-x-8">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 mr-0 ml-0 lg:mr-10 gap-y-4">{children}</div>
        </div>
      </div>
    </>
  )
}