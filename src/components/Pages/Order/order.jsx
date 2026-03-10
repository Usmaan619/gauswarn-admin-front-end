import React, { useEffect, useState } from "react";
import OrderTable from "../../Common/OrderTable/ordertable";
import { getData } from "../../Common/APIs/api";

const Order = () => {
  const OrderHeadings = [
    "Order ID",
    "Customer Name",
    "Order Date",
    "Total Amount",
    "Payment Status",
    "Order Status",
    "Date",
    "Action",
  ];

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderAPI();
  }, []);

  const getOrderAPI = async () => {
    const endpoint = "getAllOrderDetails";
    try {
      const response = await getData(endpoint);
      if (response?.success) setOrders(response?.orderDetails || []);
    } catch (error) {
      console.error("error fetching orders: ", error);
    }
  };

  return (
    <div className="orders-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text">Orders Management</h2>
        <p className="text-secondary">View and manage all customer orders from here.</p>
      </div>
      
      <div className="glass-card p-4">
        <OrderTable
          ordersData={orders}
          headings={OrderHeadings}
          refresh={getOrderAPI}
        />
      </div>
    </div>
  );
};

export default Order;
