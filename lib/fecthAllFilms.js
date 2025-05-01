import { useState, useEffect } from 'react';
import { drupal } from "./drupal.ts"

// Utilitaire pour charger les données avec gestion du cache et des erreurs
export const useLoadData = (setData, initialData, cacheKey) => {
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
		setIsLoading(true);
		
		const fetchAndSetData = async () => {
			
			const dataTimestamp = localStorage.getItem('dataTimestamp');
			const sinceLastServerLoad = Date.now() - dataTimestamp
			const dataLivingDuration = 3 * 60 * 60 * 1000; // 3 heures en milisecondes
			const dataExpired = sinceLastServerLoad > dataLivingDuration;
			
			try {
				// Vérifier si les données sont déjà en cache et non expirées
				if ( typeof window !== 'undefined' && cacheKey && !dataExpired ) {
					//console.log('Fetching data from local storage... ')
					const cachedData = localStorage.getItem(cacheKey);
					if (cachedData) {
						setData(JSON.parse(cachedData));
						// Mettre à jour l'état de chargement et quitter sans charger de données
						setIsLoading(false); 
						return;
					}
				}
				
				//console.log('Fetching data from server... ')
				const data = await drupal.getResourceCollection("node--film", {
					params: {
						//"filter[status]": "1", 
					},
					deserialize: false,
				});
				setData(data.data);

				// Mettre à jour le cache si nécessaire
				if (typeof window !== 'undefined' && cacheKey) {
					localStorage.setItem(cacheKey, JSON.stringify(data.data));
					localStorage.setItem('dataTimestamp', Date.now())
				}
			} catch (error) {
				console.error('Myriade Web, useLoadData : Erreur lors du chargement des données ', error);
				setData(initialData);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchAndSetData();
 }, [setData, initialData, cacheKey]);

 return isLoading;
};