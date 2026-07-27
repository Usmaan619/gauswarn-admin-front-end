import React, { useState } from "react";
import { postData } from "../../Common/APIs/api";
import Pagination from "react-bootstrap/Pagination";

import moment from "moment/moment";

const OrderTable = ({ ordersData = [], headings = [], refresh = () => {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter] = useState("");
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
                    <div className="text-secondary opacity-50"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="150" width="150" xmlns="http://www.w3.org/2000/svg"><path d="M490.8 459.1L248.6 209.6c-4.6-4.8-12-5-16.8-.4-4.8 4.6-5 12-.4 16.8L473.6 475.5c4.7 4.9 12 5.1 16.9.4 4.8-4.7 5.1-12 .3-16.8zM245.8 196.5l-4-4.2C188.7 136.2 113.3 103.3 35.5 103.3c-6.6 0-12 5.4-12 12s5.4 12 12 12c58.2 0 112 18 152.1 50.8l.2.2 45.4 46.8-93.5 96.6c-11.8-8.2-26.6-13.1-42.5-13.1-39.7 0-72 32.3-72 72s32.3 72 72 72 72-32.3 72-72c0-10.4-2.2-20.2-6.1-29.1l80-82.6c13.7 12.3 22.3 30.2 22.3 50.1 0 37.5-30.5 68-68 68h-112c-6.6 0-12 5.4-12 12s5.4 12 12 12h112c50.8 0 92-41.2 92-92 0-30.3-14.7-57.2-37.4-74.4l30.2-31.2z"></path></svg></div>
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
                  <td>{moment(order?.DATE).format("MM/DD/YYYY")}</td>

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
              {/* HEADER */}
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setViewData(null)}
                ></button>
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* BASIC DETAILS */}
                <div className="mb-3">
                  <p className="mb-1">
                    <strong>Name:</strong> {viewData.user_name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {viewData.user_email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {viewData.user_mobile_num}
                  </p>

                  <p className="mb-1">
                    <strong>Order Amount:</strong> ₹{viewData.user_total_amount}
                  </p>

                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        viewData.STATUS === "captured"
                          ? "badge bg-success"
                          : viewData.STATUS === "failed"
                            ? "badge bg-danger"
                            : "badge bg-secondary"
                      }
                    >
                      {viewData.STATUS}
                    </span>
                  </p>
                </div>

                {/* ADDRESS */}
                <div className="mb-3">
                  <strong>Address:</strong>
                  <div>
                    {viewData.user_house_number && (
                      <>
                        {viewData.user_house_number}
                        <br />
                      </>
                    )}
                    {viewData.user_landmark && (
                      <>
                        {viewData.user_landmark}
                        <br />
                      </>
                    )}
                    {viewData.user_city && viewData.user_state && (
                      <>
                        {viewData.user_city}, {viewData.user_state} -{" "}
                        {viewData.user_pincode}
                        <br />
                      </>
                    )}
                    {viewData.user_country && <>{viewData.user_country}</>}
                  </div>
                </div>

                {/* PAYMENT DETAILS (PARSED JSON) */}
                {(() => {
                  let payment = null;

                  try {
                    if (viewData.paymentDetails) {
                      // paymentDetails string hai to JSON.parse karenge
                      payment =
                        typeof viewData.paymentDetails === "string"
                          ? JSON.parse(viewData.paymentDetails)
                          : viewData.paymentDetails;
                    }
                  } catch (err) {
                  }

                  if (!payment) {
                    return (
                      <div className="alert alert-warning">
                        Payment details not available.
                      </div>
                    );
                  }

                  // Amount paise me hota hai (e.g. 239800 = ₹2398.00)
                  const amount = payment.amount
                    ? (payment.amount / 100).toFixed(2)
                    : null;
                  const amountCaptured = payment.amount_captured
                    ? (payment.amount_captured / 100).toFixed(2)
                    : null;
                  const fee = payment.fee
                    ? (payment.fee / 100).toFixed(2)
                    : null;
                  const tax = payment.tax
                    ? (payment.tax / 100).toFixed(2)
                    : null;

                  const createdAt = payment.created_at
                    ? new Date(payment.created_at * 1000).toLocaleString()
                    : null;

                  return (
                    <div className="card">
                      <div className="card-header">
                        <strong>Payment Details</strong>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-1">
                              <strong>Payment ID:</strong> {payment.id}
                            </p>
                            <p className="mb-1">
                              <strong>Order ID:</strong> {payment.order_id}
                            </p>
                            <p className="mb-1">
                              <strong>Method:</strong>{" "}
                              {payment.method?.toUpperCase()}
                            </p>
                            <p className="mb-1">
                              <strong>Status:</strong>{" "}
                              <span
                                className={
                                  payment.status === "captured"
                                    ? "badge bg-success"
                                    : payment.status === "failed"
                                      ? "badge bg-danger"
                                      : "badge bg-secondary"
                                }
                              >
                                {payment.status}
                              </span>
                            </p>
                            {createdAt && (
                              <p className="mb-1">
                                <strong>Payment Date & Time:</strong>{" "}
                                {createdAt}
                              </p>
                            )}
                          </div>

                          <div className="col-md-6">
                            {amount && (
                              <p className="mb-1">
                                <strong>Amount:</strong> ₹{amount}{" "}
                                {payment.currency && `(${payment.currency})`}
                              </p>
                            )}
                            {amountCaptured && (
                              <p className="mb-1">
                                <strong>Amount Captured:</strong> ₹
                                {amountCaptured}
                              </p>
                            )}
                            {fee && (
                              <p className="mb-1">
                                <strong>Gateway Fee:</strong> ₹{fee}
                              </p>
                            )}
                            {tax && (
                              <p className="mb-1">
                                <strong>Tax:</strong> ₹{tax}
                              </p>
                            )}
                            {payment.upi?.vpa && (
                              <p className="mb-1">
                                <strong>UPI ID:</strong> {payment.upi.vpa}
                              </p>
                            )}
                            {payment.acquirer_data?.rrn && (
                              <p className="mb-1">
                                <strong>RRN:</strong>{" "}
                                {payment.acquirer_data.rrn}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Optional: Notes / Extra Info */}
                        {payment.description && (
                          <p className="mt-2 mb-1">
                            <strong>Description:</strong> {payment.description}
                          </p>
                        )}

                        {payment.notes && (
                          <div className="mt-3">
                            <strong>Notes:</strong>

                            {/* CART ITEMS */}
                            {payment.notes.cart &&
                              Array.isArray(payment.notes.cart) && (
                                <div className="mt-2">
                                  <strong>Cart Items:</strong>
                                  <table className="table table-bordered mt-2">
                                    <thead>
                                      <tr>
                                        <th>Image</th>
                                        <th>Product ID</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {payment.notes.cart.map((item, i) => (
                                        <tr key={i}>
                                          <td>
                                            <img
                                              src={item.product_image}
                                              alt="product"
                                              width="50"
                                            />
                                          </td>
                                          <td>{item.product_id}</td>
                                          <td>₹{item.product_price}</td>
                                          <td>{item.product_quantity}</td>
                                          <td>₹{item.product_total_amount}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                            {/* OTHER NOTES */}
                            <ul className="mb-0">
                              {Object.entries(payment.notes)
                                .filter(([key]) => key !== "cart")
                                .map(([key, value]) => (
                                  <li key={key}>
                                    <strong>{key}:</strong> {String(value)}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* FOOTER */}
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
