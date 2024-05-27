"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/components/Toolbar";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from '@tiptap/extension-blockquote'
// import Image from '@tiptap/extension-image'

import BubelMenu from "@/components/BubelMenu";
import { UrlDialog } from "./UrlDialog";
import { Url } from "@/types/url";
import { isValidJSON } from "@/lib/valid-json";

type TipTapProps = {
  description: string;
  onChange: (richText: string) => void;
};

export default function TipTap({ description, onChange }: TipTapProps) {
    
  const [open, setOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading : false,
        blockquote : false,
      }),
      Heading.configure({
        levels: [1],
        HTMLAttributes: {
          class: "text-xl font-bold text-accent-foreground",
        },
      }),
      Typography.configure(),
      TextAlign.configure({
        defaultAlignment: "right",
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-700",
        },
        autolink: true,
        linkOnPaste : true,
        openOnClick : false,
        }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-r-4  border-primary-color pr-2 ",
        },
      }),

        // Image.configure({
        //     inline: true,
        //     allowBase64: true,
        //     HTMLAttributes: {
        //     class: "rounded-md",
        //     },
        // }),
    ],
    content: isValidJSON(description) ? JSON.parse(description) : `<p> ${description} </p>`,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-back-ring-offset-2  disabeld:cursor-not-allowed disabeled:opacity-50 p-4 focus:border-primary-color focus:outline-primary-color pr-8",
      },
    },
    onUpdate: ({ editor }) => {
        onChange(JSON.stringify(editor.getJSON()));
        // console.log(editor.getJSON());
    },
  });

  const handleOpen = useCallback(() => {
    if (!editor) return;
    setOpen((prev) => !prev);
    const previousUrl = editor.getAttributes("link").href;
    setPreviewUrl(previousUrl);
  }, [editor]);


  const onSubmit = useCallback(({ url }: Url) => {
    if (!editor) return;
    
    // Cancelled
    if (url === null) {
      return;
    }

    console.log('url', url);
    

    // Empty or valid URL
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else if (url) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    setOpen(false);
    setPreviewUrl("");
  }, [editor])


  const handelOpenModel = () => {
    setOpen(prev => !prev)
    setPreviewUrl('')
    }

  return (
    <div className="flex flex-col justify-stretch min-h-[250px] gap-y-2">
      <UrlDialog
        open={open}
        setOpen={handelOpenModel}
        previewUrl={previewUrl}
        onSubmit={onSubmit}
      />
      <Toolbar editor={editor} setOpenDialog={handleOpen} />
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bg-white rounded-md "
      >
        <BubelMenu editor={editor} setOpenDialog={handleOpen} />
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
