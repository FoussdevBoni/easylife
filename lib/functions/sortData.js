import { getDistance } from "./getDistance";

/**
 * Trie une liste d'objets en fonction d'un attribut, y compris pour les dates.
 * 
 * @param {Array} list - La liste d'objets à trier.
 * @param {string} date - L'attribut sur lequel trier la liste.
 * @param {boolean} [ascending=true] - Définit si le tri doit être croissant ou décroissant (par défaut croissant).
 * @returns {Array} - La liste triée.
 */
export function sortByDate(list, date, ascending = true) {
    return list.sort((a, b) => {
        const valA = new Date(a[date]);
        const valB = new Date(b[date]);

        const isValidDateA = !isNaN(valA.getTime());
        const isValidDateB = !isNaN(valB.getTime());

        // Comparer les valeurs valides
        if (isValidDateA && isValidDateB) {
            return ascending ? valA - valB : valB - valA;
        }

        // Les valeurs invalides ou non dates restent dans l'ordre initial
        return 0;
    });
}


 
/**
 * Trie les données par distance (croissante).
 * @param {Array} data - Tableau d'objets contenant une propriété 'distance'.
 * @returns {Array} - Tableau trié par distance croissante.
 */
export function sortByDistance(data) {
    
    return data.sort((a, b) => {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);
  
      // Comparaison des distances
      if (isNaN(distanceA) || isNaN(distanceB)) {
        return 0; // Ignore si la distance est invalide
      }
      return distanceA - distanceB;
    });
  }

  export function sortByIndex(data , index) {
    
    return data.sort((a, b) => {
      const noteA = parseFloat(a.note || 0);
      const noteB = parseFloat(b.note || 0);
  
      // Comparaison des distances
      if (isNaN(noteA) || isNaN(noteB)) {
        return 0; // Ignore si la distance est invalide
      }

      return  noteB - noteA;
    });
  }
  