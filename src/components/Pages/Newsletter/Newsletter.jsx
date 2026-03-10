import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import NewsletterTable from "./NewsletterTable";
import { getData } from "../../Common/APIs/api";

const NewsletterPage = () => {
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const loadNewsletter = useCallback(async () => {
    const endpoint = `getNewsletter?page=${filters.page}&limit=${filters.limit}&search=${filters.search}&status=${filters.status}`;
    const res = await getData(endpoint);

    if (res?.success) {
      setList(res.data);
      setPagination(res.pagination);
    }
  }, [filters]);

  useEffect(() => {
    loadNewsletter();
  }, [loadNewsletter]);

  return (
    <div className="container-fluid gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row py-2">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5">
          <NewsletterTable
            data={list}
            pagination={pagination}
            filters={filters}
            setFilters={setFilters}
            refresh={loadNewsletter}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
