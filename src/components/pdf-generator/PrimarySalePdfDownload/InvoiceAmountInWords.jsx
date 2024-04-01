import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { ToWords } from "to-words";
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
    width: "100%",
    textAlign: "center",
    padding: 4.5,
  },
});

const InvoiceAmountInWords = ({ items, currency, usd_per_value }) => {
  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  const total = items
    .map((item) => item.quantity * item.price)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  let words = currency
    ? toWords.convert(total).replace("Dollars", "JT POINTS")
    : toWords.convert(total).replace("Dollars", "USD");
  return currency ? (
    <>
      <View style={[styles.row, styles.borderBottom]}>
        <Text
          style={[styles.description, styles.borderLeft, styles.borderRight]}
        >{`Amount In Words: ${words}`}</Text>
      </View>
    </>
  ) : (
    <>
      <View style={[styles.row, styles.borderBottom]}>
        <Text
          style={[styles.description, styles.borderLeft, styles.borderRight]}
        >{`Amount In Words: ${words}`}</Text>
      </View>
    </>
  );
};

export default InvoiceAmountInWords;
