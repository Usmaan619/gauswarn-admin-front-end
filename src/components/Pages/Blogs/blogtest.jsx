import React, { useEffect, useState } from "react";
import { getData, postFormData, deleteData } from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  BookOpen,
} from "lucide-react";

// Main Blog Manager Component
const BlogManager = () => {
  const [currentView, setCurrentView] = useState("main");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogs = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await getData(`blogs?page=${pageNo}&limit=${limit}`);
      if (res?.blogs) {
        setBlogs(res.blogs);
        setPage(res.page || 1);
        const totalCount = res?.total || res?.count || res?.totalBlogs || res?.blogs?.length || 1;
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (err) {
      toastError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (id, blogData) => {
    try {
      await postFormData("/blogs/create", blogData);
      toastSuccess("Blog created successfully!");
      fetchBlogs();
      setCurrentView("list");
    } catch (err) {
      toastError("Failed to create blog");
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
    }
  };

  const handleNavigate = (view, id = null, slug = null) => {
    setCurrentView(view);
    setSelectedId(id);
    setSelectedSlug(slug);
    if (view === "list") fetchBlogs(1);
  };

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
    <div className="blog-manager-page fade-in">
      <div className="content-area">
        {renderCurrentView()}
      </div>
    </div>
  );
};

// ==================== BlogMain (4 Cards) ====================
const BlogMain = ({ onNavigate }) => {
  return (
    <div className="blog-main">
      <div className="page-header mb-5">
        <h1 className="glow-text d-flex align-items-center gap-2">
          <BookOpen className="text-info" />
          Content Hub
        </h1>
        <p className="text-secondary">Publish stories, news, and updates to engage your audience.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <ActionCard
            icon={<Plus size={24} />}
            title="Write Blog"
            description="Create and publish a new story"
            color="var(--success)"
            onClick={() => onNavigate("create")}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <ActionCard
            icon={<FileText size={24} />}
            title="Browse All"
            description="View and manage existing posts"
            color="var(--accent-blue)"
            onClick={() => onNavigate("list")}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <ActionCard
            icon={<Edit size={24} />}
            title="Edit Active"
            description="Update your published content"
            color="var(--warning)"
            onClick={() => onNavigate("list")}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <ActionCard
            icon={<Trash2 size={24} />}
            title="Recycle Bin"
            description="Manage deleted or hidden content"
            color="var(--danger)"
            onClick={() => onNavigate("list")}
          />
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, description, color, onClick }) => {
  return (
    <div 
      className="glass-card p-4 h-100 d-flex flex-column align-items-start gap-3" 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div 
        className="icon-wrapper p-3 rounded-4" 
        style={{ background: `rgba(${color === 'var(--success)' ? '16, 185, 129' : color === 'var(--accent-blue)' ? '0, 210, 255' : '239, 68, 68'}, 0.1)`, color: color }}
      >
        {icon}
      </div>
      <div>
        <h5 className="mb-2 fw-bold text-white">{title}</h5>
        <p className="small text-secondary m-0">{description}</p>
      </div>
    </div>
  );
};

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
    <div className="blog-list-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => onNavigate("main")}>
          <ArrowLeft size={18} /> Dashboard
        </button>
        <button className="btn btn-info px-4 d-flex align-items-center gap-2" onClick={() => onNavigate("create")}>
          <Plus size={18} /> New Blog
        </button>
      </div>

      <div className="page-header mb-4">
        <h2 className="glow-text">Published Blogs</h2>
        <p className="text-secondary">Found {filteredBlogs.length} matching articles.</p>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="search-bar position-relative">
          <Search size={18} className="position-absolute translate-middle-y top-50 ms-3 text-secondary" />
          <input
            type="text"
            className="form-control glass-card ps-5 py-3 text-white border-0"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!loading ? (
        <div className="row g-4">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="col-md-6 col-xl-4">
              <BlogCard blog={blog} onDelete={onDelete} onNavigate={onNavigate} />
            </div>
          ))}
          
          {filteredBlogs.length === 0 && (
            <div className="col-12 text-center py-5 glass-card">
              <FileText size={48} className="text-secondary opacity-20 mb-3" />
              <p className="text-secondary">No blogs found in this collection.</p>
            </div>
          )}

          {blogs.length > 0 && (
            <div className="col-12 d-flex justify-content-center gap-3 mt-4">
               <button disabled={page === 1} className="btn glass-card px-4" onClick={() => fetchBlogs(page - 1)}>Previous</button>
               <div className="d-flex align-items-center px-4 glass-card">Page {page} of {totalPages}</div>
               <button disabled={page === totalPages} className="btn glass-card px-4" onClick={() => fetchBlogs(page + 1)}>Next</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
          <p className="mt-3 text-secondary">Loading blogs...</p>
        </div>
      )}
    </div>
  );
};

