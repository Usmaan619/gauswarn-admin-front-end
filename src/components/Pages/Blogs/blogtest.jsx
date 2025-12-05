import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData, postFormData, deleteData } from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  Upload,
  Search,
} from "lucide-react";

const BlogManager = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });
  const [uploading, setUploading] = useState(null);
  const [currentView, setCurrentView] = useState("main");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);

  // Blog state

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Blog CRUD APIs
  // ==================== Fetch Blogs with Pagination ====================
  const fetchBlogs = async (pageNo = 1) => {
    setLoading(true);

    try {
      const res = await getData(`blogs?page=${pageNo}&limit=${limit}`);

      console.log("BLOG API RESPONSE:", res);

      if (res?.blogs) {
        setBlogs(res.blogs);
        setPage(res.page || 1);

        // 🔥 सबसे जरूरी fixes यहाँ हैं 🔥
        const totalCount =
          res?.total ||
          res?.count ||
          res?.totalBlogs ||
          res?.blogs?.length ||
          1;

        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (err) {
      toastError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (id, blogData) => {
    console.log("FINAL BLOG DATA RECEIVED:", blogData);

    for (let [key, val] of blogData.entries()) {
      console.log("FD ENTRY:", key, val);
    }

    try {
      const res = await postFormData("/blogs/create", blogData);
      toastSuccess("Blog created successfully!");
      fetchBlogs();
      setCurrentView("list");
    } catch (err) {
      toastError("Failed to create blog");
      console.log(err);
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      await postFormData(`/blogs/update/${id}`, blogData);
      toastSuccess("Blog updated successfully!");
      fetchBlogs();
      setCurrentView("list");
    } catch (err) {
      toastError("Failed to update blog");
      console.log(err);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteData("blogs", id);

      toastSuccess("Blog deleted successfully!");
      fetchBlogs(page);
    } catch (err) {
      toastError("Failed to delete blog");
      console.log(err);
    }
  };

  const handleNavigate = (view, id = null, slug = null) => {
    setCurrentView(view);
    setSelectedId(id);
    setSelectedSlug(slug);

    if (view === "list") fetchBlogs(1);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "main":
        return <BlogMain onNavigate={handleNavigate} />;
      case "list":
        return (
          <BlogList
            onNavigate={handleNavigate}
            blogs={blogs}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onDelete={deleteBlog}
            page={page}
            totalPages={totalPages}
            fetchBlogs={fetchBlogs}
          />
        );
      case "create":
        return (
          <BlogForm
            onNavigate={handleNavigate}
            onSubmit={createBlog}
            title="Create New Blog"
          />
        );
      case "edit":
        return (
          <BlogForm
            onNavigate={handleNavigate}
            onSubmit={updateBlog}
            blogId={selectedId}
            title="Edit Blog"
          />
        );
      case "view":
        return <BlogView onNavigate={handleNavigate} slug={selectedSlug} />;
      default:
        return <BlogMain onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5 py-4">{renderCurrentView()}</div>
      </div>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
        }
        .blog-card-hover:hover {
          transform: translateY(-4px);
        }
        .action-card-hover:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  );
};

// ==================== BlogMain (4 Cards) ====================
const BlogMain = ({ onNavigate }) => {
  return (
    <div>
      {" "}
      <div>
        <div style={{ textAlign: "start", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              //   color: "white",
              marginBottom: "16px",
            }}
          >
            Blog Manager
          </h1>
          <p style={{ fontSize: "18px" }}>Manage your blog posts with ease</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            // maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <ActionCard
            icon={<Plus size={36} />}
            title="Create Blog"
            description="Write and publish new blog posts"
            color="#10b981"
            onClick={() => onNavigate("create")}
          />
          <ActionCard
            icon={<FileText size={36} />}
            title="View Blogs"
            description="Browse all published blogs"
            color="#3b82f6"
            onClick={() => onNavigate("list")}
          />
          <ActionCard
            icon={<Edit size={36} />}
            title="Edit Blog"
            description="Update existing blog posts"
            color="#f59e0b"
            onClick={() => onNavigate("list")}
          />
          <ActionCard
            icon={<Trash2 size={36} />}
            title="Delete Blog"
            description="Remove unwanted blog posts"
            color="#ef4444"
            onClick={() => onNavigate("list")}
          />
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, description, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "32px",
        cursor: "pointer",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 25px 50px rgba(0,0,0,0.25)"
          : "0 8px 25px rgba(0,0,0,0.15)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "16px",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          color,
          fontSize: "24px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "12px",
          color: "#1f2937",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
};

// ==================== BlogList ====================
// const BlogList = ({
//   onNavigate,
//   blogs,
//   loading,
//   searchTerm,
//   setSearchTerm,
//   onDelete,
// }) => {
//   const filteredBlogs = blogs?.filter(
//     (blog) =>
//       blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div
//       style={
//         {
//           // minHeight: "80vh",
//           // background: "#f8fafc",
//           // padding: "40px 30px",
//           // borderRadius: "20px",
//         }
//       }
//     >
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ marginBottom: "32px" }}>
//           <button
//             onClick={() => onNavigate("main")}
//             style={{
//               background: "white",
//               border: "1px solid #e2e8f0",
//               borderRadius: "12px",
//               padding: "12px 20px",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               cursor: "pointer",
//               marginBottom: "24px",
//               fontWeight: 500,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             <ArrowLeft size={20} />
//             Back to Dashboard
//           </button>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: "20px",
//               marginBottom: "24px",
//             }}
//           >
//             <div>
//               <h1
//                 style={{
//                   fontSize: "32px",
//                   fontWeight: 700,
//                   color: "#1e293b",
//                   marginBottom: "6px",
//                 }}
//               >
//                 All Blogs ({blogs.length})
//               </h1>
//               <p style={{ color: "#64748b", fontSize: "16px" }}>
//                 {filteredBlogs.length} blogs match your search
//               </p>
//             </div>
//             <button
//               onClick={() => onNavigate("create")}
//               style={{
//                 background: "linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 padding: "14px 28px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
//               }}
//             >
//               <Plus size={20} />
//               Create New Blog
//             </button>
//           </div>

//           <div
//             style={{
//               position: "relative",
//               marginBottom: "32px",
//               background: "white",
//               borderRadius: "12px",
//               padding: "4px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//             }}
//           >
//             <Search
//               size={20}
//               style={{
//                 position: "absolute",
//                 left: "16px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#94a3b8",
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search blogs by title or category..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "14px 20px 14px 48px",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "15px",
//                 background: "transparent",
//                 outline: "none",
//               }}
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div
//             style={{ textAlign: "center", padding: "60px", color: "#64748b" }}
//           >
//             Loading blogs...
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
//               gap: "28px",
//             }}
//           >
//             {filteredBlogs.map((blog) => (
//               <BlogCard
//                 key={blog.id}
//                 blog={blog}
//                 onDelete={onDelete}
//                 onNavigate={onNavigate}
//               />
//             ))}
//             {filteredBlogs.length === 0 && (
//               <div
//                 style={{
//                   gridColumn: "1 / -1",
//                   textAlign: "center",
//                   padding: "80px 20px",
//                   color: "#64748b",
//                 }}
//               >
//                 <FileText
//                   size={64}
//                   style={{ margin: "0 auto 24px", opacity: 0.5 }}
//                 />
//                 <h3
//                   style={{
//                     fontSize: "24px",
//                     fontWeight: 600,
//                     marginBottom: "12px",
//                   }}
//                 >
//                   No blogs found
//                 </h3>
//                 <p>Try adjusting your search or create a new blog</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
const BlogList = ({
  onNavigate,
  blogs,
  loading,
  searchTerm,
  setSearchTerm,
  onDelete,
  page,
  totalPages,
  fetchBlogs,
}) => {
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <button
        onClick={() => onNavigate("main")}
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "24px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 700 }}>
          All Blogs ({blogs.length})
        </h1>

        <p style={{ color: "#64748b" }}>
          {filteredBlogs.length} blogs match your search
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          position: "relative",
          marginBottom: "24px",
          background: "white",
          borderRadius: "12px",
          padding: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Search
          size={20}
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
        />
        <input
          type="text"
          placeholder="Search blogs by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 20px 14px 48px",
            border: "none",
            outline: "none",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Blogs Grid */}
      {!loading ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "28px",
            }}
          >
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDelete={onDelete}
                onNavigate={onNavigate}
              />
            ))}

            {filteredBlogs.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 20px",
                }}
              >
                <h3>No blogs found</h3>
                <p>Try search or create new blog</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {blogs.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => fetchBlogs(page - 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: page === 1 ? "#eee" : "white",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ◀ Previous
              </button>

              <span style={{ fontSize: "18px", fontWeight: 600 }}>
                Page {page || 1} of {totalPages || 1}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => fetchBlogs(page + 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: page === totalPages ? "#eee" : "white",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading blogs...
        </div>
      )}
    </div>
  );
};

