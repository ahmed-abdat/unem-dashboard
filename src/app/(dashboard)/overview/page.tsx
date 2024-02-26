import { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsCards from "@/components/dashboard/overview/NewsCards";
import LoadMore from "@/components/dashboard/overview/LoadMoreNews";
import { fetchPostes } from "@/app/action";
import { DeleteModal } from "@/components/dashboard/DeleteModal";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { postes, lastDocId } = await fetchPostes();
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
              <NewsCards postes={postes} />
              <LoadMore lastDocId={lastDocId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
