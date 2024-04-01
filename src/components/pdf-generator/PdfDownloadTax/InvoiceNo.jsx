import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 2,
    fontSize: 16,
    fontWeight: "bolder",
    justifyContent: "flex-end",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
    fontSize: 12,
    fontWeight: "bold",
  },
});

const InvoiceNo = ({ invoice }) => (
  <Fragment>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.invoiceDate}>{invoice.id}</Text>
    </View>
    <View style={styles.invoiceDateContainer}>
      <Text>{invoice.date}</Text>
    </View>
  </Fragment>
);

export default InvoiceNo;
