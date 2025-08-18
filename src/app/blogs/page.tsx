"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // ✅ public
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // ✅ public

const databases = new Databases(client);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID!;

export default function BlogTestPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        // ✅ In client, no API key → only works if collection is public/readable
        const doc = await databases.getDocument(DB_ID, COLLECTION_ID, slug);
        setPost(doc);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!post) return notFound();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{post.title}</h1>
      <p><strong>Summary:</strong> {post.summary}</p>

      <h2>Full JSON</h2>
      <pre style={{ background: "#f5f5f5", padding: "10px" }}>
        {JSON.stringify(post, null, 2)}
      </pre>

      <h2>Raw Content</h2>
      <pre>{post.content}</pre>
    </div>
  );
}
