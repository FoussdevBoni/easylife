import { useState, useEffect } from "react";
import { statisticsService } from "../services/statisticsService";

interface StatisticsProps {
  total: number,
  rate: number,
  monthTotal: number

}
interface Statistics {
    usersNbr: StatisticsProps ,
    prestatairesNbr: StatisticsProps,
    commandesNbr: StatisticsProps,
    productsNbr: StatisticsProps
}

const useStatistics = (
  collectionName: "plats" | "medicaments" | "articles" | "logements",
  layout?: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport",
  month?: number,
  criterion?: "week" | "month" | "day" | "year"
) => {
  const [statistics, setStatistics] = useState<Statistics>({
    usersNbr: {
        total: 0,
        rate: 0,
        monthTotal: 0
    },
    prestatairesNbr: {
        total: 0,
        rate: 0,
        monthTotal: 0

    },
    commandesNbr: {
        total: 0,
        rate: 0,
        monthTotal: 0

    },
    productsNbr: {
        total: 0,
        rate: 0,
        monthTotal: 0

    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const usersNbr = await statisticsService.usersNbr(undefined, undefined);
        const prestatairesNbr = await statisticsService.prestatairesNbr(layout, criterion, month);
        const commandesNbr = await statisticsService.commandesNbr(criterion, month, layout);
        const productsNbr = await statisticsService.productsNbr(collectionName);

        setStatistics({
          usersNbr,
          commandesNbr,
          prestatairesNbr,
          productsNbr,
        });
      } catch (err) {
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    getStatistics();
  }, [collectionName, layout, month, criterion]); // Déclenche la récupération des données si les paramètres changent

  return { statistics, loading, error };
};

export { useStatistics };
