"use client";

import { deletePost } from "@/action/postAction";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import TagFiled from "@/components/ui/tag";
import { useCustomActionState } from "@/lib/custom/customHook";
import { formatDate } from "@/lib/format/format";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

interface IProps {
  posts: IPost[];
  pages: number;
  currentPage: number;
}

const PostList = ({ posts, pages, currentPage }: IProps) => {
  //using for pagination
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;

  //using for delete action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deletePost,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Deleted post failed!");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Deleted post successfully!");
      router.push("/dashboard/posts");
    }
  }, [formState, toastDisplayed]);

  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search posts..." />
        <Link href="/dashboard/posts/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Post
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Slug</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: IPost, index) => (
            <tr key={post.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{post.title}</td>
              <td className="px-4 py-2">{post.slug}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={post.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={post.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">{formatDate(post.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(post.modifiedAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/posts/${post.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="m-1 px-5 py-2 bg-red-500 text-white rounded">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        pageSize={pageSize}
        clsColor="gray"
      />
    </div>
  );
};

export default PostList;
