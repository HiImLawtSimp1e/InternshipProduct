import ShopPostDetail from "@/components/shop/post-detail/post-detail";

const Post = async ({ postSlug }: { postSlug: string }) => {
  const res = await fetch(`http://localhost:5000/api/Post/${postSlug}`, {
    method: "GET",
    next: { tags: ["shopPostDetail"] },
  });

  const post: ApiResponse<IPost> = await res.json();
//   console.log(post.data);

  return <ShopPostDetail post={post.data} />;
};

const PostDetailPage = ({ params }: { params: { postSlug: string } }) => {
  const { postSlug } = params;
  return <Post postSlug={postSlug} />;
};

export default PostDetailPage;
