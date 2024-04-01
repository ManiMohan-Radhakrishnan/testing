import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BiCopyAlt } from "react-icons/bi";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";

import "./style.scss";

const CopyToClipboardComponent = ({ copyText, css = "" }) => {
  const [copyStatus, setCopyStatus] = useState(false);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {copyStatus ? "Copied" : "Copy to Clipboard"}
    </Tooltip>
  );

  return (
    <div
      className={`d-flex justify-content-between align-items-center copy-content ${
        css ? css : ""
      }`}
    >
      <label className="copy-content-text">{copyText}</label>
      <OverlayTrigger placement="left" overlay={renderTooltip} trigger="click">
        <CopyToClipboard
          text={copyText}
          onCopy={() => {
            toast.success("Copied to Clipboard");
            setCopyStatus(true);
            setTimeout(async () => {
              setCopyStatus(false);
            }, 5000);
          }}
        >
          <BiCopyAlt size={20} />
        </CopyToClipboard>
      </OverlayTrigger>
    </div>
  );
};

export default CopyToClipboardComponent;
