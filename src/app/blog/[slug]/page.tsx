import { notFound } from "next/navigation";
import { Metadata } from "next";
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

type BlogPost = {
    $id: string;
    slug: string;
    title: string;
    summary: string;
    content: string;
    coverImage?: string;
    publishedAt?: string;
    author?: { name: string; avatar?: string };
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
            author: doc.author
                ? { name: doc.author.name, avatar: doc.author.avatar }
                : undefined,
        };
    } catch (e) {
        console.error("Error fetching blog by slug:", e);
        return null;
    }
}

// ✅ Metadata
export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
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

// ✅ Blog Page
export default async function BlogPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    if (!post) notFound();

    return (
        <Column maxWidth="m" paddingY="40" paddingX="20" gap="32">
            {/* Schema.org metadata */}
            <Schema
                as="blogPosting"
                baseURL={baseURL}
                title={post.title}
                description={post.summary}
                path={`${blog.path}/${post.slug}`}
                image={post.coverImage}
                author={{
                    name: post.author?.name || person.name,
                    url: `${baseURL}${about.path}`,
                    image: post.author?.avatar || person.avatar,
                }}
            />

            {/* Back link */}
            <Button
                href="/blog"
                variant="secondary"
                prefixIcon="arrowLeft"
                size="s"
                label="Back to posts"
            />

            {/* Title */}
            <Heading variant="display-strong-xl">{post.title}</Heading>

            {/* Author + Date */}
            <Flex gap="12" vertical="center">
                {post.author?.avatar ? (
                    <Avatar src={post.author.avatar} size="m" />
                ) : (
                    <Avatar size="m" />
                )}
                <Text variant="body-default-m" onBackground="neutral-weak">
                    Published by <strong>{post.author?.name || person.name}</strong>{" "}
                    {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
                </Text>
            </Flex>

            {/* Cover image */}
            {post.coverImage && (
                <Media
                    src={post.coverImage}
                    alt={post.title}
                    radius="xl"
                    enlarge
                    sizes="100%"
                />
            )}

            {/* Blog Content */}
            <Column
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </Column>
    );
}
