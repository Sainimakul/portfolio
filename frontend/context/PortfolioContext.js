"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getPortfolioData } from "../service/api";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {

  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadData = async () => {
      const data = await getPortfolioData();
      setPortfolioData(data);
      setLoading(false);
    };

    loadData();

  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioData, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(PortfolioContext);
};