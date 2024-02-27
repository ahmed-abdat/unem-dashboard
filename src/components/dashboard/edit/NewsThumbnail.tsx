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
import { Thumbnail } from "@/types/news-poste";

export default function NewsThumbnail({
  thumbnail,
  setThumbnail,
}: {
  thumbnail : Thumbnail
  setThumbnail : (thumbnail : Thumbnail) => void
}) {

  const handelOnThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    // check if the file is image or not
    if (file && file.type.split("/")[0] === "image") {
      const thumbnail = {
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      };
      setThumbnail(thumbnail);
      }
    }

    console.log(thumbnail);
    

  const clearThumbnail = () => {
    setThumbnail(null);
  }

  

  return (
    <Card className="w-full">
      <CardHeader className="px-4 pt-3 pb-5">
        <CardTitle className="font-tajawal font-semibold text-lg">
          اختيار صورة المصغرة
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        {thumbnail ? (
          <>
            <div className="relative w-full h-[250px] max-w-full pb-4">
              <Image
                src={thumbnail?.url}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw"
                priority={true}
                loading="eager"
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
          <div className="flex justify-center items-center w-full h-[250px] bg-gray-50 pb-4">
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
