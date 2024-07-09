import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/format/format";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  posts: IPost[];
  pages: number;
  currentPage: number;
  pageSize?: number;
}

const ShopPostList = ({ posts, pages, currentPage, pageSize }: IProps) => {
  return (
    <div className="mt-12">
      <div className="flex flex-col gap-8">
        {posts?.map((post: IPost) => (
          <div key={post.id} className="bg-gray-100 rounded-xl mx-48">
            <div>
              <div className="lg:-mx-6 lg:flex lg:items-center">
                <div className="w-full lg:mx-6 lg:w-1/2  h-72 lg:h-96 relative">
                  <Image
                    src={post.image?.toString() || "/product.png"}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-cover rounded-xl"
                  />
                </div>

                <div className="px-4 pb-8 mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
                  <p className="text-sm text-gray-400">
                    {formatDate(post.createdAt)}
                  </p>
                  <Link href={`/post/${post.slug}`}>
                    <h1 className="block mt-4 text-2xl font-bold text-gray-800 lg:text-xl">
                      {post.title}
                    </h1>
                  </Link>
                  <p className="mt-3 text-lg text-gray-600 lg:text-sm">
                    {post.description}
                  </p>
                  <Link
                    href={`/post/${post.slug}`}
                    className="inline-block mt-2 text-xl font-semibold text-blue-500 lg:text-lg hover:text-blue-700"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        pageSize={pageSize}
        clsColor="blue"
      />
    </div>
  );
};

export default ShopPostList;
