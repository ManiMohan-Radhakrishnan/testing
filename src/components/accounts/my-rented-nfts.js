/* eslint-disable jsx-a11y/anchor-is-valid */
import UserRentedNFT from "../my-rented-nfts/index";

const MyRentedNFTs = ({ hideMenus }) => {
  return (
    <div className="main-content-block profilepage">
      <div className="container-fluid">
        <div className="about-user">
          <div className="row">
            <div className="col-md-12 ">
              <div className="mb-3 mt-4">
                <div className="internal-heading-sec">
                  <h3 className="about-title">My Borrowed NFTs</h3>
                </div>
              </div>
              <UserRentedNFT hideMenus={hideMenus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRentedNFTs;
