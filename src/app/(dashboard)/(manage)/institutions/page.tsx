import Institutions from "@/components/dashboard/edit/institutions/Institutions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة ",
  description: "إدارة الأخبار في لوحة التحكم",
};

export default function News({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  console.log(searchParams);
  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <h3 className="text-lg font-medium"> رفع و تعديل جداول التخصصات </h3>
      </div>
      <Institutions searchParams={searchParams}/>
    </div>
  );
}
