"use client";

import { usePortfolio } from "../../context/PortfolioContext";
import { useState, useRef } from "react";

import Template1 from "../templates/template1";
import Template2 from "../templates/template2";
import Template3 from "../templates/template3";
import Template4 from "../templates/template4";
import Template5 from "../templates/template5";
import Template6 from "../templates/template6";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { portfolioData, loading } = usePortfolio();
  const profile = portfolioData?.profile?.data || {};

  // 🔥 template mapping (clean + scalable)
  const templates = {
    1: <Template1 />,
    2: <Template2 />,
    3: <Template3 />,
    4: <Template4 />,
    5: <Template5 />,
    6: <Template6 />,
  };

  // fallback to template 1
  const selectedTemplate = templates[profile.template_id] || templates[1];

if (loading) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      
      {/* Glow background */}
      <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Loader card */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-10 py-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
        
        <div className="h-14 w-14 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

        <p className="text-white text-sm tracking-widest animate-pulse">
          Preparing Experience...
        </p>

      </div>
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

      {selectedTemplate}
    </>
  );
}