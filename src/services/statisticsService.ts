import { calculRate } from "../functions/calculRate"
import { getDataByDate } from "../functions/getDataByDate"
import { getDataByMonth } from "../functions/getDataByMonth"
import { Commande, Prestataire } from "../utils/database"
import { commandesService } from "./commandesService"

import {prestatairesService} from "./prestatairesService"
import { productsService } from "./productsService"
import usersService from "./usersService"

export const statisticsService = {
    async prestatairesNbr(    layout?: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
       criterion?: 'week' | 'month' | 'day' | 'year' , month?: number){
        try {
          const prestataires = await prestatairesService.getAllPrestataires(layout , criterion)
           
          const filteredData = getDataByDate(prestataires , criterion).filter((item: Prestataire)=>(
             item.layout===layout
          ))
           
          return {
            total: filteredData.length,
            rate: calculRate(filteredData , criterion),
            monthTotal: getDataByMonth(prestataires , month).length
          }
        } catch (error) {
          return {
            total: 0,
            rate: 0,
            monthTotal: 0

          }
        }
    },

    async usersNbr(criterion?: 'week' | 'month' | 'day' | 'year', month?: number){
      try {
        const users = await usersService.getUsers()
        const filteredData = getDataByDate(users , criterion)
        return {
          total: filteredData.length,
          rate: calculRate(filteredData , criterion),
          monthTotal: getDataByMonth(users , month).length

        }
      } catch (error) {
        return {
          total: 0,
          rate: 0,
          monthTotal: 0

        }
      }
  },

    async productsNbr(collectionName: 'plats' | 'medicaments' | 'articles' | 'logements' , criterion?: 'week' | 'month' | 'day' | 'year', prestataireId?: string ,month?: number){
        try {
         const products = !prestataireId ? await productsService.getProducts(collectionName) :
          await productsService.getProductsByAttribute(collectionName , "prestataireId" , prestataireId)
          const filteredData = getDataByDate(products , criterion)

           return {
          total: filteredData.length,
          rate: calculRate(filteredData , criterion),
          monthTotal: getDataByMonth(products , month).length

        }
        } catch (error) {
           return {
            total: 0,
            rate: 0,
            monthTotal: 0

           }
        }
    },


   
    async commandesNbr(  
      criterion?: 'week' | 'month' | 'day' | 'year' , 
      month?: number , 
      layout?: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport'
    ){
      
    

      try {
        const commandes = await commandesService.getCommandes(criterion , layout)

         const filteredData : Commande [] = getDataByDate(commandes , criterion)
          .filter((item: Commande )=>(
            item.layout===layout
          ))

        return {
          total: filteredData.length,
          rate: calculRate(filteredData , criterion),
          monthTotal: getDataByMonth(commandes , month).length

        }
       } catch (error) {
          return {
            total: 0,
            rate: 0,
            monthTotal: 0

          }
       }
    },
    
  

   




}