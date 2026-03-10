import React from "react";
import ProductTable from "../../Common/ProductTable/productTable";
import { FiPackage } from "react-icons/fi";

const Product = () => {
  return (
    <div className="product-list-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiPackage className="text-info" />
          Product Inventory
        </h2>
        <p className="text-secondary">View and manage your entire product catalog, stock levels, and variants.</p>
      </div>

      <div className="glass-card p-4">
        <ProductTable />
      </div>
    </div>
  );
};

export default Product;
