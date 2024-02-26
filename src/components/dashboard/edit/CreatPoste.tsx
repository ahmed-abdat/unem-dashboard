"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

// This can come from your database or API.
const defaultValues: Partial<TNewsForm> = {
  title: "الإتحاد الوطني",
  videURL: "facebook.com",
  discribtion: "منشور تجريبي",
};
export function CreateNewPoste() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const form = useForm<TNewsForm>({
    resolver: zodResolver(NewsForm),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: TNewsForm) {
    // toast.success("You submitted the following values:" + JSON.stringify(data) )
    console.log(data);
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
          setThumbnailUrl={setThumbnailUrl}
          thumbnailUrl={thumbnailUrl}
        />
        {!thumbnail && (
          <p className="text-sm text-red-500">
            الرجاء اختيار صورة مصغرة للمنشور
          </p>
        )}
        <Button type="submit" className="w-full mx-auto md:max-w-[90%] text-lg">
          نشر الخبر
        </Button>
      </form>
    </Form>
  );
}
