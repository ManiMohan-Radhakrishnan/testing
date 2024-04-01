import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { FaFileExport } from "react-icons/fa";

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  billTo: {
    marginTop: 18,
    paddingBottom: 3,
    fontWeight: "bolder",
    fontSize: 12,
    color: "#347aeb",
    textTransform: "uppercase",
    fontWeight: 900,
  },
});

const BillToAddress = ({ address, name, taxable, gst_no }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.billTo}>Account Details</Text>
    <Text>{name}</Text>
    <Text>{address?.first_name}</Text>
    <Text>{address?.country}</Text>
    {/* <Text>{address.street1}</Text> */}
    {/* <Text>{address.street2}</Text> */}
    {/* <Text>{address.phone}</Text> */}
    {/* <Text>{address.pincode}</Text> */}
    {/* {taxable && <Text>{gst_no}</Text>} */}
  </View>
);

export default BillToAddress;
