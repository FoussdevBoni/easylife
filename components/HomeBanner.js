import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { colors } from "../utils/colors";

const { width } = Dimensions.get("window");

const Banner = () => {
  return (
    <View style={styles.banner}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/010/872/149/non_2x/3d-delivery-person-going-to-deliver-parcel-png.png",
          }}
          style={styles.scooterImage}
        />
      </View>
      <Text style={styles.title}>Bienvenue sur Easy Life 
        <View style={{width: 3}}></View>
        <Text style={{color: colors.secondary }}>Market</Text>
      </Text>
      <Text style={styles.subtitle}>
        La plateforme tout-en-un pour simplifier votre quotidien.
      </Text>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  scooterImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontFamily: "montserrat-bold",
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "montserrat-regular",
  },
});
