import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const ErrorScreen = ({ message = "Une erreur est survenue" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8d7da" />

      <MaterialIcons name="error-outline" size={80} color="#D9534F" />
      <Text style={styles.errorText}>{message}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#721c24" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 18,
    color: "#721c24",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#f5c6cb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#721c24",
    fontWeight: "bold",
  },
});

export default ErrorScreen;
