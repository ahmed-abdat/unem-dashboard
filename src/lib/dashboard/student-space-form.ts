import { z } from "zod";

export const StudentForm = z.object({
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
  summary: z.string().max(200, {
    message: "الملخص يجب أن لا يتجاوز 200 حرفاً",
  }).optional(),
  discribtion: z.string().min(4, {
    message: "الوصف يجب أن يحتوي على 4 أحرف على الأقل",
  }),
});

export type TStudentForm = z.infer<typeof StudentForm>;
