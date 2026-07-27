import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import FeedbackCard from "../../Common/feedbackCard/feedbackcard";
import Navbar from "../../Common/Navbar/navbar";
import { getData } from "../../Common/APIs/api";



const Feedback = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getFeedbacksAPI();
  }, []);

  const getFeedbacksAPI = async () => {
    const endpoint = "/allfeedback";
    try {
      const response = await getData(endpoint);
      setReviews(response?.reviews || []);
    } catch (error) { }
  };

  const handleFeedbackDelete = (id) => {
    setReviews((prev) => prev.filter((review) => review._id !== id));
    getFeedbacksAPI();
  };

  return (
    <>
      <div className="container-fluid gauswarn-bg-color min-vh-100">
        <Navbar />
        <div className="row py-2">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10 px-lg-5 d-flex justify-content-center">
            {reviews?.length === 0 ? (
              <div className="text-center d-flex flex-column align-items-center my-5">
                <div className="text-secondary opacity-50"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="150" width="150" xmlns="http://www.w3.org/2000/svg"><path d="M490.8 459.1L248.6 209.6c-4.6-4.8-12-5-16.8-.4-4.8 4.6-5 12-.4 16.8L473.6 475.5c4.7 4.9 12 5.1 16.9.4 4.8-4.7 5.1-12 .3-16.8zM245.8 196.5l-4-4.2C188.7 136.2 113.3 103.3 35.5 103.3c-6.6 0-12 5.4-12 12s5.4 12 12 12c58.2 0 112 18 152.1 50.8l.2.2 45.4 46.8-93.5 96.6c-11.8-8.2-26.6-13.1-42.5-13.1-39.7 0-72 32.3-72 72s32.3 72 72 72 72-32.3 72-72c0-10.4-2.2-20.2-6.1-29.1l80-82.6c13.7 12.3 22.3 30.2 22.3 50.1 0 37.5-30.5 68-68 68h-112c-6.6 0-12 5.4-12 12s5.4 12 12 12h112c50.8 0 92-41.2 92-92 0-30.3-14.7-57.2-37.4-74.4l30.2-31.2z"></path></svg></div>
                <h3>No Feedback Found</h3>
              </div>
            ) : (
              <FeedbackCard data={reviews} onDelete={handleFeedbackDelete} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Feedback;
