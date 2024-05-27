"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StudentForm, TStudentForm } from "@/lib/dashboard/student-space-form";
import StudentPosteImages from "@/components/dashboard/edit/student-space/StudentPosteImages";
import StudnetPosteThumbnail from "@/components/dashboard/edit/student-space/StudentThumbnail";
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
import { useState } from "react";
import { ImageType, Thumbnail } from "@/types/news-poste";
import {  addStudentPoste } from "@/app/action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PosteStudent } from "@/types/student-space";
import { useRouter } from "next/navigation";
import TipTap from "@/components/TipTap";

export function CreatStudentSpacePoste() {
  const [thumbnail, setThumbnail] = useState<Thumbnail>(null);
  const [loading, setLoading] = useState(false);
  const [fileImages, setFileImages] = useState<ImageType[]>([]);
  const router = useRouter();

  const form = useForm<TStudentForm>({
    resolver: zodResolver(StudentForm),
    mode: "onChange",
  });

  const addPosteToDataBase = async (posteData: PosteStudent) => {
    setLoading(true);
    try {
      await addStudentPoste(posteData);
      setTimeout(() => {
        setLoading(false);
        toast.success("تم نشر المنشور بنجاح");
        setThumbnail(null);
        setFileImages([]);
        router.push('/overviews/student-space')
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error("حدث خطأ أثناء نشر المنشور");
      console.log(error);
    }
  };

  function onSubmit(data: TStudentForm) {
    const { discribtion, title, videoURL, summary } = data;
    const posteData = {
      title,
      summary: summary ? summary : null,
      discribtion,
      videoURL: videoURL ? videoURL : null,
      thumbnail,
      images: fileImages,
    };
    if (!thumbnail?.name) {
      toast.error("يجب إضافة صورة مصغرة للمنشور");
      return;
    }
    if (fileImages.length === 0) {
      toast.error("يجب إضافة صورة واحدة على الأقل");
      return;
    }

    console.log(posteData);
    
    setLoading(true);
    addPosteToDataBase(posteData);
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
              <Textarea placeholder=" عنوان المنشور هنا "  className="resize-none min-h-10" {...field} />
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
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel> ملخص عن المنشور </FormLabel>
              <FormControl>
              <Textarea placeholder=" ملخص المنشور هنا"  className="resize-none min-h-20" {...field} />
              </FormControl>
              <FormDescription>
                الملخص يجب أن لا يتجاوز 200 حرفاً
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
                {/* <Textarea
                  placeholder="أدخل وصف المنشور هنا"
                  className="resize-none min-h-40"
                  {...field}
                /> */}
                <TipTap description={''} onChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StudnetPosteThumbnail
          setThumbnail={setThumbnail}
          thumbnail={thumbnail}
        />
        {!thumbnail && (
          <p className="text-sm text-red-500">
            الرجاء اختيار صورة مصغرة للمنشور
          </p>
        )}
        <StudentPosteImages
          fileImages={fileImages}
          setFileImages={setFileImages}
        />
        {fileImages.length === 0 && (
          <p className="text-sm text-red-500">
            الرجاء اختيار صورة واحدة على الأقل للمنشور
          </p>
        )}
        <Button
          type="submit"
          className="w-full mx-auto md:max-w-full text-lg"
          disabled={loading}
        >
          نشر الخبر
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
