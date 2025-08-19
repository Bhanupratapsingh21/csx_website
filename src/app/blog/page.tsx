"use client";
import { Client, Databases, Query } from "appwrite";
import { Column, Heading, Button, Flex } from "@once-ui-system/core";
import Post from "@/components/blog/Post";
import { useState, useEffect } from "react";

// configure Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. "https://cloud.appwrite.io/v1"
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

interface BlogPost {
  $id: string;
  slug: string;
  title: string;
  summary?: string;
  coverImage?: string;
  publishedAt?: string;
  tag?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6; // posts per page

  useEffect(() => {
    fetchPosts(0);
  }, []);

  async function fetchPosts(pageNumber: number) {
    const offset = pageNumber * limit;

    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION!,
      [
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    // Map documents to BlogPost safely
    const blogPosts = res.documents.map(
      (doc) =>
      ({
        $id: doc.$id,
        slug: doc.slug, // ✅ pull slug directly
        title: doc.title,
        summary: doc.summary,
        coverImage: doc.coverImage,
        publishedAt: doc.publishedAt,
        tag: doc.tag,
      } as BlogPost)
    );

    if (blogPosts.length < limit) {
      setHasMore(false);
    }

    if (pageNumber === 0) {
      setPosts(blogPosts);
    } else {
      setPosts((prev) => [...prev, ...blogPosts]);
    }
  }

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <Column maxWidth="s">
      <Heading marginBottom="l" variant="display-strong-s">
        All Blogs
      </Heading>

      <Column gap="20">
        {posts.map((post) => (
          <Post
            key={post.$id}
            post={{
              slug: post.slug, // ✅ use slug, not $id
              metadata: {
                title: post.title,
                image: post.coverImage,
                publishedAt: post.publishedAt,
                tag: post.tag,
              },
            }}
            thumbnail
            direction="row"
          />
        ))}
      </Column>

      {hasMore && (
        <Flex center marginTop="24">
          <Button onClick={loadMore}>Load More</Button>
        </Flex>
      )}
    </Column>
  );
}
