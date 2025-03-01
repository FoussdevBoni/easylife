import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Dimensions } from 'react-native';
import StackAppbar from '../../components/StackAppBar';
import { setCart } from '../../reducer/cartSlice';
import { RFValue } from 'react-native-responsive-fontsize';
const {height , width} = Dimensions.get("screen")


function Cart({  layout , checkoutRoute , productsRoute , title , color , user }) {
    const [message , setMessage] = useState()
    const dispatch = useDispatch();
    const allcart = useSelector((state) => state.cart.cartData);
    const updatedCart = allcart.map(item=> {
        const reduction = item.prix*(1- item.reduction/100)

        return(
            {
             ...item,
             prix: item.reduction? reduction : item.prix,
             oldPrix:  item.prix
            }
        )
    })
    const cart = updatedCart.filter(item => item.layout === layout);

    const [quantities, setQuantities] = useState(cart.map((item) => item.quantity));
    const navigation = useNavigation();

    const handleAdd = (index) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] += 1;
        setQuantities(updatedQuantities);
    };

    const handleSubtract = (index) => {
        const updatedQuantities = [...quantities];
        if (updatedQuantities[index] > 1) {
            updatedQuantities[index] -= 1;
            setQuantities(updatedQuantities);
        }
    };

    const handleRemove = (itemId) => {
        // Dispatch the action to remove the item from the cart
    const updatedCart = allcart.filter((item) => item.id !== itemId);
    dispatch(setCart(updatedCart))


    };

    const calculateTotalAmount = () => {
        return cart.reduce((total, item, index) => total + item.prix * quantities[index], 0);
    };

    const amount = calculateTotalAmount()

    useEffect(()=>{
        if (layout==='pharmacie') {
        setMessage(`${cart.length} médicaments  sélectionnés`)
        } else if (layout==='restaurant') {
            setMessage(`${cart.length} produits alimentaires sélectionnés`)

        } else if (layout==='supermarket') {
            setMessage(`${cart.length} articles  sélectionnés`)

        } else {
            setMessage(`${cart.length} produits  sélectionnés`)

        }
    } , [])

    const CartItem = ({item , index})=>{

        const reduction = item.prix*(1- item.reduction/100)
 
        return(
            <View key={item.id} style={styles.cartItem}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: item.images[0] }} />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{item?.nom}</Text>
                </View>
                <View style={styles.prixContainer}>
                        <Text style={styles.oldepPrixText}>{item.oldPrix} FCFA</Text>
                 </View>
                <View style={styles.prixAndQntiteContainer}>
                    <View style={styles.prixContainer}>
                        <Text style={styles.prixText}>{item.prix} FCFA</Text>
                    </View>
                    <View style={[styles.quantityContainer , {backgroundColor: color}]}>
                        <TouchableOpacity
                            onPress={() => handleSubtract(index)}
                            style={styles.quantityButton}
                            disabled={quantities[index] === 1}
                        >
                            <Text style={[styles.quantityText, quantities[index] === 1 && { color: 'gray' }]}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantities[index]}</Text>
                        <TouchableOpacity onPress={() => handleAdd(index)} style={styles.quantityButton}>
                            <Text style={styles.quantityText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
        )
    }
   
    return (
      <View style={styles.container}>
        <StackAppbar title="Mon panier" color={color} />
           <View style={{height: height*0.6}}>
                <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
                <Text style={styles.emptyCartText}>Votre panier est vide</Text>
            ) : (
                cart.map((item, index) => (
                   <CartItem item={item} key={index} index={index}/>
                ))
            )}
        </ScrollView>
           </View>
           <View style={styles.about}>
            <Text style={styles.aboutText}>
                {message}
            </Text>
            <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Montant total:</Text>
                <Text style={styles.amountValue}>{calculateTotalAmount()} FCFA</Text>
            </View>
             {
                cart.length ? <View style={styles.commandeContainer}>
                <TouchableOpacity style={[styles.commandeButton ,  {backgroundColor: color}]} onPress={() => {
                    if (user) {
                        navigation.navigate(checkoutRoute, { cart , amount })   
                    }else {
                        navigation.navigate("login")
                    }
                }}>
                    <Text style={styles.commandeButtonText}>Commander</Text>
                </TouchableOpacity>
            </View>: <View style={styles.commandeContainer}>
                <TouchableOpacity style={[styles.commandeButton ,  {backgroundColor: color}]} onPress={() => navigation.navigate(productsRoute, { data: {title: title} })}>
                    <Text style={styles.commandeButtonText}>
                        Charger mon panier
                    </Text>
                </TouchableOpacity>
            </View>
             }
        </View>
      </View>
    );
}

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        height: 100,
        alignItems: 'center', // Aligner les éléments au centre
        position: 'relative', // Nécessaire pour positionner le bouton "Retirer"
    },
    imageContainer: {
        width: '30%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    detailsContainer: {
        width: '70%',
        padding: 10,
        justifyContent: 'center',
    },
    nameContainer: {
        marginBottom: 5,
    },
    nameText: {
        fontFamily: 'montserrat-bold',
        fontSize: RFValue(13)

    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prixAndQntiteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    prixContainer: {},
    prixText: {
        fontFamily: 'montserrat-bold',
        fontSize: RFValue(13)

    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    quantityButton: {
        paddingVertical: 1,
        paddingHorizontal: 8,
        borderRadius: 20,
    },
    quantityText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: RFValue(13)

    },
    quantity: {
        fontFamily: 'montserrat-bold',
        marginHorizontal: 10,
        color: '#FFF',
    },
    about: {
        flex: 2,
        backgroundColor: '#ccc',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 20,
        justifyContent: 'flex-end',
        paddingTop: 50,
        height: height*0.8,
    },
    aboutText: {
        fontFamily: 'montserrat-bold',
        fontSize: RFValue(13)

    },
    amountContainer: {
        flexDirection: 'row',
        marginTop: 12,

    },
    amountLabel: {
        fontFamily: 'montserrat-regular',
        fontSize: RFValue(13)


    },
    amountValue: {
        fontSize: RFValue(13),
        fontFamily: 'montserrat-regular',   
     marginLeft: 12,
    },
    commandeContainer: {
        alignItems: 'center',
        marginBottom: 3,
        alignSelf: 'stretch',
    },
    commandeButton: {
        paddingVertical: 15,
        borderRadius: 30,
        width: '70%',
        alignItems: 'center',
        marginTop: 10,
    },
    commandeButtonText: {
        color: 'white',
        fontFamily: 'montserrat-bold',
        fontSize: RFValue(13)
    },
    emptyCartText: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 20,
    },
    removeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    oldepPrixText:{
        fontSize: 13,
      color: "gray",
    textDecorationLine: "line-through",
    marginRight: 8,
    fontFamily: 'montserrat-regular',

    }
});
