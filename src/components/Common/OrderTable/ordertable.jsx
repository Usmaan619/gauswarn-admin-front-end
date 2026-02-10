import React, { useState } from "react";
import { postData } from "../../Common/APIs/api";
import Pagination from "react-bootstrap/Pagination";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";

const OrderTable = ({ ordersData = [], headings = [], refresh = () => {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewData, setViewData] = useState(null);

  const itemsPerPage = 10;

  const getStatusSpotClass = (status) => {
    switch (status) {
      case "Pending":
        return "yellow-spot";
      case "Cancel":
        return "red-spot";
      case "Shipped":
        return "blue-spot";
      case "Delivered":
        return "green-spot";
      default:
        return "";
    }
  };

  // UPDATE ORDER STATUS
  const updateOrderStatus = async (id, status) => {
    await postData(`/updateOrderStatus/${id}`, { status });
    refresh();
  };

  // FILTER LOGIC
  const filteredOrders = ordersData.filter((order) => {
    const matchesStatus = statusFilter ? order.STATUS === statusFilter : true;

    const matchesPayment = paymentFilter
      ? paymentFilter === "paid"
        ? order.isPaymentPaid === "1"
        : order.isPaymentPaid === "0"
      : true;

    const matchesSearch =
      order?.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.user_id?.toString().includes(searchQuery);

    return matchesStatus && matchesSearch && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="recent-table bg-white d-flex flex-column w-100">
      <p className="p-3 recent-tble-header bg-light-green-color font-20">
        Orders History
      </p>

      {/* FILTERS */}
      <div className="d-flex gap-2 px-3 py-2 flex-wrap">
        {/* Payment Filter */}
        <select
          className="form-select w-auto"
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        {/* Search */}
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search name or ID"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="table-responsive px-2">
        <table className="table text-nowrap">
          <thead className="text-center">
            <tr>
              {headings.map((head, index) => (
                <th key={index}>{head}</th>
              ))}
            </tr>
          </thead>

          <tbody className="text-center">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={headings.length} className="py-5">
                  <div className="no-data text-center d-flex flex-column align-items-center">
                    <img
                      src={noDataImg}
                      alt="No Data"
                      className="no-data-img"
                    />
                    <h3 className="mt-3">No Records Found</h3>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order?.user_id}</td>
                  <td>{order?.user_name}</td>
                  <td>{new Date(order?.DATE).toLocaleDateString("en-GB")}</td>
                  <td>₹ {order?.user_total_amount}</td>
                  <td>{order?.isPaymentPaid === "1" ? "Paid" : "Unpaid"}</td>

                  <td className="align-middle">
                    <span
                      className={`rounded-circle status-spot me-2 ${getStatusSpotClass(
                        order.STATUS,
                      )}`}
                    ></span>

                    <select
                      className="form-select d-inline-block w-auto"
                      value={order.STATUS}
                      onChange={(e) =>
                        updateOrderStatus(order.user_id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setViewData(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {paginatedOrders.length > 0 && (
        <Pagination className="mx-3 my-3">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="modal show fade d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setViewData(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {viewData.user_name}
                </p>
                <p>
                  <strong>Email:</strong> {viewData.user_email}
                </p>
                <p>
                  <strong>Phone:</strong> {viewData.user_mobile_num}
                </p>
                <p>
                  <strong>Order Amount:</strong> ₹{viewData.user_total_amount}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
