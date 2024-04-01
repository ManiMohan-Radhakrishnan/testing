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
    justifyContent: "flex-start",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
    fontSize: 14,
    fontWeight: "bold",
  },
});

const InvoiceGstNo = ({ invoice }) => {
  return (
    <Fragment>
      {invoice.pan_no !== "" && (
        <View style={styles.invoiceNoContainer}>
          <Text style={styles.label}>PAN No:</Text>
          <Text style={styles.label}>{invoice.pan_no}</Text>
        </View>
      )}

      {invoice.gst_no !== "" && (
        <View style={styles.invoiceDateContainer}>
          <Text style={styles.label}>GST No: </Text>
          <Text style={styles.label}>{invoice.gst_no}</Text>
        </View>
      )}

      {invoice.tan_no !== "" && (
        <View style={styles.invoiceDateContainer}>
          <Text style={styles.label}>TAN No: </Text>
          <Text style={styles.label}>{invoice.tan_no}</Text>
        </View>
      )}
    </Fragment>
  );
};
export default InvoiceGstNo;
