import React, { useEffect, useState } from "react";
import ContactTable from "../../Common/ContactTable/contactTable";
import { getData } from "../../Common/APIs/api";
import { FiMessageSquare } from "react-icons/fi";

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
      console.error("error fetching contacts: ", error);
    }
  };

  return (
    <div className="contact-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiMessageSquare className="text-info" />
          Contact Messages
        </h2>
        <p className="text-secondary">Review and respond to general inquiries from your website's contact form.</p>
      </div>

      <div className="glass-card p-4">
        <ContactTable ContactData={contacts} />
      </div>
    </div>
  );
};

export default Contact;
