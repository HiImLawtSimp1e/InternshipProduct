"use client";

import React, { useEffect, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface MyEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
}

const MyEditor: React.FC<MyEditorProps> = ({ value, onEditorChange }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsEditorReady(true);
    }
  }, []);

  if (!isEditorReady) {
    return null;
  }

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // replace your tinyMCE API key
      value={value}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help | code",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={(content) => onEditorChange(content)}
    />
  );
};

export default MyEditor;
