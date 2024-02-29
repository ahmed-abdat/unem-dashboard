import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Poste from "@/components/dashboard/overview/poste/Poste";
import { DeleteModal } from "@/components/dashboard/DeleteModal";

export const metadata: Metadata = {
  title: "إدارة الأخبار",
  description: "إدارة الأخبار في لوحة التحكم",
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
          {" "}
          معاينة جميع المنشورات الإخبارية{" "}
        </h3>
      </div>
      <Separator className="mb-4" />
      <Poste />
    </>
  );
}
