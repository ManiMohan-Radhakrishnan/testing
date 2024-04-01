import React from "react";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../images/jump-trade/jt-logo.png";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceItemsTableW from "../PdfDownload/InvoiceItemsTable";

import BillToAddress from "./BillToAddress";
import InvoiceNo from "./InvoiceNo";
import InvoiceTitle from "./InvoiceTitle";
import SoldByAddress from "./SoldByAddress";
import InvoiceGstNo from "./InvoiceGstNo";
// export const styles = StyleSheet.create({
//     font: { fontFamily: "Oswald" }
// });
const styles = StyleSheet.create({
  subTitle: {
    fontWeight: "bolder",
    textTransform: "capitalize",
    fontSize: 20,
  },
  subTitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 225,
    height: 30,
    float: "left",
  },
});

const Invoice = ({ data }) => {
  const { invoice } = data;
  const {
    taxable,
    sold_to_address,
    bill_to_address,
    name,
    to_name,
    id,
    ordered_items,
    gst_no,
    pan_no,
    currency,
    usd_per_value,
  } = invoice;
  if (invoice) {
    return (
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <View>
            <Image style={styles.logo} src={logo} fixed />
            <View style={styles.subTitleContainer} fixed>
              <Text style={styles.subTitle}>
                {invoice.taxable ? "Tax Invoice" : "Invoice"}
              </Text>
            </View>
            <InvoiceNo invoice={invoice} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <SoldByAddress address={sold_to_address} name={name} />
              <BillToAddress
                address={bill_to_address}
                name={to_name}
                taxable={taxable}
                gst_no={gst_no}
              />
            </View>
            {/* <View style={{ justifyContent: "space-between" }}> */}
            {/* <InvoiceGstNo invoice={invoice} /> */}

            {/* </View> */}
            {invoice.taxable ? (
              <InvoiceItemsTable invoice={invoice} />
            ) : (
              <InvoiceItemsTableW invoice={invoice} currency={currency} />
            )}
          </View>
        </Page>
      </Document>
    );
  } else
    return (
      <Document>
        <Page size="A4">
          <View>
            <Text>This Pdf could not be generated</Text>
          </View>
        </Page>
      </Document>
    );
};

export default Invoice;
