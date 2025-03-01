import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, FlatList, Alert } from 'react-native';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const MedicoItem = ({ medicament }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity style={styles.medicoItem} onPress={()=>{
      navigation.navigate("medicament-details" , {product: medicament})
    }}>
      <View style={styles.medicoAvatarContainer}>
        <Image source={{ uri: medicament.images[0] }} style={styles.medicoAvatar} />
      </View>
      <Text style={styles.medicoName}>
        {medicament.nom}
      </Text>
      <Text style={{    fontFamily: 'montserrat-regular' , fontSize: RFValue(12)}}>
        {medicament.prix} FCFA
      </Text>
    </TouchableOpacity>
  );
};

function XmedecoList({ medicaments }) {
  return (
    <FlatList
      horizontal
      data={medicaments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <MedicoItem medicament={item} />}
      contentContainerStyle={styles.medicoListContainer}
      showsHorizontalScrollIndicator={false} // Cache la barre de défilement horizontale
    />
  );
}

export default XmedecoList;

const styles = StyleSheet.create({
  medicoItem: {
    width: 150, // Largeur fixe pour chaque item
    flexDirection: 'column',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  medicoAvatarContainer: {
    marginBottom: 10,
  },
  medicoAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  medicoName: {
    fontSize: RFValue(12),
    fontFamily: 'montserrat-bold',
    textAlign: 'center',
    flexWrap: 'wrap', // Pour permettre le retour à la ligne
    maxWidth: '100%', // Limiter le texte à la largeur de l'item
  },
  medicoListContainer: {
    padding: 20,
  },
});
