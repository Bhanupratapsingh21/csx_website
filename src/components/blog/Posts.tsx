import { Grid } from "@once-ui-system/core";
import Post from "./Post";

interface BlogPost {
  $id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  publishedAt?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface PostsProps {
  posts: BlogPost[];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
}

export function Posts({
  posts,
  columns = "1",
  thumbnail = false,
  direction,
}: PostsProps) {
  // sort by published date (descending)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <>
      {sortedPosts.length > 0 && (
        <Grid columns={columns} fillWidth marginBottom="40" gap="12">
          {sortedPosts.map((post) => (
            <Post
              key={post.slug || post.$id}
              post={post}
              thumbnail={thumbnail}
              direction={direction}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
