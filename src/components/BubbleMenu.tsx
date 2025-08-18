"use client";
import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import {
  Column,
  Flex,
  Button,
  Input,
  Textarea,
  Heading,
  Tag,
  Media,
  Text,
  useTheme,
} from "@once-ui-system/core";
import { Client, Databases, ID } from "appwrite";
import { useAuthStore } from "@/store/auth";
import { EditorButton } from "@/components/EditorButton";

// Custom BubbleMenu Component
export const CustomBubbleMenu = ({ editor }: { editor: any }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current || !editor) return;

    const bubbleMenu = BubbleMenuExtension.configure({
      element: menuRef.current,
     
    });

    editor.registerPlugin(bubbleMenu);

    return () => {
      editor.unregisterPlugin(bubbleMenu.name);
    };
  }, [editor]);

  return (
    <div ref={menuRef} style={{ display: "none" }}>
      <Flex
        padding="4"
        gap="4"
        background="neutral-strong"
        radius="m"
        vertical="center"
      >
        <EditorButton
          size="s"
          label="B"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        />
        <EditorButton
          size="s"
          label="I"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        />
        <EditorButton
          size="s"
          label="U"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        />
        <EditorButton
          size="s"
          label="Link"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("URL", previousUrl);

            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        />
      </Flex>
    </div>
  );
};