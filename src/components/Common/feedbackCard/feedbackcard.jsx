import React, { useState } from "react";
import "./feebdack.css";

import { RiDeleteBinLine } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { deleteData } from "../APIs/api";
import { toastError, toastSuccess } from "../../../Services/toast.service";
import { clossModalById } from "../../../utils/helper";

const FeedbackCard = React.memo(({ data, onDelete }) => {
  const [feedbackId, setFeedbackId] = useState(null);
  const endpoint = "deleteFeedbackById";

  const deleteFeedbackById = async () => {
    try {
      const response = await deleteData(endpoint, feedbackId);
      if (response?.success) {
        await clossModalById("CloseModalFeedback");
        onDelete(feedbackId);
        setFeedbackId(null);
        toastSuccess(response?.message);
      }
    } catch (error) {
      toastError(error?.message);
    }
  };

  return (
    <>
      <div className="feedback-wrapper row gx-0">
        {data.map((item, idx) => (
          <div className="col-12 col-md-6 p-3" key={idx}>
            <div className="feedback-card bg-white p-3 box-shadow d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div className="d-flex gap-3 align-items-center">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: "30px", height: "30px"}}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="15" width="15" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></div>
                  <div>
                    <div className="inter-font-family-600 font-14 text-murmaid-color name-text">
                      {item?.name}
                    </div>
                    <div className="text-dark-silver-color font-12 inter-font-family-300">
                      {item?.date}
                    </div>
                  </div>
                </div>
                <div className="star-group d-flex gap-1 mt-2 mt-md-0">
                  {[...Array(item?.rating)].map((_, i) => (
                    <FaStar key={i} className="star-group svg" size={14} />
                  ))}
                </div>
              </div>

              <p className="text-murmaid-color inter-font-family-400 font-14 mt-2 mb-3">
                {item?.feedback}
              </p>

              <button
                className="btn btn-sm delete-btn align-self-end d-flex justify-content-center align-items-center px-3 inter-font-family-400 font-12"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setFeedbackId(item?.id);
                }}
              >
                <RiDeleteBinLine className="me-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete this feedback?
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="font-12 inter-font-family-400 text-murmaid-color border-0 bg-transparent"
                data-bs-dismiss="modal"
                id="CloseModalFeedback"
              >
                Cancel
              </button>
              <button
                type="button"
                className="border-0 px-3 py-2 rounded font-12 inter-font-family-500 text-murmaid-color bg-light-green-color"
                onClick={deleteFeedbackById}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default FeedbackCard;
