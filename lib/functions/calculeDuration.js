export function calculDuration(startDate, endDate) {
    // Convertir les dates en format ISO pour éviter les erreurs liées au format local
    const start = new Date(startDate.split('/').reverse().join('-'));
    const end = new Date(endDate.split('/').reverse().join('-'));
    
    // Calculer la différence en millisecondes
    const differenceInMilliseconds = end - start;
    
    // Convertir les millisecondes en jours
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    
    return differenceInDays;
  }
  
  
  