import React from "react";
import CustomerInfoForm from "../../Common/CustomerInfoForm/CustomerForm";
import { useSearchParams } from "react-router-dom";
import { FiUser } from "react-icons/fi";

const CustomerInfo = () => {
  const [searchParams] = useSearchParams();
  const customerData = JSON.parse(searchParams.get("customerData"));
  
  return (
    <div className="customer-info-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiUser className="text-info" />
          Customer Profile Details
        </h2>
        <p className="text-secondary">View and modify account information for {customerData?.name || 'Customer'}.</p>
      </div>

      <div className="glass-card p-5">
        <CustomerInfoForm CustomerInfoData={customerData} />
      </div>
    </div>
  );
};

export default CustomerInfo;
