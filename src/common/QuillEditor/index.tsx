import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar";
import { Text } from "@mantine/core";

const QuillEditor = ({
  onChangeValue,
  setValue,
  toolbarId,
  label,
  description,
}: QuillEditorType) => {
  const [text, setText] = useState("");
  const [editorHtml, setEditorHtml] = useState("");

  const countWords = (html: any) => {
    // Loại bỏ các thẻ HTML từ nội dung
    const text = html.replace(/<[^>]+>/g, "");
    // Tách chuỗi thành các từ và đếm số lượng từ
    const words = text.split(/\s+/).filter((word: any) => word !== "");
    return words.length;
  };

  const handleChange = (html: any) => {
    setEditorHtml(html);
    setText(html);
    onChangeValue(html);
    setValue(html);
  };
  const modules = {
    toolbar: {
      container: "#" + toolbarId,
    },
  };
  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  useEffect(() => {
    if (description) {
      setText(description);
    }
  }, [description]);

  return (
    <>
      <Text fw={500} style={{ marginTop: 12 }}>
        {label}
      </Text>
      <CustomToolbar id={toolbarId} />
      <ReactQuill
        value={text}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        style={{ width: "100%", height: "450px" }}
      />
      <Text fw={500} style={{ marginTop: 10 }}>
        Số kí tự: {countWords(editorHtml)} từ
      </Text>
    </>
  );
};

type QuillEditorType = {
  onChangeValue: (html: string) => void;
  setValue: (value: any) => void;
  toolbarId: string;
  label?: string;
  description?: string | null;
};

export default QuillEditor;
