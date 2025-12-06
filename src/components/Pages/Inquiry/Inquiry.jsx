import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";

import InquiryTable from "./inquiryTable";
import { getData } from "../../Common/APIs/api";

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
      setPagination(response.pagination);
    }
  } catch (error) {
    console.log("Inquiry Fetch Error:", error);
  }
};


  return (
    <div className="container-fluid gauswarn-bg-color min-vh-100">
      <Navbar />

      <div className="row py-2">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 px-lg-5">
          <InquiryTable
            inquiries={inquiries}
            pagination={pagination}
            filters={filters}
            setFilters={setFilters}
            refresh={getInquiriesAPI}
          />
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
