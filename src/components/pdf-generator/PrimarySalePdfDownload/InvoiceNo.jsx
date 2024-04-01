import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "flex-start",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "flex-start",
    marginLeft: 80,
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 135,
    fontSize: 12,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

const InvoiceNo = ({ invoice }) => (
  <Fragment>
    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
      <View style={styles.invoiceNoContainer}>
        <Text style={styles.label}>NFT Transaction Report : </Text>
        <Text style={styles.invoiceDate}>{invoice.invoice_number}</Text>
      </View>
      <View style={styles.invoiceDateContainer}>
        <Text style={styles.date}>Date: </Text>
        {/* <Text>{invoice.created_at}</Text> */}
        <Text>22 April 2022</Text>
      </View>
    </View>
  </Fragment>
);

export default InvoiceNo;
