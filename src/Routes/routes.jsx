import { Route, Routes } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import { getItem } from "../Services/storage.service.js";
import { axiosInterceptor } from "../AxiosInstance/axiosInstance.jsx";

import { lazy, Suspense } from 'react';

// Public Pages
const Login = lazy(() => import("../components/Common/Auth/Login/login"));
const Forgot = lazy(() => import("../components/Common/Auth/Forgot/forgot"));

// Gauswarn Pages
const Home = lazy(() => import("../components/Pages/Home/home"));
const Order = lazy(() => import("../components/Pages/Order/order"));
const Product = lazy(() => import("../components/Pages/Products/product"));
const ProductInfo = lazy(() => import("../components/Pages/Products/productInfo"));
const Customer = lazy(() => import("../components/Pages/Customer/customer"));
const CustomerInfo = lazy(() => import("../components/Pages/Customer/customerInfo"));
const Feedback = lazy(() => import("../components/Pages/Feedback/feedback"));
const Contact = lazy(() => import("../components/Pages/Contact/contact"));

const Error = lazy(() => import("../components/Pages/Error404/error.jsx"));
const BannerManager = lazy(() => import("../components/Pages/Home-Banner/home-banner.jsx"));
const ReelUploader = lazy(() => import("../components/Pages/Reels/reelsUpload.jsx"));
const BlogCreate = lazy(() => import("../components/Pages/Blogs/BlogCreate.jsx"));
const BlogList = lazy(() => import("../components/Pages/Blogs/BlogList.jsx"));
const BlogView = lazy(() => import("../components/Pages/Blogs/BlogView.jsx"));
const BlogEdit = lazy(() => import("../components/Pages/Blogs/BlogEdit.jsx"));
const BlogsTest = lazy(() => import("../components/Pages/Blogs/blogtest.jsx"));
const Inquiry = lazy(() => import("../components/Pages/Inquiry/Inquiry.jsx"));
const NewsletterPage = lazy(() => import("../components/Pages/Newsletter/Newsletter.jsx"));

const CreateAdminUserPage = lazy(() => import("../components/Pages/CreateAdminUser/CreateAdminUserPage.jsx"));
const OfferManagement = lazy(() => import("../components/OfferManagement/OfferManagement.jsx"));

const AuthRoutes = () => {
  const { UserLogin, setUserLogin } = useContext(UserContext);

  axiosInterceptor(setUserLogin);

  useEffect(() => {
    const token = getItem("token");
    setUserLogin(token ?? null);
  }, [setUserLogin]);

  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
      <Routes>
        {!UserLogin ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/forgot" element={<Forgot />} />
          </>
        ) : (
          <>
            {/* Gauswarn Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/product" element={<Product />} />
            <Route path="/home-page-banner-change" element={<BannerManager />} />

            <Route path="/reels-upload" element={<ReelUploader />} />

            <Route path="/productinfo" element={<ProductInfo />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/customerinfo" element={<CustomerInfo />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/blog" element={<BlogsTest />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/newlatter" element={<NewsletterPage />} />
            <Route path="/offerBanner" element={<OfferManagement />} />
            <Route path="/create-admin-user" element={<CreateAdminUserPage />} />

            <Route path="/blog/create" element={<BlogCreate />} />
            <Route path="/blog/list" element={<BlogList />} />
            <Route path="/blog/view/:slug" element={<BlogView />} />
            <Route path="/blog/edit/:id" element={<BlogEdit />} />

            <Route path="*" element={<Error />} />
          </>
        )}

        {/* Fallback route */}

        <Route path="/" element={UserLogin ? <Home /> : <Login />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
