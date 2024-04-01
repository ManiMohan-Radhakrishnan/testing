import React from "react";
import Header3 from "../header3";

import "./style.scss";

const DashboardWrapper = ({ children, hideHeader = false }) => {
  return (
    <>
      {!hideHeader && <Header3 />}
      <section>
        <div
          className={`section_wrapper ${
            hideHeader === true ? "fullscreen-mode" : ""
          }`.trim()}
        >
          {/* <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12"> */}
          {children}
          {/* </div>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default DashboardWrapper;
