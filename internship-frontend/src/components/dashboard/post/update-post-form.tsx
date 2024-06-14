"use client";

import { addPost, updatePost } from "@/action/postAction";
import MyEditor from "@/components/ui/editor";
import InputField from "@/components/ui/input";
import SelectField from "@/components/ui/select";
import { useCustomActionState } from "@/lib/custom/customHook";
import React, { useState } from "react";
import slugify from "slugify";

interface IProps {
  post: IPost;
}

const UpdatePostForm = ({ post }: IProps) => {
  const [content, setContent] = useState<string>(post.content);

  // manage state of form action [useActionState hook]
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updatePost,
    initialState
  );

  // manage state of form data
  const [formData, setFormData] = useState<IPost>(post);

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

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <input type="hidden" name="id" value={post.id} />
      <InputField
        label="Title"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
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
      <div>
        <label className="block mb-2 text-sm font-medium text-white">
          Detail
        </label>
        <MyEditor
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
      <button
        type="submit"
        className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Update
      </button>
    </form>
  );
};

export default UpdatePostForm;
