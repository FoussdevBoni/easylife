import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const SuccessScreen = ({ message   }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const navigation = useNavigation()
  useEffect(() => {
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar  backgroundColor="#F6F6F6" style="dark"/>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Card style={styles.successCard}>
           <View>
           <View style={styles.iconContainer}>
            <AntDesign name="checkcircle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.title}>Succès !</Text>
          <Text style={styles.message}>
             {message || ` Votre action a été réalisée avec succès. Vous pouvez maintenant continuer votre expérience.
         `}
            </Text>
           </View>
          <Button mode="contained" onPress={() => navigation.navigate('main-home')} style={styles.button}>
            CONTINUER
          </Button>
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 20,

  },
  card: {
    width: "100%",
    alignItems: "center",
  },
  successCard: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 15,
    alignItems: "center",

  },
  title: {
    fontSize: 24,
    color: "#333",
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'montserrat-bold',

  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: 'montserrat-regular',

  },
  button: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
});

export default SuccessScreen;
