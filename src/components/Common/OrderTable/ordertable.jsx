import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "react-bootstrap/Pagination";
import {
  IoIosSearch,
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoIosArrowDown,
} from "react-icons/io";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png"; // ✅ make sure path is correct

const OrderTable = ({ ordersData = [], headings = [] }) => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredOrders = ordersData?.filter((order) => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesSearch =
      order?.user_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      order?.user_id?.toString()?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="recent-table bg-white d-flex flex-column w-100">
      <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
        Orders History
      </p>

      {/* Filters */}

      <form className="row gy-3 px-lg-5 px-4 pb-4 pt-2 w-100">
        <div className="col-12  col-lg-2">
          <Dropdown className='border rounded-3 w-100'>
            <Dropdown.Toggle variant="white" className="d-flex justify-content-between align-items-center w-100">
              <span>{statusFilter || "Filter"}</span>
              <span className="ms-auto"><IoIosArrowDown /></span>
            </Dropdown.Toggle>
            <Dropdown.Menu className='w-100'>
              <Dropdown.Item onClick={() => setStatusFilter('')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('Pending')}>Pending</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('Shipped')}>Shipped</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('Delivered')}>Delivered</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('Cancel')}>Cancel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className='col-lg-4'>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><IoIosSearch /></span>
            <input
              className="form-control border border-start-0"
              type="search"
              placeholder="Search by Name or OrderID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </form>

      {/* Table Section */}
      <div className="recent-table-content px-2 w-100">
        <div className="table-responsive">
          <table className="table text-nowrap">
            <thead className="text-center">
              <tr>
                {headings.map((head, index) => (
                  <th
                    key={index}
                    className="text-dark-silver-color inter-font-family-500 align-middle px-3"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-center">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={headings.length} className="py-5">
                    <div className="text-center d-flex flex-column align-items-center">
                      <img
                        src={noDataImg}
                        alt="No Data"
                        className="no-data-img mb-3"
                      />
                      <h3 className="text-dark">No Records Found</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr key={index} style={{ height: "60px" }}>
                    <td className="text-murmaid-color inter-font-family-400 p-3 align-middle">
                      {order?.user_id}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 align-middle">
                      {order?.user_name}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 align-middle">
                      {new Date(order?.DATE || order?.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 align-middle">
                      ₹ {order?.user_total_amount}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 align-middle">
                      {order?.isPaymentPaid === "1" ? "Paid" : "Unpaid"}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 align-middle">
                      <span
                        className={`rounded-circle status-spot me-2 ${getStatusSpotClass(
                          order?.status
                        )}`}
                      ></span>
                      {order?.status || order?.STATUS}
                    </td>
                  </tr>
                ))
              )}

              {/* Empty rows to maintain spacing */}
              {paginatedOrders.length > 0 &&
                Array.from({
                  length: itemsPerPage - paginatedOrders.length,
                }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td colSpan={headings.length} className="empty_row"></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {paginatedOrders.length > 0 && (
          <div className="d-flex align-items-center justify-content-left mt-auto mb-3 px-3">
            <Pagination className="border-0">
              <Pagination.Prev
                className="fs-3"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IoIosArrowRoundBack />
              </Pagination.Prev>

              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                className="fs-3"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <IoIosArrowRoundForward />
              </Pagination.Next>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
