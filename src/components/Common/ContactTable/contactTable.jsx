import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";

const ContactTable = React.memo(({ ContactData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math?.ceil(ContactData?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const paginatedContact = ContactData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {!ContactData?.length ? (
        <div className="text-center d-flex flex-column align-items-center ">
          <img src={noDataImg} alt="No Data" className="no-data-img mb-3" />
          <h3>No Contact Data Found</h3>
        </div>
      ) : (
        <div className="recent-table bg-white">
          <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
            Contact
          </p>

          <div className="table-responsive">
            <table className="table text-nowrap align-middle">
              <thead className="text-center">
                <tr>
                  <th className="text-dark-silver-color inter-font-family-500 py-1 px-3">Name</th>
                  <th className="text-dark-silver-color inter-font-family-500 py-1 px-3">Email</th>
                  <th className="text-dark-silver-color inter-font-family-500 py-1 px-3">Phone</th>
                  <th className="text-dark-silver-color inter-font-family-500 py-1 px-3">Subject</th>
                  <th className="text-dark-silver-color inter-font-family-500 py-1 px-3">Message</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {paginatedContact?.map((item, index) => (
                  <tr key={index} style={{ height: "52px" }}>
                    <td className="text-murmaid-color inter-font-family-400 p-3 p-lg-2">{item?.user_name}</td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 p-lg-2">{item?.user_email}</td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 p-lg-2">{item?.user_mobile}</td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 p-lg-2">{item?.user_subject}</td>
                    <td className="text-murmaid-color inter-font-family-400 p-3 p-lg-2" title={item?.user_message}>
                      <span className="text-truncate">{item?.user_message}</span>
                    </td>
                  </tr>
                ))}

                {/* Empty rows to keep table height consistent */}
                {Array.from({ length: itemsPerPage - paginatedContact?.length }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ height: "52px" }}>
                    <td colSpan="5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex p-3 align-items-center justify-content-left mt-auto mb-3">
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
    </div>
  );
});

export default ContactTable;
