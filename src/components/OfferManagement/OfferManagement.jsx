import React from "react";
import OfferTable from "./OfferTable";
import { FiTag } from "react-icons/fi";

const OfferManagement = () => {
  return (
    <div className="offer-management-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiTag className="text-info" />
          Promotion Banners
        </h2>
        <p className="text-secondary">Create and manage your limited-time offers and coupon banners.</p>
      </div>

      <div className="glass-card p-4">
        <OfferTable />
      </div>
    </div>
  );
};

export default OfferManagement;
