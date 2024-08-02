import ShopPostList from "@/components/shop/post-list/post-list";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

interface IProps {
  page?: number;
}

const Posts = async ({ page }: IProps) => {
  let url = "";
  if (page == null) {
    url = `http://localhost:5000/api/Post`;
  } else {
    url = `http://localhost:5000/api/Post?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["shopPostList"] },
  });

  const responseData: ApiResponse<PagingParams<IPost[]>> = await res.json();
  const { data, success, message } = responseData;
  //   console.log(responseData);
  const { result, pages, currentPage, pageResults } = data;

  return (
    <ShopPostList
      posts={result}
      pages={pages}
      currentPage={currentPage}
      pageSize={pageResults}
    />
  );
};

const PostsPage = ({ searchParams }: { searchParams: { page?: number } }) => {
  const { page } = searchParams;
  return (
    <Suspense fallback={<Loading />}>
      <Posts page={page || undefined} />
    </Suspense>
  );
};

export default PostsPage;
