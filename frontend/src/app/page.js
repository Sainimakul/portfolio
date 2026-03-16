"use client";

import { usePortfolio } from "../../context/PortfolioContext";
import Template1 from "../templates/template1";
import Template2 from "../templates/template2";
import Template3 from "../templates/template3";
import Template4 from "../templates/template4";
import Template5 from "../templates/template5";
import Template6 from "../templates/template6";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { loading } = usePortfolio();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        Loading...
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <Template3 />
      {/* <Template2 /> */}
      {/* <Template3 /> */}
      {/* <Template4 /> */}
      {/* <Template5 /> */}
      {/* <Template6 /> */}
    </>
  );
}
