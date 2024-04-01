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
import footer from "../../../images/jump-trade/image.png";
import InvoiceItemsTableW from "./InvoiceItemsTable";
import BillToAddress from "./BillToAddress";
import InvoiceNo from "./InvoiceNo";
import InvoiceTitle from "./InvoiceTitle";
import SoldByAddress from "./SoldByAddress";
// export const styles = StyleSheet.create({
//     font: { fontFamily: "Oswald" }
// });
const styles = StyleSheet.create({
  invoiceLogoContainer: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "flex-end",
  },
  Details: {
    marginTop: 10,
    marginBottom: 1,
    fontWeight: "bolder",
    fontSize: 12,
    color: "black",
    fontWeight: 900,
  },

  subTitle: {
    fontWeight: "bolder",
    textTransform: "capitalize",
    fontSize: 16,
    color: "#4472c4",
    fontWeight: 900,
  },
  subTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  note: {
    fontWeight: "bolder",
    textTransform: "capitalize",
    fontSize: 12,
    width: 140,
    alignItems: "end",
    justifyContent: "flex-start",

    // color: "#306EFF",
  },
  notecontent: {
    fontWeight: "bolder",
    textTransform: "capitalize",
    fontSize: 8,
    alignItems: "end",
    // color: "#306EFF",
    justifyContent: "flex-start",
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "",
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
    width: 125,
    height: 50,
    // float: "right",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mcllogo: {
    width: 30,
    height: 30,
    // float: "right",
    // display:"flex",
    // alignItems:"center",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 20,
    textAlign: "center",
  },
  footerContent: {
    paddingLeft: 50,
  },
});

const Invoice = ({ data }) => {
  const { invoice } = data;
  const { taxable, sold_to_address, bill_to_address, name, id, ordered_items } =
    invoice;
  if (invoice) {
    return (
      <Document style={styles.document}>
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.invoiceLogoContainer}>
            <Image style={styles.logo} src={logo} fixed />
          </View>
          <View style={{ padding: "20px" }}>
            <View style={styles.subTitleContainer} fixed>
              <Text style={styles.subTitle}>STATEMENT</Text>
            </View>
            <InvoiceNo invoice={invoice} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <SoldByAddress address={invoice.seller_details} name={name} />
              <BillToAddress address={invoice.buyer_details} name={name} />
            </View>
            <Text style={styles.Details}>Details</Text>
            <InvoiceItemsTableW invoice={invoice} />
          </View>
          {/* <Image style={styles.logo} src={logo} fixed /> */}
          <View style={styles.pageNumber} fixed>
            <Image style={styles.footerContent} src={footer} />
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
