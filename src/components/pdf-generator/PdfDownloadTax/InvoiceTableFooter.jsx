import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { currencyFormat } from "../../../utils/common";

const borderColor = "black";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    fontSize: 12,
    fontStyle: "bold",
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
  description: {
    width: "46%",
    textAlign: "center",
    height: "100%",
    padding: 5,
    fontSize: 8,
  },
  net: {
    width: "10%",
    textAlign: "center",
    height: "100%",
    padding: 5,
    fontSize: 8,
  },
  empty: {
    width: "19%",
    textAlign: "center",
    height: "100%",
    padding: 5,
    color: "white",
  },
  taxAmount: {
    width: "10%",
    textAlign: "center",
    height: "100%",
    padding: 5,
    fontSize: 8,
  },
  total: {
    width: "15%",
    textAlign: "center",
    height: "100%",
    padding: 5,
    fontSize: 8,
  },
});

const InvoiceTableFooter = ({ items, currency }) => {
  const calcActualCost = (input, tax) => {
    return input / (tax / 100 + 1);
  };

  const total = items
    .map((item) => item.quantity * calcActualCost(item.price, item.tax_rate))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const gstTotal = items
    .map(
      (item) =>
        (item.quantity *
          calcActualCost(item.price, item.tax_rate) *
          item.tax_rate) /
        100
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={[styles.row, styles.borderBottom]}>
      <Text style={[styles.description, styles.borderRight, styles.borderLeft]}>
        TOTAL
      </Text>
      <Text style={[styles.net, styles.borderRight]}>
        {currency
          ? parseFloat(total).toFixed(2) + " JT"
          : currencyFormat(total, "USD")}
      </Text>
      <Text style={[styles.empty, styles.borderRight]}>-</Text>
      <Text style={[styles.taxAmount, styles.borderRight]}>
        {currency
          ? parseFloat(gstTotal).toFixed(2) + " JT"
          : currencyFormat(gstTotal, "USD")}
      </Text>
      <Text style={[styles.total, styles.borderRight]}>
        {currency
          ? parseFloat(total + gstTotal).toFixed(2) + " JT"
          : currencyFormat(total + gstTotal, "USD")}
      </Text>
    </View>
  );
};

export default InvoiceTableFooter;
