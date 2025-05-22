import { useState, useEffect, useRef } from 'react';
import { drupal } from "./drupal.ts"

const cacheDuration = 0.25 // en heures

// Utilitaire pour charger les données de film avec gestion du cache et des erreurs
export const useLoadData = (setData, initialData, cacheKey) => {
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
		setIsLoading(true);
		
		const fetchAndSetData = async () => {
			
			const allFilmTimestamp = localStorage.getItem('allFilmTimestamp');
			const sinceLastServerLoad = Date.now() - allFilmTimestamp
			const dataLivingDuration = cacheDuration * 60 * 60 * 1000; // 3 heures en milisecondes
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
					deserialize: false,
					params: {
						fields: {
							"node--film": "path,drupal_internal__nid,title,field_annees_de_sortie,field_site_thematique,field_site_collection,field_site_visible"
						},
						include: "field_site_thematique"
					}
				});
				setData(data.data);

				// Mettre à jour le cache si nécessaire
				if (typeof window !== 'undefined' && cacheKey) {
					localStorage.setItem(cacheKey, JSON.stringify(data.data));
					localStorage.setItem('allFilmTimestamp', Date.now())
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


// Utilitaire pour charger les données de taxonomies
export const useLoadTaxonomies = () => {
	const [data, setData] = useState(null)
	const [fetchedData, setFetchedData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const cacheIsUsable = useRef(null)
	
	const vocabularyArray = ['realisation', 'langue', 'site_categorie']
	const cacheKey = 'taxonomiesCache'
	
	// reusable fetch function
	async function fetchDrupalVocabulary(vocabName) {
		const fieldsParam = `fields[${vocabName}]`;
		
		try {	
			const response = await drupal.getResourceCollection(vocabName, {
				params: {
					[fieldsParam]: "termid,name",
					"page[limit]": 200
				},
				deserialize: false,
			});
			
			const data = await response.data;
			return data;
			
		} catch (error) {
			console.error(`Myriade Web - useLoadTaxonomies : Erreur lors du chargement des données pour le vocablaire ${vocabName}`, error);
			throw error;
		}
	}
	
	// Cache check
	useEffect(() => {
		
		if (typeof window !== 'undefined' && vocabularyArray && !fetchedData) {
			
			function cacheCheck() {	
				console.log('Checking cache for taxo data...')
				const taxoTimestamp = localStorage.getItem('taxoTimestamp');
				if (!taxoTimestamp)
					return false
				
				const sinceLastServerLoad = Date.now() - taxoTimestamp
				const dataLivingDuration = cacheDuration * 60 * 60 * 1000; // 3 heures en milisecondes
				const dataExpired = sinceLastServerLoad > dataLivingDuration;
				
				function isEmpty(obj){
					if (Object.keys(obj).length)
						return false
					else 
						return true
				}
				
				const storedData = localStorage.getItem(cacheKey)
				const parsedDataObj = JSON.parse(storedData)
				const cachedDataIsEmpty = isEmpty(parsedDataObj)
				
				if (dataExpired || cachedDataIsEmpty)
					return false
				else 
					return true	
			}
			
			if (!data && cacheIsUsable.current === null)
				cacheIsUsable.current = cacheCheck()
		}
		
		if (!vocabularyArray)
			console.warn('Myriade web : un array de string doit desiger les vocabulaires a extraire') 
		
	}, [vocabularyArray, cacheIsUsable.current, data, fetchedData])
	
	// Set data with cached data or Fetch Drupal data for further treatment
	useEffect( () => {
		
		// set data with usable cached data
		if (!data && cacheIsUsable.current === true && !fetchedData) {
			const cachedData = JSON.parse(localStorage.getItem(cacheKey))
			console.log('Taking taxo data from cache')
			setData(cachedData)
		}
		
		// Fetch data from drupal db
		if (!data && cacheIsUsable.current === false && !fetchedData) {
			
			console.log('Fetching taxo data from Drupal DB ...')
			
			let fetchedObj = {}
			
			const fetchData = async () => {	
				try {
					const fetchedObj = {};
					const promises = vocabularyArray.map(vocabulary => {
						const vocabularyName = 'taxonomy_term--' + vocabulary;
						return fetchDrupalVocabulary(vocabularyName)
							.then(result => {
								fetchedObj[vocabulary] = result;
							});
					});
					await Promise.all(promises);
					setFetchedData(fetchedObj);
				} catch (error) {
					setError(error);
					console.error('Myriade Web, useLoadTaxonomies : Erreur lors du chargement des données ', error);
					return null
				}
			};
			
			fetchData();
			
		}
		
	}, [vocabularyArray, data, cacheIsUsable.current, fetchedData])
	
	// Traiter les termes
	useEffect( () => {
		if (fetchedData !== null && !data) {
			// console.log('fetchedData', fetchedData)
			
			let newData = {}
			
			function traitementTermes(obj) {
				console.log('Treating taxo data to minimal ...')
				for (const [key, value] of Object.entries(obj)) {
					if (!value[0].id) {
						console.warn(`Myriade Web : le vocabulaire ${key} est vide`)
						return
					}
					
					newData[key] = value.map(term => ({
						id: term.attributes.termid,
						name: term.attributes.name
					}))
				}
			}
			
			traitementTermes(fetchedData);
			
			// Mettre à jour le cache
			const jsonData = JSON.stringify(newData)
			console.log('Updating local storage with new taxo data...')
			localStorage.setItem(cacheKey, jsonData);
			localStorage.setItem('taxoTimestamp', Date.now())
			
			setData(newData)
		}
		
	}, [fetchedData, data])
	
	// Disable loading state
	useEffect( () => {
		if (data) {
			console.log('Disabling loading state for taxonomy...')
			setLoading(false);
		}
	},[data])
	
  return { data, loading, error };
};

