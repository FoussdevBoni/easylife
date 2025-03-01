import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export const Loading = ({ message = "Chargement en cours..." , size , color }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={50} color={color}/>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f5",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#4a4a4a",
    fontFamily: "montserrat-bold",
    textAlign: "center",
  },
});

