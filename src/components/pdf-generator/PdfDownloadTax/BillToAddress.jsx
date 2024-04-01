import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    maxWidth: "33%",
  },
  billTo: {
    marginTop: 18,
    paddingBottom: 3,
    fontWeight: "bolder",
    fontSize: 14,
  },
});

const BillToAddress = ({ address, name, taxable, gst_no }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.billTo}>BILL TO:</Text>
    <Text>{name}</Text>
    {/* <Text>{address.street1}</Text>
    {address.street2 !== "" && <Text>{address.street2}</Text>} */}
    {/* {address.city !== "" && <Text>{address.city}</Text>} */}
    {/* {address.state !== "" && <Text>{address.state}</Text>} */}
    <Text>{address.country}</Text>
    {/* {taxable && <Text>{gst_no}</Text>} */}
  </View>
);

export default BillToAddress;
