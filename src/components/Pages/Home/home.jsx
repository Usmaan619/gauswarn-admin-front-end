import React, { useContext, useEffect, useState } from "react";
import SideBar from "../../Common/SideBar/sidebar";
import DashboardCards from "../../Common/Dashboard-cards/cards";
import RecentOrderTable from "../../Common/Recent-order-table/recentOrder";
import CustomerCards from "../../Common/CustomerCards/customercards";
import Navbar from "../../Common/Navbar/navbar";
import DropDowns from "../../Common/Dropdown/dropdown";
import BarChart from "../../Common/Graph/Graph";

// icons
import { FaUsers, FaShoppingCart, FaBox, FaBriefcase, FaEnvelope, FaNewspaper, FaTag, FaComment } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

import { getData, postData } from "../../Common/APIs/api";
import { DropdownContext } from "../../../Context/DropdownContext";

const Home = () => {
  const { dropdownData } = useContext(DropdownContext);

  const [salesData, setSalesData] = useState();
  const [counts, setCounts] = useState({});
  console.log("salesDataaaaaa: ", salesData);

  const getDashboardCounts = async () => {
    try {
      const response = await getData("dashboardCounts");
      console.log("Dashboard Counts Response: ", response);
      if (response?.success) {
        // Matches your confirmed structure: { success: true, counts: { ... } }
        setCounts(response.counts || response.data || {});
      } else if (response && typeof response === "object" && !response.hasOwnProperty('success')) {
        // Fallback for direct object response
        setCounts(response);
      }
    } catch (error) {
      console.log("Error fetching dashboard counts:", error);
    }
  };

  const getSalesDataByAPI = async () => {
    const endpoint = "/getAllSales";
    try {
      const payload = {
        filterType: dropdownData.filterType,
        month: dropdownData.month,
        year: dropdownData.year,
      };

      const response = await postData(endpoint, payload);
      console.log("Sales Data Response: ", response);

      if (response?.data?.success) {
        setSalesData(response?.data?.data);
      }
    } catch (error) {
      console.log("Error fetching sales data: ", error);
    }
  };

  useEffect(() => {
    getSalesDataByAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownData]);

  useEffect(() => {
    getDashboardCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DashboardCardData = [
    {
      label: "Total Products",
      count: counts?.totalProducts || salesData?.totalProducts || "0",
      icon: <FaBox size={28} color="#0077b6" />,
      cardColor: "bg-light-blue-color",
      circleColor: "dashboard-blue-color",
    },
    {
      label: "Total Sales",
      count: counts?.totalSales || salesData?.summary?.total_sales || "0",
      icon: <FiTrendingUp size={28} color="#6ba368" />,
      cardColor: "bg-light-green-color",
      circleColor: "dashboard-green-color",
    },
    {
      label: "Total Orders",
      count: counts?.totalOrders || salesData?.totalOrders || "0",
      icon: <FaShoppingCart size={28} color="#e86a33" />,
      cardColor: "bg-light-yellow-color",
      circleColor: "dashboard-yellow-color",
    },
    {
      label: "Customers",
      count: counts?.customers || "0",
      icon: <FaUsers size={28} color="#0077b6" />,
      cardColor: "bg-light-blue-color",
      circleColor: "dashboard-blue-color",
    },
    {
      label: "B2B Inquiries",
      count: (counts?.b2bInquiry !== undefined ? counts.b2bInquiry : "0"),
      icon: <FaBriefcase size={28} color="#6a0dad" />,
      cardColor: "bg-light-purple-color",
      circleColor: "dashboard-purple-color",
    },
    {
      label: "Contacts",
      count: (counts?.contact !== undefined ? counts.contact : "0"),
      icon: <FaEnvelope size={28} color="#e86a33" />,
      cardColor: "bg-light-yellow-color",
      circleColor: "dashboard-yellow-color",
    },
    {
      label: "Newsletters",
      count: (counts?.newsletter !== undefined ? counts.newsletter : "0"),
      icon: <FaNewspaper size={28} color="#6ba368" />,
      cardColor: "bg-light-green-color",
      circleColor: "dashboard-green-color",
    },
    {
      label: "Offer Banners",
      count: (counts?.offerBanner !== undefined ? counts.offerBanner : "0"),
      icon: <FaTag size={28} color="#0077b6" />,
      cardColor: "bg-light-blue-color",
      circleColor: "dashboard-blue-color",
    },
    {
      label: "Feedback",
      count: (counts?.feedback !== undefined ? counts.feedback : "0"),
      icon: <FaComment size={28} color="#6a0dad" />,
      cardColor: "bg-light-purple-color",
      circleColor: "dashboard-purple-color",
    },
  ];




  return (
    <div className="container-fluid gauswarn-bg-color">
      <Navbar title="Rajlaxmi Dashboard" />

      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-2">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="col-lg-10 px-lg-5 d-flex justify-content-center flex-column">
          {/* Dashboard Heading + Dropdown */}
          <div className="row align-items-center my-3">
            <div className="col-md-6 col-12">
              <p className="font-20 mb-0 inter-font-family-500">Dashboard</p>
            </div>
            <div className="col-md-6 col-12 mt-2 mt-md-0 d-flex justify-content-md-end justify-content-end">
              <DropDowns />
            </div>
          </div>

          {/* Cards */}
          <DashboardCards cardData={DashboardCardData} />

          {/* Bar Chart */}
          <BarChart BarChartData={salesData} />


          {/* <div className="row pt-3 bg-white recent-table box-shadow mt-4 mx-1">
            <div className="col-lg-4">
              <p className="font-20 inter-font-family-500 text-murmaid-color mt-lg-0 mt-4">
                Banner Images
              </p>
              <div className="upload-ghee-banner d-flex align-items-center justify-content-center text-center">
                <label className="btn btn-upload border border-success mb-2">
                  <p className="mb-0 fs-2 "><ImFolderUpload className="text-success" /></p>
                  Add Files
                  <input type="file" multiple hidden onChange={handleImageUpload} />
                  <div className="text-muted small">Or drag and drop files</div>
                </label>
                {error && <div className="text-danger small mt-2">{error}</div>}
              </div>
            </div>

            <div className="col-lg-8 ">
              <div className="image-ghee-banner py-2 d-flex flex-wrap justify-content-around align-items-center">
                {images.map((src, i) => (
                  <div key={i} className="banner-image-box position-relative m-2">
                    <img src={src} alt={`preview-${i}`} className="img-thumbnail" />
                    <p
                      onClick={() => handleImageDelete(i)}
                      className="position-absolute fs-3"
                      style={{ top: "-18px", right: "-10px", borderRadius: "50%" }}
                    >
                      <RxCrossCircled className="text-danger" />
                    </p>
                  </div>
                ))}
              </div>

              {images.length > 0 && (
                <div className="d-flex justify-content-center">
                  <button className="bg-light-green-color border rounded-2 px-4 py-1 text-dark">Upload</button>
                </div>)}
            </div>
          </div> */}

          {/* Orders + Customers */}
          <div className="row mt-3 mb-5">
            <div className="col-lg-8">
              <RecentOrderTable
                RecentOrderTableData={salesData?.recentOrders}
              />
            </div>
            <div className="col-lg-4">
              <p className="font-20 inter-font-family-500 text-murmaid-color mt-lg-0 mt-4">
                Top Customers
              </p>
              {salesData?.topUsers?.length === 0 ? (
                <div className="no-data text-center d-flex flex-column align-items-center">
                  <div className="text-secondary opacity-50"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="150" width="150" xmlns="http://www.w3.org/2000/svg"><path d="M490.8 459.1L248.6 209.6c-4.6-4.8-12-5-16.8-.4-4.8 4.6-5 12-.4 16.8L473.6 475.5c4.7 4.9 12 5.1 16.9.4 4.8-4.7 5.1-12 .3-16.8zM245.8 196.5l-4-4.2C188.7 136.2 113.3 103.3 35.5 103.3c-6.6 0-12 5.4-12 12s5.4 12 12 12c58.2 0 112 18 152.1 50.8l.2.2 45.4 46.8-93.5 96.6c-11.8-8.2-26.6-13.1-42.5-13.1-39.7 0-72 32.3-72 72s32.3 72 72 72 72-32.3 72-72c0-10.4-2.2-20.2-6.1-29.1l80-82.6c13.7 12.3 22.3 30.2 22.3 50.1 0 37.5-30.5 68-68 68h-112c-6.6 0-12 5.4-12 12s5.4 12 12 12h112c50.8 0 92-41.2 92-92 0-30.3-14.7-57.2-37.4-74.4l30.2-31.2z"></path></svg></div>
                  <h5 className="mt-3">No Top Customers Found</h5>
                </div>
              ) : (
                <CustomerCards CustomerCardData={salesData?.topUsers} />
              )}
            </div>

            {/* Optional Section */}
            {/* 
              <div className="col-lg-12 my-4">
                <TopProduct hideCategories={true} />
              </div> 
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
