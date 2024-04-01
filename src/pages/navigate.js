import React, { useEffect } from "react";

const Navigate = () => {
  useEffect(() => {
    window.open(process.env.REACT_APP_WEBSITE_URL, "_self");
  }, []);

  return (
    <>
      <div className="container">
        <div
          className="row align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="col">
            <div className="w-75 m-auto">
              <div className="form-group text-center">
                {/* <div>
                  <BsExclamationCircle size={50}></BsExclamationCircle>
                </div> */}

                <div className="mt-2 not-found-text">
                  Please wait - Redirecting...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigate;
