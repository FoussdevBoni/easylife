import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { setCart } from '../../reducer/cartSlice';
import { Br } from '../../components/Br';
import RatingSection from '../../components/RatingForm';
import { setFavorites } from '../../reducer/favoritesSlice';
import { firestoreDbService } from '../../lib/services/firestoreDbService';
import { RFValue } from 'react-native-responsive-fontsize';
import VariationItem from '../../components/items/VariationItem';

const ProductDetails = ({color , layout , collectionName}) => {
   const route =useRoute()
 
  const {product} = route.params
   const [commandeRoute , setCommandeRoute] = useState()
  const cart = useSelector((state) => state.cart.cartData);
  const favorites = useSelector((state) => state.favorites.favoritesData);
    const [showSnackBar, setShowSnackBar] = useState(false); // Pour afficher un feedback visuel
    const [message , setMessage] = useState('')
   const existingItemFavorite = favorites.find((item) => item.id === product.id);
    const existingItemCart = cart.find((item) => item.id === product.id);
    const reduction = product.prix*(1- product.reduction/100)

    

   const navigation = useNavigation()
  const dispatch = useDispatch()
  
 const handleAdd = () => {
    setQuantity(quantity + 1);
  };

  const handleSubtract = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = (productToAdd) => {
    if (productToAdd) {
      const existingProductCart = cart.find((item) => item.id === productToAdd.id);
      if (existingProductCart) {
        
      }else {
        dispatch(setCart([...cart, { ...productToAdd, quantity }]));

      }
    } else {
      if (existingItemCart) {
        navigation.navigate("cart")
     } else {
          dispatch(setCart([...cart, { ...product, quantity }]));
     }
    }

   
  };



  const addVariationToCart = (variation )=>{
    const existingVariationCart = cart.find((item) => item.nom === variation.nom);

    if (existingVariationCart) {
      navigation.navigate("cart")
   } else {
     dispatch(setCart([...cart, 
      { ...product, id: variation.nom , 
        prix: variation.prix, nom: variation.value, images: [variation.image], quantity }]));
   }
   setShowSnackBar(true); 


  }

  useEffect(()=>{
      if (layout==='restaurant') {
        setCommandeRoute("plat-commande-form")
      } else if (layout==='pharmacie') {
        setCommandeRoute("medico-commande-form")
      } else if(layout==='supermarket'){
        setCommandeRoute("article-commande-form")
      }
     } , [])

  const goToOrder = ()=>{

      const cartOne = [
        { 
        ...product,
        quantity , 
        prix: product.isPromo ? reduction: product.prix }
      ]



      navigation.navigate(commandeRoute , {cart: cartOne , amount: cartOne[0].prix*quantity })
  
  }


  const likeProduct = () => {

  if (!existingItemFavorite) {
      dispatch(setFavorites([...favorites , product]));
    setShowSnackBar(true); 
        setMessage("Ce product a été ajouté à vos favoris !");

  }else{
    
    const updatedFavorites = favorites.filter((item) => item.id !== product.id);
    dispatch(setFavorites(updatedFavorites)); 
    setMessage("Ce product a été retiré de vos favoris !");
    setShowSnackBar(true);
  }
  };



  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);




  const noter = (data) => {
        const {rating , review} = data
        const currentNote = product.note || 0
        const reviews = product.reviews || []
    
        const newNote = (currentNote + rating)/(reviews.length + 1);
    
        firestoreDbService.updateData(collectionName , product.id , {
          ...product , note: newNote , reviews: [...reviews , review]
        } , ()=>{
          Alert.alert("Succès" , "Merci beaucoup pour votre avis")
        } , 
        (error)=>{
           Alert.alert("Erreur" , "Une erreur s'est produite")
        }
        )
  }

  const [similarDishes , setSimilarDishes] = useState([])
  const [restoProducts , setRestoProducts] = useState([])
  const variations = product.variations || []
  const [loading , setLoading] = useState(true)

  useEffect(()=>{
    const getSimilarProduct = ()=>{
        firestoreDbService.getDataByProperty(collectionName ,"categorieId" , product.categorieId ,  (data)=>{
           setSimilarDishes(data)
           setLoading(false)
        } , (error)=>{
           setLoading(false)
            console.log("error" , error)
        })
    }

    const getRestoProducts = ()=>{
       firestoreDbService.getDataByProperty(collectionName ,"prestataireId" , product.prestataireId ,  (data)=>{
           console.log(data)
           setRestoProducts(data)
          setLoading(false)
        } , (error)=>{
           setLoading(false)
            console.log("error" , error)
        })
    }

    getSimilarProduct()
    getRestoProducts()

  } , [])

  return (
     <View style={{flex: 1}}>
          <Appbar.Header style={[styles.header , {backgroundColor: color}]}>
        <StatusBar style="light" backgroundColor={color} />

        {/* Bouton retour */}
        <Appbar.Action
          icon={() => (
            <Ionicons
              style={{ marginTop: -4, marginLeft: -7 }}
              size={30}
              name="chevron-back-circle"
              color="white"
            />
          )}
          onPress={() => {
            navigation.goBack()
          }}
        />

        {/* Informations du vendeur */}
        <View style={styles.infoContainer}>
          <Text style={styles.sellerName}>
            {product.prestataireName}
          </Text>
          <Text style={styles.locationText}>
            {product.adresse}
          </Text>
        </View>

        {/* Icône de notification */}
        <View style={styles.notificationContainer}>
          <Appbar.Action icon="heart" onPress={() => {
            likeProduct()
          }} color={existingItemFavorite ? 'red': "white"} />
        </View>
      </Appbar.Header>

        <ScrollView style={styles.container}>
      {/* Dish Image */}
      <TouchableOpacity style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images[0] || 'https://via.placeholder.com/350x200' }}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{product.nom}</Text>
      <Text style={styles.description}>
        {product.description}
      </Text>

     
      <View style={styles.priceQuantity}>
      

     
      {
        product.isPromo ? <Text style={styles.price}>{reduction} Fcfa</Text>: <Text style={styles.price}>{product.prix} XOF</Text>
      }


     <View style={styles.quantityContainer}>
         <TouchableOpacity onPress={handleSubtract} style={[styles.quantityButton , {backgroundColor: color}]}>
          <Ionicons name="remove-outline" size={24} color="#FFF" />
         </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
         <TouchableOpacity onPress={handleAdd} style={[styles.quantityButton , {backgroundColor: color}]}>
         <Ionicons name="add-outline" size={24} color="#FFF" />
       </TouchableOpacity>
     </View>

      </View>
     

       <View style={styles.buttonContainer}>
        {/* Add to Cart Button */}
      <TouchableOpacity onPress={()=>{
        goToOrder()

      }} style={[styles.addToCartButton , 

      {backgroundColor: 'white' , borderColor: color, borderWidth: 1}]}>
        <Text style={{...styles.addToCartText, color: color }}>
          Commander
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{
        addToCart()
      }} style={[styles.addToCartButton , {backgroundColor: color}]}>
        <Text style={styles.addToCartText}>
          {existingItemCart ? "Voir le panier": "Ajouter au panier"}
        </Text>
      </TouchableOpacity>
       </View>

       {
         variations.length>0 &&  <Text style={styles.sectionTitle}>
            Variations (différentes options)
         </Text>
       }

      <FlatList
        style={{marginTop: -10}}
        horizontal
        data={variations}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <VariationItem color={color} nom={item.value} prix={item.prix} image={item.image} 
           onAddToCart={()=>{
            addVariationToCart(item)
           }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
          

      {/* Similar Dishes */}
        <>
         {loading ? <View style={{justifyContent: 'center' , alignItems: 'center'}}>
          <ActivityIndicator size={25} />
         </View> : <>
         
           {
            similarDishes.length>0 &&  <Text style={styles.sectionTitle}>Products similaires</Text>
           }
          
      <FlatList
        style={{marginTop: -10}}
        horizontal
        data={similarDishes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <VariationItem 
               color={color}
               prix={item.prix} id={item.id} nom={item.nom} image={item.images[0]}
               onAddToCart={
                ()=>{
                  addToCart(item)
                }
               }
            />
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>
        {product.prestataireName} propose aussi
      </Text>

      <FlatList
        style={{marginTop: -10}}
        horizontal
        data={restoProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <VariationItem 
              color={color}
             prix={item.prix} id={item.id} nom={item.nom} image={item.images[0]}
             onAddToCart={
              ()=>{
                addToCart(item)
              }
             }
            />
        )}
        showsHorizontalScrollIndicator={false}
      />
         </>
         
         }
        
        </>
        <Br size={24}/>
        {
          layout !=='pharmacie' &&  <RatingSection color={color} title={"Notez ce produit"} onSubmit={(data)=>{
            noter(data)
         }}/>
        }

      <Br size={24}/>
    </ScrollView>
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  sellerName: {
    color: 'white',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  locationText: {
    color: 'white',
    fontSize: RFValue(13),
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  dishName: {
    fontSize: RFValue(16),
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'montserrat-bold',
    width:  67

  },
  price: {
    fontSize: RFValue(16),
    color: '#F57224',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'montserrat-bold',

  },
   oldPrice: {
    fontSize: RFValue(12),
    color: "gray",
    textDecorationLine: "line-through",
    marginRight: 8,
    fontFamily: 'montserrat-regular',

  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: RFValue(12),
    color: '#666',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  deliveryText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
   priceQuantity:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  quantityButton: {
    backgroundColor: '#F57224',
    borderRadius: 50,
    padding: 10,
  },
  quantityText: {
    fontSize: RFValue(13),
    color: '#333',
    marginHorizontal: 15,
    fontFamily: 'montserrat-bold',

  },
  sectionTitle: {
    fontSize: RFValue(14),
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
    fontFamily: 'montserrat-bold',

  },
  description: {
    fontSize: RFValue(13),
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'montserrat-regular',

  },
  buttonContainer:{
    flexDirection:'row',
    justifyContent: 'center'
  } ,
  addToCartButton: {
    backgroundColor: '#F57224',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
    width: '48%',
    marginHorizontal: 2
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  similarDish: {
    alignItems: 'center',
    marginRight: 15,
  },
  similarDishImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  similarDishName: {
    color: '#333',
    marginTop: 8,
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(12),


  },
});

export default ProductDetails;
