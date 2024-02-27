import { Separator } from "@/components/ui/separator";
import { CreateNewPoste } from "@/components/dashboard/edit/CreatPoste";
import { UpdatePoste } from "@/components/dashboard/edit/UpdatePoste";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة الأخبار",
  description: "إدارة الأخبار في لوحة التحكم",
};

export default function News({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postId = searchParams.postId;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">إنشاء منشور إخباري جديد</h3>
      </div>
      <Separator />
      {postId ? <UpdatePoste postId={postId as string} /> : <CreateNewPoste />}
    </div>
  );
}
