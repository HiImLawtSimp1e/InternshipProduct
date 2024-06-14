"use client";

import { addPost } from "@/action/postAction";
import MyEditor from "@/components/ui/editor";
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import React, { useState } from "react";

const CreatePost: React.FC = () => {
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
    seoTitle: "",
    seoDescription: "",
    seoKeyworks: "",
    content: "",
  });

  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formAction(formData);
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
          Detail
        </label>
        <MyEditor
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>
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
