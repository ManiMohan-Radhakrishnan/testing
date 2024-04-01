import React from "react";

import "./style.scss";

const InputTextArea = ({
  title,
  rows,
  name,
  value,
  onChange = () => {},
  className = "",
  placeholder = " ",
}) => {
  const x = Math.floor(Math.random() * 100 + 1);

  return (
    // <div className="form-floating  mb-3">
    //   <textarea
    //     className={`form-control ${className}`}
    //     rows={rows}
    //     placeholder={placeholder}
    //     id={`floatingTextarea${x}`}
    //   ></textarea>
    //   <label htmlFor={`floatingTextarea${x}`}>{title}</label>
    // </div>

    <>
      <label htmlFor={`floatingTextarea${x}`} className="input-title">
        {title}
      </label>
      <textarea
        className={`form-control ${className}`}
        rows={rows}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        id={`floatingTextarea${x}`}
      ></textarea>
    </>
  );
};

export default InputTextArea;
