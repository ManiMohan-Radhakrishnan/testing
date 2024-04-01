import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import ToolTip from "../tooltip/index";
import {
  currencyFormat,
  dynamicDecimalPrecision,
  EVENT_NAMES,
  formattedNumber,
  invokeTrackEvent,
  openWindowBlank,
  userBalanceDetailFormat,
} from "../../utils/common";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import {
  userDownloadInvoiceApi,
  userNFTInvoiceApi,
} from "../../api/methods-marketplace";
import sample from "../../images/post1.png";
import nonftfound from "../../images/nonftfound.svg";
import "./styles.scss";
import { Modal, Offcanvas, OffcanvasBody } from "react-bootstrap";
import PdfDocument from "../pdf-generator/PdfDownloadTax/PdfDocument";
import InvoiceTax from "../pdf-generator/PdfDownloadTax/InvoiceTax";
import countryJson from "../../utils/countries.json";
import { useSelector } from "react-redux";
import utCoin from "../../images/coin.png";
import { saveAs } from "file-saver";
import { List } from "react-content-loader";

const MyOrderCard = ({
  list = [],
  buyOrder = false,
  upgradeOrder = false,
  IsDownload = false,
  buyType = false,
  type,
}) => {
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [sellOrderDetails, setSellOrderDetails] = useState();
  const [showSellOrderDetails, setShowSellOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [invoiceData, setInvoiceData] = useState();
  const [typeStatus, setTypeStatus] = useState("buy");
  const paymentInfo = orderDetails?.order_payments || [];
  const taxInfo = paymentInfo[paymentInfo.length - 1];
  const isTDSApplicable =
    user?.data?.user?.apply_buy_tds && taxInfo?.tds_fee_rate;
  // const handleGenerateInvoice = async (e, input) => {
  //   e.stopPropagation();

  //   const result = await userNFTInvoiceApi(input);

  //   const { invoice } = result.data.data;

  //   if (invoice.buyer_kyc_completed) {
  //     //futher process - pdf generation
  //     setShow(true);

  //     setInvoiceData({
  //       invoice: {
  //         id: invoice?.invoice_details?.invoice_number,
  //         date: invoice?.invoice_details?.invoice_date,
  //         taxable: invoice?.seller_details?.gst ? true : false,
  //         name: `${invoice?.seller_details?.address?.first_name}`,
  //         to_name: `${invoice?.buyer_details?.address?.first_name}`,
  //         pan_no: invoice?.seller_details?.pan
  //           ? invoice?.seller_details?.pan
  //           : "",
  //         gst_no: invoice?.seller_details?.gst
  //           ? invoice?.seller_details?.gst
  //           : "",
  //         tan_no: invoice?.seller_details?.tan
  //           ? invoice?.seller_details?.tan
  //           : "",
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
  //                 ).name
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
  //             ? invoice?.buyer_details?.address.city
  //             : "",
  //           state: invoice?.buyer_details?.address?.state
  //             ? countryJson
  //                 .find(
  //                   (o) => o.code2 === invoice?.buyer_details?.address?.country
  //                 )
  //                 .states.find(
  //                   (c) => c.code === invoice?.buyer_details?.address?.state
  //                 ).name
  //             : "",
  //           country: countryJson.find(
  //             (o) => o.code2 === invoice?.buyer_details?.address?.country
  //           )?.name,
  //           pincode: invoice?.buyer_details?.address?.pincode,
  //         },
  //         ordered_items: [
  //           {
  //             id: 1,
  //             description: invoice?.nft_name,
  //             price: invoice?.invoice_details?.total_amount,
  //             quantity: invoice?.invoice_details?.quantity,
  //             tax_rate: 18,
  //             tax_type: "GST",
  //           },
  //         ],
  //       },
  //     });
  //   } else {
  //     toast.error("You need to complete your KYC");
  //   }
  // };

  const handlePDFDownload = async (slug) => {
    try {
      const result = await userDownloadInvoiceApi(slug);
      if (result?.status === 200) {
        let { data } = result;
        const blob = new Blob([data], { type: "application/pdf" });
        console.log(blob);
        saveAs(blob, "BuyerInvoice.pdf");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePDFDownloadSeller = async (slug) => {
    try {
      const result = await userDownloadInvoiceApi(slug);
      if (result?.status === 200) {
        let { data } = result;
        const blob = new Blob([data], { type: "application/pdf" });
        console.log(blob);
        saveAs(blob, "SellerInvoice.pdf");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calculateTotalAmountWithFee = (bAmt, s_fee, tds_fee, orderFees = 0) => {
    if (orderFees !== 0 && orderFees) {
      if (user?.data?.user?.apply_buy_tds && tds_fee && !isNaN(tds_fee))
        return formattedNumber(
          parseFloat(bAmt) +
            (parseFloat(orderFees) +
              parseFloat(bAmt) * parseFloat(tds_fee / 100)),
          2
        );
      else return formattedNumber(parseFloat(bAmt) + parseFloat(orderFees), 2);
    }
    let base = formattedNumber(bAmt, 2);
    let service = formattedNumber(s_fee, 2);
    let tds = formattedNumber(tds_fee, 2);
    if (user?.data?.user?.apply_buy_tds && tds && !isNaN(tds)) {
      return formattedNumber(
        parseFloat(base) + parseFloat((base * (service + tds)) / 100),
        2
      );
    } else
      return formattedNumber(
        parseFloat(base) + parseFloat((base * service) / 100),
        2
      );
  };

  const calculateTotalAmount = (
    buyAmount,
    taxAmount,
    tdsAmount,
    type,
    artistAmount = 0
  ) => {
    // console.log(tdsAmount)
    let ba;
    let tx;
    let artFee;
    let tds;
    let total;
    if (type === "sell") {
      ba = formattedNumber(parseFloat(buyAmount), 2);
      tx = formattedNumber(calculateFee(buyAmount, taxAmount), 2);
      artFee = formattedNumber(calculateFee(buyAmount, artistAmount), 2);
      tds = parseFloat(tdsAmount ? tdsAmount / 100 : 0);
      total = formattedNumber(ba - (tx + artFee), 2);
      if (user?.data?.user?.apply_sale_tds && !isNaN(tds))
        total = total - formattedNumber(total * tds, 2);
    }
    if (type === "buy") {
      ba = formattedNumber(parseFloat(buyAmount), 2);
      tx = formattedNumber(parseFloat(taxAmount), 2);
      tds = formattedNumber(parseFloat(tdsAmount ? tdsAmount : 0), 2);
      total = ba + tx;
      if (user?.data?.user?.apply_buy_tds && !isNaN(tds))
        // total = total + (total * tds) / 100;
        total += tds;
    }
    return typeof total === "number" ? total : undefined;
  };

  const calculateFee = (buyAmount, fee) => {
    return parseFloat(buyAmount) * parseFloat(fee / 100);
  };
  const calculateTdsFee = (buyAmount, fee, tds_fee) => {
    let feeFloat = formattedNumber(parseFloat(fee), 2);
    // let tds_fee_Float=parseFloat(tds_fee)
    let buyAmountFloat = formattedNumber(parseFloat(buyAmount), 2);
    let total = buyAmountFloat - calculateFee(buyAmount, feeFloat);
    return calculateFee(total, tds_fee);
  };
  const showOrderDetials = (e, order) => {
    e.stopPropagation();
    if (buyOrder) {
      if (order?.order_payments.length === 0)
        setOrderDetails({
          ...order,
          total_amount:
            order?.buy_amount + order?.fees + (order?.tds_fees || 0),
          order_payments: [
            {
              sub_total:
                order?.buy_amount + order?.fees + (order?.tds_fees || 0),
              sub_total_usd:
                order?.buy_amount + order?.fees + (order?.tds_fees || 0),
              buy_value: order?.buy_amount,
              service_fee: order?.fees,
              service_fee_in_usd: order?.fees,
              tds_fee: order?.tds_fees || 0,
              tds_fee_in_usd: order?.tds_fees || 0,
              payment_type: "usd",
              service_fee_rate: order?.service_fee,
              tds_fee_rate: order?.tds_rate,
            },
          ],
        });
      else setOrderDetails(order);
      setShowOrderDetails(true);
    } else {
      if (order?.status === "success") {
        setTypeStatus(order?.order_details[0].sale_type);
        setSellOrderDetails(order);
        setShowSellOrderDetails(true);
      } else {
        if (order?.is_buy && order?.is_bid) setTypeStatus("buy");
        else if (order?.is_buy) setTypeStatus("buy");
        else setTypeStatus("bid");
        setSellOrderDetails(order);
        setShowSellOrderDetails(true);
      }
    }
  };

  // const checkBuyType = () => {
  //   if (orderDetails?.order_payments?.length === 2) {
  //     if (taxInfo?.payment_type === "usd")
  //       setOrderDetails({
  //         ...orderDetails,
  //         order_payments: [
  //           orderDetails?.order_payments[1],
  //           taxInfo,
  //         ],
  //       });
  //     return "dollarJt";
  //   } else if (
  //     orderDetails?.order_payments?.length === 1 &&
  //     taxInfo?.payment_type === "assert"
  //   )
  //     return "jt";
  //   else if (
  //     orderDetails?.order_payments.length === 1 &&
  //     taxInfo.payment_type === "usd"
  //   )
  //     return "dollar";
  // };
  return (
    <>
      {list.length > 0 ? (
        list.map((order, i) => {
          let total_amount =
            order?.total_amount ||
            order?.buy_amount + order?.fees + (order?.tds_fees || 0);
          return (
            <>
              <article
                key={`order-${i}`}
                className={`myorder-card ${
                  buyOrder && buyType ? "buyorder" : ""
                }`}
                // onClick={() => {
                //   if (!upgradeOrder) {
                //     openWindowBlank(
                //       `${process.env.REACT_APP_MARKETPLACE_URL}/order/details/${order?.slug}/${order?.order_slug}`
                //     );
                //   } else {
                //     openWindowBlank(
                //       `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${order?.slug}`
                //     );
                //   }
                // }}
              >
                {/* {buyOrder && !IsDownload && (
                <div className="jt-usd-labelside">
                  {(() => {
                    if (
                      !order?.order_payments &&
                      order?.order_payments.length > 0
                    )
                      return "USD";
                    else if (order?.order_payments?.length === 2)
                      return "JT/USD";
                    else {
                      if (order?.order_payments[0]?.payment_type === "assert")
                        return "JT";
                      else return "USD";
                    }
                  })()}
                </div>
              )} */}
                <div
                  className="nft-info"
                  onClick={() => {
                    if (order?.bundle_id) {
                      return;
                    } else if (!upgradeOrder && !order?.drops_nft) {
                      openWindowBlank(
                        `${process.env.REACT_APP_MARKETPLACE_URL}/order/details/${order?.slug}/${order?.order_slug}`
                      );
                    } else if (order?.drops_nft) {
                      openWindowBlank(
                        `${process.env.REACT_APP_BALL_NFT_URL}/details/${order?.slug}`
                      );
                    } else {
                      openWindowBlank(
                        `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${order?.slug}`
                      );
                    }
                  }}
                >
                  <div className="nft-bundle-sec">
                    <div className="img-block">
                      <img
                        alt="NFT"
                        src={(() => {
                          if (order?.asset_type?.includes("image")) {
                            return order?.asset_url ? order?.asset_url : sample;
                          } else {
                            return order?.cover_url ? order?.cover_url : sample;
                          }
                        })()}
                      />
                    </div>
                    <div className="nft-base-detail">
                      <h6>
                        {/* {order?.nft_type?.toUpperCase()} |{" "} */}
                        {order?.category_name}{" "}
                        {order?.bundle_id && (
                          <span className="bundle-nft-badge">Bundle NFT</span>
                        )}{" "}
                        {order?.drops_nft && (
                          <span>
                            <i className="newbadge">drop</i>
                          </span>
                        )}
                        {/* | */}
                        {/* {order?.celebrity_id === 1
                          ? ` Amitabh Bachchan's Exclusive NFTs`
                          : ` Stan Lee's Exclusive NFTs`} */}
                      </h6>

                      <h4>{order?.name}</h4>
                      {/* <h5 className="mt-2">{order?.nft_type?.toUpperCase()}</h5> */}
                      {buyOrder ? (
                        <h5 className="mt-2 transform">
                          <span>Purchase Type:</span> {order?.sale_type}{" "}
                        </h5>
                      ) : !upgradeOrder ? (
                        <>
                          <h5 className="mt-2 transform">
                            <span>Sale Type:</span>{" "}
                            {(() => {
                              if (order?.status === "success") {
                                return order?.order_details[0].sale_type;
                              } else {
                                if (order?.is_buy && order?.is_bid)
                                  return "bid & buy";
                                else if (order?.is_buy) return "buy";
                                else return "bid";
                              }
                            })()}
                          </h5>
                        </>
                      ) : (
                        <>
                          <h5 className="mt-2">
                            <span>Level :</span> {order?.from_level}
                            {" to "}
                            {order?.to_level}
                          </h5>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {buyOrder ? (
                  <div className="myorder-info-block">
                    {IsDownload && (
                      <div className="myorder-price-info">
                        <h5>
                          <span className="caption">Qty:</span>{" "}
                          <b>{order?.buy_quantity}</b>{" "}
                          <span className="caption">Price:</span>{" "}
                          {`$${order?.buy_amount}`}
                        </h5>
                        {!order?.drops_nft && (
                          <h5>
                            <span className="caption">Service Fee:</span>{" "}
                            {parseFloat(
                              order?.order_payments?.length === 0
                                ? order?.service_fee
                                : order?.order_payments[0]?.service_fee_rate
                            )}
                            %{" "}
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
                          </h5>
                        )}
                        {!order?.drops_nft &&
                          user?.data?.user?.apply_buy_tds &&
                          !isNaN(parseFloat(order?.tds_rate)) && (
                            <h5>
                              <span className="caption">TDS:</span>{" "}
                              {order?.order_payments?.length === 0
                                ? parseFloat(order?.tds_rate)
                                : parseFloat(
                                    order?.order_payments[0]?.tds_fee_rate
                                  )}
                              %{" "}
                              <ToolTip
                                icon={
                                  <BsFillQuestionCircleFill
                                    size={16}
                                    className="mb-1 check-icon"
                                  />
                                }
                                content={"TDS u/s 194S Income Tax Act"}
                                placement="top"
                              />
                            </h5>
                          )}
                        <>
                          <h4>Total Amount: {`$${total_amount}`}</h4>
                        </>
                      </div>
                    )}

                    <div className="myorder-info">
                      {!IsDownload && (
                        <>
                          <h4> Total Amount: {`$${total_amount}`}</h4>
                        </>
                      )}
                      {IsDownload && (
                        <h5>
                          {dayjs(order?.updated_at).format(
                            " D MMM YYYY hh:mma"
                          )}
                        </h5>
                      )}
                      <div
                        className={`${
                          IsDownload && "invoicebtn-block"
                        } my-order-buttonflex`}
                      >
                        <span
                          className={`pill-status btn btn-sm rounded rounded-pill ps-4 pe-4 ${order?.status}`}
                        >
                          {order?.status === "pending"
                            ? `Transaction Pending`
                            : order?.status}
                        </span>
                        {!IsDownload && (
                          <button
                            type="button"
                            className="btn btn-dark btn-sm rounded rounded-pill ps-4 pe-4 btn-small"
                            onClick={(e) => {
                              invokeTrackEvent(
                                EVENT_NAMES?.ORDER_DETAILS_CHECKED,
                                {
                                  orderType: "Buy",
                                  name: order?.name,
                                  quantity: order?.total_quantity
                                    ? parseInt(order?.total_quantity)
                                    : null,
                                  price: order?.buy_amount
                                    ? parseInt(order?.buy_amount)
                                    : null,
                                  total_amount: total_amount
                                    ? parseInt(total_amount)
                                    : null,
                                }
                              );
                              showOrderDetials(e, order);
                            }}
                          >
                            Order Details
                          </button>
                        )}
                        {IsDownload ? (
                          <>
                            {order?.status === "transferred" && (
                              <button
                                type="button"
                                className="btn btn-dark btn-sm rounded rounded-pill ps-4 pe-4 btn-small"
                                // onClick={(e) =>
                                //   handleGenerateInvoice(
                                //     e,
                                //     order?.order_detail_slug
                                //   )
                                // }
                                onClick={() => {
                                  handlePDFDownload(order?.order_detail_slug);
                                  invokeTrackEvent(
                                    EVENT_NAMES?.DOWNLOAD_INVOICE,
                                    {
                                      type: "Buy orders",
                                      name: order?.name,
                                      Quantity: order?.buy_quantity
                                        ? parseInt(order?.buy_quantity)
                                        : null,
                                      "Service Fee": parseFloat(
                                        order?.service_fee
                                      ),
                                      TDS: parseFloat(
                                        order?.order_payments[0]?.tds_fee
                                      ),
                                      "Total Amount": order?.total_amount
                                        ? parseFloat(order?.total_amount)
                                        : null,
                                      "Order Date": dayjs(
                                        order?.updated_at
                                      ).format(" D MMM YYYY hh:mma "),
                                    }
                                  );
                                }}
                              >
                                Download Invoice
                              </button>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      {!IsDownload && (
                        <h5>
                          {dayjs(order?.updated_at).format(
                            " D MMM YYYY hh:mma"
                          )}
                        </h5>
                      )}
                    </div>
                  </div>
                ) : (
                  IsDownload && (
                    <div className="myorder-info-block">
                      <div className="myorder-price-info">
                        {order?.total_quantity > 0 && (
                          <h5>
                            <span className="caption">Edition(s):</span>{" "}
                            {order?.total_quantity} / {order?.total_quantity}
                          </h5>
                        )}
                        <h5>
                          {order?.is_bid && (
                            <span>
                              <span className="caption">Bid: </span>{" "}
                              {`$${order?.minimum_bid}`}
                            </span>
                          )}
                          {order?.is_buy && (
                            <span>
                              &nbsp; &nbsp;
                              <span className="caption">Buy: </span>{" "}
                              {`$${order?.buy_amount}`}
                            </span>
                          )}
                        </h5>
                      </div>
                      <div className="myorder-price-info">
                        {!upgradeOrder ? (
                          <>
                            <h5>
                              <span className="caption">Artist Fee:</span>{" "}
                              {parseFloat(order?.artist_fee)}%{" "}
                              <ToolTip
                                icon={
                                  <BsFillQuestionCircleFill
                                    size={16}
                                    className="mb-1 check-icon"
                                  />
                                }
                                content={
                                  "The royalty paid to the artist or the inspiration."
                                }
                                placement="top"
                              />
                            </h5>
                            <h5>
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
                            </h5>
                            {user?.data?.user?.apply_sale_tds &&
                              !isNaN(parseFloat(order?.tds_rate)) && (
                                <h5>
                                  <span className="caption">TDS:</span>{" "}
                                  {parseFloat(order?.tds_rate)}%{" "}
                                  <ToolTip
                                    icon={
                                      <BsFillQuestionCircleFill
                                        size={16}
                                        className="mb-1 check-icon"
                                      />
                                    }
                                    content={"TDS u/s 194S Income Tax Act"}
                                    placement="top"
                                  />
                                </h5>
                              )}
                            {/* {order?.status === "success" ? ( */}

                            {order?.is_buy &&
                              order?.order_details[0].sale_type === "buy" && (
                                <h4> Total Amount:{`$${total_amount}`} </h4>
                              )}
                            {order?.is_bid &&
                              order?.order_details[0].sale_type === "bid" && (
                                <h4>
                                  {" "}
                                  Total Amount:{`$${order?.bid_total_amount}`}{" "}
                                </h4>
                              )}

                            {/* ) : (
                            currencyFormat(
                              calculateTotalAmount(
                                order?.buy_amount,
                                parseFloat(order?.service_fee),
                                order?.tds_rate,
                                "sell",
                                parseFloat(order?.artist_fee)
                              ),
                              "USD"
                            )
                          )} */}
                          </>
                        ) : (
                          <>
                            {order?.payment_type == "assert" ? (
                              <>
                                <h4>
                                  Total Amount: {parseFloat(order?.buy_value)}{" "}
                                  JT POINTS
                                </h4>
                                <p>Equivalent USD {order?.equivalent_usd}</p>
                              </>
                            ) : (
                              <h4>Total Amount: {`$${order?.buy_value}`}</h4>
                            )}
                          </>
                        )}
                      </div>

                      <div className="myorder-info">
                        <h5>
                          {!upgradeOrder
                            ? dayjs(order?.created_at).format(
                                " D MMM YYYY hh:mma"
                              )
                            : dayjs(order?.upgraded_at).format(
                                " D MMM YYYY hh:mma"
                              )}
                        </h5>

                        <div className="my-order-buttonflex invoicebtn-block">
                          {!upgradeOrder && (
                            <span
                              className={`pill-status mt-2 ${order?.status}`}
                            >
                              {order?.status?.replace("_", " ")}
                            </span>
                          )}
                          {IsDownload ? (
                            <>
                              {order?.invoices.length > 0 && (
                                <button
                                  type="button"
                                  className="btn btn-dark btn-sm rounded rounded-pill ps-4 pe-4 btn-small"
                                  onClick={() => {
                                    handlePDFDownloadSeller(
                                      order?.invoices[0].order_detail_slug
                                    );
                                    invokeTrackEvent(
                                      EVENT_NAMES?.DOWNLOAD_INVOICE,
                                      {
                                        type: "Sell orders",
                                        name: order?.name,
                                        Quantity: order?.buy_quantity
                                          ? parseInt(order?.buy_quantity)
                                          : null,
                                        "Service Fee": parseFloat(
                                          order?.service_fee
                                        ),
                                        TDS: order?.order_details[0]?.tds_fee
                                          ? parseFloat(
                                              order?.order_details[0]?.tds_fee
                                            )
                                          : null,
                                        "Total Amount": order?.total_amount
                                          ? parseFloat(order?.total_amount)
                                          : null,
                                        "Order Date": dayjs(
                                          order?.updated_at
                                        ).format(" D MMM YYYY hh:mma "),
                                      }
                                    );
                                  }}
                                >
                                  Download Invoice
                                </button>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
                {!buyOrder && !IsDownload && (
                  <div className="myorder-info-block">
                    {!upgradeOrder ? (
                      <div className="myorder-info">
                        <>
                          {(() => {
                            if (order?.status === "success") {
                              return (
                                <>
                                  <h4>
                                    Total Amount:{" "}
                                    {`$${
                                      order?.order_details[0] &&
                                      order?.order_details[0]?.sale_type ===
                                        "buy"
                                        ? total_amount
                                        : order?.bid_total_amount
                                    }`}
                                  </h4>
                                </>
                              );
                            } else {
                              if (order?.is_bid && order?.is_buy) {
                                return (
                                  <>
                                    <h4>
                                      <span className="bid-key">
                                        Minimum Bid:&nbsp;
                                      </span>
                                      <span className="bid-value">
                                        {`$${order?.minimum_bid}`}
                                      </span>{" "}
                                      <br />
                                      <span className="buy-key">
                                        Buy Amount:&nbsp;
                                      </span>
                                      <span className="buy-value">
                                        {`$${order?.buy_amount}`}
                                      </span>
                                    </h4>
                                  </>
                                );
                              } else {
                                return (
                                  <h4>
                                    {" "}
                                    {order?.is_buy ? "Buy" : "Bid"} Amount:{" "}
                                    {`$${
                                      order?.is_buy
                                        ? order?.buy_amount
                                        : order?.minimum_bid
                                    }`}
                                  </h4>
                                );
                              }
                            }
                          })()}
                        </>
                        <div
                          className={`${
                            IsDownload && "invoicebtn-block"
                          } my-order-buttonflex`}
                        >
                          <span
                            className={`pill-status btn btn-sm rounded rounded-pill ps-4 pe-4 ${order?.status}`}
                          >
                            {order?.status === "pending"
                              ? `Transaction Pending`
                              : order?.status}
                          </span>
                          {order?.status !== "cancelled" && (
                            <button
                              type="button"
                              className="btn btn-dark btn-sm rounded rounded-pill ps-4 pe-4 btn-small"
                              onClick={(e) => {
                                showOrderDetials(e, order);
                                invokeTrackEvent(
                                  EVENT_NAMES?.ORDER_DETAILS_CHECKED,
                                  {
                                    orderType: "Sellorders",
                                    name: order?.name,
                                    quantity: parseInt(order?.total_quantity),
                                    amount: parseInt(order?.buy_amount),
                                    total_amount: total_amount
                                      ? parseInt(total_amount)
                                      : null,
                                  }
                                );
                              }}
                            >
                              Order Details
                            </button>
                          )}
                        </div>
                        <h5>
                          {dayjs(order?.created_at).format(
                            " D MMM YYYY hh:mma"
                          )}
                        </h5>
                      </div>
                    ) : (
                      <div className="myorder-info">
                        <>
                          {/* !!!!! Add Reward Points Here */}
                          <h4>
                            {order?.payment_type === "usd"
                              ? `Total Amount: $${order?.buy_value}`
                              : `Total Amount : ${order?.buy_value} JT ($${order?.equivalent_usd})`}
                          </h4>
                        </>
                        <div
                          className={`${
                            IsDownload && "invoicebtn-block"
                          } my-order-buttonflex`}
                        >
                          <span
                            className={`pill-status btn btn-sm rounded rounded-pill ps-4 pe-4 onsale`}
                          >
                            Upgraded
                          </span>
                        </div>
                        <h5>
                          {dayjs(order?.upgraded_at).format(
                            " D MMM YYYY hh:mma"
                          )}
                        </h5>
                      </div>
                    )}
                  </div>
                )}

                {!buyOrder && order?.timed_auction && (
                  <div className="auction-flex">
                    <h5 className="auction_time">
                      <span className="caption">
                        Auction Starting Date: &nbsp;
                      </span>
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
                        {dayjs(order?.auction_end_time).format(
                          "D MMM YYYY hh:mma"
                        )}
                      </b>
                    </h5>
                  </div>
                )}
              </article>
            </>
          );
        })
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="Nonftfound" />
            <h4>
              {type === "upgrade-orders"
                ? "No upgrade found!"
                : "No orders found!"}
            </h4>
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
              document={<InvoiceTax data={invoiceData} />}
            />
          )}
        </div>
      </Modal>
      {/* Buy Order Popup */}
      <Offcanvas
        show={showOrderDetails}
        onHide={() => setShowOrderDetails(!showOrderDetails)}
        placement="end"
        className="popup-wrapper-canvas"
        backdrop={"true"}
      >
        <Offcanvas.Body className="myorder-details-body-container">
          <div className="myorder-details-nft-details">
            <div className="myorder-details-head-content">
              <div className="myorder-details-title">Order Details</div>
              <div
                className="close-button-pop"
                onClick={() => setShowOrderDetails(!showOrderDetails)}
              >
                <img
                  alt="place bid logo"
                  src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                />
              </div>
            </div>
            <div className="myorder-details-progress">
              <div className="progress-complete"></div>
            </div>
            <div className="myorder-details-bodyContent">
              <div className="myorder-details-nft-info">
                <div className="myorder-details-nft-media">
                  <img
                    alt="media logo"
                    className="type_image typeimg_audio"
                    src={(() => {
                      if (orderDetails?.asset_type?.includes("image")) {
                        return orderDetails?.asset_url
                          ? orderDetails?.asset_url
                          : sample;
                      } else {
                        return orderDetails?.cover_url
                          ? orderDetails?.cover_url
                          : sample;
                      }
                    })()}
                    loading="lazy"
                  />
                </div>
                <div className="myorder-details-nft-content">
                  <div className="pop-author-name flex-align">
                    {orderDetails?.category_name}
                    {orderDetails?.bundle_id && (
                      <>
                        {" "}
                        | <span className="bundle-order-badge">Bundle NFT</span>
                      </>
                    )}
                  </div>
                  <div className="myorder-details-nft-title text-center mb-1">
                    {orderDetails?.name}
                  </div>
                  <></>
                  <div className="sticky-bottom">
                    <h6 className="purchase-type">
                      Purchase Type : <span> {orderDetails?.sale_type}</span>
                    </h6>
                    <h6 className="purchase-date">
                      {dayjs(orderDetails?.updated_at).format(
                        " D MMM YYYY hh:mma"
                      )}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="sticky-bottom-fix">
                <div className="price-flex">
                  <span className="qty-value">
                    Qty : <span>{orderDetails?.buy_quantity}</span>
                  </span>

                  <span className="price-value">
                    Price: <span>{`$${orderDetails?.buy_amount}`}</span>
                  </span>
                </div>
                {!orderDetails?.drops_nft && (
                  <div className="price-flex">
                    <span className="qty-value">
                      Service Fee:
                      {` ${taxInfo?.service_fee_rate}% `}
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
                      {isTDSApplicable ? (
                        <>
                          {" "}
                          + TDS Fee :{` ${taxInfo?.tds_fee_rate}% `}
                          <ToolTip
                            icon={
                              <BsFillQuestionCircleFill
                                size={16}
                                className="mb-1 check-icon"
                              />
                            }
                            content={"TDS u/s 194S Income Tax Act"}
                            placement="top"
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </span>
                    <span className="price-value">
                      <span>
                        $
                        {dynamicDecimalPrecision(
                          parseFloat(taxInfo?.service_fee_in_usd) +
                            parseFloat(taxInfo?.tds_fee_in_usd)
                        )}
                      </span>
                    </span>
                  </div>
                )}
                <div className="price-flex-column">
                  {paymentInfo.map((info) => {
                    let {
                      display_name,
                      payment_type,
                      sub_total,
                      sub_total_usd,
                    } = info;
                    let asset_description = "Used USD";
                    if (payment_type !== "usd" && display_name)
                      asset_description =
                        `Used ${display_name} (${userBalanceDetailFormat(
                          sub_total
                        )})`.trim();
                    return (
                      <div className="sub-price-flex">
                        <span className="qty-value">{asset_description}</span>
                        <span className="price-value">
                          {payment_type === "assert" ? (
                            <span>${sub_total_usd}</span>
                          ) : (
                            <span>${sub_total}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bottom-area">
              <div className="bottom-content-pop">
                <div className="flex-total">
                  <span className="total-title">Total Amount </span>
                  <span className="total-value">
                    {`$${orderDetails?.total_amount}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Sell Order Popup */}
      <Offcanvas
        show={showSellOrderDetails}
        onHide={() => setShowSellOrderDetails(!showSellOrderDetails)}
        placement="end"
        className="popup-wrapper-canvas"
        backdrop={"true"}
      >
        <Offcanvas.Body className="myorder-details-body-container">
          <div className="myorder-details-nft-details">
            <div className="myorder-details-head-content">
              <div className="myorder-details-title">Order Details</div>
              <div
                className="close-button-pop"
                onClick={() => setShowSellOrderDetails(!showSellOrderDetails)}
              >
                <img
                  alt="place bid logo"
                  src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                />
              </div>
            </div>
            <div className="myorder-details-progress">
              <div className="progress-complete"></div>
            </div>
            <div className="myorder-details-bodyContent">
              <div className="myorder-details-nft-info">
                <div className="myorder-details-nft-media">
                  <img
                    alt="media logo"
                    className="type_image typeimg_audio"
                    src={(() => {
                      if (sellOrderDetails?.asset_type?.includes("image")) {
                        return sellOrderDetails?.asset_url
                          ? sellOrderDetails?.asset_url
                          : sample;
                      } else {
                        return sellOrderDetails?.cover_url
                          ? sellOrderDetails?.cover_url
                          : sample;
                      }
                    })()}
                    loading="lazy"
                  />
                </div>
                <div className="myorder-details-nft-content">
                  <div className="pop-author-name flex-align">
                    {sellOrderDetails?.category_name}
                    {sellOrderDetails?.bundle_id && (
                      <>
                        {" "}
                        | <span className="bundle-order-badge">Bundle NFT</span>
                      </>
                    )}
                  </div>
                  <div className="myorder-details-nft-title text-center mb-1">
                    {sellOrderDetails?.name}
                  </div>

                  <div className="sticky-bottom">
                    <h6 className="purchase-type">
                      Sale Type :{" "}
                      <span>
                        {" "}
                        {(() => {
                          if (sellOrderDetails?.status !== "onsale") {
                            return sellOrderDetails?.order_details[0]
                              ?.sale_type;
                          } else {
                            if (
                              sellOrderDetails?.is_bid &&
                              sellOrderDetails?.is_buy
                            )
                              return "Bid & Buy";
                            else if (sellOrderDetails?.is_buy) return "Buy";
                            else return "Bid";
                          }
                        })()}
                      </span>
                    </h6>
                    <h6 className="purchase-date">
                      {dayjs(sellOrderDetails?.created_at).format(
                        " D MMM YYYY hh:mma"
                      )}
                    </h6>
                  </div>
                </div>
              </div>
              {sellOrderDetails?.is_bid &&
                sellOrderDetails?.is_buy &&
                sellOrderDetails?.status === "onsale" && (
                  <>
                    <div className="flex-buy-bid-pill">
                      <button
                        className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-buy-bid-pill ${
                          typeStatus === "buy" && "active"
                        }`}
                        onClick={() => setTypeStatus("buy")}
                      >
                        Buy
                      </button>
                      <button
                        className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-buy-bid-pill ${
                          typeStatus === "bid" && "active"
                        }`}
                        onClick={() => setTypeStatus("bid")}
                      >
                        Bid
                      </button>
                    </div>
                  </>
                )}
              <div className="sticky-bottom-fix">
                <div className="price-flex">
                  <span className="qty-value">
                    Qty : <span>{sellOrderDetails?.total_quantity}</span>
                  </span>

                  <span className="price-value">
                    {typeStatus === "buy" ? `Price:` : `Bid Amount:`}{" "}
                    <span>
                      {`$${
                        typeStatus === "buy"
                          ? sellOrderDetails?.buy_amount
                          : sellOrderDetails?.minimum_bid
                      }`}
                    </span>
                    {typeStatus === "bid" && (
                      <span className="startbid">
                        <span className="title"> Starting Bid: </span>{" "}
                        {`$${sellOrderDetails?.starting_bid}`}{" "}
                      </span>
                    )}
                  </span>
                </div>
                <div className="single-payment-flex">
                  <ul className="payfee-list">
                    <li>
                      <span className="payfee-key">Sub Total :</span>
                      <span className="payfee-value">
                        {typeStatus === "buy"
                          ? `$${
                              sellOrderDetails?.total_quantity *
                              sellOrderDetails?.buy_amount
                            }`
                          : `$${sellOrderDetails?.minimum_bid}`}
                      </span>
                    </li>
                    <li>
                      <span className="payfee-key">
                        <span className="caption">Artist Fee:</span>
                        <span className="fee-percentage-val">
                          {parseFloat(sellOrderDetails?.artist_fee)}%{" "}
                          <ToolTip
                            icon={
                              <BsFillQuestionCircleFill
                                size={16}
                                className="mb-1 check-icon"
                              />
                            }
                            content={
                              "The royalty paid to the artist or the inspiration."
                            }
                            placement="top"
                          />
                        </span>
                      </span>
                      <span className="payfee-value">
                        <span style={{ color: "red" }}>-&nbsp; </span>
                        {`$${
                          typeStatus === "buy"
                            ? sellOrderDetails?.artist_fee_in_usd
                            : sellOrderDetails?.bid_artist_fee_in_usd
                        }`}
                      </span>
                    </li>
                    <li>
                      <span className="payfee-key">
                        <span className="caption">Service Fee:</span>
                        <span className="fee-percentage-val">
                          {parseFloat(sellOrderDetails?.service_fee)}%{" "}
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
                        </span>
                      </span>
                      <span className="payfee-value">
                        <span style={{ color: "red" }}>-&nbsp;</span>
                        {`$${
                          typeStatus === "buy"
                            ? sellOrderDetails?.service_fee_in_usd
                            : sellOrderDetails?.bid_service_fee_in_usd
                        }`}
                      </span>{" "}
                    </li>
                    {user?.data?.user?.apply_sale_tds &&
                      (sellOrderDetails?.tds_fee_in_usd ||
                        sellOrderDetails?.bid_tds_fee_in_usd) >= 0 && (
                        <li>
                          <span className="payfee-key">
                            <span className="caption">TDS Fee:</span>
                            <span className="fee-percentage-val">
                              {sellOrderDetails?.tds_rate || 1}
                              %
                              <ToolTip
                                icon={
                                  <BsFillQuestionCircleFill
                                    size={16}
                                    className="mb-1 check-icon"
                                  />
                                }
                                content={"TDS u/s 194S Income Tax Act"}
                                placement="top"
                              />
                            </span>
                          </span>
                          <span className="payfee-value">
                            <span style={{ color: "red" }}>-&nbsp;</span>
                            {`$${
                              typeStatus === "buy"
                                ? sellOrderDetails?.tds_fee_in_usd
                                : sellOrderDetails?.bid_tds_fee_in_usd
                            }`}
                          </span>
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bottom-area">
              <div className="bottom-content-pop">
                <div className="flex-total">
                  <span className="total-title">Total Amount </span>
                  <span className="total-value">
                    {`$${
                      typeStatus === "buy"
                        ? sellOrderDetails?.total_amount
                        : sellOrderDetails?.bid_total_amount
                    }`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MyOrderCard;
