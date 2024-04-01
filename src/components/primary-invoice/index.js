import React, { useState } from "react";
import dayjs from "dayjs";
// import { toast } from "react-toastify";
// import ToolTip from "../tooltip/index";
import { currencyFormat } from "../../utils/common";
// import { openWindowBlank } from "../../utils/common";
// import { BsFillQuestionCircleFill } from "react-icons/bs";
import { PrimaryInvoiceDownloadApi } from "../../api/methods-marketplace";
// import {
//   primaryInvoicesApi
// } from "../../api/methods-marketplace";
import loot from "../../images/loot_box.jpg";
import nonftfound from "../../images/nonftfound.svg";
import "./styles.scss";
import { Modal } from "react-bootstrap";
import PdfDocument from "../pdf-generator/PdfDownloadTax/PdfDocument";
import Invoice from "../pdf-generator/PrimarySalePdfDownload/Invoice";
// import countryJson from "../../utils/countries.json";
import { saveAs } from "file-saver";

const PrimaryInvoice = ({ list = [], buyOrder = false }) => {
  const [show, setShow] = useState(false);

  const [invoiceData, setInvoiceData] = useState();
  const [data, setData] = useState();

  const handlePDFDownload = async (slug) => {
    try {
      const result = await PrimaryInvoiceDownloadApi(slug);
      console.log(result, "result");
      if (result?.status === 200) {
        let { data } = result;
        const blob = new Blob([data], { type: "application/pdf" });
        console.log(blob);
        saveAs(blob, "DropInvoice.pdf");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleGenerateInvoice = async (e, input) => {
  //   e.stopPropagation();

  //   const result = await primaryInvoicesApi(input);

  //   const { invoice } = result.data.data;

  //   setData(result.data.data);
  //   console.log(data, "invoicedata");
  //   console.log(data, "invoicedata");

  //   if (invoice.buyer_kyc) {
  //     //futher process - pdf generation
  //     setShow(true);

  //     let price =
  //       invoice?.payment_type == "assert"
  //         ? invoice?.invoice_details?.total_amount / invoice?.usd_per_value
  //         : invoice?.invoice_details?.total_amount;

  //     let currency = invoice?.payment_type == "assert" ? "JT" : "";

  //     let taxable =
  //       invoice?.payment_type == "assert"
  //         ? false
  //         : invoice?.seller_details?.gst
  //         ? true
  //         : false;

  //     // console.log("first_name", invoice?.seller_details?.address);
  //     setInvoiceData({
  //       invoice: {
  //         id: invoice?.invoice_number,
  //         // date: invoice?.invoice_date,
  //         taxable: taxable,
  //         name: `${invoice?.seller_details?.address?.first_name} ${invoice.seller_details?.address?.last_name}`,
  //         to_name: `${invoice?.buyer_details?.address?.first_name} ${invoice.buyer_details?.address?.last_name}`,
  //         pan_no: invoice?.seller_details?.pan
  //           ? invoice?.seller_details?.pan
  //           : "",
  //         gst_no: invoice?.seller_details?.gst
  //           ? invoice?.seller_details?.gst
  //           : "",
  //         tan_no: invoice?.seller_details?.tan
  //           ? invoice?.seller_details?.tan
  //           : "",
  //         net_amount: invoice?.net_amount,
  //         unit_price: invoice?.unit_price,
  //         quantity: invoice?.quantity,
  //         category_name: invoice?.category_name,
  //         usd_per_value: invoice?.total_amount,
  //         currency: currency,
  //         sold_to_address: {
  //           // street1: invoice.seller_details.address.line1,
  //           // street2: invoice.seller_details.address.line2
  //           //   ? invoice.seller_details.address.line2
  //           //   : "",
  //           city: invoice?.seller_details?.address?.city
  //             ? invoice.seller_details.address.city
  //             : "",
  //           state: invoice?.seller_details?.address?.state
  //             ? countryJson
  //                 .find(
  //                   (o) => o.code2 === invoice?.seller_details?.address?.country
  //                 )
  //                 .states.find(
  //                   (c) => c.code === invoice?.seller_details?.address?.state
  //                 )?.name
  //             : "",
  //           country: countryJson.find(
  //             (o) => o.code2 === invoice?.seller_details?.address?.country
  //           )?.name,
  //           pincode: invoice?.seller_details?.address?.pincode,
  //         },
  //         bill_to_address: {
  //           // street1: invoice.buyer_details.address.line1,
  //           // street2: invoice.buyer_details.address.line2
  //           //   ? invoice.buyer_details.address.line2
  //           //   : "",
  //           city: invoice?.buyer_details?.address?.city
  //             ? invoice?.buyer_details?.address?.city
  //             : "",
  //           state: invoice?.buyer_details?.address?.state
  //             ? countryJson
  //                 .find(
  //                   (o) => o.code2 === invoice?.buyer_details?.address?.country
  //                 )
  //                 .states.find(
  //                   (c) => c.code === invoice?.buyer_details?.address?.state
  //                 )?.name
  //             : "",
  //           country: countryJson.find(
  //             (o) => o.code2 === invoice?.buyer_details?.address?.country
  //           )?.name,
  //           pincode: invoice.buyer_details?.address?.pincode,
  //         },
  //         // ordered_items: [
  //         //   {
  //         //     id: 1,
  //         //     description: invoice?.nft_name,
  //         //     price: price,

  //         //     quantity: invoice?.invoice_details?.quantity,
  //         //     tax_rate: 18,
  //         //     tax_type: "GST",
  //         //   },
  //         // ],
  //       },
  //     });
  //   } else {
  //     toast.error("You need to complete your KYC");
  //   }
  // };

  return (
    <>
      {list.length > 0 ? (
        list.map((order, i) => (
          <article
            key={`order-${i}`}
            className="primary-invoice-card"
            // onClick={() =>
            //   openWindowBlank(
            //     `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${order?.slug}`
            //   )
            // }
          >
            <div className="nft-info">
              <div className="img-block">
                <img
                  alt="NFT"
                  src={(() => {
                    if (order?.asset_type?.includes("image")) {
                      return order?.asset_url ? order?.asset_url : loot;
                    } else {
                      return order?.cover_url ? order?.cover_url : loot;
                    }
                  })()}
                />
              </div>
              <div className="nft-base-detail">
                <h6>
                  ERC721 |{" "}
                  {order?.celebrity_name
                    ? order.celebrity_name
                    : "Meta Cricket League NFTs"}
                </h6>
                <h4>{order?.category_name}</h4>
                {/* <h5 className="mt-2">{order?.nft_type?.toUpperCase()}</h5> */}
                {buyOrder ? (
                  <h5 className="mt-2 transform">
                    <span>Purchase Type: </span>Buy{" "}
                  </h5>
                ) : (
                  <h5 className="mt-2 transform">
                    <span> Level :</span>{" "}
                    {order?.core_statistics?.level?.value &&
                      order?.core_statistics?.level?.value}
                  </h5>
                )}
              </div>
            </div>
            {buyOrder ? (
              <div className="myorder-info-block">
                <div className="myorder-price-info">
                  <h5>
                    <span className="caption">Qty:</span>{" "}
                    <b>{order?.quantity}</b>{" "}
                    <span className="caption">Price:</span>{" "}
                    {currencyFormat(parseFloat(order?.unit_price), "USD")}
                  </h5>
                  {order?.discount > 0 && order?.discount ? (
                    <h5>
                      <span className="caption">Discount:</span>{" "}
                      <b>{currencyFormat(parseFloat(order.discount))}</b>
                    </h5>
                  ) : (
                    ""
                  )}
                  {/* <h5>
                    <span className="caption">Service Fee:</span>{" "}
                    {parseFloat(order?.service_fee)}%{" "}
                    <ToolTip
                      icon={
                        <BsFillQuestionCircleFill
                          size={16}
                          className="mb-1 check-icon"
                        />
                      }
                      content={
                        "The service fee includes gas fee and the platform fee."
                      }
                      placement="top"
                    />
                  </h5> */}
                  <h4>
                    Total Amount:{" "}
                    {currencyFormat(parseFloat(order?.net_amount), "USD")}
                  </h4>
                </div>
                <div className="myorder-info">
                  <h5>
                    {dayjs(order?.created_at).format(" D MMM YYYY hh:mma")}
                  </h5>
                  <span className={`pill-status mt-2 ${order?.status}`}>
                    {order?.status === "pending"
                      ? `Transaction Pending`
                      : order?.status}
                  </span>
                  {/* {order?.status === "transferred" && ( */}
                  <button
                    type="button"
                    className="btn btn-dark btn-sm rounded rounded-pill ps-4 pe-4 btn-small"
                    // onClick={(e) => handleGenerateInvoice(e, order?.slug)}
                    onClick={() => handlePDFDownload(order?.slug)}
                  >
                    Download Invoice
                  </button>
                  {/* // )} */}
                </div>
              </div>
            ) : (
              <div className="myorder-info-block">
                <div className="myorder-price-info">
                  {order?.total_quantity > 0 && (
                    <h5>
                      <span className="caption">Edition(s):</span>{" "}
                      {order?.total_quantity} / {order?.total_quantity}
                    </h5>
                  )}
                  <h5>
                    {/* {(() => {
                      if (order?.is_bid && order?.is_buy) {
                        return (
                          <span>
                            <span className="caption">Bid / Buy : </span>{" "}
                            {currencyFormat(
                              parseFloat(order?.minimum_bid),
                              "USD"
                            )}{" "}
                            <span className="caption"> / </span>
                            {currencyFormat(
                              parseFloat(order?.buy_amount),
                              "USD"
                            )}
                          </span>
                        );
                      } else if (order?.is_bid) {
                        return (
                          <span>
                            <span className="caption">Bid: </span>{" "}
                            {currencyFormat(
                              parseFloat(order?.minimum_bid),
                              "USD"
                            )}
                          </span>
                        );
                      } else if (order?.is_buy) {
                        return (
                          <span>
                            <span className="caption">Buy: </span>{" "}
                            {currencyFormat(
                              parseFloat(order?.buy_amount),
                              "USD"
                            )}
                          </span>
                        );
                      }
                    })()} */}
                    {order?.is_bid && (
                      <span>
                        <span className="caption">Bid: </span>{" "}
                        {currencyFormat(parseFloat(order?.minimum_bid), "USD")}
                      </span>
                    )}
                    {order?.is_buy && (
                      <span>
                        &nbsp; &nbsp;
                        <span className="caption">Buy: </span>{" "}
                        {currencyFormat(parseFloat(order?.buy_amount), "USD")}
                      </span>
                    )}
                  </h5>
                </div>
                <div className="myorder-price-info">
                  {order?.payment_type === "assert" ? (
                    <>
                      <h4>
                        Total Amount: {parseFloat(order?.buy_value)} JT POINTS
                      </h4>
                      <p>Equivalent USD {order?.equivalent_usd}</p>
                    </>
                  ) : (
                    <h4>
                      Total Amount:{" "}
                      {currencyFormat(
                        order?.buy_value,

                        "USD"
                      )}
                    </h4>
                  )}
                </div>
                <div className="myorder-info">
                  <h5>
                    {dayjs(order?.created_at).format(" D MMM YYYY hh:mma")}
                  </h5>
                  {/* <span className={`pill-status mt-2 ${order?.status}`}>
                    {order?.status?.replace("_", " ")}
                  </span> */}
                  {order?.slug && order?.buyer_kyc && (
                    <button
                      type="button"
                      className="btn btn-dark btn-sm rounded rounded-pill ps-4 pe-4 btn-small"
                      // onClick={(e) => handleGenerateInvoice(e, order?.slug)}
                      onClick={() => handlePDFDownload(order?.slug)}
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            )}

            {!buyOrder && order?.timed_auction && (
              <div className="auction-flex">
                <h5 className="auction_time">
                  <span className="caption">Auction Starting Date: &nbsp;</span>
                  <b>
                    {dayjs(order?.auction_start_time).format(
                      "D MMM YYYY hh:mma"
                    )}
                  </b>
                </h5>
                <h5 className="auction_time">
                  <span className="caption">
                    Auction Expiration Date: &nbsp;
                  </span>
                  <b>
                    {dayjs(order?.auction_end_time).format("D MMM YYYY hh:mma")}
                  </b>
                </h5>
              </div>
            )}
          </article>
        ))
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="" />
            <h4>No orders found!</h4>
          </div>
        </div>
      )}

      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          setInvoiceData(null);
        }}
      >
        <Modal.Header closeButton>
          <h3>Download your Invoice</h3>
        </Modal.Header>
        <div className="p-4">
          <div className="mb-4">
            An Invoice has been generated for your order and it is available for
            download.
          </div>
          {invoiceData && (
            <PdfDocument
              title={invoiceData.invoice.id}
              document={<Invoice data={data} />}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default PrimaryInvoice;
