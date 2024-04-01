import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    maxWidth: "33%",
  },
  soldBy: {
    marginTop: 20,
    paddingBottom: 3,
    fontWeight: "bolder",
    fontSize: 14,
  },
});

const SoldByAddress = ({ address, name }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.soldBy}>SOLD BY:</Text>
    <Text>{name}</Text>
    {/* <Text>{address.street1}</Text>
    {address.street2 !== "" && <Text>{address.street2}</Text>} */}
    {/* {address.city !== "" && <Text>{address.city}</Text>} */}
    {/* {address.state !== "" && <Text>{address.state}</Text>} */}
    <Text>{address.country}</Text>
  </View>
);

export default SoldByAddress;
