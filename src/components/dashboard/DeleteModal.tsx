"use client";

import { deltePosteImages, delteStudentPosteImages, getPoste } from "@/app/action";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewsPoste } from "@/types/news-poste";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteModal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const posteId = searchParams?.postId || null;
  const collectionName = searchParams?.collectionName as string ;
  const isModalOpen = searchParams?.openModal == "true" ? true : false;

  const [poste, setPoste] = useState<NewsPoste | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handelClose = () => {
    router.back();
    console.log("close");
  };
  const handelDeletePoste = () => {
    setLoading(true);
    try {
      if(collectionName === "student-space"){
        delteStudentPosteImages(poste?.id, poste?.images ?? [], poste?.thumbnail ?? null);
      }else{
      deltePosteImages(poste?.id, poste?.images ?? [], poste?.thumbnail ?? null);
      }
      router.refresh();
      setTimeout(() => {
        toast.success("تم حذف المنشور بنجاح");
        setLoading(false);
        handelClose();
      }, 1500)
    } catch (error) {
      toast.error("لم يتم حذف المنشور بنجاح");
      setLoading(false);
      console.log(error);
    }
  };

  
  useEffect(() => {
    const handelGetPoste = async (id: string) => {
      const { poste } = await getPoste(id, collectionName || "postes");
      if (!poste) {
          toast.error('المنشور غير موجود')
          router.back();
          router.refresh();
          return;
      }
      setPoste(poste);
    };
    if (posteId) {
      handelGetPoste(posteId as string);
    }
    setPoste(null);
  }, [posteId , router]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handelClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-center"> حذف المنشور </DialogTitle>
          <DialogDescription className="text-right">
            عند حذف المنشور لا يمكن استرجاعه بعد ذلك !
          </DialogDescription>
          {poste ? (
            <div className="flex flex-col w-full h-full gap-y-4">
              <Image
                src={poste?.thumbnail?.url || poste?.images[0]?.url}
                alt={poste?.images[0]?.name || "thumbnail"}
                width={200}
                height={200}
                className="object-cover rounded-md w-full h-40 sm:h-60 sm:w-full sm:rounded-md"
              />
              <h3 className="font-aljazira font-semibold text-lg text-right">
                {poste?.title}
              </h3>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full gap-y-4">
                <Skeleton className="w-full h-40 sm:h-60" />
                <Skeleton className="w-full h-8" />
            </div>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-center items-center gap-x-4 w-full flex-row">
          <Button variant="outline" onClick={handelClose}>
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={handelDeletePoste}
            disabled={loading || !poste}
          >
            حذف المنشور
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
