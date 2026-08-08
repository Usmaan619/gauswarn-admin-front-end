// import React, { useEffect, useState } from "react";
// import Sidebar from "../../Common/SideBar/sidebar";
// import Navbar from "../../Common/Navbar/navbar";
// import { getData, postData, postFormData } from "../../Common/APIs/api";
// import { toastSuccess } from "../../../Services/toast.service";
// import { useForm, useFieldArray } from "react-hook-form";

// /* =======================
//    SKELETON COMPONENT
//    ======================= */
// const ProductSkeleton = () => (
//   <div className="card shadow-sm rounded-3 mb-4 border-0">
//     <div className="card-body p-4">
//       <div className="placeholder-glow mb-3">
//         <span className="placeholder col-4"></span>
//       </div>

//       <div className="row g-3 mb-4">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="col-md-3">
//             <span className="placeholder col-12" style={{ height: 38 }} />
//           </div>
//         ))}
//       </div>

//       <div className="d-flex gap-3">
//         {[1, 2, 3].map((i) => (
//           <span key={i} className="placeholder col-2" style={{ height: 140 }} />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const ProductInfo = () => {
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState({});

//   const { control, register, getValues } = useForm({
//     defaultValues: { products: [] },
//   });

//   const { fields, replace } = useFieldArray({
//     control,
//     name: "products",
//   });

//   useEffect(() => {
//     getProductAPI();
//   }, []);

//   /* =======================
//      FETCH PRODUCTS
//      ======================= */
//   const getProductAPI = async () => {
//     try {
//       setLoading(true);
//       const response = await getData("gauswarnGetAllProduct");
//       if (response?.success) {
//         replace(response.products || []);
//       }
//     } catch (error) {
//       console.log("API error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================
//      REPLACE IMAGE (PROGRESS)
//      ======================= */
//   const handleImageReplace = async (productIndex, replaceIndex, file) => {
//     const key = `${productIndex}-${replaceIndex}`;
//     const product = getValues().products[productIndex];

//     const formData = new FormData();
//     formData.append("product_id", product.product_id);
//     formData.append("replace_index", replaceIndex);
//     formData.append("image", file);

//     try {
//       const response = await postFormData("/replace-image", formData, {
//         onUploadProgress: (e) => {
//           const percent = Math.round((e.loaded * 100) / e.total);
//           setUploadProgress((p) => ({ ...p, [key]: percent }));
//         },
//       });

//       if (response?.data?.success) {
//         toastSuccess("Image replaced successfully!");
//         setUploadProgress((p) => ({ ...p, [key]: 0 }));
//         await getProductAPI();
//       }
//     } catch (error) {
//       console.log("Image update error:", error);
//       setUploadProgress((p) => ({ ...p, [key]: 0 }));
//     }
//   };

//   /* =======================
//      ADD IMAGES (PROGRESS)
//      ======================= */
//   const handleAddImages = async (productIndex, files) => {
//     const key = `add-${productIndex}`;
//     const product = getValues().products[productIndex];

//     const formData = new FormData();
//     formData.append("product_id", product.product_id);
//     for (let f of files) formData.append("images", f);

//     try {
//       const response = await postFormData("/add-images", formData, {
//         onUploadProgress: (e) => {
//           const percent = Math.round((e.loaded * 100) / e.total);
//           setUploadProgress((p) => ({ ...p, [key]: percent }));
//         },
//       });

//       if (response?.data?.success) {
//         toastSuccess("Images uploaded successfully!");
//         setUploadProgress((p) => ({ ...p, [key]: 0 }));
//         await getProductAPI();
//       }
//     } catch (err) {
//       console.log("Add image error:", err);
//       setUploadProgress((p) => ({ ...p, [key]: 0 }));
//     }
//   };

//   /* =======================
//      UPDATE PRODUCT
//      ======================= */
//   const updateProduct = async (index) => {
//     const product = getValues().products[index];

//     try {
//       const response = await postData("/updateGauswarnProductById", {
//         product_id: product.product_id,
//         product_price: product.product_price,
//         product_purchase_price: product.product_purchase_price,
//         product_del_price: product.product_del_price,
//         product_weight: product.product_weight,
//       });

//       if (response?.data?.success) {
//         toastSuccess("Product updated successfully!");
//         await getProductAPI();
//       }
//     } catch (error) {
//       console.log("Update error:", error);
//     }
//   };

//   return (
//     <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
//       <Navbar />
//       <div className="row">
//         <div className="col-lg-2">
//           <Sidebar />
//         </div>

