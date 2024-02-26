import { z } from "zod";

export const NewsForm = z.object({
  title: z.string().max(150, {
    message: "عنوان الخبر يجب أن لا يتجاوز 150 حرفاً",
  }).min(4, {
    message: "عنوان الخبر يجب أن يحتوي على 4 أحرف على الأقل",
    }),
  videoURL: z.string().refine(
    (url) => {
      if(url === "") return true;
      const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/
        const facebookRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:[^\/]+\/videos\/|video\.php\?v=|watch\/)?|fb\.watch\/)([\w-]+)[\/\?]?.*$/;

      return facebookRegex.test(url) || youtubeRegex.test(url);
    },
    {
      message:
        "الرجاء إدخال رابط صحيح للفيديو. يمكنك إدخال رابط من يوتيوب أو فيسبوك.",
    }
  ).optional(),
  discribtion: z.string().min(4, {
    message: "الوصف يجب أن يحتوي على 4 أحرف على الأقل",
  }),
});

export type TNewsForm = z.infer<typeof NewsForm>;
