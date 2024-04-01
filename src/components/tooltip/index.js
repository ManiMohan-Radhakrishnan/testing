import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import "./style.scss";

const ToolTip = ({
  icon,
  className,
  placement,
  content,
  temp = false,
  verified = false,
}) => {
  return (
    <>
      {temp ? (
        <span>{icon}</span>
      ) : (
        <OverlayTrigger
          key={placement}
          className={className}
          placement={placement}
          overlay={<Tooltip className="tooltip-text">{content}</Tooltip>}
        >
          <span>{icon}</span>
        </OverlayTrigger>
      )}
    </>
  );
};

export default ToolTip;
