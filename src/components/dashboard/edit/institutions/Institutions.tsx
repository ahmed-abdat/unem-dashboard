"use client";
import {
  checkIfTabelExist,
  creatSpecialityTabel,
  getFaculiters,
  getFliers,
  updateSpecialityTabel,
} from "@/app/action";
import NewsThumbnail from "@/components/dashboard/edit/NewsThumbnail";
import { SelecteInstitution } from "@/components/dashboard/overview/institutions/Selecte";
import { Button } from "@/components/ui/button";
import { faculiters, optionType, filieres } from "@/constant/filiers";
import { Filiers } from "@/types/filiers-tabel";
import { Thumbnail } from "@/types/news-poste";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Institutions({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postId = searchParams?.postId as string;
  const collectionName = searchParams?.collectionName as string;
  const flieresId = searchParams?.filiereId as string;

  const [facuiliter, setFaculiter] = useState<optionType>({
    content: "كلية العلوم و التقنيات",
    url: "/fst",
  });
  const [speciality, setSpeciality] = useState<optionType>({
    content: "BG",
    url: "/bg",
  });
  const [filierese, setFilierese] = useState<optionType[]>([]);
  const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExisteSpeciality, setisExisteSpeciality] = useState<string>("null");
  const [isFacExiste, setIfFacExiste] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    const getFlieres = async () => {
      const flieres = await getFaculiters(collectionName, postId, flieresId);
      if (flieres) {
        const fac = {
          content: flieres.label,
          url: `/${flieres.name}`,
        };
        const spec = flieres?.flieres.find(
          (f: Filiers) => f.name === flieresId
        );
        setIsUpdating(true);
        setFaculiter(fac);
        setSpeciality({ content: spec?.name, url: `/${spec?.name}` });
        setThumbnail(spec);
      } else {
        setIsUpdating(false);
        setThumbnail(null);
      }

      // setFaculiter(flieres.name)
    };

    if (postId && collectionName && flieresId) {
      getFlieres();
    } else {
      setIsUpdating(false);
      setThumbnail(null);
      setisExisteSpeciality("null");
    }
  }, [postId, collectionName, flieresId]);

  useMemo(() => {
    const faculiter = filieres.find(
      (f) => f.faculiter === facuiliter.url.slice(1)
    );

    const fliers = faculiter?.filieres;
    if (fliers && !isUpdating) {
      setSpeciality(fliers[0]);
      setFilierese(fliers);
    }
    if (fliers && isUpdating) {
      setFilierese(fliers);
      setIsUpdating(false);
    }
    setisExisteSpeciality("null");
  }, [facuiliter , isUpdating]);

  useMemo(() => {
    if (isUpdating) {
      setisExisteSpeciality("exist");
    } else {
      setisExisteSpeciality("null");
    }
  }, [speciality , isUpdating]);

  const handelSearchSpeciality = async () => {
    setLoading(true);
    if (speciality.content === "" || facuiliter.content === "") {
      toast.error("الرجاء اختيار التخصص و الكلية");
      return;
    }

    const { isFacExiste, isSpecExiste, tabelImage } = await checkIfTabelExist(
      facuiliter.url.slice(1),
      speciality.content
    );

    setIfFacExiste(isFacExiste);

    const isSearchSpeciality =
      isExisteSpeciality == "exist" || isExisteSpeciality == "notExist";

    if (isSearchSpeciality && !thumbnail) {
      toast.error("الرجاء قم بإضافة صورة جدول التخصص");
    }

    if (tabelImage) {
      setThumbnail(tabelImage);
    } else {
      setThumbnail(null);
    }

    if (!isFacExiste) {
      toast.info("لم يتم إضافة هذه الكلية بعد");
      setisExisteSpeciality("notExist");
    } else if (isFacExiste && !isSpecExiste) {
      toast.info("الجدول غير موجود");
      setisExisteSpeciality("notExist");
    } else {
      toast.success("الجدول موجود");
      setisExisteSpeciality("exist");
    }

    setLoading(false);
  };

  const handelCreatAnewFacAndSpec = async () => {
    setLoading(true);
    console.log("creat a new fac and spec");

    try {
      if (thumbnail) {
        await creatSpecialityTabel(
          thumbnail,
          facuiliter.url.slice(1),
          speciality.content
        );
        setTimeout(() => {
          setisExisteSpeciality("null");
          setThumbnail(null);
          setLoading(false);
          toast.success("تم إضافة جدول التخصص بنجاح");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ ما");
      setLoading(false);
    }
  };

  const handelUpdateSpec = async () => {
    setLoading(true);
    console.log("update spec");

    try {
      if (thumbnail) {
        await updateSpecialityTabel(
          thumbnail,
          facuiliter.url.slice(1),
          speciality.content
        );
        setTimeout(() => {
          setisExisteSpeciality("null");
          toast.success("تم تحديث الجدول بنجاح");
          setThumbnail(null);
          setLoading(false);
        }, 1500);
      } else {
        toast.error("الرجاء اختيار صورة للجدول الخاص بالتخصص");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ ما");
      setLoading(false);
    }
  };

  return (
    <>
      <SelecteInstitution
        options={faculiters}
        setValue={setFaculiter}
        value={facuiliter}
      />
      <SelecteInstitution
        options={filierese}
        setValue={setSpeciality}
        value={speciality}
        isSpeciality
      />
      {(isExisteSpeciality === "exist" || isExisteSpeciality == "notExist") && (
        <>
          <NewsThumbnail
            setThumbnail={setThumbnail}
            thumbnail={thumbnail}
            title="إختيار جدول التخصص"
          />
          {!thumbnail && (
            <p className="text-sm text-red-500">
              الرجاء اختيار صورة للجدول الخاص بالتخصص
            </p>
          )}
        </>
      )}

      <Button
        className="w-full mx-auto md:max-w-full text-lg"
        disabled={loading}
        onClick={
          isExisteSpeciality === "null"
            ? handelSearchSpeciality
            : isExisteSpeciality == "notExist" && !isFacExiste
            ? handelCreatAnewFacAndSpec
            : handelUpdateSpec
        }
        type="submit"
      >
        {isExisteSpeciality === "null"
          ? "بحث عن جدول التخصص"
          : isExisteSpeciality === "notExist"
          ? "إضافة جدول التخصص"
          : "تحديث جدول التخصص"}
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      </Button>
    </>
  );
}
