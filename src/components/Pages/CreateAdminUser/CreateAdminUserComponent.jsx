import React, { useState } from "react";
import axios from "axios";

const ROLES = ["super_admin", "admin", "manager", "user"];

const PERMISSION_LIST = [
  { id: "orders", label: "Orders" },
  { id: "all", label: "All" },
  { id: "b2b", label: "B2B Inquiry" },
  { id: "blogs", label: "Blogs" },
  { id: "users", label: "User Management" },
  { id: "banners", label: "Home Banners" },
  { id: "reels", label: "Reels" },
  { id: "products", label: "Products" },
  { id: "customers", label: "Customers" },
  { id: "contact", label: "Contact" },
  { id: "feedback", label: "Feedback" },
];

const CreateAdminUser = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    password: "",
    role: "",
    permissions: [],
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePermission = (permission) => {
    const exist = formData.permissions.includes(permission);

    if (exist) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    }
  };

  const createUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      alert("Request failed");
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mb-5">
      <input
        name="full_name"
        placeholder="Full Name"
        className="form-control mb-3"
        value={formData.full_name}
        onChange={handleInput}
      />

      <input
        name="email"
        placeholder="Email"
        className="form-control mb-3"
        value={formData.email}
        onChange={handleInput}
      />

      <input
        name="mobile_number"
        placeholder="Mobile Number"
        className="form-control mb-3"
        value={formData.mobile_number}
        onChange={handleInput}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="form-control mb-3"
        value={formData.password}
        onChange={handleInput}
      />

      <select
        name="role"
        className="form-select mb-4"
        value={formData.role}
        onChange={handleInput}
      >
        <option value="">Select Role</option>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <label className="fw-bold">Permissions:</label>
      <div className="row">
        {PERMISSION_LIST.map((item) => (
          <div key={item.id} className="col-6 mb-2">
            <label>
              <input
                type="checkbox"
                checked={formData.permissions.includes(item.id)}
                onChange={() => togglePermission(item.id)}
              />
              &nbsp; {item.label}
            </label>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mt-4" onClick={createUser}>
        Create Admin User
      </button>
    </div>
  );
};

export default CreateAdminUser;
