import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover, Modal, Button, Form } from "react-bootstrap";
import {
  openWindowBlank,
  calculateTimeLeft,
  sameField,
} from "../../utils/common";
import postOne from "../../images/post1.png";
import NFTStat from "../nft-stat";
import { promoteNFT, allowOrRevokeRental } from "../../api/methods-marketplace";
import { toast } from "react-toastify";
import ToolTip from "../tooltip/index";

import "./style.scss";
import { BiHelpCircle } from "react-icons/bi";
import { transferNFTApi as transferNFTApis } from "../../api/methods-marketplace";
import InputText from "../input-text";

const TransferCard = ({ nft, owned = false, isTransfer = false }) => {
  const { user } = useSelector((state) => state.user.data);
  const [imageloaded, setImageLoaded] = useState(false);

  const [timer, setTimer] = useState();
  const [selectedNFT, setSelectedNFT] = useState();
  const [loading, setLoading] = useState(false);
  const [confirmPopupInfo, setConfirmPopupInfo] = useState({});

  const role = nft?.core_statistics?.role?.value || "";

  const [transfer, setTransfer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [confirmAddress, setConfirmAddress] = useState("");

  const handleConfirm = (input, popupInfo = {}) => {
    setConfirmPopupInfo(popupInfo);
    setSelectedNFT(input);
  };

  const initiateTransfer = () => {
    setTransfer(false);
    setConfirm(true);
  };
  const handleSuccessTransfer = async () => {
    if (!sameField(address, confirmAddress))
      toast.error(`Wallet address doesn't match.`);
    else if (address.substring(0, 2) !== "0x")
      toast.error("Wallet address is invalid");
    else {
      setConfirm(false);
      try {
        console.log(nft, "nft");
        const nfts = [
          {
            nft_id: nft?.slug,
            quantity: 1,
          },
        ];
        const result = await transferNFTApis({
          nfts,
          to_address: address,
        });
        if (result?.data?.success) {
          setTransferSuccess(true);
        }
      } catch (error) {
        toast.error("OOPS...! Your NFT Transfer Has been failed...");
      }
    }
  };

  const handleOkay = async () => {
    setTransferSuccess(false);
    window.location.reload();
  };
  return (
    <div className="mynft-card-box">
      <div className="block-box user-post jt-card">
        <div className="item-post">
          {nft?.core_statistics?.rank?.value && (
            <span className="nft-type-badge-rank">
              <span className="rank-title">{`Rank ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}</span>
            </span>
          )}

          <NFTStat statistics={nft?.core_statistics} />

          {/* <video
            playsInline
            loop
            muted
            autoPlay
            src={
              nft?.asset_url
                ? nft?.asset_url
                : nft?.image_url
                ? nft?.image_url
                : postOne
            }
            // src={"https://cdn.jump.trade/7qu1iap6tpqej7mrtiqjpexet19f"}
            width="100%"
            alt="nft logo "
            role="button"
            style={imageloaded ? {} : { height: "20rem" }}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {
              openWindowBlank(
                `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
              );
            }}
          ></video> */}
          <img
            src={
              nft?.asset_url
                ? nft?.asset_url
                : nft?.image_url
                ? nft?.image_url
                : postOne
            }
            width="100%"
            alt="nft logo"
            role="button"
            style={imageloaded ? {} : { height: "20rem" }}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {
              openWindowBlank(
                `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
              );
            }}
          />
        </div>

        <div className="item-content transfer">
          <div className="post-title-box">
            {/* {user?.slug !== nft?.player_slug && (
              <span className="nft-type-badge-rank rented">
                <span className="rank-title">Rented</span>
              </span>
            )} */}

            <h6 className="post-title">{nft?.name}</h6>

            {/* <span className="nft-type-badge">
              {nft?.nft_type?.toUpperCase()}
            </span> */}
          </div>

          {/* <div className="post-cost pw_we  d-flex  justify-content-between">
            <div className="left-bids"></div>
            <div className="right-bid">
              {nft.quantity && (
                <>
                  <div className="post-sold-text end">You Own</div>
                  <div className="post-sold-cost end">{nft.quantity}</div>
                </>
              )}
            </div>
          </div> */}

          {isTransfer && (
            <button
              type="button"
              disabled={nft?.transfer_requested}
              onClick={() => {
                setTransfer(true);
                setAddress("");
                setConfirmAddress("");
              }}
              className={"btn btn-dark "}
            >
              {!nft?.transfer_requested ? "Transfer NFT" : "Transfer Initiated"}
            </button>
          )}
        </div>
      </div>

      {/* <Modal show={show} className="yeild-confirm-popup">
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By confirming, you consent to opt-in your NFT for the yield
            generation program.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-dark-secondary"
            onClick={() => set_show(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn btn-dark "
            onClick={handlePopConfirm}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={confirmPopupInfo?.show} className="yeild-confirm-popup">
        <Modal.Header>
          <Modal.Title>{confirmPopupInfo?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{confirmPopupInfo?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-dark-secondary"
            onClick={() => handleConfirm("", {})}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn btn-dark"
            onClick={confirmPopupInfo?.confirmAction}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={transfer}
        onHide={() => setTransfer(false)}
        backdrop="static"
        keyboard={false}
        className="transferNFT"
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer NFT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You're claiming the custody of your NFT to transfer them from the
            Jump.trade's Vault.
          </p>
          <p>
            Any discrepancies will not be Jump.trade's responsibility here
            after.
          </p>
          <p>
            Please ensure you enter the correct wallet address in the next step
            to a wallet that <b>supports Polygon, ERC721 standard.</b>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={initiateTransfer}
            variant="primary"
            className={`btn btn-dark w-100 rounded-pill btn-af-pay mt-2 mb-2`}
          >
            I UNDERSTAND
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={confirm}
        onHide={() => setConfirm(false)}
        className="transferNFT"
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer NFT to your wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div>
              <p>
                Please enter, and confirm a valid wallet address to ensure you
                receive your NFT securely.
              </p>
            </div>
            <div>
              <Form>
                <label className="labelTansfer"></label>
                <InputText
                  title="Enter Wallet Address"
                  name={"wallet_address"}
                  value={address}
                  lengthValue={42}
                  onChange={(e) => setAddress(e.target.value.toString().trim())}
                  placeholder="Eg. 0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"
                ></InputText>
                <label className="labelTansfer"></label>
                <InputText
                  title="Please Confirm Again"
                  name={"confirm-wallet_address"}
                  value={confirmAddress}
                  lengthValue={42}
                  onChange={(e) =>
                    setConfirmAddress(e.target.value.toString().trim())
                  }
                  placeholder="Eg. 0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"
                ></InputText>
              </Form>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            disabled={!address || !confirmAddress}
            onClick={handleSuccessTransfer}
            className={`btn btn-dark  w-100 rounded-pill btn-af-pay mt-6 mb-6`}
          >
            Transfer NFT
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={transferSuccess}
        onHide={() => {
          setTransferSuccess(false);
          window.location.reload();
        }}
        className="transferNFT"
        backdrop
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer Initiated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your transfer has been initiated! This can take up to 72 hours to
            process, thanks for your patience.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button
            type="button"
            className={`btn btn-dark  w-50 rounded-pill btn-af-pay mt-6 mb-6`}
            onClick={handleOkay}
          >
            Okay
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransferCard;
