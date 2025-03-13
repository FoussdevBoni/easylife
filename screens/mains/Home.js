import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HomeBanner from "../../components/HomeBanner";
import { colors } from "../../utils/colors";

const { width } = Dimensions.get("window");

function HomeScreen() {
  const navigation = useNavigation();
  const services = [
    { title: "Repas", icon: "restaurant", action: "COMMANDER", screen: "resto-app" },
    { title: "SuperMarché", icon: "cart", action: "COURSES", screen: "market-app" },
    { title: "Médicaments", icon: "medkit", action: "COMMANDER", screen: "medico-app" },
    { title: "Hôtel", icon: "bed", action: "RÉSERVER", screen: "stay-app" },
    { title: "Chauffeur", icon: "car", action: "COMMANDER" },
    { title: "Ticket de Bus", icon: "bus", action: "RÉSERVER" },
  ];

  const openPodcastSite = () => {
    // Remplacez l'URL par le lien vers votre site de podcasts
    Linking.openURL("https://votre-site-de-podcast.com");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Bannière */}
      <HomeBanner />

      {/* Section Podcast */}
      <TouchableOpacity style={styles.podcastContainer} onPress={openPodcastSite}>
        <View style={styles.podcastContent}>
          <View style={styles.podcastIconContainer}>
            <Ionicons name="headset" size={26} color="#fff" />
          </View>
          <View style={styles.podcastTextContainer}>
            <Text style={styles.podcastTitle}>Nos Podcasts et blogs</Text>
            <Text numberOfLines={1} style={styles.podcastSubtitle}>Découvrez nos sélections 
              d'épisodes exclusives</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Services */}
      <Text style={styles.sectionTitle}>DÉCOUVREZ NOS SERVICES</Text>
      <View style={styles.grid}>
        {services.map((service, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name={service.icon} size={20} color="#fff" />
            </View>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (service.screen) {
                  navigation.navigate(service.screen);
                } else {
                  Alert.alert("Oufs!", "Le service n'est pas encore disponible");
                }
              }}
            >
              <Text style={styles.buttonText}>{service.action}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "montserrat-bold",
    color: colors.primary,
    marginVertical: 10,
    marginTop: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    width: width / 2 - 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
    height: 50,
    width: 50,
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: "montserrat-bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "montserrat-bold",
    fontSize: 10,
  },
  // Styles pour la section podcast
  podcastContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  podcastContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  podcastIconContainer: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 50,
    marginRight: 12,
  },
  podcastTextContainer: {
    flex: 1,
  },
  podcastTitle: {
    fontSize: 14,
    fontFamily: "montserrat-bold",
    color: colors.secondary,
    textAlign: 'center'
  },
  podcastSubtitle: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
    textAlign: 'center'
  },
});