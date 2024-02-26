"use client";

import { ChangeEvent, useState } from "react";
import { ImagePlus } from "lucide-react";
import { ImageType } from "@/types/news-poste";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TfiDropbox } from "react-icons/tfi";
import Image from "next/image";

export default function NewsImages({
  fileImages,
  setFileImages,
}: {
  fileImages: ImageType[];
  setFileImages: (file: ImageType[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const deletePosteImage = (name: string) => {
    const newImages = fileImages.filter((image) => image.name !== name);
    setFileImages(newImages);
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files?.length === 0) return;
    let newImages: ImageType[] = [];
    for (let i = 0; i < (files?.length ?? 0); i++) {
      const file = files?.[i];
      // Check for image type
      if (file?.type.split("/")[0] !== "image") continue;
      const posteInfo = {
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      };
        newImages.push(posteInfo);
    }
    setFileImages([...fileImages, ...newImages]);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    let newImages: ImageType[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check for image type
      if (file.type.split("/")[0] !== "image") continue;
      const imageInfo = {
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      };
        newImages.push(imageInfo);
    }
    setFileImages([...fileImages, ...newImages]);
  };

  return (
    <Card className="w-full">
      <CardContent className="px-2 py-4">
          <div
            className="md:min-h-36 min-h-24 max-h-40 gap-y-2 font-tajawal text-base border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md cursor-pointer relative select-none"
            // onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            // onClick={() => fileInputRef.current.click()}
          >

              <label className="cursor-pointer w-full h-full flex items-center justify-center rounded-md">
                <input
                  type="file"
                  name="file"
                  className="file"
                  multiple
                  hidden={true}
                  onChange={onFileSelect}
                />
                {isDragging ? (
                    <div className="flex items-center justify-center gap-x-2">
                    <span className="font-aljazira text-[1.2rem] text-gray-700"> أفلت الصورة هنا</span>
                    <TfiDropbox size={35} className="animate-bounce"/>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-x-2">
                    <span className="text-primary-color cursor-pointer transition-all duration-75 hover:opacity-60">
                      إسحب وأفلت الصورة هنا
                    </span>
                    <span className="or">أو</span>
                    <span className="text-primary-color cursor-pointer transition-all duration-75 hover:opacity-60">
                      تصفح
                    </span>
                    <ImagePlus size={35} />
                  </div>
                )}
              </label>
          </div>
          {
            fileImages.length > 0 &&  <div className="w-full overflow-y-scroll overflow-x-hidden h-auto flex justify-start items-start flex-wrap max-h-40 mt-6">
            {fileImages?.map((image, index) => (
              <div
                className="h-20 w-20 relative mr-1 mb-3"
                key={`${index}-${image.url}`}
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw"
                  priority={true}
                  loading="eager"
                  className="bg-gray-100 rounded-md object-cover object-center"
                />
                <span
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all duration-75"
                  onClick={() => deletePosteImage(image.name)}
                >
                  &times;
                </span>
              </div>
            ))}
          </div>
          }
      </CardContent>
    </Card>
  );
}
