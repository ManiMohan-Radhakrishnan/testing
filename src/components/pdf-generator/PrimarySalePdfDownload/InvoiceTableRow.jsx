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
    width: "20%",
    height: "100%",
    textAlign: "center",
    padding: 5,
  },
  qty: {
    width: "18%",
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
  // const rows = items.map((item, id) => (
  {
    console.log(items, "items");
  }
  const rows = (
    <View
      style={[styles.row, styles.borderBottom]}
      // key={item.id.toString()}
      // break={id > 10 ? true : false}
    >
      <Text style={[styles.sNo, styles.borderLeft, styles.borderRight]}>
        {"1"}
      </Text>
      <Text style={[styles.description, styles.borderRight]}>
        {items?.category_name}
      </Text>
      <Text style={[styles.qty, styles.borderRight]}>{items?.quantity}</Text>
      <Text style={[styles.unit, styles.borderRight]}>$ 
      {parseFloat(items?.unit_price).toFixed(2)}</Text>
      <Text style={[styles.amount, styles.borderRight]}>$
        {parseFloat(items?.net_amount).toFixed(2)}
      </Text>
    </View>
  );
  // ));
  return <Fragment>{rows}</Fragment>;
};

export default InvoiceTableRow;