//         <div className="col-lg-10 px-lg-5 py-4">
//           <h2 className="fw-bold mb-1">Product Management</h2>
//           <p className="text-muted mb-4">
//             Update product details, pricing, and images
//           </p>

//           {/* SKELETON */}
//           {loading &&
//             Array.from({ length: 3 }).map((_, i) => (
//               <ProductSkeleton key={i} />
//             ))}

//           {/* PRODUCTS */}
//           {!loading &&
//             fields.map((item, index) => (
//               <div key={item.id} className="card shadow-sm mb-4 border-0">
//                 <div className="card-body p-4">
//                   <h5 className="mb-3">
//                     Product #{index + 1}{" "}
//                     <span className="badge bg-secondary">
//                       {item.product_id}
//                     </span>
//                   </h5>

//                   {/* IMAGES */}
//                   <div className="d-flex flex-wrap gap-3 mb-4">
//                     {item.product_images &&
//                       JSON.parse(item.product_images).map((img, imgIndex) => (
//                         <div key={imgIndex} style={{ width: 140 }}>
//                           <img
//                             src={img}
//                             alt=""
//                             className="w-100 rounded"
//                             style={{ height: 140, objectFit: "cover" }}
//                           />

//                           <input
//                             type="file"
//                             hidden
//                             id={`img-${index}-${imgIndex}`}
//                             onChange={(e) =>
//                               handleImageReplace(
//                                 index,
//                                 imgIndex,
//                                 e.target.files[0]
//                               )
//                             }
//                           />

//                           <button
//                             className="btn btn-danger btn-sm w-100 mt-2"
//                             onClick={() =>
//                               document
//                                 .getElementById(`img-${index}-${imgIndex}`)
//                                 .click()
//                             }
//                           >
//                             Replace
//                           </button>

//                           {uploadProgress[`${index}-${imgIndex}`] > 0 && (
//                             <div
//                               className="progress mt-2"
//                               style={{ height: 5 }}
//                             >
//                               <div
//                                 className="progress-bar progress-bar-striped progress-bar-animated"
//                                 style={{
//                                   width: `${
//                                     uploadProgress[`${index}-${imgIndex}`]
//                                   }%`,
//                                 }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                   </div>

//                   {/* ADD IMAGES */}
//                   <input
//                     type="file"
//                     multiple
//                     className="form-control"
//                     onChange={(e) => handleAddImages(index, e.target.files)}
//                   />

//                   {uploadProgress[`add-${index}`] > 0 && (
//                     <div className="progress mt-2">
//                       <div
//                         className="progress-bar progress-bar-striped progress-bar-animated bg-success"
//                         style={{
//                           width: `${uploadProgress[`add-${index}`]}%`,
//                         }}
//                       />
//                     </div>
//                   )}

//                   {/* SAVE */}
//                   <div className="text-end mt-4">
//                     <button
//                       className="btn btn-primary px-4"
//                       onClick={() => updateProduct(index)}
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductInfo;

import React, { useEffect, useCallback } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData, postData } from "../../Common/APIs/api";
import { toastSuccess } from "../../../Services/toast.service";
import { useForm, useFieldArray } from "react-hook-form";

