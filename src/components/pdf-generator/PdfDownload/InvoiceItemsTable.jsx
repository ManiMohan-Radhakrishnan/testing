import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import InvoiceTableHeader from "./InvoiceTableHeader";
import InvoiceTableRow from "./InvoiceTableRow";
import InvoiceTableBlankSpace from "./InvoiceTableBlankSpace";
import InvoiceTableFooter from "./InvoiceTableFooter";
import InvoiceAmountInWords from "./InvoiceAmountInWords";
import InvoiceDigitalMessage from "./InvoiceDigitalMessage";

const tableRowsCount = 30;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "black",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});
// enable InvoiceTableBlankSpace component if needed for future use
const InvoiceItemsTableW = ({ invoice, currency }) => (
  <View style={styles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow
      items={invoice.ordered_items}
      currency={currency}
      usd_per_value={invoice.usd_per_value}
    />
    {/* <InvoiceTableBlankSpace rowsCount={tableRowsCount - invoice.ordered_items.length} /> */}
    <InvoiceTableFooter
      items={invoice.ordered_items}
      currency={currency}
      usd_per_value={invoice.usd_per_value}
    />
    <InvoiceAmountInWords
      items={invoice.ordered_items}
      currency={currency}
      usd_per_value={invoice.usd_per_value}
    />
    <InvoiceDigitalMessage message="This is a digitally generated invoice." />
  </View>
);

export default InvoiceItemsTableW;
