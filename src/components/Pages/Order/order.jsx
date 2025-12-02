import React, { useEffect, useState } from "react";
import OrderTable from "../../Common/OrderTable/ordertable";
import SideBar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData } from "../../Common/APIs/api";
const Order = () => {
  const OrderHeadings = [
    "Order ID",
    "Customer Name",
    "Order Date",
    "Total Amount",
    "Payment Status",
    "Order Status",
  ];

  const [orders, setOrders] = useState([]);
  console.log("orders: ", orders);

  useEffect(() => {
    getOrderAPI();
  }, []);

  const getOrderAPI = async () => {
    const endpoint = "getAllOrderDetails";
    try {
      const response = await getData(endpoint);
      if (response?.success) setOrders(response?.orderDetails || []);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  return (
    <>
      <div className="container-fluid gauswarn-bg-color  min-vh-100 ">
        <Navbar />
        <div className="row">
          <div className="col-lg-2">
            <SideBar />
          </div>
          <div className="col-lg-10 px-lg-5">
            {/* <p className='inter-font-family-500 font-20 text-drak-blue-colo'>Navbar</p> */}
            <OrderTable ordersData={orders} headings={OrderHeadings} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
