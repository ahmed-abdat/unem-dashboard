"use client";

import React, { useCallback } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Link,
  Link2Off,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Image,
  Undo,
  Redo,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

type ToolbarProps = {
  editor: Editor | null;
  setOpenDialog: () => void;
};

function Toolbar({ editor , setOpenDialog }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  // const addImage = useCallback(() => {
  //   const url = window.prompt('URL')

  //   if (url) {
  //     editor.chain().focus().setImage({ src: url }).run()
  //   }
  // }, [editor])




  return (
    <div
      className="border border-input bg-transparent rounded-md flex items-center gap-x-2 overflow-auto sm:overflow-hidden"
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
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
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
        onPressedChange={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <Link2Off className="h-4 w-4" />
      </Toggle>

      {/* <Toggle
        size="sm"
        onPressedChange={addImage}
      >
        <Image className="h-4 w-4" />
      </Toggle> */}
      

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4 list-" />
      </Toggle>
    </div>
  );
}

export default Toolbar;
