"use client";

import { Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Url } from "@/types/url";
import React, { useEffect } from "react";

type UrlDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: Url) => void;
  previewUrl?: string;
};

export function UrlDialog({
  open,
  setOpen,
  onSubmit,
  previewUrl = "",
}: UrlDialogProps) {
  const [url, setUrl] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  useEffect(() => {
    setUrl(previewUrl);
  }, [previewUrl]);

  const handleSubmit = () => {
    const urlRegex =
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$|^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
    // validate url
    if (!url) {
      setError("الرابط مطلوب");
      return;
    }
    if (!urlRegex.test(url)) {
      setError("الرابط غير صحيح");
      return;
    }
    setError("");

    onSubmit({ url });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md text-right z-50" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-center">أدخل الرابط هنا </DialogTitle>
          <DialogDescription className="text-center">
            تأكد من صحة الرابط قبل إضافته
          </DialogDescription>
        </DialogHeader>
        <Input
          onChange={handelChange}
          type="url"
          name="url"
          placeholder="https://example.com"
          className="w-full"
          value={url}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <DialogFooter className="flex w-full flex-row items-center justify-center gap-x-2 sm:justify-center">
          <Button
            type="submit"
            className="flex items-center gap-x-2"
            onClick={handleSubmit}
          >
            <Link className="h-4 w-4" />
            إضافة الرابط
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">إلغاء</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