const BlogCard = ({ blog, onDelete, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        style={{
          height: "200px",
          background: `url(${blog.image_url}) center/cover`,
          position: "relative",
        }}
      >
        {blog.category && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#e07a5f",
            }}
          >
            {blog.category}
          </div>
        )}
      </div>

      <div style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "10px",
            lineHeight: 1.4,
          }}
        >
          {blog.title}
        </h3>

        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onNavigate("view", null, blog.slug)}
            style={{
              flex: 1,
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <Eye size={16} />
            View
          </button>

          <button
            onClick={() => onNavigate("edit", blog.id)}
            style={{
              flex: 1,
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <Edit size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(blog.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s",
              width: "44px",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== BlogForm (Create/Edit) ====================
// const BlogForm = ({ onNavigate, onSubmit, blogId, title }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     category: "",
//     content: "",
//     image_url: "",
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (blogId) {
//       // Load existing blog data
//       // TODO: fetchData(`/blogs/${blogId}`)
//     }
//   }, [blogId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "title" && { slug: generateSlug(value) }),
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//         setFormData((prev) => ({ ...prev, image_url: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title || !formData.content) {
//       alert("Title and content are required!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await onSubmit(blogId, formData);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div style={{ margin: "0 auto" }}>
//         <button
//           onClick={() => onNavigate("main")}
//           style={{
//             background: "white",
//             border: "1px solid #e2e8f0",
//             borderRadius: "12px",
//             padding: "12px 20px",
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             cursor: "pointer",
//             marginBottom: "32px",
//             fontWeight: 500,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           }}
//         >
//           <ArrowLeft size={20} />
//           Back to Dashboard
//         </button>

//         <div
//           style={{
//             background: "white",
//             borderRadius: "20px",
//             padding: "48px",
//             boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h1
//             style={{
//               fontSize: "32px",
//               fontWeight: 700,
//               color: "#1e293b",
//               marginBottom: "32px",
//             }}
//           >
//             {title}
//           </h1>

//           <form onSubmit={handleSubmit}>
//             <div style={{ marginBottom: "24px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "15px",
//                   fontWeight: 600,
//                   color: "#374151",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Blog Title *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Enter your blog title..."
//                 style={{
//                   width: "100%",
//                   padding: "16px 20px",
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   fontSize: "16px",
//                   transition: "border-color 0.2s",
//                 }}
//                 required
//               />
//             </div>

//             <div style={{ marginBottom: "24px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "15px",
//                   fontWeight: 600,
//                   color: "#374151",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Slug
//               </label>
//               <input
//                 type="text"
//                 name="slug"
//                 value={formData.slug}
//                 onChange={handleInputChange}
//                 placeholder="Auto-generated from title"
//                 style={{
//                   width: "100%",
//                   padding: "16px 20px",
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   fontSize: "16px",
//                   backgroundColor: "#f8fafc",
//                   color: "#64748b",
//                 }}
//               />
//             </div>

//             <div style={{ marginBottom: "24px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "15px",
//                   fontWeight: 600,
//                   color: "#374151",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Category
//               </label>
//               <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Technology, Design, Programming"
//                 style={{
//                   width: "100%",
//                   padding: "16px 20px",
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   fontSize: "16px",
//                 }}
//               />
//             </div>

//             <div style={{ marginBottom: "24px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "15px",
//                   fontWeight: 600,
//                   color: "#374151",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Featured Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{
//                   width: "100%",
//                   padding: "16px",
//                   borderRadius: "12px",
//                   border: "2px dashed #cbd5e1",
//                   background: "#f8fafc",
//                   cursor: "pointer",
//                 }}
//               />
//               {imagePreview && (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   style={{
//                     marginTop: "16px",
//                     width: "100%",
//                     maxHeight: "300px",
//                     borderRadius: "12px",
//                     objectFit: "cover",
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//                   }}
//                 />
//               )}
//             </div>

//             <div style={{ marginBottom: "32px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "15px",
//                   fontWeight: 600,
//                   color: "#374151",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Content *
//               </label>
//               <textarea
//                 name="content"
//                 value={formData.content}
//                 onChange={handleInputChange}
//                 placeholder="Write your blog content here..."
//                 rows={12}
//                 style={{
//                   width: "100%",
//                   padding: "20px",
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   fontSize: "16px",
//                   fontFamily: "inherit",
//                   resize: "vertical",
//                   lineHeight: 1.6,
//                 }}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 background: "linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 padding: "18px 40px",
//                 cursor: loading ? "not-allowed" : "pointer",
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 margin: "0 auto",
//                 boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
//                 opacity: loading ? 0.7 : 1,
//               }}
//             >
//               <Save size={20} />
//               {loading ? "Publishing..." : "Publish Blog"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// final
// const BlogForm = ({ onNavigate, onSubmit, blogId, title }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     category: "",
//     content: "",
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (blogId) {
//       // TODO: Load existing blog data from API
//     }
//   }, [blogId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "title" && { slug: generateSlug(value) }),
//     }));
//   };

//   // Image preview + file setter
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setImageFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.content) {
//       toastError("Title and content are required!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const fd = new FormData();
//       fd.append("title", formData.title.trim());
//       fd.append("content", formData.content.trim());
//       fd.append("slug", formData.slug || generateSlug(formData.title));
//       fd.append("category", formData.category?.trim() || "");

//       // Append image file if exists
//       if (imageFile) {
//         fd.append("image", imageFile);
//       }

//       // Log FormData for debugging
//       console.log("FormData being sent:");
//       for (let [key, value] of fd.entries()) {
//         console.log(key, ":", value);
//       }

//       await onSubmit(blogId, fd);
//     } catch (err) {
//       console.error("Submit error:", err);
//       toastError("Failed to submit blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ margin: "0 auto" }}>
//       <button
//         onClick={() => onNavigate("main")}
//         style={{
//           background: "white",
//           border: "1px solid #e2e8f0",
//           borderRadius: "12px",
//           padding: "12px 20px",
//           display: "flex",
//           alignItems: "center",
//           gap: "10px",
//           cursor: "pointer",
//           marginBottom: "32px",
//           fontWeight: 500,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//         }}
//       >
//         <ArrowLeft size={20} />
//         Back to Dashboard
//       </button>

//       <div
//         style={{
//           background: "white",
//           borderRadius: "20px",
//           padding: "48px",
//           boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "32px",
//             fontWeight: 700,
//             color: "#1e293b",
//             marginBottom: "32px",
//           }}
//         >
//           {title}
//         </h1>

//         <form onSubmit={handleSubmit}>
//           {/* Blog Title */}
//           <div style={{ marginBottom: "24px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: "10px",
//               }}
//             >
//               Blog Title *
//             </label>

//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Enter your blog title..."
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 borderRadius: "12px",
//                 border: "1px solid #e2e8f0",
//                 fontSize: "16px",
//               }}
//               required
//             />
//           </div>

//           {/* Slug */}
//           <div style={{ marginBottom: "24px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: "10px",
//               }}
//             >
//               Slug
//             </label>

//             <input
//               type="text"
//               name="slug"
//               value={formData.slug}
//               onChange={handleInputChange}
//               placeholder="Auto-generated from title"
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 borderRadius: "12px",
//                 border: "1px solid #e2e8f0",
//                 fontSize: "16px",
//                 backgroundColor: "#f8fafc",
//                 color: "#64748b",
//               }}
//             />
//           </div>

//           {/* Category */}
//           <div style={{ marginBottom: "24px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: "10px",
//               }}
//             >
//               Category
//             </label>

//             <input
//               type="text"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               placeholder="e.g. Technology, Programming"
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 borderRadius: "12px",
//                 border: "1px solid #e2e8f0",
//                 fontSize: "16px",
//               }}
//             />
//           </div>

//           {/* Image Upload */}
//           <div style={{ marginBottom: "24px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: "10px",
//               }}
//             >
//               Featured Image
//             </label>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               style={{
//                 width: "100%",
//                 padding: "16px",
//                 borderRadius: "12px",
//                 border: "2px dashed #cbd5e1",
//                 background: "#f8fafc",
//                 cursor: "pointer",
//               }}
//             />

//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 style={{
//                   marginTop: "16px",
//                   width: "100%",
//                   maxHeight: "300px",
//                   borderRadius: "12px",
//                   objectFit: "cover",
//                   boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//                 }}
//               />
//             )}
//           </div>

//           {/* Content */}
//           <div style={{ marginBottom: "32px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: "10px",
//               }}
//             >
//               Content *
//             </label>

//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleInputChange}
//               rows={12}
//               placeholder="Write your blog content here..."
//               style={{
//                 width: "100%",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 border: "1px solid #e2e8f0",
//                 fontSize: "16px",
//                 lineHeight: 1.6,
//                 resize: "vertical",
//               }}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               background: "linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)",
//               color: "white",
//               border: "none",
//               borderRadius: "12px",
//               padding: "18px 40px",
//               cursor: loading ? "not-allowed" : "pointer",
//               fontSize: "16px",
//               fontWeight: 600,
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               margin: "0 auto",
//               boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
//               opacity: loading ? 0.7 : 1,
//             }}
//           >
//             <Save size={20} />
//             {loading ? "Publishing..." : "Publish Blog"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// ==================== BlogForm (Create/Edit) ====================
const BlogForm = ({ onNavigate, onSubmit, blogId, title }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    content: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 CHANGED: EDIT MODE पर data load होगा
  useEffect(() => {
    if (blogId) {
      loadBlogData();
    }
  }, [blogId]);

  // 🔥 CHANGED: Backend से blog data लाने वाला function
  const loadBlogData = async () => {
    try {
      const res = await getData(`blogs/${blogId}`);

      if (res?.blog) {
        const blog = res.blog;

        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          category: blog.category || "",
          content: blog.content || "",
        });

        setImagePreview(blog.image_url || null); // पुरानी image दिखेगी
      }
    } catch (err) {
      console.log("Error loading blog:", err);
      toastError("Failed to load blog data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));
  };

  // Image preview + store
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit handler (Both create & update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toastError("Title and content are required!");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("content", formData.content.trim());
      fd.append("slug", formData.slug);
      fd.append("category", formData.category.trim());

      if (imageFile) {
        fd.append("image", imageFile); // New image
      }

      // Debug Log
      console.log("FormData being sent:");
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      await onSubmit(blogId, fd);
    } catch (err) {
      console.error("Submit error:", err);
      toastError("Failed to submit blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <button
        onClick={() => onNavigate("main")}
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "32px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "48px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "32px",
          }}
        >
          {title}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Blog Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your blog title..."
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Slug */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Auto-generated from title"
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g. Technology, Programming"
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Image */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Featured Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "2px dashed #cbd5e1",
                background: "#f8fafc",
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  maxHeight: "300px",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          {/* Content */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Content *
            </label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              placeholder="Write blog content..."
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                lineHeight: 1.6,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "18px 40px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            <Save size={20} />
            {loading ? "Processing..." : blogId ? "Update Blog" : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==================== BlogView ====================
// const BlogView = ({ onNavigate, slug }) => {
//   // TODO: Fetch single blog by slug
//   const blog = {
//     id: 1,
//     title: "Sample Blog Post",
//     category: "Technology",
//     content:
//       "<p>This is a sample blog post content. In real implementation, this would be fetched from <strong>/blogs/slug/${slug}</strong> API.</p><p>Your full HTML content from MySQL <code>longtext</code> field will render here using <code>dangerouslySetInnerHTML</code>.</p>",
//     image_url:
//       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
//     created_at: "2025-12-04T13:42:00Z",
//   };

//   return (
//     <div
//       style={{
//         // minHeight: "80vh",
//         // background: "#f8fafc",
//         // borderRadius: "20px",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           height: "400px",
//           background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${blog.image_url}) center/cover`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "white",
//           textAlign: "center",
//           padding: "0 40px",
//         }}
//       >
//         <div>
//           {blog.category && (
//             <div
//               style={{
//                 background: "rgba(255,255,255,0.2)",
//                 padding: "8px 20px",
//                 borderRadius: "30px",
//                 display: "inline-block",
//                 marginBottom: "24px",
//                 fontSize: "14px",
//                 backdropFilter: "blur(10px)",
//               }}
//             >
//               {blog.category}
//             </div>
//           )}
//           <h1
//             style={{
//               fontSize: "48px",
//               fontWeight: 700,
//               marginBottom: "20px",
//               maxWidth: 900,
//             }}
//           >
//             {blog.title}
//           </h1>
//           <p style={{ fontSize: "18px", opacity: 0.95 }}>
//             Published on{" "}
//             {new Date(blog.created_at).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>
//       </div>

//       <div
//         style={{
//           maxWidth: 900,
//           margin: "-80px auto 0",
//           padding: "0 40px 60px",
//         }}
//       >
//         <div
//           style={{
//             background: "white",
//             borderRadius: "24px",
//             padding: "80px 60px 60px",
//             boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
//             marginBottom: "40px",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "18px",
//               lineHeight: 1.8,
//               color: "#374151",
//             }}
//             dangerouslySetInnerHTML={{ __html: blog.content }}
//           />
//         </div>

//         <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
//           <button
//             onClick={() => onNavigate("edit", blog.id)}
//             style={{
//               background: "#f59e0b",
//               color: "white",
//               border: "none",
//               borderRadius: "12px",
//               padding: "14px 28px",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               cursor: "pointer",
//               fontSize: "15px",
//               fontWeight: 600,
//             }}
//           >
//             <Edit size={18} />
//             Edit Blog
//           </button>
//           <button
//             onClick={() => onNavigate("list")}
//             style={{
//               background: "white",
//               border: "1px solid #e2e8f0",
//               borderRadius: "12px",
//               padding: "14px 28px",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               cursor: "pointer",
//               fontSize: "15px",
//               fontWeight: 500,
//               boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//             }}
//           >
//             <ArrowLeft size={18} />
//             Back to Blogs
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const BlogView = ({ onNavigate, slug }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await getData(`/blogs/single/${slug}`);
      setBlog(res.blog);
    } catch (err) {
      console.log(err);
      toastError("Failed to load blog");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ overflow: "hidden" }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => onNavigate("list")}
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "24px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={20} /> Back to Blogs
      </button>

      {/* HERO SECTION */}
      <div
        style={{
          height: "400px",
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${blog.image_url}) center/cover`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <div>
          {blog.category && (
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 20px",
                borderRadius: "30px",
                display: "inline-block",
                marginBottom: "24px",
                fontSize: "14px",
                backdropFilter: "blur(10px)",
              }}
            >
              {blog.category}
            </div>
          )}

          <h1
            style={{
              fontSize: "48px",
              fontWeight: 700,
              marginBottom: "20px",
              maxWidth: 900,
            }}
          >
            {blog.title}
          </h1>

          <p style={{ fontSize: "18px", opacity: 0.95 }}>
            Published on{" "}
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div
        style={{
          // maxWidth: 900,
          margin: "-80px auto 0",
          padding: "0 40px 60px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "80px 60px 60px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{ fontSize: "18px", lineHeight: 1.8, color: "#374151" }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => onNavigate("edit", blog.id)}
            style={{
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            <Edit size={18} />
            Edit Blog
          </button>

          <button
            onClick={() => onNavigate("list")}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

// const BlogView = ({ onNavigate, slug }) => {
//   const [blog, setBlog] = useState(null);

//   useEffect(() => {
//     fetchBlog();
//   }, []);

//   const fetchBlog = async () => {
//     try {
//       const res = await getData(`/blogs/single/${slug}`);
//       setBlog(res.blog);
//     } catch (err) {
//       console.log(err);
//       toastError("Failed to load blog");
//     }
//   };

//   if (!blog) return <p>Loading...</p>;

//   return (
//     <div>
//       <button onClick={() => onNavigate("list")}>Back</button>

//       <h1>{blog.title}</h1>
//       <img
//         src={blog.image_url}
//         style={{ width: "100%", borderRadius: "12px" }}
//       />
//       <div
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//         style={{ marginTop: "20px" }}
//       />
//     </div>
//   );
// };

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default BlogManager;

// testing code

// import React, { useEffect, useState } from "react";
// import Sidebar from "../../Common/SideBar/sidebar";
// import Navbar from "../../Common/Navbar/navbar";
// import { getData, postFormData, deleteData } from "../../Common/APIs/api";
// import { toastSuccess, toastError } from "../../../Services/toast.service";
// import {
//   Plus,
//   FileText,
//   Edit,
//   Trash2,
//   Eye,
//   ArrowLeft,
//   Save,
//   Upload,
//   Search,
// } from "lucide-react";

// const BlogManager = () => {
//   // Banner states
//   const [banners, setBanners] = useState({
//     banner1: null,
//     banner2: null,
//     banner3: null,
//     banner4: null,
//   });
//   const [uploading, setUploading] = useState(null);

//   // View states
//   const [currentView, setCurrentView] = useState("main");
//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedSlug, setSelectedSlug] = useState(null);

//   // Blog states
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Color palette - Your exact colors
//   const colors = {
//     primary: "#e07a5f",
//     primaryDark: "#d05a3f",
//     background: "#fefbe9",
//     surface: "#f6f0e4",
//     textPrimary: "#131523",
//     textSecondary: "#2f3e46",
//     dark: "#111111",
//     accent: "#5d4037",
//   };

//   // Blog CRUD APIs
//   const fetchBlogs = async (pageNo = 1) => {
//     setLoading(true);
//     try {
//       const res = await getData(`blogs?page=${pageNo}&limit=${limit}`);
//       console.log("BLOG API RESPONSE", res);
//       if (res?.blogs) {
//         setBlogs(res.blogs);
//         setPage(res.page || 1);
//         const totalCount =
//           res?.total ||
//           res?.count ||
//           res?.totalBlogs ||
//           res?.blogs?.length ||
//           1;
//         setTotalPages(Math.ceil(totalCount / limit));
//       }
//     } catch (err) {
//       toastError("Failed to fetch blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createBlog = async (id, blogData) => {
//     console.log("FINAL BLOG DATA RECEIVED", blogData);
//     try {
//       const res = await postFormData("blogs/create", blogData);
//       toastSuccess("Blog created successfully!");
//       fetchBlogs();
//       setCurrentView("list");
//     } catch (err) {
//       toastError("Failed to create blog");
//       console.log(err);
//     }
//   };

//   const updateBlog = async (id, blogData) => {
//     try {
//       await postFormData(`blogs/update/${id}`, blogData);
//       toastSuccess("Blog updated successfully!");
//       fetchBlogs();
//       setCurrentView("list");
//     } catch (err) {
//       toastError("Failed to update blog");
//       console.log(err);
//     }
//   };

//   const deleteBlog = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await deleteData("blogs", id);
//       toastSuccess("Blog deleted successfully!");
//       fetchBlogs(page);
//     } catch (err) {
//       toastError("Failed to delete blog");
//       console.log(err);
//     }
//   };

//   const handleNavigate = (view, id = null, slug = null) => {
//     setCurrentView(view);
//     setSelectedId(id);
//     setSelectedSlug(slug);
//     if (view === "list") fetchBlogs(1);
//   };

//   const generateSlug = (title) => {
//     return title
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/[\s_-]+/g, "-")
//       .replace(/^-+|-+$/g, "");
//   };

//   // Render current view
//   const renderCurrentView = () => {
//     switch (currentView) {
//       case "main":
//         return <BlogMain onNavigate={handleNavigate} colors={colors} />;
//       case "list":
//         return (
//           <BlogList
//             onNavigate={handleNavigate}
//             blogs={blogs}
//             loading={loading}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             onDelete={deleteBlog}
//             page={page}
//             totalPages={totalPages}
//             fetchBlogs={fetchBlogs}
//             colors={colors}
//           />
//         );
//       case "create":
//         return (
//           <BlogForm
//             onNavigate={handleNavigate}
//             onSubmit={createBlog}
//             title="Create New Blog"
//             colors={colors}
//           />
//         );
//       case "edit":
//         return (
//           <BlogForm
//             onNavigate={handleNavigate}
//             onSubmit={updateBlog}
//             blogId={selectedId}
//             title="Edit Blog"
//             colors={colors}
//           />
//         );
//       case "view":
//         return (
//           <BlogView
//             onNavigate={handleNavigate}
//             slug={selectedSlug}
//             colors={colors}
//           />
//         );
//       default:
//         return <BlogMain onNavigate={handleNavigate} colors={colors} />;
//     }
//   };

//   useEffect(() => {
//     if (currentView === "list") {
//       fetchBlogs(1);
//     }
//   }, [currentView]);

//   return (
//     <div
//       className="container-fluid px-4"
//       style={{
//         backgroundColor: colors.background,
//         minHeight: "100vh",
//         fontFamily:
//           '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       }}
//     >
//       <Navbar />
//       <div className="row">
//         <div className="col-lg-2">
//           <Sidebar />
//         </div>
//         <div className="col-lg-10 px-lg-5 py-4">{renderCurrentView()}</div>
//       </div>
//       <style jsx>{`
//         .hover-lift:hover {
//           transform: translateY(-5px) !important;
//         }
//         .blog-card-hover:hover {
//           transform: translateY(-4px) !important;
//         }
//         .action-card-hover:hover {
//           transform: translateY(-8px) !important;
//         }
//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   );
// };

// // ========================================
// // BlogMain - Dashboard Cards
// // ========================================
// const BlogMain = ({ onNavigate, colors }) => {
//   return (
//     <div>
//       <div style={{ textAlign: "start", marginBottom: "50px" }}>
//         <h1
//           style={{
//             fontSize: "42px",
//             fontWeight: "700",
//             color: colors.textPrimary,
//             marginBottom: "16px",
//             lineHeight: "1.2",
//           }}
//         >
//           Blog Manager
//         </h1>
//         <p
//           style={{
//             fontSize: "18px",
//             color: colors.textSecondary,
//             opacity: 0.9,
//           }}
//         >
//           Manage your blog posts with ease
//         </p>
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//           gap: "30px",
//           maxWidth: "1200px",
//           margin: "0 auto",
//         }}
//       >
//         <ActionCard
//           icon={Plus}
//           size={36}
//           title="Create Blog"
//           description="Write and publish new blog posts"
//           color={colors.primary}
//           onClick={() => onNavigate("create")}
//           colors={colors}
//         />
//         <ActionCard
//           icon={FileText}
//           size={36}
//           title="View Blogs"
//           description="Browse all published blogs"
//           color={colors.accent}
//           onClick={() => onNavigate("list")}
//           colors={colors}
//         />
//         <ActionCard
//           icon={Eye}
//           size={36}
//           title="View Blog"
//           description="Read individual blog posts"
//           color={colors.primaryDark}
//           onClick={() => onNavigate("list")}
//           colors={colors}
//         />
//         <ActionCard
//           icon={Trash2}
//           size={36}
//           title="Manage Blogs"
//           description="Edit or delete blog posts"
//           color="#ef4444"
//           onClick={() => onNavigate("list")}
//           colors={colors}
//         />
//       </div>
//     </div>
//   );
// };

// // ========================================
// // Action Cards
// // ========================================
// const ActionCard = ({
//   icon: Icon,
//   title,
//   description,
//   color,
//   onClick,
//   colors,
//   size = 24,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       onClick={onClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className="action-card-hover"
//       style={{
//         backgroundColor: colors.surface,
//         borderRadius: "24px",
//         padding: "36px",
//         cursor: "pointer",
//         transform: isHovered ? "translateY(-12px)" : "translateY(0)",
//         boxShadow: isHovered
//           ? `0 30px 60px ${colors.primary}30`
//           : `0 12px 30px ${colors.textPrimary}10`,
//         transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//         position: "relative",
//         overflow: "hidden",
//         border: `1px solid ${colors.primary}15`,
//         backdropFilter: "blur(10px)",
//       }}
//     >
//       <div
//         style={{
//           width: "80px",
//           height: "80px",
//           borderRadius: "20px",
//           background: `linear-gradient(135deg, ${color}20, ${color}10)`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           marginBottom: "28px",
//           border: `2px solid ${color}40`,
//           boxShadow: `0 8px 20px ${color}20`,
//         }}
//       >
//         <Icon
//           size={size}
//           color={color}
//           style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
//         />
//       </div>
//       <h3
//         style={{
//           fontSize: "24px",
//           fontWeight: "700",
//           marginBottom: "16px",
//           color: colors.textPrimary,
//           lineHeight: "1.3",
//         }}
//       >
//         {title}
//       </h3>
//       <p
//         style={{
//           fontSize: "16px",
//           color: colors.textSecondary,
//           lineHeight: "1.7",
//           opacity: 0.9,
//         }}
//       >
//         {description}
//       </p>
//     </div>
//   );
// };

// // ========================================
// // Blog List View
// // ========================================
// const BlogList = ({
//   onNavigate,
//   blogs,
//   loading,
//   searchTerm,
//   setSearchTerm,
//   onDelete,
//   page,
//   totalPages,
//   fetchBlogs,
//   colors,
// }) => {
//   const filteredBlogs =
//     blogs?.filter(
//       (blog) =>
//         blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
//     ) || [];

//   return (
//     <div
//       style={{
//         minHeight: "80vh",
//         padding: "48px 32px",
//         background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 100%)`,
//         borderRadius: "28px",
//         boxShadow: `0 20px 60px ${colors.primary}05`,
//       }}
//     >
//       <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
//         {/* Back Button */}
//         <button
//           onClick={() => onNavigate("main")}
//           style={{
//             backgroundColor: colors.surface,
//             border: `1px solid ${colors.primary}20`,
//             borderRadius: "16px",
//             padding: "14px 24px",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             cursor: "pointer",
//             marginBottom: "32px",
//             fontWeight: "600",
//             color: colors.textPrimary,
//             boxShadow: `0 4px 16px ${colors.primary}10`,
//             transition: "all 0.3s ease",
//             fontSize: "15px",
//           }}
//         >
//           <ArrowLeft size={22} color={colors.textPrimary} />
//           Back to Dashboard
//         </button>

//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: "24px",
//             marginBottom: "36px",
//             paddingBottom: "24px",
//             borderBottom: `1px solid ${colors.primary}10`,
//           }}
//         >
//           <div>
//             <h1
//               style={{
//                 fontSize: "36px",
//                 fontWeight: "700",
//                 color: colors.textPrimary,
//                 marginBottom: "8px",
//                 lineHeight: "1.2",
//               }}
//             >
//               All Blogs ({blogs.length})
//             </h1>
//             <p
//               style={{
//                 color: colors.textSecondary,
//                 fontSize: "17px",
//                 opacity: 0.9,
//               }}
//             >
//               {filteredBlogs.length} blogs match your search
//             </p>
//           </div>
//           <button
//             onClick={() => onNavigate("create")}
//             style={{
//               background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
//               color: "white",
//               border: "none",
//               borderRadius: "16px",
//               padding: "16px 32px",
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "700",
//               boxShadow: `0 12px 30px ${colors.primary}40`,
//               transition: "all 0.3s ease",
//             }}
//           >
//             <Plus size={22} />
//             Create New Blog
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div
//           style={{
//             position: "relative",
//             marginBottom: "40px",
//             backgroundColor: colors.surface,
//             borderRadius: "16px",
//             padding: "6px",
//             boxShadow: `0 8px 24px ${colors.textPrimary}10`,
//             border: `1px solid ${colors.primary}15`,
//           }}
//         >
//           <Search
//             size={24}
//             style={{
//               position: "absolute",
//               left: "20px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: colors.textSecondary,
//             }}
//           />
//           <input
//             type="text"
//             placeholder="Search blogs by title or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "18px 24px 18px 64px",
//               border: "none",
//               borderRadius: "12px",
//               fontSize: "16px",
//               background: "transparent",
//               outline: "none",
//               color: colors.textPrimary,
//               fontWeight: "500",
//             }}
//           />
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "80px 40px",
//               color: colors.textSecondary,
//               fontSize: "18px",
//             }}
//           >
//             <div style={{ marginBottom: "24px" }}>
//               <FileText size={80} style={{ margin: "0 auto", opacity: 0.6 }} />
//             </div>
//             Loading blogs...
//           </div>
//         ) : (
//           <>
//             {/* Blogs Grid */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
//                 gap: "32px",
//                 marginBottom: "48px",
//               }}
//             >
//               {filteredBlogs.map((blog) => (
//                 <BlogCard
//                   key={blog.id}
//                   blog={blog}
//                   onDelete={onDelete}
//                   onNavigate={onNavigate}
//                   colors={colors}
//                 />
//               ))}
//               {filteredBlogs.length === 0 && (
//                 <div
//                   style={{
//                     gridColumn: "1 / -1",
//                     textAlign: "center",
//                     padding: "100px 40px",
//                     color: colors.textSecondary,
//                   }}
//                 >
//                   <FileText
//                     size={80}
//                     style={{ margin: "0 auto 32px", opacity: 0.5 }}
//                   />
//                   <h3
//                     style={{
//                       fontSize: "28px",
//                       fontWeight: "700",
//                       marginBottom: "16px",
//                       color: colors.textPrimary,
//                     }}
//                   >
//                     No blogs found
//                   </h3>
//                   <p style={{ fontSize: "17px" }}>
//                     Try adjusting your search or create a new blog
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {blogs.length > 0 && (
//               <div
//                 style={{
//                   marginTop: "48px",
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: "24px",
//                   alignItems: "center",
//                 }}
//               >
//                 <button
//                   disabled={page === 1}
//                   onClick={() => fetchBlogs(page - 1)}
//                   style={{
//                     padding: "14px 28px",
//                     borderRadius: "12px",
//                     border: `1px solid ${colors.primary}30`,
//                     backgroundColor: page === 1 ? `${colors.surface}` : "white",
//                     cursor: page === 1 ? "not-allowed" : "pointer",
//                     opacity: page === 1 ? 0.6 : 1,
//                     color: colors.textPrimary,
//                     fontWeight: "600",
//                     fontSize: "16px",
//                     transition: "all 0.3s ease",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   Previous
//                 </button>
//                 <span
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "700",
//                     color: colors.textPrimary,
//                   }}
//                 >
//                   Page {page} of {totalPages}
//                 </span>
//                 <button
//                   disabled={page === totalPages}
//                   onClick={() => fetchBlogs(page + 1)}
//                   style={{
//                     padding: "14px 28px",
//                     borderRadius: "12px",
//                     border: `1px solid ${colors.primary}30`,
//                     backgroundColor:
//                       page === totalPages ? `${colors.surface}` : "white",
//                     cursor: page === totalPages ? "not-allowed" : "pointer",
//                     opacity: page === totalPages ? 0.6 : 1,
//                     color: colors.textPrimary,
//                     fontWeight: "600",
//                     fontSize: "16px",
//                     transition: "all 0.3s ease",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ========================================
// // Blog Card
// // ========================================
// const BlogCard = ({ blog, onDelete, onNavigate, colors }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className="blog-card-hover"
//       style={{
//         backgroundColor: colors.surface,
//         borderRadius: "24px",
//         overflow: "hidden",
//         boxShadow: isHovered
//           ? `0 25px 50px ${colors.primary}20`
//           : `0 8px 32px ${colors.textPrimary}10`,
//         transform: isHovered ? "translateY(-8px)" : "translateY(0)",
//         transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//         border: `1px solid ${colors.primary}10`,
//         backdropFilter: "blur(10px)",
//       }}
//     >
//       {/* Image */}
//       <div
//         style={{
//           height: "220px",
//           background: `linear-gradient(rgba(224, 122, 95, 0.3), rgba(224, 122, 95, 0.15)), url(${blog.imageurl}) center/cover no-repeat`,
//           position: "relative",
//           borderRadius: "24px 24px 0 0",
//         }}
//       >
//         {blog.category && (
//           <div
//             style={{
//               position: "absolute",
//               top: "24px",
//               right: "24px",
//               backgroundColor: "rgba(255, 255, 255, 0.95)",
//               backdropFilter: "blur(20px)",
//               padding: "10px 20px",
//               borderRadius: "24px",
//               fontSize: "13px",
//               fontWeight: "700",
//               color: colors.primary,
//               boxShadow: `0 8px 24px ${colors.primary}20`,
//               border: `1px solid ${colors.primary}20`,
//             }}
//           >
//             {blog.category}
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div style={{ padding: "32px" }}>
//         <h3
//           style={{
//             fontSize: "22px",
//             fontWeight: "700",
//             color: colors.textPrimary,
//             marginBottom: "12px",
//             lineHeight: "1.4",
//             display: "-webkit-box",
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//           }}
//         >
//           {blog.title}
//         </h3>
//         <p
//           style={{
//             fontSize: "14px",
//             color: colors.textSecondary,
//             marginBottom: "28px",
//             opacity: 0.9,
//           }}
//         >
//           {new Date(blog.createdat).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </p>

//         {/* Action Buttons */}
//         <div style={{ display: "flex", gap: "12px" }}>
//           <button
//             onClick={() => onNavigate("view", null, blog.slug)}
//             style={{
//               flex: 1,
//               backgroundColor: colors.accent,
//               color: "white",
//               border: "none",
//               borderRadius: "12px",
//               padding: "12px 16px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "600",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               transition: "all 0.3s ease",
//               boxShadow: `0 4px 16px ${colors.accent}30`,
//             }}
//           >
//             <Eye size={18} />
//             View
//           </button>
//           <button
//             onClick={() => onNavigate("edit", blog.id)}
//             style={{
//               flex: 1,
//               backgroundColor: colors.primaryDark,
//               color: "white",
//               border: "none",
//               borderRadius: "12px",
//               padding: "12px 16px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "600",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               transition: "all 0.3s ease",
//               boxShadow: `0 4px 16px ${colors.primary}30`,
//             }}
//           >
//             <Edit size={18} />
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(blog.id)}
//             style={{
//               backgroundColor: "#ef4444",
//               color: "white",
//               border: "none",
//               borderRadius: "12px",
//               padding: "12px 16px",
//               cursor: "pointer",
//               fontSize: "14px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               transition: "all 0.3s ease",
//               width: "52px",
//               boxShadow: `0 4px 16px rgba(239,68,68,0.4)`,
//             }}
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ========================================
// // Blog Form (Create/Edit)
// // ========================================
// const BlogForm = ({ onNavigate, onSubmit, blogId, title, colors }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     category: "",
//     content: "",
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Load existing blog data for edit
//   useEffect(() => {
//     if (blogId) {
//       const loadBlogData = async () => {
//         try {
//           const res = await getData(`blogs/${blogId}`);
//           if (res?.blog) {
//             const blog = res.blog;
//             setFormData({
//               title: blog.title || "",
//               slug: blog.slug || "",
//               category: blog.category || "",
//               content: blog.content || "",
//             });
//             setImagePreview(blog.imageurl);
//           }
//         } catch (err) {
//           console.log("Error loading blog", err);
//           toastError("Failed to load blog data");
//         }
//       };
//       loadBlogData();
//     }
//   }, [blogId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "title" && { slug: generateSlug(value) }),
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title.trim() || !formData.content.trim()) {
//       toastError("Title and content are required!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", formData.title.trim());
//       fd.append("content", formData.content.trim());
//       fd.append("slug", formData.slug || generateSlug(formData.title));
//       fd.append("category", formData.category?.trim() || "");

//       if (imageFile) {
//         fd.append("image", imageFile);
//       }

//       console.log("FormData being sent:");
//       for (let [key, value] of fd.entries()) {
//         console.log(key, value);
//       }

//       await onSubmit(blogId, fd);
//     } catch (err) {
//       console.error("Submit error", err);
//       toastError("Failed to submit blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ margin: "0 auto", maxWidth: "900px" }}>
//       {/* Back Button */}
//       <button
//         onClick={() => onNavigate("main")}
//         style={{
//           backgroundColor: colors.surface,
//           border: `1px solid ${colors.primary}20`,
//           borderRadius: "16px",
//           padding: "14px 24px",
//           display: "flex",
//           alignItems: "center",
//           gap: "12px",
//           cursor: "pointer",
//           marginBottom: "40px",
//           fontWeight: "600",
//           color: colors.textPrimary,
//           boxShadow: `0 4px 16px ${colors.primary}10`,
//           transition: "all 0.3s ease",
//         }}
//       >
//         <ArrowLeft size={22} color={colors.textPrimary} />
//         Back to Dashboard
//       </button>

//       {/* Form Card */}
//       <div
//         style={{
//           backgroundColor: colors.surface,
//           borderRadius: "28px",
//           padding: "60px",
//           boxShadow: `0 30px 80px ${colors.primary}10`,
//           border: `1px solid ${colors.primary}15`,
//           backdropFilter: "blur(20px)",
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "36px",
//             fontWeight: "700",
//             color: colors.textPrimary,
//             marginBottom: "40px",
//             lineHeight: "1.2",
//           }}
//         >
//           {title}
//         </h1>

//         <form onSubmit={handleSubmit}>
//           {/* Title Field */}
//           <div style={{ marginBottom: "32px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: colors.textPrimary,
//                 marginBottom: "12px",
//               }}
//             >
//               Blog Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Enter your blog title..."
//               style={{
//                 width: "100%",
//                 padding: "20px 24px",
//                 borderRadius: "16px",
//                 border: `2px solid ${colors.primary}20`,
//                 fontSize: "17px",
//                 backgroundColor: "white",
//                 transition: "all 0.3s ease",
//                 color: colors.textPrimary,
//                 fontWeight: "500",
//               }}
//               required
//             />
//           </div>

//           {/* Slug Field */}
//           <div style={{ marginBottom: "32px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: colors.textPrimary,
//                 marginBottom: "12px",
//               }}
//             >
//               Slug (URL)
//             </label>
//             <input
//               type="text"
//               name="slug"
//               value={formData.slug}
//               onChange={handleInputChange}
//               placeholder="Auto-generated from title"
//               style={{
//                 width: "100%",
//                 padding: "20px 24px",
//                 borderRadius: "16px",
//                 border: `2px solid ${colors.primary}20`,
//                 fontSize: "17px",
//                 backgroundColor: colors.background,
//                 color: colors.textSecondary,
//                 fontWeight: "500",
//               }}
//             />
//           </div>

//           {/* Category Field */}
//           <div style={{ marginBottom: "32px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: colors.textPrimary,
//                 marginBottom: "12px",
//               }}
//             >
//               Category
//             </label>
//             <input
//               type="text"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               placeholder="e.g. Technology, Programming, Design"
//               style={{
//                 width: "100%",
//                 padding: "20px 24px",
//                 borderRadius: "16px",
//                 border: `2px solid ${colors.primary}20`,
//                 fontSize: "17px",
//                 backgroundColor: "white",
//                 color: colors.textPrimary,
//                 fontWeight: "500",
//               }}
//             />
//           </div>

//           {/* Image Upload */}
//           <div style={{ marginBottom: "32px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: colors.textPrimary,
//                 marginBottom: "12px",
//               }}
//             >
//               Featured Image
//             </label>
//             <div
//               style={{
//                 width: "100%",
//                 padding: "24px",
//                 borderRadius: "16px",
//                 border: `2px dashed ${colors.primary}30`,
//                 backgroundColor: colors.background,
//                 cursor: "pointer",
//                 textAlign: "center",
//                 transition: "all 0.3s ease",
//                 color: colors.textSecondary,
//                 fontSize: "16px",
//               }}
//               onClick={() => document.getElementById("image-upload").click()}
//             >
//               <Upload
//                 size={32}
//                 color={colors.primary}
//                 style={{ marginBottom: "12px", display: "block" }}
//               />
//               {imagePreview
//                 ? "Change Image"
//                 : "Click to upload image (JPG, PNG, WebP)"}
//               <input
//                 id="image-upload"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{
//                   display: "none",
//                 }}
//               />
//             </div>
//             {imagePreview && (
//               <div style={{ marginTop: "24px" }}>
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   style={{
//                     width: "100%",
//                     height: "280px",
//                     borderRadius: "16px",
//                     objectFit: "cover",
//                     boxShadow: `0 12px 40px ${colors.primary}15`,
//                     border: `2px solid ${colors.primary}20`,
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div style={{ marginBottom: "48px" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 color: colors.textPrimary,
//                 marginBottom: "12px",
//               }}
//             >
//               Content *
//             </label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleInputChange}
//               rows={14}
//               placeholder="Write your blog content here... Use HTML tags for formatting (h2, p, strong, em, ul, ol, etc.)"
//               style={{
//                 width: "100%",
//                 padding: "24px",
//                 borderRadius: "16px",
//                 border: `2px solid ${colors.primary}20`,
//                 fontSize: "17px",
//                 fontFamily: "inherit",
//                 resize: "vertical",
//                 lineHeight: "1.7",
//                 backgroundColor: "white",
//                 color: colors.textPrimary,
//                 fontWeight: "500",
//                 minHeight: "300px",
//               }}
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
//               color: "white",
//               border: "none",
//               borderRadius: "16px",
//               padding: "22px 48px",
//               cursor: loading ? "not-allowed" : "pointer",
//               fontSize: "18px",
//               fontWeight: "700",
//               display: "flex",
//               alignItems: "center",
//               gap: "16px",
//               margin: "0 auto",
//               boxShadow: `0 16px 40px ${colors.primary}50`,
//               opacity: loading ? 0.8 : 1,
//               transition: "all 0.3s ease",
//               width: "100%",
//               justifyContent: "center",
//             }}
//           >
//             <Save size={24} />
//             {loading
//               ? "Publishing..."
//               : blogId
//               ? "Update Blog"
//               : "Publish Blog"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ========================================
// // Blog View
// // ========================================
// const BlogView = ({ onNavigate, slug, colors }) => {
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         setLoading(true);
//         const res = await getData(`blogs/single/${slug}`);
//         setBlog(res.blog);
//       } catch (err) {
//         console.log(err);
//         toastError("Failed to load blog");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (slug) fetchBlog();
//   }, [slug]);

//   if (loading || !blog) {
//     return (
//       <div
//         style={{
//           minHeight: "80vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: colors.background,
//         }}
//       >
//         <div style={{ textAlign: "center", color: colors.textSecondary }}>
//           <FileText size={64} style={{ margin: "0 auto 24px", opacity: 0.6 }} />
//           <p style={{ fontSize: "18px" }}>Loading blog...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 100%)`,
//       }}
//     >
//       {/* Back Button */}
//       <div style={{ padding: "32px 40px 0" }}>
//         <button
//           onClick={() => onNavigate("list")}
//           style={{
//             backgroundColor: colors.surface,
//             border: `1px solid ${colors.primary}20`,
//             borderRadius: "16px",
//             padding: "14px 24px",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             cursor: "pointer",
//             fontWeight: "600",
//             color: colors.textPrimary,
//             boxShadow: `0 4px 16px ${colors.primary}10`,
//             transition: "all 0.3s ease",
//             width: "fit-content",
//           }}
//         >
//           <ArrowLeft size={22} color={colors.textPrimary} />
//           Back to Blogs
//         </button>
//       </div>

//       {/* Hero Section */}
//       <div
//         style={{
//           height: "500px",
//           background: `linear-gradient(135deg, rgba(19, 21, 35, 0.8), rgba(47, 62, 70, 0.6)), url(${blog.imageurl}) center/cover no-repeat`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "white",
//           textAlign: "center",
//           padding: "0 60px",
//           position: "relative",
//           borderRadius: "0 0 32px 32px",
//         }}
//       >
//         <div style={{ maxWidth: "1000px" }}>
//           {blog.category && (
//             <div
//               style={{
//                 backgroundColor: "rgba(255, 255, 255, 0.2)",
//                 padding: "12px 28px",
//                 borderRadius: "32px",
//                 display: "inline-block",
//                 marginBottom: "32px",
//                 fontSize: "15px",
//                 fontWeight: "700",
//                 backdropFilter: "blur(20px)",
//                 border: "1px solid rgba(255,255,255,0.3)",
//               }}
//             >
//               {blog.category}
//             </div>
//           )}
//           <h1
//             style={{
//               fontSize: "52px",
//               fontWeight: "800",
//               marginBottom: "24px",
//               lineHeight: "1.2",
//               textShadow: "0 4px 12px rgba(0,0,0,0.5)",
//             }}
//           >
//             {blog.title}
//           </h1>
//           <p
//             style={{
//               fontSize: "20px",
//               opacity: 0.95,
//               fontWeight: "500",
//             }}
//           >
//             Published on{" "}
//             {new Date(blog.createdat).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div
//         style={{
//           maxWidth: "1000px",
//           margin: "-100px auto 0",
//           padding: "0 60px 80px",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: colors.surface,
//             borderRadius: "32px",
//             padding: "100px 80px 80px",
//             boxShadow: `0 40px 100px ${colors.primary}15`,
//             border: `1px solid ${colors.primary}10`,
//             backdropFilter: "blur(20px)",
//             position: "relative",
//             zIndex: 2,
//           }}
//         >
//           <div
//             style={{
//               fontSize: "19px",
//               lineHeight: "1.9",
//               color: colors.textPrimary,
//               fontWeight: "400",
//             }}
//             dangerouslySetInnerHTML={{ __html: blog.content }}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div
//           style={{
//             display: "flex",
//             gap: "24px",
//             justifyContent: "center",
//             marginTop: "60px",
//             flexWrap: "wrap",
//           }}
//         >
//           <button
//             onClick={() => onNavigate("edit", blog.id)}
//             style={{
//               backgroundColor: colors.primaryDark,
//               color: "white",
//               border: "none",
//               borderRadius: "16px",
//               padding: "18px 36px",
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "700",
//               boxShadow: `0 12px 32px ${colors.primary}40`,
//               transition: "all 0.3s ease",
//             }}
//           >
//             <Edit size={22} />
//             Edit Blog
//           </button>
//           <button
//             onClick={() => onNavigate("list")}
//             style={{
//               backgroundColor: colors.surface,
//               border: `2px solid ${colors.primary}20`,
//               borderRadius: "16px",
//               padding: "18px 36px",
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "600",
//               boxShadow: `0 8px 24px ${colors.primary}15`,
//               color: colors.textPrimary,
//               transition: "all 0.3s ease",
//             }}
//           >
//             <ArrowLeft size={22} />
//             Back to Blogs
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const generateSlug = (title) => {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/[\s_-]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// };
// export default BlogManager;
