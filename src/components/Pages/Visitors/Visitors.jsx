import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import VisitorsTable from "./VisitorsTable";
import { getData } from "../../Common/APIs/api";

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVisitorsAPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getData("list-visitors");
      if (response?.success) {
        setVisitors(response.visitors || []);
      }
    } catch (error) {
      console.error("Visitor Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getVisitorsAPI();
  }, [getVisitorsAPI]);

  return (
    <div className="container-fluid gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row py-2">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5">
          <VisitorsTable
            visitors={visitors}
            loading={loading}
            refresh={getVisitorsAPI}
          />
        </div>
      </div>
    </div>
  );
};

export default Visitors;
