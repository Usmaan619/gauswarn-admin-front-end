import React, { useState, useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";

import moment from "moment";

const ITEMS_PER_PAGE = 10;

const ContactTable = React.memo(({ ContactData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ContactData.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const paginatedContact = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return ContactData.slice(start, start + ITEMS_PER_PAGE);
  }, [ContactData, currentPage]);

  if (!ContactData.length) {
    return (
      <div className="text-center d-flex flex-column align-items-center">
        <div className="text-secondary opacity-50"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="150" width="150" xmlns="http://www.w3.org/2000/svg"><path d="M490.8 459.1L248.6 209.6c-4.6-4.8-12-5-16.8-.4-4.8 4.6-5 12-.4 16.8L473.6 475.5c4.7 4.9 12 5.1 16.9.4 4.8-4.7 5.1-12 .3-16.8zM245.8 196.5l-4-4.2C188.7 136.2 113.3 103.3 35.5 103.3c-6.6 0-12 5.4-12 12s5.4 12 12 12c58.2 0 112 18 152.1 50.8l.2.2 45.4 46.8-93.5 96.6c-11.8-8.2-26.6-13.1-42.5-13.1-39.7 0-72 32.3-72 72s32.3 72 72 72 72-32.3 72-72c0-10.4-2.2-20.2-6.1-29.1l80-82.6c13.7 12.3 22.3 30.2 22.3 50.1 0 37.5-30.5 68-68 68h-112c-6.6 0-12 5.4-12 12s5.4 12 12 12h112c50.8 0 92-41.2 92-92 0-30.3-14.7-57.2-37.4-74.4l30.2-31.2z"></path></svg></div>
        <h3>No Contact Data Found</h3>
      </div>
    );
  }

  return (
    <div className="recent-table bg-white">
      <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
        Contact
      </p>

      {/* ===== TABLE ===== */}
      <div className="table-responsive">
        <table
          className="table text-nowrap align-middle"
          style={{ minWidth: "1100px" }}
        >
          <thead className="text-center">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Create Date</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {paginatedContact.map((item, index) => (
              <tr key={item.id ?? `${item.user_email}-${index}`}>
                <td>{item.user_name || "-"}</td>
                <td>{item.user_email || "-"}</td>
                <td>{item.user_mobile || "-"}</td>
                <td>{item.user_subject || "-"}</td>
                <td>
                  {item.created_at
                    ? moment(item.created_at).format(
                        "DD MMM YYYY, hh:mm A",
                      )
                    : "-"}
                </td>
                <td
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                  title={item.user_message}
                >
                  {item.user_message || "-"}
                </td>
              </tr>
            ))}

            {/* ===== EMPTY ROWS ===== */}
            {Array.from({
              length: ITEMS_PER_PAGE - paginatedContact.length,
            }).map((_, i) => (
              <tr key={`empty-${i}`} style={{ height: "52px" }}>
                <td colSpan="6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="d-flex p-3 align-items-center">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
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
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <IoIosArrowRoundForward />
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </div>
  );
});

export default ContactTable;
