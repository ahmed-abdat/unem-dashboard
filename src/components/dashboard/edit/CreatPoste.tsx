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
import { useState } from "react";
import { ImageType, Poste, Thumbnail } from "@/types/news-poste";
import { addPoste } from "@/app/action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// This can come from your database or API.
const defaultValues: Partial<TNewsForm> = {
  title: "الإتحاد الوطني",
  videURL: "facebook.com",
  discribtion: "منشور تجريبي",
};
export function CreateNewPoste() {
  const [thumbnail, setThumbnail] = useState<Thumbnail>(null);
  const [loading, setLoading] = useState(false);
  const [fileImages, setFileImages] = useState<ImageType[]>([]);


  const form = useForm<TNewsForm>({
    resolver: zodResolver(NewsForm),
    defaultValues,
    mode: "onChange",
  });

  const addPosteToDataBase = async (posteData : Poste) => {
    setLoading(true)
      try {
        await addPoste(posteData)
        setTimeout(() => {
          setLoading(false)
          toast.success("تم نشر المنشور بنجاح")

        }, 1000);
      } catch (error) {
        setLoading(false)
        toast.error("حدث خطأ أثناء نشر المنشور")
        console.log(error)
      }
  }

  function onSubmit(data: TNewsForm) {
    // toast.success("You submitted the following values:" + JSON.stringify(data) )
    const {discribtion , title , videURL} = data
    const posteData = {
      title,
      discribtion,
      videURL,
      thumbnail,
      images : fileImages,
    }
    console.log(posteData)
    setLoading(true)
    addPosteToDataBase(posteData)

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
          name="videURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel> رابط الفيديو </FormLabel>
              <FormControl>
                <Input placeholder="facebook.com" {...field} />
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
           <NewsThumbnail
          setThumbnail={setThumbnail}
          thumbnail={thumbnail}
        />
        {!thumbnail && (
          <p className="text-sm text-red-500">
            الرجاء اختيار صورة مصغرة للمنشور
          </p>
        )}
        <NewsImages  fileImages={fileImages} setFileImages={setFileImages}/>
        <Button type="submit" className="w-full mx-auto md:max-w-full text-lg" disabled={loading}>
          نشر الخبر
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
