import React from "react";

const RecentOrderTable = ({ RecentOrderTableData = [] }) => {
  const getStatusSpotClass = (status) => {
    switch (status) {
      case "Pending":
        return "yellow-spot";
      case "Cancel":
        return "red-spot";
      case "Shipped":
        return "blue-spot";
      case "captured":
        return "green-spot";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="recent-table box-shadow bg-white">
        <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
          Recent Table
        </p>
        <div className="table-responsive">
          <table className="table text-nowrap px-3">
            <thead className="text-center">
              <tr>
                <th className="text-dark-silver-color inter-font-family-500">
                  Order ID.
                </th>
                <th className="text-dark-silver-color inter-font-family-500">
                  Customer
                </th>
                <th className="text-dark-silver-color inter-font-family-500">
                  Date
                </th>
                <th className="text-dark-silver-color inter-font-family-500">
                  Amount
                </th>
                <th className="text-dark-silver-color inter-font-family-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="text-center">
              {RecentOrderTableData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    <strong>No Data Found</strong>
                  </td>
                </tr>
              ) : (
                RecentOrderTableData.map((order, index) => (
                  <tr key={index}>
                    <th className="text-murmaid-color inter-font-family-400 py-3 px-3">
                      {order?.user_id}
                    </th>
                    <td className="text-murmaid-color inter-font-family-400 py-3 px-3">
                      {order?.user_name}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 py-3 px-3">
                      {new Date(order.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 py-3 px-3">
                      {order.user_total_amount}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 py-3 px-3">
                      <span
                        className={`rounded-circle status-spot me-2 ${getStatusSpotClass(
                          order.status
                        )}`}
                      ></span>
                      {order.isPaymentPaid === "1" ? "Paid" : "Unpaid"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RecentOrderTable;
