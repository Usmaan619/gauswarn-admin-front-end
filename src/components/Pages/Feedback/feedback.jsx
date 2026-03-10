import React, { useEffect, useState } from "react";
import FeedbackCard from "../../Common/feedbackCard/feedbackcard";
import { getData } from "../../Common/APIs/api";
import { FiStar, FiInbox } from "react-icons/fi";

const Feedback = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFeedbacksAPI();
  }, []);

  const getFeedbacksAPI = async () => {
    setLoading(true);
    const endpoint = "/allfeedback";
    try {
      const response = await getData(endpoint);
      setReviews(response?.reviews || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackDelete = (id) => {
    setReviews((prev) => prev.filter((review) => review._id !== id));
    getFeedbacksAPI();
  };

  return (
    <div className="feedback-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiStar className="text-info" />
          Customer Feedback
        </h2>
        <p className="text-secondary">Monitor your product ratings and reviews from verified customers.</p>
      </div>

      <div className="glass-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status"></div>
          </div>
        ) : reviews?.length === 0 ? (
          <div className="text-center py-5 opacity-20">
            <FiInbox size={64} className="mb-3" />
            <h3>No Feedback Found</h3>
            <p>Your library is currently empty.</p>
          </div>
        ) : (
          <FeedbackCard data={reviews} onDelete={handleFeedbackDelete} />
        )}
      </div>
    </div>
  );
};
export default Feedback;
