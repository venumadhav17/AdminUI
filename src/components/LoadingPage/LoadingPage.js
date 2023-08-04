import React from "react";

// Importing styles
import "./LoadingPage.css";

const LoadingPage = ({ message }) => {
  return <div className="loader">{message}</div>;
};

export default LoadingPage;