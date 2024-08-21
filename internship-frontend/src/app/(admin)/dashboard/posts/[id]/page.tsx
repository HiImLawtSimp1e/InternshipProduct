import UpdatePostForm from "@/components/dashboard/post/update-post-form";
import { cookies as nextCookies } from "next/headers";

const Post = async ({ id }: { id: string }) => {
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Post/admin/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // header Authorization
    },
    next: { tags: ["postDetail"] },
  });

  const post: ApiResponse<IPost> = await res.json();

  return <UpdatePostForm post={post.data} />;
};

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <Post id={id} />;
};

export default PostDetailPage;
