"use client";

import { updatePost } from "@/action/postAction";
import TinyMCEEditorField from "@/lib/tinyMCE/editor";
import InputField from "@/components/ui/input";
import SelectField from "@/components/ui/select";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import Image from "next/image";

interface IProps {
  post: IPost;
}

const UpdatePostForm = ({ post }: IProps) => {
  const router = useRouter();

  const [content, setContent] = useState<string>(post.content);

  // manage state of form action [useActionState hook]
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updatePost,
    initialState
  );

  // manage state of form data
  const [formData, setFormData] = useState<IPost>(post);

  const [toastDisplayed, setToastDisplayed] = useState(false);

  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  //handle change
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // check if InputField
    if (e.target instanceof HTMLInputElement) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));

      if (name === "title") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          slug: slugify(value, { lower: true }),
        }));
      }
    }

    // check if SelectField
    if (e.target instanceof HTMLSelectElement) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Update post failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Updated post successfully!");
      router.push("/dashboard/posts");
    }
  }, [formState, toastDisplayed]);

  return (
    <div className="container mt-5">
      <div className="flex gap-8">
        <div className="basis-1/4 bg-gray-700 p-4 rounded-lg font-bold">
          <div className="w-full h-72 relative rounded-lg overflow-hidden mb-4">
            <Image
              src={post.image?.toString() || "/noavatar.png"}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="basis-3/4 bg-gray-700 p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 w-full">
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="image" value={post.image} />
            <InputField
              label="Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              rows={10}
              onChange={handleChange}
              className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
              required
            />
            <InputField
              label="Slug"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              readonly
            />
            <InputField
              label="SEO Title"
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              required
            />
            <InputField
              label="SEO Description"
              id="seoDescription"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              required
            />
            <InputField
              label="SEO Keywords"
              id="seoKeyworks"
              name="seoKeyworks"
              value={formData.seoKeyworks}
              onChange={handleChange}
              required
            />
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-white">
                Content
              </label>
              <TinyMCEEditorField
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
              />
            </div>
            <SelectField
              label="Is Active"
              id="isActive"
              name="isActive"
              value={formData.isActive.toString()}
              onChange={handleChange}
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
            />
            {formState.errors.length > 0 && (
              <ul>
                {formState.errors.map((error, index) => {
                  return (
                    <li className="text-red-400" key={index}>
                      {error}
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              type="submit"
              className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostForm;
