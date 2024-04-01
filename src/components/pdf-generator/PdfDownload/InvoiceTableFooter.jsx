import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { currencyFormat } from "../../../utils/common";

const borderColor = "black";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    fontSize: 10,
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
    width: "63%",
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
  total: {
    width: "37%",
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
});

const InvoiceTableFooter = ({ items, currency, usd_per_value }) => {
  const total = items
    .map((item) => item.quantity * item.price)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={[styles.row, styles.borderBottom]}>
      <Text style={[styles.description, styles.borderRight, styles.borderLeft]}>
        TOTAL
      </Text>
      <Text style={[styles.total, styles.borderRight]}>
        {currency ? `${total} JT POINTS` : currencyFormat(total, "USD")}{" "}
        {currency ? `(${currencyFormat(usd_per_value, "USD")})` : ""}
      </Text>
    </View>
  );
};

export default InvoiceTableFooter;
