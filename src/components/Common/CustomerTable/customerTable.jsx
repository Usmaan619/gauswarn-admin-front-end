import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "react-bootstrap/Pagination";
import {
  IoIosSearch,
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoIosArrowDown,
} from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { PiPencilSimple } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { NavLink } from "react-router-dom";



// Rajlaxmi-Admin-Panel/src/components/Assets/Images/Logo/mainlogo.png

const CustomerTable = ({ CustomerData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const itemsPerPage = 8;

  const filteredProducts = CustomerData?.filter((item) => {
    const nameMatch = item.user_name
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const pincodeMatch = String(item.user_pincode)
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const filterCondition =
      selectedFilter === "All"
        ? true
        : selectedFilter === "In Stock"
          ? item.user_landmark !== "Out Of location"
          : item.user_landmark === "Out Of location";

    return (nameMatch || pincodeMatch) && filterCondition;
  });

  const totalPages = Math?.ceil(filteredProducts?.length / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const isRajlaxmi = window.location.pathname.includes("rajlaxmi");

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      {!CustomerData?.length ? (
        <div className="text-center d-flex flex-column align-items-center ">
          <div className="text-secondary opacity-50"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="150" width="150" xmlns="http://www.w3.org/2000/svg"><path d="M490.8 459.1L248.6 209.6c-4.6-4.8-12-5-16.8-.4-4.8 4.6-5 12-.4 16.8L473.6 475.5c4.7 4.9 12 5.1 16.9.4 4.8-4.7 5.1-12 .3-16.8zM245.8 196.5l-4-4.2C188.7 136.2 113.3 103.3 35.5 103.3c-6.6 0-12 5.4-12 12s5.4 12 12 12c58.2 0 112 18 152.1 50.8l.2.2 45.4 46.8-93.5 96.6c-11.8-8.2-26.6-13.1-42.5-13.1-39.7 0-72 32.3-72 72s32.3 72 72 72 72-32.3 72-72c0-10.4-2.2-20.2-6.1-29.1l80-82.6c13.7 12.3 22.3 30.2 22.3 50.1 0 37.5-30.5 68-68 68h-112c-6.6 0-12 5.4-12 12s5.4 12 12 12h112c50.8 0 92-41.2 92-92 0-30.3-14.7-57.2-37.4-74.4l30.2-31.2z"></path></svg></div>
          <h3>No Customer Data Found</h3>
        </div>
      ) : (

        <div className="recent-table bg-white">
          <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
            Customer
          </p>

          {/* Filters */}
          <form className="row gy-3 px-lg-5 px-3 pb-4 pt-2 w-100">
            {/* <div className="col-12 col-sm-6 col-lg-2">
              <Dropdown className='border rounded-3 w-100'>
                <Dropdown.Toggle variant="white" className="d-flex justify-content-between align-items-center w-100">
                  <span>{selectedFilter || "Filter"}</span>
                  <span className="ms-auto"><IoIosArrowDown /></span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='w-100'>
                  <Dropdown.Item onClick={() => setSelectedFilter('')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Pending')}>Pending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Shipped')}>Shipped</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Delivered')}>Delivered</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Cancel')}>Cancel</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div> */}

            <div className='col-lg-4'>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><IoIosSearch /></span>
                <input
                  className="form-control border border-start-0"
                  type="search"
                  placeholder="Search by Name or CustomerID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </form>

          <div className="table-responsive customer-table-wrapper">
            <table className="table text-nowrap fixed-table">
              <thead className="text-center">
                <tr>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Customer ID
                  </th>
                  <th className="text-start text-dark-silver-color inter-font-family-500 align-middle ps-5">
                    <div className="d-flex align-items-center">Name</div>
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Location
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Pincode
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Amount
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {paginatedProducts?.map((c, index) => (
                  <tr key={index}>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.user_id}
                    </td>

                    <td className="text-murmaid-color inter-font-family-400 align-middle ps-5">
                      <div className="d-flex align-items-center">
                        {c?.user_name}
                      </div>
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.user_landmark}, {c?.user_city}, {c?.user_state}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.user_pincode}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      ₹ {c?.user_total_amount ?? "-"}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      <div className="d-flex align-items-center justify-content-center">
                        <NavLink
                          to={`/customerinfo?customerData=${JSON.stringify(c)}`}
                        >
                          <span className="border-2 border eye-icon-color fs-5 p-1 rounded-3 d-flex align-items-center justify-content-center">
                            <IoEyeOutline />
                          </span>
                        </NavLink>
                        {isRajlaxmi && (
                          <>
                            <NavLink to={"/customerinfo"}>
                              <span className="border-2 border edit-icon-color fs-5 p-1 rounded-3 mx-3 d-flex align-items-center justify-content-center">
                                <PiPencilSimple />
                              </span>
                            </NavLink>
                            <span
                              className="border-2 border trash-icon-color fs-5 p-1 rounded-3 d-flex align-items-center justify-content-center"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <RiDeleteBinLine />
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Render Empty Rows if needed to fill the table */}
                {Array.from({
                  length: itemsPerPage - paginatedProducts?.length,
                }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td colSpan="6" className="empty_row"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex align-items-center justify-content-left">
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
        </div>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <p
                className="modal-title font-16 inter-font-family-600 text-murmaid-color"
                id="exampleModalLabel"
              >
                Delete Items
              </p>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body inter-font-family-400 text-murmaid-color font-14 pt-0">
              Are you sure you want to delete 4 selected items?
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="font-12 inter-font-family-400 text-murmaid-color border-0 bg-transparent"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="border-0 px-3 py-2 rounded font-12 inter-font-family-500 text-murmaid-color bg-light-green-color"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerTable;
