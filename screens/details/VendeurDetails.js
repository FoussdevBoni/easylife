import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getCurrentAddress from '../../lib/functions/getCurrentAddress';
import { firestoreDbService } from '../../lib/services/firestoreDbService';
import XProductsList from '../../components/lists/XProductLists';
import StackAppbar from '../../components/StackAppBar';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window'); // Récupère la largeur de l'écran

const Br = ({ size }) => {
  return <View style={{ height: size }}></View>;
};

export default function Vendeur({ color, layout, collectionName }) {
  const { vendeur } = useRoute().params;
  const [products, setMedicaments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const note = vendeur.note ? vendeur.note.toFixed(1): '4.0'
  

 




  // Fetch similar products based on the vendeur ID and search term
  useEffect(() => {
    const getSimilarMedicaments = () => {
      setLoading(true); // Set loading to true before fetching
      firestoreDbService.getDataByProperty(collectionName, "prestataireId", vendeur.id, (data) => {
        const filteredMedicaments = data.filter(item => item.nom.toLowerCase().includes(search.toLowerCase().trim())); // Filter products based on search
        setMedicaments(filteredMedicaments);
        setLoading(false); // Set loading to false once data is fetched
      }, (error) => {
        setLoading(false); // Set loading to false in case of error
        console.log("error", error);
      });
    };

    getSimilarMedicaments();
  }, [search, vendeur?.id]);

  const handleReservePress = () => {
    // Redirection vers une page web
    Linking.openURL("https://www.easylife5.com/commande-repas/reservations/create")  
   
  };

  const handlePhonePress = () => {
    // Passer un appel
    Linking.openURL(`tel:${vendeur.tel}`);
  };
  const handleOpenWhatsap = ()=>{
    Linking.openURL(`https://wa.me/${vendeur.whatsapp}`);

  }

  return (
    <View style={{ flex: 1 }}>
      <StackAppbar color={color} title={vendeur?.nom} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: color }]}>
          <View style={styles.headerContent}>
            <Image
              source={{ uri: vendeur.profile }}
              style={styles.logo}
            />
            <View style={styles.infoSection}>
          <TouchableOpacity onPress={handlePhonePress}>
            <View style={styles.infoTextContainer}>
              <Ionicons name="call" size={16} color={'white'} /> 
              <Text style={styles.infoText}>
                {vendeur.tel}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.infoTextContainer}>
            <Ionicons name="location" size={16} color={"white"} /> 
            <Text style={styles.infoText}>
                {vendeur.adresse}
              </Text>
          </View>

          <TouchableOpacity onPress={handleOpenWhatsap}>
            <View style={styles.infoTextContainer}>
              <Ionicons name="logo-whatsapp" size={16} color={"white"} />
              <Text style={styles.infoText}>
                {vendeur.whatsapp || vendeur.tel}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.infoTextContainer}>
            <Ionicons name="time" size={16} color={'white'} /> 
            <Text style={styles.infoText}>
               {vendeur.disponibilites}
              </Text>
          </View>

          <View style={styles.infoTextContainer}>
            <Ionicons name="star" size={16} color={'white'} /> 
            <Text style={styles.infoText}>
               {note || '4.0'}/5
            </Text>
          </View>


           {
            layout==='restaurant' &&  <View style={styles.reserveButtonContainer}>
            <TouchableOpacity style={styles.reserveButton} onPress={handleReservePress}>
              <Text style={{...styles.reserveButtonText ,     color: color}}>Réserver une table </Text>
            </TouchableOpacity>
            </View>
           }
        </View>
           
          </View>
         
        </View>

        {/* Informations supplémentaires */}
        <View style={styles.searchBarContainer}>
        <TextInput
            style={styles.searchBar}
            placeholder="Rechercher un produit"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={(text) => setSearch(text)} // Update search term on input change
          />
        </View>

        {/* Categories */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Explorer les offres de {vendeur.nom}</Text>

          {loading ? (
            <ActivityIndicator size="large" color={color} />
          ) : (
            <>
              {
                products.length > 0 ? (
                  <XProductsList color={color} products={products} />
                ) : <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Aucune offre trouvée chez ce fournisseur
                  </Text>
                </View>
              }
            </>
          )}
        </View>
        <Br size={30} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginBottom: 8,
    borderRadius: 25,
  },
  storeName: {
    fontSize: RFValue(17),
    fontFamily: 'montserrat-bold',
    color: '#fff',
  },
  deliveryInfo: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-regular',
    color: '#fff',
  },
  searchBarContainer:{
    paddingHorizontal: 10
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: RFValue(13),
    textAlign: 'center',
    width: '100%',
    marginTop: 16,
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoTextContainer: {
    marginBottom: 8,
    flexDirection: 'row'
  },
  infoText: {
    fontSize: RFValue(14),
    fontFamily: 'montserrat-regular',
    color: 'white',
    flexDirection: 'row',
    marginTop: 0,
    marginLeft: 12
  },
  reserveButtonContainer: {
    alignItems: 'center'
  },
  reserveButton: {
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '80%',
   backgroundColor: 'white'
  },
  reserveButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'montserrat-bold',
  },
  categorySection: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: RFValue(16),
    fontFamily: 'montserrat-bold',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'montserrat-bold',
    opacity: 0.4,
    fontSize: RFValue(13),
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});