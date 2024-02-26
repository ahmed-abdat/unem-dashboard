"use client";

import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function NewsThumbnail({
  thumbnailUrl,
  setThumbnailUrl,
  setThumbnail,
}: {
  thumbnailUrl: string | null;
  setThumbnailUrl: (url: string | null) => void;
  setThumbnail: (file: File | null) => void;
}) {

  const handelOnThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    // check if the file is image or not
    if (file && file.type.split("/")[0] === "image") {
      setThumbnail(file);
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const clearThumbnail = () => {
    setThumbnail(null);
    setThumbnailUrl(null);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader className="px-4 pt-3 pb-5">
        <CardTitle className="font-tajawal font-semibold text-lg">
          اختيار صورة المصغرة
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        {thumbnailUrl ? (
          <>
            <div className="relative w-full h-[200px] max-w-full pb-4">
              <Image
                src={thumbnailUrl}
                fill
                alt="thumbnail"
                className="w-full h-full object-cover rounded-md"
              />
              <Button
                className="absolute -top-10 left-0 h-7 w-7 font-roboto"
                variant="outline"
                onClick={clearThumbnail}
              >
                X
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center w-full h-[200px] bg-gray-50 pb-4">
            <label className="cursor-pointer w-full h-full flex items-center justify-center rounded-md">
              <input
                type="file"
                hidden={true}
                onChange={handelOnThumbnailChange}
              />
              <ImagePlus size={48} />
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
