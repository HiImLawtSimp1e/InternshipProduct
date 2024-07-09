import { formatDate } from "@/lib/format/format";
import Image from "next/image";

interface IProps {
  post: IPost;
}

const ShopPostDetail = ({ post }: IProps) => {
  return (
    <div className="mt-10">
      <div
        className="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative"
        style={{ height: "24em" }}
      >
        <div
          className="absolute rounded-xl left-0 bottom-0 w-full h-full z-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg,transparent,rgba(0,0,0,.7))",
          }}
        ></div>
        <Image
          src={post.image}
          layout="fill"
          objectFit="cover"
          className="z-0 rounded-xl"
          alt="Cover"
        />
        <div className="p-4 absolute bottom-0 left-0 z-20">
          <h2 className="text-4xl font-semibold text-gray-100 leading-tight">
            {post.title}
          </h2>
        </div>
      </div>

      <div className="px-4 lg:px-0 mt-12  max-w-screen-md mx-auto">
        <p className="py-2 text-sm text-gray-400">
          {formatDate(post.createdAt)}
        </p>
        <div
          className=" text-gray-700 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default ShopPostDetail;
