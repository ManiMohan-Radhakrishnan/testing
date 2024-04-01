import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback((word) => {
  // Return entire word as unique part
  return [word + ""];
});
const borderColor = "black";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "black",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "baseline",
    height: 35,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  borderBottom: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  borderLeft: {
    borderLeftColor: borderColor,
    borderLeftWidth: 1,
  },
  borderRight: {
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  sNo: {
    width: "8%",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    fontSize: 10,
  },
  description: {
    width: "23%",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    fontSize: 10,
  },
  unit: {
    width: "10%",
    alignItems: "center",
    textAlign: "center",
    fontSize: 10,
    height: "100%",
  },
  qty: {
    width: "5%",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    fontSize: 10,
  },
  rate: {
    width: "10%",
    alignItems: "center",
    textAlign: "center",
    fontSize: 10,
    height: "100%",
  },
  amount: {
    width: "15%",
    alignItems: "center",
    textAlign: "center",
    fontSize: 10,
    height: "100%",
  },
  taxRate: {
    width: "10%",
    alignItems: "center",
    textAlign: "center",
    fontSize: 10,
    height: "100%",
  },
  taxType: {
    width: "7%",
    alignItems: "center",
    textAlign: "center",
    flex: 1,
    height: "100%",
    fontSize: 10,
  },
  taxAmount: {
    width: "10%",
    alignItems: "center",
    textAlign: "center",
    fontSize: 10,
    height: "100%",
  },
  taxTypeContainer: {
    width: "9%",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    padding: "0 5px",
    flexDirection: "row",
  },
});
const Br = () => "\n";
const InvoiceTableHeader = () => (
  <View style={[styles.container, styles.borderBottom]}>
    <Text style={[styles.sNo, styles.borderRight, styles.borderLeft]}>
      S.NO
    </Text>
    <Text style={[styles.description, styles.borderRight]}>
      Item Description
    </Text>
    <Text style={[styles.unit, styles.borderRight]}>
      <Text>Unit</Text>
      <Text>Price</Text>
    </Text>
    <Text style={[styles.qty, styles.borderRight]}>Qty</Text>
    <Text style={[styles.rate, styles.borderRight]}>
      <Text>Net</Text>
      <Text>Amount</Text>
    </Text>
    <Text style={[styles.taxRate, styles.borderRight]}>
      <Text>Tax</Text>
      <Text>{` Rate(%)`}</Text>
    </Text>
    <Text style={[styles.taxTypeContainer, styles.borderRight]}>
      <Text>Tax</Text>
      <Text>Type</Text>
    </Text>
    <Text style={[styles.taxAmount, styles.borderRight]}>
      <Text>Tax</Text>
      <Text>Amount</Text>
    </Text>
    <Text style={[styles.amount, styles.borderRight]}>
      <Text>Total</Text>
      <Text>{` Amount`}</Text>
    </Text>
  </View>
);

export default InvoiceTableHeader;
