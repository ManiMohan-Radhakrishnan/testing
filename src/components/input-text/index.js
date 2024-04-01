import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { blockInvalidChar } from "../../utils/common";

import "./style.scss";

const InputText = ({
  tooltip,
  title,
  name = "",
  type = "text",
  className = "",
  required = false,
  boxRequired = false,
  requiredBottom = false,
  restrictChar = false,
  scrollIncrese = false,
  placeholder = " ",
  onChange = () => {},
  value,
  isPop = false,
  lengthValue = 100,
  popText,
  disabled = false,
  upiPayment = false,
  ...props
}) => {
  const x = Math.floor(Math.random() * 100 + 1);

  const popover = (
    <Popover>
      <Popover.Body>
        <p className="password-terms">{popText}</p>
      </Popover.Body>
    </Popover>
  );

  const exceptThisSymbols = ["e", "E", "."];

  return (
    // <div className="form-floating mb-3">
    //   <input
    //     id={`floatingInput${x}`}
    //     type={type}
    //     className={`form-control ${className}`}
    //     placeholder={placeholder}
    //     onChange={onChange}
    //     value={value}
    //   />
    //   <label htmlFor={`floatingInput${x}`}>{title}</label>
    // </div>

    <>
      <label htmlFor={`floatingInput${x}`} className="input-title">
        {title} {tooltip && tooltip}
      </label>{" "}
      {!requiredBottom && required && (
        <small className="text-danger font-10">(Required)</small>
      )}
      {isPop ? (
        <OverlayTrigger trigger="focus" placement="top" overlay={popover}>
          <input
            {...props}
            id={`floatingInput${x}`}
            type={type}
            name={name}
            className={`form-control ${
              required && "border-danger"
            } ${className} ${disabled && "input-disabled"}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            autoComplete="off"
            readOnly={disabled}
            onKeyDown={(evt) => {
              if (type === "number" && upiPayment)
                exceptThisSymbols?.includes(evt.key) && evt.preventDefault();
            }}
          />
        </OverlayTrigger>
      ) : (
        <input
          {...props}
          id={`floatingInput${x}`}
          type={type}
          name={name}
          className={`form-control ${
            (required || boxRequired) && "border-danger"
          }
            ${className} ${disabled && "input-disabled"}`}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={lengthValue}
          onKeyDown={(e) => {
            if (restrictChar) {
              blockInvalidChar(e);
            }
            if (type === "number" && upiPayment) {
              exceptThisSymbols?.includes(e.key) && e.preventDefault();
            }
          }}
          autoComplete="off"
          onWheel={(event) => {
            if (scrollIncrese) {
              event.currentTarget.blur();
            }
          }}
          readOnly={disabled}
        />
      )}
      {requiredBottom && value.length === 0 && (
        <small className="text-danger font-10">(Required)</small>
      )}
    </>
  );
};

export default InputText;
