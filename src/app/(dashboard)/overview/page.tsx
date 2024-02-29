import { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchPostes } from "@/app/action";
import { DeleteModal } from "@/components/dashboard/DeleteModal";
import Poste from "@/components/dashboard/overview/poste/Poste";
import Student from "@/components/dashboard/overview/student-space/Student";

export const metadata: Metadata = {
  title : 'معاينة اللوحة',
  description: 'معاينة اللوحة',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <DeleteModal searchParams={searchParams}/>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight"> نظرة عامة </h2>
        </div>
        <Tabs defaultValue="news" className="space-y-4" dir="rtl">
          <TabsList>
            <TabsTrigger value="news"> الأخبار </TabsTrigger>
            <TabsTrigger value="student-space">فضاء الطالب</TabsTrigger>
            <TabsTrigger value="faculiter">مؤسسات التعليم العالي</TabsTrigger>
          </TabsList>
          <TabsContent value="news" className="space-y-4">
            <Poste />
          </TabsContent>
          <TabsContent value="student-space" className="space-y-4">
            <Student />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
