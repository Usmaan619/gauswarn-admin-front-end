import React, { useContext, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import logo from "../../../Assets/Images/Logo/rajlaxmi.svg";
import { useNavigate } from "react-router-dom";
import { postData } from "../../APIs/api";
import { toastError, toastSuccess } from "../../../../Services/toast.service";
import { setItem, initSession } from "../../../../Services/storage.service";
import { UserContext } from "../../../../Context/UserContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  checkLockout,
  recordFailedAttempt,
  resetProtection,
} from "../../../../Services/loginProtection";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState({ isLocked: false, remainingSeconds: 0 });

  const navigate = useNavigate();
  const endpoint = "/login";
  const { setUserLogin, setUserPermissions } = useContext(UserContext);

  // Check lockout status on mount & update countdown
  const updateLockoutStatus = useCallback(() => {
    const status = checkLockout();
    setLockoutInfo(status);
    return status;
  }, []);

  useEffect(() => {
    updateLockoutStatus();
  }, [updateLockoutStatus]);

  // Countdown timer when locked out
  useEffect(() => {
    if (!lockoutInfo.isLocked) return;

    const interval = setInterval(() => {
      const status = checkLockout();
      setLockoutInfo(status);

      if (!status.isLocked) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutInfo.isLocked]);

  const onSubmit = async (data) => {
    // Check lockout before submitting
    const currentStatus = updateLockoutStatus();
    if (currentStatus.isLocked) {
      toastError(`Account locked. Wait ${currentStatus.remainingSeconds} seconds.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await postData(endpoint, data);

      if (response?.data?.success && response?.data?.accessToken) {
        // ✅ Successful login — reset protection & init secure session
        resetProtection();
        initSession();

        setItem("token", response?.data?.accessToken);
        setItem("email", response?.data?.email);
        setItem("name", response?.data?.name);

        setUserLogin(response?.data?.accessToken);
        setUserPermissions(response?.data?.permissions || []);

        toastSuccess(response?.data?.message);
        setTimeout(() => navigate("/home"), 1000);
      } else {
        // ❌ Failed login — record attempt
        const result = recordFailedAttempt();
        updateLockoutStatus();

        if (result.isNowLocked) {
          toastError(
            `Too many failed attempts! Account locked for ${result.lockoutSeconds} seconds.`
          );
        } else {
          toastError(
            `${response?.data?.message || "Login failed"} — ${result.attemptsRemaining} attempts remaining`
          );
        }
      }
    } catch (error) {
      // ❌ Error also counts as failed attempt
      const result = recordFailedAttempt();
      updateLockoutStatus();

      if (result.isNowLocked) {
        toastError(
          `Too many failed attempts! Account locked for ${result.lockoutSeconds} seconds.`
        );
      } else {
        toastError(
          `${error?.message || "Something went wrong"} — ${result.attemptsRemaining} attempts remaining`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <>
      <div className="login-container d-flex align-items-center justify-content-center">
        <div className="login-box text-center p-4">
          <div className="mb-4">
            <img src={logo} alt="Logo" className="logo mb-3" />
            <h2 className="title font-20 inter-font-family-600 text-white">
              Admin Login
            </h2>
            <p className="subtitle font-14 inter-font-family-300 text-white">
              Access your dashboard by logging into your admin account.
            </p>
          </div>

          {/* 🔒 Lockout Warning Banner */}
          {lockoutInfo.isLocked && (
            <div
              className="alert d-flex align-items-center mb-3 py-2 px-3 rounded"
              role="alert"
              style={{
                background: "rgba(220, 53, 69, 0.15)",
                border: "1px solid rgba(220, 53, 69, 0.4)",
                color: "#ff6b6b",
              }}
            >
              <span className="me-2" style={{ fontSize: "20px" }}>🔒</span>
              <div className="text-start" style={{ fontSize: "13px" }}>
                <strong>Account Temporarily Locked</strong>
                <br />
                Too many failed attempts. Try again in{" "}
                <strong>{formatTime(lockoutInfo.remainingSeconds)}</strong>
              </div>
            </div>
          )}

          <form
            className="login-form d-flex flex-column text-start"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="login-input mb-3">
              <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                Email Address
              </label>
              <input
                type="email"
                className="form-control text-white py-2 border-0"
                disabled={lockoutInfo.isLocked || isSubmitting}
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>

            <div className="login-input mb-3">
              <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control text-white py-2 border-0 pe-5"
                  disabled={lockoutInfo.isLocked || isSubmitting}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
                      message:
                        "Must include 1 capital letter and 1 special character",
                    },
                  })}
                />
                <button
                  type="button"
                  className="btn-eye position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", padding: "8px 12px" }}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={lockoutInfo.isLocked || isSubmitting}
              className={`login-btn rounded-pill border-0 font-16 inter-font-family-500 py-2 mt-5 text-white bg-red-color ${
                lockoutInfo.isLocked || isSubmitting ? "opacity-50" : ""
              }`}
            >
              {isSubmitting
                ? "Logging in..."
                : lockoutInfo.isLocked
                  ? `Locked (${formatTime(lockoutInfo.remainingSeconds)})`
                  : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
