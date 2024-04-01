import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { currencyFormat } from "../../../utils/common";

const borderColor = "black";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    fontStyle: "bold",
    flexGrow: 2,
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
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
  description: {
    width: "30%",
    height: "100%",
    textAlign: "left",
    padding: 5,
  },
  unit: {
    width: "15%",
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
  qty: {
    width: "8%",
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
  rate: {
    width: "15%",
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
  amount: {
    width: "22%",
    height: "100%",
    textAlign: "center",
    padding: "5px 0",
  },
});

const InvoiceTableRow = ({ items, currency, usd_per_value }) => {
  const rows = items.map((item, id) => (
    <View
      style={[styles.row, styles.borderBottom]}
      key={item.id.toString()}
      break={id > 10 ? true : false}
    >
      <Text style={[styles.sNo, styles.borderLeft, styles.borderRight]}>
        {item.id}
      </Text>
      <Text style={[styles.description, styles.borderRight]}>
        {item.description}
      </Text>
      <Text style={[styles.unit, styles.borderRight]}>
        {currency
          ? `${parseFloat(item.price)} JT POINTS`
          : currencyFormat(item.price, "USD")}
      </Text>
      <Text style={[styles.qty, styles.borderRight]}>{item.quantity}</Text>
      <Text style={[styles.rate, styles.borderRight]}>
        {currency
          ? `${parseFloat(item.quantity * item.price)} JT POINTS`
          : currencyFormat(item.quantity * item.price, "USD")}
      </Text>
      <Text style={[styles.amount, styles.borderRight]}>
        {currency
          ? `${item.quantity * item.price} JT POINTS (${currencyFormat(
              usd_per_value,
              "USD"
            )})`
          : currencyFormat(item.quantity * item.price, "USD")}
      </Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default InvoiceTableRow;
