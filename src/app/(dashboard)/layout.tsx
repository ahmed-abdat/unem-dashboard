"use client";

import { MainNav } from "@/components/dashboard/MainNav";
import { Search } from "@/components/dashboard/Search";
import { UserNav } from "@/components/dashboard/user-nav";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();


  

  useEffect(() => {
    const localeUser = localStorage?.getItem("user") ?? "";
    if (!localeUser) {
      router.push("/");
      return;
    }
  }, [router]);

  
  return (
    <>
      <div className="flex flex-col ">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 gap-x-2 md:gap-x-0" dir="rtl">
            <MainNav />
            <div className="mr-auto flex items-center gap-x-2 w-[50%] sm:w-full justify-end">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
