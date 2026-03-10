import React, { useEffect, useState } from "react";
import NewsletterTable from "./NewsletterTable";
import { getData } from "../../Common/APIs/api";
import { FiMail } from "react-icons/fi";

const NewsletterPage = () => {
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  useEffect(() => {
    loadNewsletter();
  }, [filters]);

  const loadNewsletter = async () => {
    try {
      const endpoint = `getNewsletter?page=${filters.page}&limit=${filters.limit}&search=${filters.search}&status=${filters.status}`;
      const res = await getData(endpoint);
      if (res?.success) {
        setList(res.data || []);
        setPagination(res.pagination || {});
      }
    } catch (error) {
      console.error("Error loading newsletters:", error);
    }
  };

  return (
    <div className="newsletter-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiMail className="text-info" />
          Newsletter Subscribers
        </h2>
        <p className="text-secondary">Keep track of your email marketing audience and subscriptions.</p>
      </div>

      <div className="glass-card p-4">
        <NewsletterTable
          data={list}
          pagination={pagination}
          filters={filters}
          setFilters={setFilters}
          refresh={loadNewsletter}
        />
      </div>
    </div>
  );
};

export default NewsletterPage;
