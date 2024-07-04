import PostList from "@/components/dashboard/post/post-list";

const Posts = async ({ params }: { params: { page?: number } }) => {
  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Post/admin";
  } else {
    url = `http://localhost:5000/api/Post/admin?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["postListAdmin"] },
  });

  const responseData: ApiResponse<PagingParams<IPost[]>> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage } = data;

  return <PostList posts={result} pages={pages} currentPage={currentPage} />;
};

const PostsPage = ({ searchParams }: { searchParams: { page?: number } }) => {
  const { page } = searchParams;

  // Render Products component with params prop
  return <Posts params={{ page: page || undefined }} />;
};

export default PostsPage;
