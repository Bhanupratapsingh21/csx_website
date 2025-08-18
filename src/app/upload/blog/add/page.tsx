"use client";

import React, { useState } from "react";
import {
  Column, Flex, Button, Input, Textarea, Heading, Tag, Media, Text,
  useTheme, MediaUpload, useToast
} from "@once-ui-system/core";

import dynamic from "next/dynamic";
import { Client, Databases, ID } from "appwrite";
import { useAuthStore } from "@/store/auth";

// ---------- Appwrite client ----------
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const databases = new Databases(client);

// TinyMCE dynamic import
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  { ssr: false }
);

export default function BlogPostForm() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); // TinyMCE content (HTML)

  // --- Cloudinary upload helper ---
  const uploadToCloudinary = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!}/auto/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url as string;
  };

  // --- Cover image uploader (with MediaUpload) ---
  const handleCoverUpload = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file);
      setCoverImage(url);
      addToast({ variant: "success", message: "Cover image uploaded!" });
    } catch (err) {
      console.error(err);
      addToast({ variant: "danger", message: "Upload failed" });
    }
  };

  // --- Tags ---
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((s) => [...s, t]);
    setTagInput("");
  };

  // --- Save to Appwrite ---
  const handleSubmit = async () => {
    if (!title || !content.trim()) {
      addToast({ variant: "danger", message: "Title and Content are required!" });
      return;
    }

    setLoading(true);
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION!,
        ID.unique(),
        {
          title,
          summary,
          content,                       // store HTML directly
          tags,
          coverImage,
          status: "private",
          publishedAt: new Date().toISOString(),
          createdBy: user?.id,
          upvotes: 0,
        }
      );

      addToast({ variant: "success", message: "Blog created successfully!" });
      setTitle("");
      setSummary("");
      setTags([]);
      setCoverImage("");
      setContent("");
    } catch (e) {
      console.error(e);
      addToast({ variant: "danger", message: "Failed to save blog." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column
      maxWidth="l"
      gap="24"
      padding="24"
      background="transparent"
      radius="xl"
      shadow="m"
    >
      <Heading variant="display-strong-m">Create New Blog</Heading>

      {/* Title */}
      <Input
        id="Title"
        placeholder="Enter your blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Summary */}
      <Textarea
        id="Summary"
        label="Summary"
        placeholder="Short summary (optional)"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* Cover Image with MediaUpload */}
      <Column gap="8">
        <Text variant="body-default-m">Cover Image</Text>
        <MediaUpload
          sizes="m"
          aspectRatio="4 / 3"
          onFileUpload={handleCoverUpload}
        />
        
        {coverImage && (
          <Flex paddingTop="8">
            <Media src={coverImage} alt="cover" radius="l" />
          </Flex>
        )}
      </Column>

      {/* Tags */}
      <Column gap="8">
        <Text variant="body-default-m">Tags</Text>
        <Flex gap="8" wrap>
          {tags.map((t, i) => (
            <Tag key={i} size="m">{t}</Tag>
          ))}
        </Flex>
        <Flex gap="8">
          <Input
            id="tag"
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <Button label="Add" onClick={addTag} />
        </Flex>
      </Column>

      {/* Content (TinyMCE) */}
      <Column gap="8">
        <Text variant="body-default-m">Content</Text>
        <div
          className={`border border-neutral-alpha-medium rounded-xl p-3 ${theme === "dark" ? "bg-neutral-strong" : "bg-white"}`}
        >
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // optional
            value={content}
            onEditorChange={(newValue) => setContent(newValue)}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
              skin: theme === "dark" ? "oxide-dark" : "oxide",
              content_css: theme === "dark" ? "dark" : "default",
            }}
          />
        </div>
      </Column>

      {/* Submit */}
      <Flex horizontal="end">
        <Button
          label={loading ? "Saving..." : "Save Blog"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </Flex>
    </Column>
  );
}
