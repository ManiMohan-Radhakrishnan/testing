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
    width: "8%",
    height: "100%",
    textAlign: "center",
    padding: 5,
    fontSize: 8,
  },
  description: {
    width: "23%",
    height: "100%",
    textAlign: "left",
    fontSize: 8,
    padding: 5,
  },
  unit: {
    width: "10%",
    height: "100%",
    textAlign: "center",
    padding: 5,
    fontSize: 8,
  },
  qty: {
    width: "5%",
    height: "100%",
    textAlign: "center",
    padding: 5,
    fontSize: 8,
  },
  rate: {
    width: "10%",
    height: "100%",
    textAlign: "center",
    padding: 5,
    fontSize: 8,
  },
  amount: {
    width: "15%",
    height: "100%",
    textAlign: "center",
    padding: 5,
    fontSize: 8,
  },
  taxRate: {
    width: "10%",
    height: "100%",
    alignItems: "center",
    padding: 5,
    textAlign: "center",
    fontSize: 8,
  },
  taxType: {
    width: "9%",
    height: "100%",
    alignItems: "center",
    padding: 5,
    fontSize: 8,
    textAlign: "center",
  },
  taxAmount: {
    width: "10%",
    height: "100%",
    alignItems: "center",
    padding: 5,
    fontSize: 8,
    textAlign: "center",
  },
});

const InvoiceTableRow = ({ items, currency }) => {
  const calcActualCost = (input, tax) => {
    return input / (tax / 100 + 1);
  };

  const rows = items.map((item, id) => (
    <View
      style={[styles.row, styles.borderBottom]}
      key={item.id.toString()}
      break={id > 10 ? true : false}
    >
      <Text style={[styles.sNo, styles.borderRight, styles.borderLeft]}>
        {item.id}
      </Text>

      <Text style={[styles.description, styles.borderRight]}>
        {item.description}
      </Text>
      <Text style={[styles.unit, styles.borderRight]}>
        {currency
          ? parseFloat(calcActualCost(item.price, item.tax_rate)).toFixed(2) +
            " JT"
          : currencyFormat(calcActualCost(item.price, item.tax_rate), "USD")}
      </Text>
      <Text style={[styles.qty, styles.borderRight]}>{item.quantity}</Text>
      <Text style={[styles.rate, styles.borderRight]}>
        {currency
          ? parseFloat(
              item.quantity * calcActualCost(item.price, item.tax_rate)
            ).toFixed(2) + " JT"
          : currencyFormat(
              item.quantity * calcActualCost(item.price, item.tax_rate),
              "USD"
            )}
      </Text>
      <Text style={[styles.taxRate, styles.borderRight]}>{item.tax_rate}%</Text>
      <Text style={[styles.taxType, styles.borderRight]}>{item.tax_type}</Text>
      <Text style={[styles.taxAmount, styles.borderRight]}>
        {currency
          ? parseFloat(
              (item.quantity *
                calcActualCost(item.price, item.tax_rate) *
                item.tax_rate) /
                100
            ).toFixed(2) + " JT"
          : currencyFormat(
              (item.quantity *
                calcActualCost(item.price, item.tax_rate) *
                item.tax_rate) /
                100,
              "USD"
            )}
      </Text>
      <Text style={[styles.amount, styles.borderRight]}>
        {currency
          ? parseFloat(item.quantity * item.price).toFixed(2) + " JT"
          : currencyFormat(item.quantity * item.price, "USD")}
      </Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default InvoiceTableRow;
