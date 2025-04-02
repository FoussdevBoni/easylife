
export interface User {
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    password: string;
    address: string;
    phoneNumber: string;
    role: 'vendeur' | 'acheteur-pro' | 'acheteur-particulier' | 'admin';
    siret?: string | undefined;
    birthday: string;
    profile?: string;
    id?: any;
    date?: string
  }
  
  export interface Product extends Logement {
    nom: string;
    description: string;
    prix: number;
    likes?: number;
    views?: number;
    prestataireId?: string;
    prestataireName?: string;
    isPromo?: boolean;
    quantite: number;
    statut?: 'pending' | 'approved' | 'rejected';
    reduction?: number;
    id?: string;
    images: string[] ;
    commandes?: number;
    categorieId?: string;
    categorie?: Categorie | null,
    note?: number;
    quantityCommanded?: number,
    date: string,
    adresse?: string,
    livraisonTime: string,
    location: any,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    ordonnance: boolean,
    variations?: Variation [],
    isVariable?: boolean
  }

  
  export interface Prestataire {
    pays?: string;
    garde?: boolean;
    nom?: string;
    ville?: string,
    profile?: string;
    reviews?: number,
    likes: number,
    note?: number,
    date?: string,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    location: any,
    id?: any, 
    adresse: string,
    views: number,
    tel?: string,
    whatsapp?: string,
    disponibilites?: string,
    email: string;
    password: string
  }
  
  export interface Commande {
    clientId: string;
    contact: string;
    statut: 'En attente' | 'Acceptée' | 'Refusée' | 'Annulée';
    deliveryAddress: string;
    date: string;
    details: string;
    id?: string;
    productId?:string, 
    email: string,
    nom: string  ,
    prestataireId: string,
    prix: number,
    quantite?: number,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',

  }
  
  export interface Logement {
     area?: number,
     bedrooms?: number,
     bathrooms?: number,
     balcony?: boolean,
     airConditioning?: boolean,
     balconyArea?: number,
     charges?: number,
     deposit?: number,
     elevator?: boolean,
     endDate?: string,
     startDate?: string,
     equippedKitchen?: boolean,
     floor?: number,
     furnished?: boolean, 
     garden?: boolean,
     gardenArea?: number
     haveOther?: boolean,
     heating?: string,
     internet?: boolean,
     neighborhood?: string,
     parking?: boolean,
     petsAllowed?: boolean,
     toilets?: number,
     rooms?: number,
     transport?: string,


  }

  export interface Categorie{
    id?: string,
    logo: string,
    nom: string,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    prestataireId: string
  }
  

  export interface Variation{
    type: string,
    value: string,
    image: string,
    prix: number
  }

  export interface Reservation {
    client: string;
    email: string;
    phone: string;
    country: string;
    logementId: string;
    clientId: string;
    date: string;
    startDate: string;
    endDate: string;
    identityDocType: 'passport' | 'id_card' | 'driver_license';
    identityDocNumber: string;
    identityDocPhotos: string[]; 
    statut: 'refusée' | 'validée' | 'annulée' | undefined;
    id?: string,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
  }