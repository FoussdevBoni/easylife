import React, { useRef } from "react";
import { View, Animated, Dimensions, StyleSheet, Image } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = 260;
const SPACING = 20;

const CustomCarousel = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (ITEM_WIDTH + SPACING),
            index * (ITEM_WIDTH + SPACING),
            (index + 1) * (ITEM_WIDTH + SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85], // Effet de zoom
            extrapolate: "clamp",
          });

          return (
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
              <Image source={{ uri: item }} style={styles.image} />
            </Animated.View>
          );
        }}
      />

      {/* Indicateurs dynamiques SANS width animé */}
      <View style={styles.indicatorsContainer}>
        {data.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * (ITEM_WIDTH + SPACING),
              index * (ITEM_WIDTH + SPACING),
              (index + 1) * (ITEM_WIDTH + SPACING),
            ],
            outputRange: [0.5, 1, 0.5], // Animation de l'opacité
            extrapolate: "clamp",
          });

          return <Animated.View key={index} style={[styles.indicator, { opacity }]} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 20,
    marginHorizontal: SPACING / 2,
    overflow: "hidden",
    backgroundColor: "#ddd",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  indicatorsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  indicator: {
    width: 10, // Fixé pour éviter l'erreur
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff5a5f",
    marginHorizontal: 5,
  },
});

export default CustomCarousel;
