import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogEditor = ({ title, setTitle, content, setContent, category, setCategory }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ align: [] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
  ];

  return (
    <>
      <div className="mb-4">
        <label className="form-label fw-bold">Blog Title</label>
        <input
          type="text"
          className="form-control form-control-lg shadow-sm"
          placeholder="Enter a catchy title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ borderRadius: "10px", border: "1px solid #ddd" }}
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold">Category</label>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="e.g. Health, Lifestyle, A2 Ghee"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ borderRadius: "10px", border: "1px solid #ddd" }}
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold">Content</label>
        <div className="editor-container shadow-sm" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd" }}>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder="Write your story here..."
            style={{ height: 400, border: "none" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 80 }} />
    </>
  );
};

export default BlogEditor;

