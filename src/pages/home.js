import React from "react";

import ClientCard from "./../components/clientcard";
import Header3 from "../components/header3";

const Home = () => {
  const handleNavigate = () => {
    window.open(process.env.REACT_APP_CHAKRA_URL, "_self");
  };

  return (
    <>
      <Header3 />
      <div className="container">
        <h1 className="text-center mt-5 mb-5">
          Never miss a drop. Sign up now!
        </h1>
        <div className="row">
          <div className="col-12 col-sm-6 col-md-4">
            <ClientCard
              onClick={handleNavigate}
              title="AB NFT"
              desc="Some quick example text to build on the card title and make up the bulk of the card's content."
              imgUrl={
                "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE1ODA0OTcxOTg4MDU5NjYx/raavan---uk-film-premiere-red-carpet-arrivals.jpg"
              }
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <ClientCard
              title="SACHIN NFT"
              desc="Some quick example text to build on the card title and make up the bulk of the card's content."
              imgUrl={
                "https://pbs.twimg.com/profile_images/1410819014255730689/u76ZqFWN.jpg"
              }
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <ClientCard
              title="MSD NFT"
              desc="Some quick example text to build on the card title and make up the bulk of the card's content."
              imgUrl={
                "https://pbs.twimg.com/profile_images/1410592280474374145/XXrkp-wc_400x400.jpg"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
