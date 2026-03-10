import React, { useContext, useEffect, useState } from "react";
import SideBar from "../../Common/SideBar/sidebar";
import DashboardCards from "../../Common/Dashboard-cards/cards";
import RecentOrderTable from "../../Common/Recent-order-table/recentOrder";
import CustomerCards from "../../Common/CustomerCards/customercards";
import Navbar from "../../Common/Navbar/navbar";
import DropDowns from "../../Common/Dropdown/dropdown";
import BarChart from "../../Common/Graph/Graph";

// icons
import { FaUsers, FaShoppingCart, FaRupeeSign } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import noDataImg from '../../Assets/Images/home-img/flat-design-no-data-illustration.png';
import { getData, postData } from "../../Common/APIs/api";
import { DropdownContext } from "../../../Context/DropdownContext";
import { RxCrossCircled } from "react-icons/rx";
import { ImFolderUpload } from "react-icons/im";

const Home = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const { dropdownData } = useContext(DropdownContext);

  useEffect(() => {
    getSalesDataByAPI();
  }, [dropdownData]);

  const [salesData, setSalesData] = useState();
  console.log("salesDataaaaaa: ", salesData);

  const getSalesDataByAPI = async () => {
    const endpoint = "/getAllSales";
    try {
      const payload = {
        filterType: dropdownData.filterType,
        month: dropdownData.month,
        year: dropdownData.year,
      };

      const response = await postData(endpoint, payload);
      // console.log("response:dddddddddddddddd ", response);

      if (response?.data?.success) {
        setSalesData(response?.data?.data);
      }

      // store data in session for  later use
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const DashboardCardData = [
    {
      label: "Total Products",
      count: '1',
      // count: salesData?.totalProducts || '1',
      icon: <FaUsers size={28} color="#0077b6" />,
      cardColor: "bg-light-blue-color",
      circleColor: "dashboard-blue-color",
    },
    {
      label: "Total Sales",
      count: salesData?.summary?.total_sales ?? "0",
      icon: <FiTrendingUp size={28} color="#6ba368" />,
      cardColor: "bg-light-green-color",
      circleColor: "dashboard-green-color",
    },
    {
      label: "Total Order",
      count: salesData?.totalOrders ?? "0",
      icon: <FaShoppingCart size={28} color="#e86a33" />,
      cardColor: "bg-light-yellow-color",
      circleColor: "dashboard-yellow-color",
    },
    {
      label: "Total Profit",
      count: salesData?.monthlyProfit ?? "0",
      icon: <FaRupeeSign size={28} color="#6a0dad" />,
      cardColor: "bg-light-purple-color",
      circleColor: "dashboard-purple-color",
    },
  ];


  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const newImages = files.map(file => URL.createObjectURL(file));
  //   setImages(prev => [...prev, ...newImages]);
  // };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    const newImages = [];
    for (let file of files) {
      if (validImageTypes.includes(file.type)) {
        newImages.push(URL.createObjectURL(file));
      } else {
        setError(`Invalid file type: ${file.name}`);
        setTimeout(() => setError(""), 3000); // clear error after 3 sec
      }
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageDelete = (indexToDelete) => {
    setImages(prev => prev.filter((_, index) => index !== indexToDelete));
  };

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
                  <img src={noDataImg} alt="No Data" className="no-data-img" />
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
