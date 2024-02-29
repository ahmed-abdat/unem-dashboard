import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Student from "@/components/dashboard/overview/student-space/Student";
import { DeleteModal } from "@/components/dashboard/DeleteModal";

export const metadata: Metadata = {
  title: "إدارة الأخبار",
  description: "إدارة الأخبار في لوحة التحكم",
};

export default function StudentPoste({ searchParams} : {searchParams: { [key: string]: string | string[] | undefined }}) {

  return (
    <>
      <DeleteModal searchParams={searchParams}/>
      <div className="mb-4">
        <h3 className="font-aljazira text-lg md:text-xl font-medium"> معاينة جميع منشورات  فضاء الطالب </h3>
      </div>
      <Separator className="mb-4"/>
      <Student />
    </>
  );
}
