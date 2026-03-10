import React, { useEffect, useState } from "react";
import CustomerTable from "../../Common/CustomerTable/customerTable";
import { getData } from "../../Common/APIs/api";
import { FiUsers } from "react-icons/fi";

const Customer = () => {
  const [customer, setCustomers] = useState([]);

  useEffect(() => {
    getCustomerAPI();
  }, []);

  const getCustomerAPI = async () => {
    const endpoint = "/getAllCustomer";
    try {
      const response = await getData(endpoint);
      if (response?.success) setCustomers(response?.customers || []);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  };

  return (
    <div className="customer-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiUsers className="text-info" />
          Customer Database
        </h2>
        <p className="text-secondary">Manage and review your complete customer base and their shopping history.</p>
      </div>

      <div className="glass-card p-4">
        <CustomerTable CustomerData={customer} />
      </div>
    </div>
  );
};

export default Customer;
