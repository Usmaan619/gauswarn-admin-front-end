import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import CustomerTable from "../../Common/CustomerTable/customerTable";
import { getData } from "../../Common/APIs/api";
const Customer = () => {
  const [customer, setCustomers] = useState([]);

  const getCustomerAPI = useCallback(async () => {
    const endpoint = "/getAllCustomer";
    try {
      const response = await getData(endpoint);
      if (response?.success) setCustomers(response?.customers || []);
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    getCustomerAPI();
  }, [getCustomerAPI]);

  return (
    <>
      <div className="container-fluid gauswarn-bg-color  min-vh-100">
        <Navbar />
        <div className="row">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10 px-lg-5">
            <CustomerTable CustomerData={customer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Customer;