const BlogCard = ({ blog, onDelete, onNavigate }) => {
  return (
    <div className="glass-card h-100 overflow-hidden">
      <div 
        className="blog-image-header w-100" 
        style={{ height: '180px', background: `url(${blog.image_url}) center/cover` }}
      />
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge glass-card text-info px-2 py-1 small">{blog.category || 'General'}</span>
          <small className="text-secondary">{new Date(blog.created_at).toLocaleDateString()}</small>
        </div>
        <h6 className="text-white fw-bold mb-4" style={{ height: '2.8rem', overflow: 'hidden' }}>{blog.title}</h6>
        
        <div className="d-flex gap-2">
           <button className="btn btn-sm glass-card flex-grow-1 text-white border-0 py-2 d-flex align-items-center justify-content-center gap-1" onClick={() => onNavigate("view", null, blog.slug)}>
             <Eye size={14} /> View
           </button>
           <button className="btn btn-sm glass-card flex-grow-1 text-white border-0 py-2 d-flex align-items-center justify-content-center gap-1" onClick={() => onNavigate("edit", blog.id)}>
             <Edit size={14} /> Edit
           </button>
           <button className="btn btn-sm glass-card text-danger border-0 px-3 py-2" onClick={() => onDelete(blog.id)}>
             <Trash2 size={14} />
           </button>
        </div>
      </div>
    </div>
  );
};

const BlogForm = ({ onNavigate, onSubmit, blogId, title }) => {
  const [formData, setFormData] = useState({ title: "", slug: "", category: "", content: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogId) loadBlogData();
  }, [blogId]);

  const loadBlogData = async () => {
    try {
      const res = await getData(`blogs/${blogId}`);
      if (res?.blog) {
        setFormData({
          title: res.blog.title || "",
          slug: res.blog.slug || "",
          category: res.blog.category || "",
          content: res.blog.content || "",
        });
        setImagePreview(res.blog.image_url || null);
      }
    } catch (err) {
      toastError("Failed to load blog data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') }),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("content", formData.content);
      fd.append("slug", formData.slug);
      fd.append("category", formData.category);
      if (imageFile) fd.append("image", imageFile);
      await onSubmit(blogId, fd);
    } catch (err) {
      toastError("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form-view">
      <button className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2" onClick={() => onNavigate("main")}>
        <ArrowLeft size={18} /> Cancel
      </button>

      <div className="glass-card p-5">
        <h2 className="glow-text mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-8">
            <div className="mb-4">
              <label className="form-label text-secondary small uppercase fw-bold">Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} className="form-control glass-card text-white border-0 py-3" style={{ background: 'rgba(255,255,255,0.05)' }} required />
            </div>
            <div className="mb-4">
              <label className="form-label text-secondary small uppercase fw-bold">Content</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} className="form-control glass-card text-white border-0 py-3" style={{ background: 'rgba(255,255,255,0.05)', minHeight: '300px' }} required />
            </div>
          </div>
          <div className="col-md-4">
             <div className="mb-4">
              <label className="form-label text-secondary small uppercase fw-bold">Image</label>
              <div className="image-upload-box glass-card position-relative overflow-hidden" style={{ minHeight: '200px', cursor: 'pointer' }} onClick={() => document.getElementById('blog-img').click()}>
                {imagePreview ? (
                  <img src={imagePreview} className="w-100 h-100 position-absolute" style={{ objectFit: 'cover' }} alt="preview" />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                    <Plus size={32} className="text-secondary" />
                    <span className="text-secondary small mt-2">Upload Cover</span>
                  </div>
                )}
                <input id="blog-img" type="file" onChange={handleImageChange} hidden />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label text-secondary small uppercase fw-bold">Category</label>
              <input name="category" value={formData.category} onChange={handleInputChange} className="form-control glass-card text-white border-0 py-3" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <button type="submit" className="btn btn-info w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              <Plus size={20} /> {loading ? 'Saving...' : (blogId ? 'Update Blog' : 'Publish Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogView = ({ onNavigate, slug }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (slug) loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      const res = await getData(`blogs/slug/${slug}`);
      if (res?.blog) setBlog(res.blog);
    } catch (err) {
      toastError("Failed to load blog");
    }
  };

  if (!blog) return <div className="text-center py-5"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="blog-view">
       <button className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2" onClick={() => onNavigate("list")}>
        <ArrowLeft size={18} /> Back to List
      </button>
      <div className="glass-card overflow-hidden">
        <div className="w-100" style={{ height: '400px', background: `url(${blog.image_url}) center/cover` }} />
        <div className="p-5">
           <div className="d-flex align-items-center gap-3 mb-4">
              <span className="badge glass-card text-info px-3 py-2">{blog.category}</span>
              <span className="text-secondary small">{new Date(blog.created_at).toLocaleDateString()}</span>
           </div>
           <h1 className="glow-text mb-4">{blog.title}</h1>
           <div className="blog-content text-secondary lh-lg" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
