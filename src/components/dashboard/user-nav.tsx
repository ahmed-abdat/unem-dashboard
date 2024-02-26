'use client';


import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {User} from '@/types/user'
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


  
  export function UserNav() {
    const [user , setUser] = useState<User | null>(null);

    const router = useRouter();

    useEffect(() => {
      const localeUser = localStorage?.getItem("user") ? JSON.parse(localStorage?.getItem("user") as string) : '';
      setUser(localeUser);
    }, []);

    const Signoute =  () => {
      signOut(auth).then(() => {
        toast.success("تم تسجيل الخروج بنجاح");
        localStorage.removeItem("user");
        router.push("/");
      }).catch((error) => {
        console.log("error", error);
        toast.error("حدث خطأ ما"); 
      });
    }


    return (
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/logo.png" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount >
          <DropdownMenuLabel className="font-normal" dir="ltr">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">unem</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || 'm@example.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/overview')} className="justify-end">
              نظرة عامة
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/news')} className="justify-end">
            إدارة المحتوى
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={Signoute} className="justify-end">
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }