import React, { useEffect } from "react";
import { getData, postData, postFormData } from "../../Common/APIs/api";
import { toastSuccess } from "../../../Services/toast.service";
import { useForm, useFieldArray } from "react-hook-form";
import { FiPackage, FiImage, FiSave, FiRefreshCw, FiPlus } from "react-icons/fi";

const ProductInfo = () => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    getProductAPI();
  }, []);

  const getProductAPI = async () => {
    const endpoint = "gauswarnGetAllProduct";
    try {
      const response = await getData(endpoint);
      if (response?.success) {
        replace(response.products || []);
      }
    } catch (error) {
      console.error("API error: ", error);
    }
  };

  const handleImageReplace = async (productIndex, replaceIndex, file) => {
    const allData = getValues();
    const product = allData.products[productIndex];

    const formData = new FormData();
    formData.append("product_id", product.product_id);
    formData.append("replace_index", replaceIndex);
    formData.append("image", file);

    try {
      const response = await postFormData("/replace-image", formData);
      if (response?.data?.success) {
        toastSuccess("Image replaced successfully!");
        await getProductAPI();
      }
    } catch (error) {
      console.error("Image update error:", error);
    }
  };

  const handleAddImages = async (productIndex, files) => {
    const allData = getValues();
    const product = allData.products[productIndex];
    const formData = new FormData();
    formData.append("product_id", product.product_id);
    for (let f of files) {
      formData.append("images", f);
    }

    try {
      const response = await postFormData("/add-images", formData);
      if (response?.data?.success) {
        toastSuccess("Images uploaded successfully!");
        await getProductAPI();
      }
    } catch (err) {
      console.error("Add image error:", err);
    }
  };

  const updateProduct = async (index) => {
    const allData = getValues();
    const product = allData.products[index];
    const payload = {
      product_id: product.product_id,
      product_price: product.product_price,
      product_purchase_price: product.product_purchase_price,
      product_del_price: product.product_del_price,
      product_weight: product.product_weight,
    };

    try {
      const response = await postData("/updateGauswarnProductById", payload);
      if (response?.data?.success) {
        toastSuccess("Product updated successfully!");
        await getProductAPI();
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="product-management-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text">Product Management</h2>
        <p className="text-secondary">Manage inventory, pricing and product visual assets.</p>
      </div>

      <div className="products-list">
        {fields.map((item, index) => (
          <div key={item.id} className="glass-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-light pb-3">
              <h5 className="m-0 d-flex align-items-center gap-2">
                <FiPackage className="text-info" />
                Product #{index + 1}
              </h5>
              <span className="badge glass-card px-3">ID: {item.product_id}</span>
            </div>

            <div className="row g-4">
              <div className="col-lg-12">
                <h6 className="text-secondary mb-3 small uppercase fw-bold">Pricing & Logistics</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">Weight</label>
                    <input
                      type="text"
                      className="form-control glass-card text-white border-0"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      {...register(`products.${index}.product_weight`)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">Purchase Price (₹)</label>
                    <input
                      type="number"
                      className="form-control glass-card text-white border-0"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      {...register(`products.${index}.product_purchase_price`)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">Selling Price (₹)</label>
                    <input
                      type="number"
                      className="form-control glass-card text-white border-0"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      {...register(`products.${index}.product_price`)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">MRP (₹)</label>
                    <input
                      type="number"
                      className="form-control glass-card text-white border-0"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      {...register(`products.${index}.product_del_price`)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-12 mt-4">
                <h6 className="text-secondary mb-3 small uppercase fw-bold">Images</h6>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  {item.product_images &&
                    JSON.parse(item.product_images).map((img, imgIndex) => (
                      <div key={imgIndex} className="product-image-container glass-card p-2">
                        <img
                          src={img}
                          alt="product"
                          className="rounded"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <input
                          type="file"
                          id={`img-${index}-${imgIndex}`}
                          style={{ display: "none" }}
                          onChange={(e) => handleImageReplace(index, imgIndex, e.target.files[0])}
                        />
                        <button
                          className="btn btn-sm btn-outline-info w-100 mt-2 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => document.getElementById(`img-${index}-${imgIndex}`).click()}
                        >
                          <FiRefreshCw size={12} /> Replace
                        </button>
                      </div>
                    ))}
                  
                  <div className="add-image-placeholder glass-card d-flex flex-column align-items-center justify-content-center" style={{ width: '136px', height: '170px', borderStyle: 'dashed', cursor: 'pointer' }} onClick={() => document.getElementById(`add-img-${index}`).click()}>
                    <FiPlus size={24} className="text-secondary" />
                    <span className="small text-secondary mt-2">Add Image</span>
                    <input
                      type="file"
                      id={`add-img-${index}`}
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => handleAddImages(index, e.target.files)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button 
                className="btn btn-info px-4 d-flex align-items-center gap-2"
                onClick={() => updateProduct(index)}
              >
                <FiSave /> Save Changes
              </button>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="glass-card p-5 text-center">
            <FiPackage size={48} className="text-secondary opacity-20 mb-3" />
            <p className="text-secondary">No products found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
