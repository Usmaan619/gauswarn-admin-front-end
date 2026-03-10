import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import { FiTrendingUp, FiShoppingBag, FiUsers, FiMessageSquare, FiMail, FiStar, FiPackage } from "react-icons/fi";
import Chart from "react-apexcharts";
import { DropdownContext } from "../../../Context/DropdownContext";
import { postData } from "../../Common/APIs/api";

const DashboardHome = () => {
  const { dropdownData } = useContext(DropdownContext);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [dropdownData]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const endpoint = "/getAllSales";
    try {
      const payload = {
        filterType: dropdownData.filterType,
        month: dropdownData.month,
        year: dropdownData.year,
      };
      const response = await postData(endpoint, payload);
      if (response?.data?.success) {
        setSalesData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Orders", value: salesData?.totalOrders || "0", icon: <FiShoppingBag />, change: "+12.5%", color: "#00d2ff" },
    { label: "Total Products", value: salesData?.totalProducts || "45", icon: <FiPackage />, change: "+3.2%", color: "#00d2ff" },
    { label: "Total Customers", value: salesData?.totalUsers || "1.2k", icon: <FiUsers />, change: "+18.7%", color: "#00d2ff" },
    { label: "Revenue", value: `\u20B9${salesData?.summary?.total_sales || "0"}`, icon: <FiTrendingUp />, change: "+24.1%", color: "#00d2ff" },
    { label: "Inquiries", value: "24", icon: <FiMessageSquare />, change: "+5.4%", color: "#00d2ff" },
    { label: "Subscribers", value: "850", icon: <FiMail />, change: "+10.2%", color: "#00d2ff" },
    { label: "Feedbacks", value: "128", icon: <FiStar />, change: "+2.1%", color: "#00d2ff" },
  ];

  const chartOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ['#00d2ff'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    stroke: { curve: 'smooth', width: 3 },
    grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: '#94a3b8' } },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    tooltip: { theme: 'dark' },
  };

  const chartSeries = [{
    name: 'Sales',
    data: [31, 40, 28, 51, 42, 109, 100]
  }];

  return (
    <div className="dashboard-container">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card glass-card fade-in" style={{"--delay": `${index * 0.1}s`}}>
            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <h3 className="stat-value">{stat.value}</h3>
              <span className="stat-change">{stat.change} vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid mt-4">
        {/* Analytics Chart */}
        <div className="chart-container glass-card fade-in">
          <div className="card-header">
            <h3>Sales Analytics</h3>
            <div className="chart-filters">
              <button className="filter-btn active">Daily</button>
              <button className="filter-btn">Weekly</button>
              <button className="filter-btn">Monthly</button>
            </div>
          </div>
          <div className="chart-body">
            <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders-container glass-card fade-in">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(salesData?.recentOrders || [
                  { _id: "#ORD-7721", user_name: "John Doe", status: "Delivered", total_price: "1250" },
                  { _id: "#ORD-7722", user_name: "Jane Smith", status: "Pending", total_price: "850" },
                  { _id: "#ORD-7723", user_name: "Robert Fox", status: "Shaped", total_price: "2100" },
                  { _id: "#ORD-7724", user_name: "Emily Davis", status: "Cancelled", total_price: "450" }
                ]).map((order, i) => (
                  <tr key={i}>
                    <td className="glow-text">{order._id}</td>
                    <td>{order.user_name}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>\u20B9{order.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
