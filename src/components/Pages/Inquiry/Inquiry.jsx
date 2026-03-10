import React, { useEffect, useState } from "react";
import InquiryTable from "./inquiryTable";
import { getData } from "../../Common/APIs/api";
import { FiBriefcase } from "react-icons/fi";

const Inquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  useEffect(() => {
    getInquiriesAPI();
  }, [filters]);

  const getInquiriesAPI = async () => {
    try {
      const endpoint = `getb2bInquiries?page=${filters.page}&limit=${filters.limit}&search=${filters.search}&status=${filters.status}`;
      const response = await getData(endpoint);

      if (response?.success) {
        setInquiries(response.data || []);
        setPagination(response.pagination || {});
      }
    } catch (error) {
      console.error("Inquiry Fetch Error:", error);
    }
  };

  return (
    <div className="inquiry-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiBriefcase className="text-info" />
          B2B Inquiries
        </h2>
        <p className="text-secondary">Manage wholesale and business inquiry requests from potential partners.</p>
      </div>

      <div className="glass-card p-4">
        <InquiryTable
          inquiries={inquiries}
          pagination={pagination}
          filters={filters}
          setFilters={setFilters}
          refresh={getInquiriesAPI}
        />
      </div>
    </div>
  );
};

export default Inquiry;
