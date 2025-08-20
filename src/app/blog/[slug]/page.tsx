// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { baseURL, blog, person, about } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { Client, Databases, Query } from "appwrite";
import {
    Avatar,
    Button,
    Column,
    Flex,
    Heading,
    Media,
    Schema,
    Text,
} from "@once-ui-system/core";
import Image from "next/image";

type BlogPost = {
    $id: string;
    slug: string;
    title: string;
    summary: string;
    content: string;
    coverImage?: string;
    publishedAt?: string;
    authorName?: string;
};

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION!,
            [Query.equal("slug", slug)]
        );

        if (res.total === 0) return null;
        const doc = res.documents[0];

        return {
            $id: doc.$id,
            slug: doc.slug,
            title: doc.title,
            summary: doc.summary,
            content: doc.content,
            coverImage: doc.coverImage,
            publishedAt: doc.publishedAt,
            authorName: doc.authorName
        };
    } catch (e) {
        console.error("Error fetching blog by slug:", e);
        return null;
    }
}

// ✅ Fixed: await params in generateMetadata
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            url: `${baseURL}${blog.path}/${post.slug}`,
            images: post.coverImage
                ? [post.coverImage]
                : [`/api/og/generate?title=${encodeURIComponent(post.title)}`],
        },
    };
}

// ✅ Fixed: await params in default export
export default async function BlogPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) notFound();

    return (
        <Column maxWidth="m" paddingY="40" paddingX="20" gap="32">
            <Schema
                as="blogPosting"
                baseURL={baseURL}
                title={post.title}
                description={post.summary}
                path={`${blog.path}/${post.slug}`}
                image={post.coverImage}
                author={{
                    name: post.authorName || "Anonymous",
                    url: `${baseURL}${about.path}`,
                    image: person.avatar,
                }}
            />

            <Button
                href="/blog"
                variant="secondary"
                prefixIcon="arrowLeft"
                size="s"
                label="Back to posts"
            />

            <Heading variant="display-strong-xl">{post.title}</Heading>

            <Flex gap="12" vertical="center">

                <Avatar size="m" />

                <Text variant="body-default-m" onBackground="neutral-weak">
                    Published by <strong>{post.authorName || "Anonymous"}</strong>{" "}
                    {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
                </Text>
            </Flex>



            <Column
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.coverImage && (

                <Image
                    className="w-full max-w-4xl mx-auto h-auto rounded-xl"
                    src={post.coverImage}
                    alt={post.title}
                    width={1200}
                    height={600}
                    style={{ width: '100%', height: 'auto' }}
                />
            )}
        </Column>
    );
}