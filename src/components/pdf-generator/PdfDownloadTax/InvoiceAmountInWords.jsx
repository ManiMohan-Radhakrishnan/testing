import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { ToWords } from "to-words";

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
    width: "100%",
    textAlign: "center",
    padding: 5,
    fontSize: 10,
  },
});

const InvoiceAmountInWords = ({ items, currency }) => {
  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

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

  let words = currency
    ? toWords.convert(total + gstTotal).replace("Dollars", "JT POINTS")
    : toWords.convert(total + gstTotal).replace("Dollars", "USD");
  return (
    <View style={[styles.row, styles.borderBottom]}>
      <Text
        style={[styles.description, styles.borderLeft, styles.borderRight]}
      >{`Amount In Words: ${words}`}</Text>
    </View>
  );
};

export default InvoiceAmountInWords;
