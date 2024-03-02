import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Institutions from "@/components/dashboard/overview/institutions/Institutions";
import { DeleteModal } from "@/components/dashboard/DeleteModal";

export const metadata: Metadata = {
  title: "معاينة جداول التخصصات",
  description: "معاينة جداول التخصصات في لوحة التحكم",
};

export default function News({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <DeleteModal searchParams={searchParams} />
      <div className="mb-4">
        <h3 className="font-aljazira text-lg md:text-xl font-medium">
          معاينة جميع جداول التخصصات
        </h3>
      </div>
      <Separator className="mb-4" />
      <Institutions />
    </>
  );
}
