import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    justifySelf: "end",
  },
  soldBy: {
    fontWeight: 900,
    marginTop: 20,
    paddingBottom: 3,
    fontWeight: "bolder",
    fontSize: 12,
    color: "#347aeb",
    textTransform: "uppercase",
  },
});

const SoldByAddress = ({ address, name }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.soldBy}>Address</Text>
    <Text>{name}</Text>
    <Text>{address?.address?.first_name}</Text>
    <Text>{address?.address?.city}</Text>
    <Text>{address?.address?.state}</Text>
    <Text>{address?.address?.country}</Text>
    <Text>{address?.country}</Text>
  </View>
);

export default SoldByAddress;
