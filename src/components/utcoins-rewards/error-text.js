import React from "react";

const ErrorText = ({ type, handleClick = () => {}, title, desc }) => {
  if (type === "lowutcoins") {
    return (
      <div className="error-container">
        <div className="error-text">
          You need a minimum of 250,000 JT Points to do the conversion.
        </div>
      </div>
    );
  }

  return null;
};

export default ErrorText;
