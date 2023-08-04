import React from "react";

// Importing styles
import "./DeleteButton.css";

const DeleteButton = ({ deleteText, handleDeleteUsers }) => {
  return (
    <div className="btn" onClick={handleDeleteUsers}>
      {deleteText}
    </div>
  );
};

export default DeleteButton;