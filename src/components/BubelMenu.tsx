"use client";

import React, { useCallback } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading1,
  Link,
  Link2Off,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

type ToolbarProps = {
  editor: Editor | null;
  setOpenDialog: () => void;
};

function BubelMenu({ editor , setOpenDialog}: ToolbarProps) {
  if (!editor) {
    return null;
  }


  return (
    <div
      className="border border-input bg-transparent rounded-md flex items-center gap-x-2"
      dir="ltr"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>


      <Toggle
        size="sm"
        onPressedChange={setOpenDialog}
        pressed={editor.isActive("link")}
      >
        <Link className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <Link2Off className="h-4 w-4" />
      </Toggle>

 
    </div>
  );
}

export default BubelMenu;
