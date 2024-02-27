"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NewsImages from "./NewsPosteImages";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NewsForm, TNewsForm } from "@/lib/dashboard/news-form";
import NewsThumbnail from "./NewsThumbnail";
import { useEffect, useState } from "react";
import {
  ImageType,
  NewsPoste,
  NewsUpdate,
  Poste,
  imagePoste,
  Thumbnail,
} from "@/types/news-poste";
import {
  addPoste,
  deleteThumbnail,
  getPoste,
  removeImage,
  updateImages,
  updatePosteData,
  updateThumbnail,
} from "@/app/action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { isSamePoste, isUpdatePoste } from "@/utils/news/poste";

// This can come from your database or API.
export function UpdatePoste({ postId }: { postId: string }) {
  // get the search Params}

  const form = useForm<TNewsForm>({
    resolver: zodResolver(NewsForm),
    mode: "onChange",
  });

  const [thumbnail, setThumbnail] = useState<Thumbnail>(null);
  const [loading, setLoading] = useState(false);
  const [fileImages, setFileImages] = useState<
    ImageType[] | NewsPoste["images"]
  >([]);

  useEffect(() => {
    const fetchPostes = async () => {
      try {
        const { poste } = await getPoste(postId);
        if (!poste) return;
        localStorage.setItem("poste", JSON.stringify(poste));
        setThumbnail(poste.thumbnail);
        setFileImages(poste.images);
        form.reset({
          title: poste.title,
          videoURL: poste.videoURL || "",
          discribtion: poste.discribtion,
        });
      } catch (error) {
        console.log(error);
      }
    };
    // scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (postId) {
      fetchPostes();
    }
  }, [postId]);

  // update the poste data , title , discribtion , videoURL
  const updatePosteInfo = async (posteData: NewsUpdate) => {
    setLoading(true);
    try {
      await updatePosteData(postId!, posteData);
      setTimeout(() => {
        setLoading(false);
        toast.success("تم تحديث المنشور بنجاح");
        form.reset({
          title: "",
          videoURL: "",
          discribtion: "",
        });
        setThumbnail(null);
        setFileImages([]);
        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ أثناء تحديث المنشور ");
      console.log(error);
    }
  };

  // update poste images
  const updatePosteImages = async (posteImages: ImageType[]) => {
    setLoading(true);
    try {
      await updateImages(postId!, posteImages);
      setTimeout(() => {
        setLoading(false);
        toast.success("تم تحديث الصور بنجاح")
        form.reset({
          title: "",
          videoURL: "",
          discribtion: "",
        });
        setThumbnail(null);
        setFileImages([]);
        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ أثناء تحديث المنشور ");
      console.log(error);
    }
  };

  //   remove poste images
  const removePosteImages = async (posteImages: ImageType[]) => {
    setLoading(true);
    try {
      await removeImage(postId!, posteImages);
      setTimeout(() => {
        setLoading(false);
        form.reset({
          title: "",
          videoURL: "",
          discribtion: "",
        });
        setThumbnail(null);
        setFileImages([]);
        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ أثناء تحديث المنشور ");
      console.log(error);
    }
  };

//   remove and update thumbnail 
const removeAndUpdateThumbnail = async (oldThumbnail : Thumbnail , newThumbnail : Thumbnail) => {
    setLoading(true);
    try {
      await updateThumbnail(postId!, newThumbnail);
      await deleteThumbnail(postId! , oldThumbnail);
      setTimeout(() => {
        setLoading(false);
        form.reset({
          title: "",
          videoURL: "",
          discribtion: "",
        });
        setThumbnail(null);
        setFileImages([]);
        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ أثناء تحديث المنشور ");
      console.log(error);
    }
  };

  function onSubmit(data: TNewsForm) {
    const { discribtion, title, videoURL } = data;
    const local = localStorage.getItem("poste") || "";
    const posteData = {
      title,
      discribtion,
      videoURL,
      thumbnail,
      images: fileImages as ImageType[], // Cast fileImages to ImageType[]
    };
    const localePoste = JSON.parse(local);
    const notHostedImages = fileImages.filter((image) =>
      image.url.startsWith("blob:")
    ) as ImageType[];
    const removedImages = localePoste.images.filter(
      (image: imagePoste) => !fileImages.some((img) => img.url === image.url)
    );
    if (!thumbnail?.name) {
      toast.error("يجب إضافة صورة مصغرة للمنشور");
      return;
    }
    if (fileImages.length === 0) {
      toast.error("يجب إضافة صورة واحدة على الأقل");
      return;
    }

    if (isSamePoste(localePoste, posteData)) {
      toast.error("لم تقم بتعديل المنشور");
      return;
    }
    if (isUpdatePoste(localePoste, posteData)) {
      const updatePosteData = {
        title,
        discribtion,
        videoURL,
      };
      console.log(localePoste , posteData);
      
      updatePosteInfo(updatePosteData);
    } 
     if (removedImages.length > 0 && notHostedImages.length > 0) {
      console.log("both update and remove image");
      updatePosteImages(notHostedImages);
      removePosteImages(removedImages);
    } else if (removedImages.length > 0) {
      console.log("remove image");
      removePosteImages(removedImages);
    } else if (notHostedImages.length > 0) {
      console.log("update image");
      updatePosteImages(notHostedImages);
    }

    if (localePoste.thumbnail.url !== thumbnail.url) {
      console.log("update thumbnail");
      removeAndUpdateThumbnail(localePoste.thumbnail , thumbnail)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المنشور</FormLabel>
              <FormControl>
                <Input placeholder="الإتحاد الوطني" {...field} />
              </FormControl>
              <FormDescription>
                عنوان المنشور يجب أن لا يتجاوز 150 حرفاً
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel> رابط الفيديو </FormLabel>
              <FormControl>
                <Input
                  placeholder="facebook.com"
                  className="font-roboto"
                  dir="ltr"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discribtion"
          render={({ field }) => (
            <FormItem>
              <FormLabel> وصف المنشور </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل وصف المنشور هنا"
                  className="resize-none min-h-60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <NewsThumbnail setThumbnail={setThumbnail} thumbnail={thumbnail} />
        {!thumbnail && (
          <p className="text-sm text-red-500">
            الرجاء اختيار صورة مصغرة للمنشور
          </p>
        )}
        <NewsImages
          fileImages={fileImages as ImageType[]}
          setFileImages={setFileImages}
        />
        <Button
          type="submit"
          className="w-full mx-auto md:max-w-full text-lg"
          disabled={loading}
        >
          تحديث المنشور
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}