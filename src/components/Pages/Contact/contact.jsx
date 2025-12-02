import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import ContactTable from "../../Common/ContactTable/contactTable";
import { getData } from "../../Common/APIs/api";

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getContactsAPI();
  }, []);

  const getContactsAPI = async () => {
    const endpoint = "/getAllContact";
    try {
      const response = await getData(endpoint);
      if (response?.success) setContacts(response?.contact || []);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      <div className="container-fluid gauswarn-bg-color min-vh-100">
        <Navbar />

        <div className="row py-2">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10 px-lg-5">
            {/* <p className='inter-font-family-500 font-20 text-drak-blue-colo'>Navbar</p> */}
            <ContactTable ContactData={contacts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
