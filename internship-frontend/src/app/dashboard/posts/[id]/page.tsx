import UpdatePostForm from "@/components/dashboard/post/update-post-form";

const Post = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/Post/admin/${id}`, {
    method: "GET",
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
