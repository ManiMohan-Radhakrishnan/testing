import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "black";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#4472c4",
    alignItems: "baseline",
    height: 28,
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
    width: "10%",
    alignItems: "center",
    padding: "5px 0",
    borderLeftColor: borderColor,
    borderLeftWidth: 1,
    color: "white",
    fontWeight:"bold"
  },
  description: {
    width: "30%",
    alignItems: "center",
    padding: 5,
    color: "white",
    fontWeight:"bold"
  },

  qty: {
    width: "18%",
    alignItems: "center",
    padding: 5,
    color: "white",
    fontWeight:"bold"
  },
  unit: {
    width: "20%",
    alignItems: "center",
    padding: 5,
    color: "white",
    fontWeight:"bold"
  },

  amount: {
    width: "22%",
    alignItems: "center",
    padding: "5px 0",
    color: "white",
    fontWeight:"bold"
  },
});

const InvoiceTableHeader = () => (
  <View style={[styles.container, styles.borderBottom]}>
    <Text style={[styles.sNo, styles.borderLeft, styles.borderRight]}>
      S.NO
    </Text>
    <Text style={[styles.description, styles.borderRight]}>Name</Text>
    <Text style={[styles.qty, styles.borderRight]}>Qty</Text>
    <Text style={[styles.unit, styles.borderRight]}>Unit Price</Text>
    <Text style={[styles.amount, styles.borderRight]}>Total Amount</Text>
  </View>
);

export default InvoiceTableHeader;
