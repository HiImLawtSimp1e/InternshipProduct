"use client";

import { addPost } from "@/action/postAction";
import TinyMCEEditorField from "@/lib/tinyMCE/editor";
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CreatePost: React.FC = () => {
  const router = useRouter();

  const [content, setContent] = useState<string>("");

  // manage state of form action [useActionState hook]
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addPost,
    initialState
  );

  // manage state of form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    seoKeyworks: "",
    content: "",
  });

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Create post failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Created post successfully!");
      router.push("/dashboard/posts");
    }
  }, [formState, toastDisplayed]);

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <InputField
        label="Title"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <label className="block mb-2 text-sm font-medium" htmlFor="image">
        Image
      </label>
      <input
        id="image"
        name="image"
        type="file"
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600  border border-gray-600 cursor-pointer focus:outline-none placeholder-gray-400"
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
      <div>
        <label className="block mb-2 text-sm font-medium text-white">
          Content
        </label>
        <TinyMCEEditorField
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>
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
        Create
      </button>
    </form>
  );
};

export default CreatePost;
