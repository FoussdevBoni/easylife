import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";
import { RFValue } from "react-native-responsive-fontsize";

const Banner = () => {
  const handlePress = () => {
    Linking.openURL("https://www.easylife5.com/commande-repas/reservations/create");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../../assets/home/resto1.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.slogan}>Une expérience culinaire inoubliable</Text>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Réservez une table</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Overlay semi-transparent
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  slogan: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#ff7f50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Banner;