const ProductInfo = () => {
  const {
    control,
    register,
    getValues,
  } = useForm({
    defaultValues: {
      products: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "products",
  });

  const getProductAPI = useCallback(async () => {
    const endpoint = "gauswarnGetAllProduct";
    try {
      const response = await getData(endpoint);
      if (response?.success) {
        replace(response.products || []);
      }
    } catch (error) {
    }
  }, [replace]);

  useEffect(() => {
    getProductAPI();
  }, [getProductAPI]);

  // Convert file to base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageReplace = async (productIndex, replaceIndex, file) => {
    const allData = getValues();
    const product = allData.products[productIndex];

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      const response = await postData("/replace-image-base64", {
        product_id: product.product_id,
        replace_index: replaceIndex,
        image: base64Image,
      });

      if (response?.data?.success) {
        toastSuccess("Image replaced successfully!");
        await getProductAPI();
      }
    } catch (error) {
    }
  };

  const handleAddImages = async (productIndex, files) => {
    const allData = getValues();
    const product = allData.products[productIndex];

    try {
      // Convert all files to base64
      const base64Images = await Promise.all(
        Array.from(files).map((file) => fileToBase64(file))
      );

      const response = await postData("/add-images-base64", {
        product_id: product.product_id,
        images: base64Images,
      });

      if (response?.data?.success) {
        toastSuccess("Images uploaded successfully!");
        await getProductAPI();
      }
    } catch (err) {
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

    const endpoint = "/updateGauswarnProductById";
    try {
      const response = await postData(endpoint, payload);
      if (response?.data?.success) {
        toastSuccess("Product updated successfully!");
        await getProductAPI();
      }
    } catch (error) {
    }
  };

  return (
    <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 px-lg-5">
          <div className="row g-0">
            <div className="col-12 px-2 px-sm-3 py-4">
              {/* Page Header */}
              <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Product Management</h2>
                <p className="text-muted mb-0">Update product details, pricing, and images</p>
              </div>

              {/* Products List */}
              {fields.map((item, index) => (
                <div key={item.id} className="card shadow-sm rounded-3 mb-4 border-0">
                  <div className="card-header bg-gradient text-white py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-semibold">
                        <i className="bi bi-box-seam me-2"></i>
                        Product #{index + 1}
                      </h5>
                      <span className="badge bg-light text-dark">ID: {item.product_id}</span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {/* Pricing Section */}
                    <div className="mb-4">
                      <h6 className="text-uppercase text-muted mb-3 fw-semibold" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}}>
                        <i className="bi bi-currency-rupee me-2"></i>Pricing Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6 col-lg-3">
                          <label className="form-label fw-semibold text-dark small">Product Weight</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control border-2"
                              placeholder="e.g., 500g"
                              {...register(`products.${index}.product_weight`)}
                            />
                            <span className="input-group-text bg-light border-2">
                              <i className="bi bi-speedometer2"></i>
                            </span>
                          </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <label className="form-label fw-semibold text-dark small">Purchase Price</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-2">₹</span>
                            <input
                              type="number"
                              className="form-control border-2"
                              placeholder="0.00"
                              {...register(`products.${index}.product_purchase_price`)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <label className="form-label fw-semibold text-dark small">Selling Price</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-2">₹</span>
                            <input
                              type="number"
                              className="form-control border-2"
                              placeholder="0.00"
                              {...register(`products.${index}.product_price`)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <label className="form-label fw-semibold text-dark small">MRP</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-2">₹</span>
                            <input
                              type="number"
                              className="form-control border-2"
                              placeholder="0.00"
                              {...register(`products.${index}.product_del_price`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="mb-4">
                      <h6 className="text-uppercase text-muted mb-3 fw-semibold" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}}>
                        <i className="bi bi-images me-2"></i>Product Images
                      </h6>

                      {/* Current Images */}
                      <div className="d-flex flex-wrap gap-3 mb-4">
                        {item.product_images &&
                          JSON.parse(item.product_images).map((img, imgIndex) => (
                            <div key={imgIndex} className="position-relative" style={{width: '140px'}}>
                              <div className="border rounded-3 overflow-hidden shadow-sm" style={{height: '140px'}}>
                                <img
                                  src={img}
                                  alt="product"
                                  className="w-100 h-100"
                                  style={{objectFit: 'cover'}}
                                />
                              </div>

                              <input
                                type="file"
                                id={`img-${index}-${imgIndex}`}
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageReplace(index, imgIndex, e.target.files[0])
                                }
                              />

                              <button
                                type="button"
                                className="btn btn-sm btn-danger w-100 mt-2 shadow-sm"
                                onClick={() =>
                                  document.getElementById(`img-${index}-${imgIndex}`).click()
                                }
                              >
                                <i className="bi bi-arrow-repeat me-1"></i>
                                Replace
                              </button>
                            </div>
                          ))}
                      </div>

                      {/* Add New Images */}
                      <div className="p-4 bg-light rounded-3 border-2 border-dashed" style={{borderStyle: 'dashed'}}>
                        <label className="form-label fw-semibold text-dark mb-2">
                          <i className="bi bi-cloud-upload me-2"></i>
                          Add More Images
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="form-control"
                          onChange={(e) => handleAddImages(index, e.target.files)}
                        />
                        <small className="text-muted d-block mt-2">
                          <i className="bi bi-info-circle me-1"></i>
                          You can select multiple images at once
                        </small>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="d-flex justify-content-end pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-lg px-5 shadow-sm"
                        style={{
                          background: 'linear-gradient(135deg, #e56a54 0%, #e56a54 100%)',
                          color: 'white',
                          border: 'none'
                        }}
                        onClick={() => updateProduct(index)}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="card shadow-sm rounded-3 border-0">
                  <div className="card-body text-center py-5">
                    <i className="bi bi-inbox" style={{fontSize: '3rem', color: '#ccc'}}></i>
                    <p className="text-muted mt-3 mb-0">No products found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
