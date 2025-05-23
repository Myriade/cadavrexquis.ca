import { useState, useEffect, useRef } from 'react';
import { drupal } from "./drupal.ts"

const cacheDuration = 0.25 // en heures

// Reusable functions //
// Cache check
function cacheCheck(dataKey, timestampKey) {	
	const cacheTimestamp = localStorage.getItem(timestampKey);
	
	if (!cacheTimestamp) {
		return false
	}
	
	const sinceLastServerLoad = Date.now() - cacheTimestamp
	const dataLivingDuration = cacheDuration * 60 * 60 * 1000; // 3 heures en milisecondes
	const dataExpired = sinceLastServerLoad > dataLivingDuration;
	
	function isEmpty(obj){
		if (Object.keys(obj).length)
			return false
		else 
			return true
	}
	
	const storedData = localStorage.getItem(dataKey)
	const parsedDataObj = JSON.parse(storedData)
	const cachedDataIsEmpty = isEmpty(parsedDataObj)
	
	if (dataExpired || cachedDataIsEmpty)
		return false
	else 
		return true	
}


// Charger tous films pour la grille
export const useFetchAllFilms = (initialData) => {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const filmsCacheValueKey = 'allFilms'
	const filmsCacheTimeKey = 'filmsTimestamp'
	
	//// --  Functions declaration -- ////
	// Drupal fetch data
	async function fetchDrupalFilms() {
		try {	
			// fetch
			const response = await drupal.getResourceCollection("node--film", {
				deserialize: false,
				params: {
					fields: {
						"node--film": "path,drupal_internal__nid,title,field_annees_de_sortie,field_site_thematique,field_site_collection,field_site_visible,field_site_photogramme",
					},
					include: "field_site_thematique,field_site_photogramme"
				}
			});
			
			// set
			setData(response);
			
			// store
			const jsonData = JSON.stringify(response)
			localStorage.setItem(filmsCacheValueKey, jsonData);
			localStorage.setItem(filmsCacheTimeKey, Date.now())
			
		} catch (error) {
			console.error('useFetchAllFilms : Erreur lors du chargement des données', error);
			const defaultResponse = {}
			defaultResponse.data = initialData 
			defaultResponse.included = null
			setData(defaultResponse);
		}
	}
	
	//// -- Async functions calls -- ////
	// cache check
	useEffect(() => {
		if (typeof window !== 'undefined' && isLoading && !data && cacheIsUsable === null) {
			const resultBool = cacheCheck(filmsCacheValueKey, filmsCacheTimeKey)
			setCacheIsUsable(resultBool)
		}
	}, [cacheIsUsable, data, isLoading])
	
	// set or fetch and set data
	useEffect( () => {
		// set data with usable cached data
		if (!data && cacheIsUsable === true && isLoading) {
			const cachedData = JSON.parse(localStorage.getItem(filmsCacheValueKey))
			console.log('[films] Taking data from cache')
			setData(cachedData)
		}
		
		// Fetch data from drupal db and set data
		if (!data && cacheIsUsable === false && isLoading) {
			console.log('[films] Fetching data from Drupal DB')
			fetchDrupalFilms()
		}
		
	}, [data, cacheIsUsable, isLoading])
	
	// Disable loading state
	useEffect( () => {
		if (data && isLoading) {
			setIsLoading(false);
		}
	},[data, isLoading])
	
	return { data, isLoading, error };
	
}


// Charger la liste des path alias et nid des films
export const useFetchFilmsPaths = (initialData) => {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const pathsCacheValueKey = 'allPaths'
	const pathsCacheTimeKey = 'pathsTimestamp'
	
	//// --  Functions declaration -- ////	
	// Drupal fetch data
	async function fetchFilmsPaths() {
		try {	
			// fetch
			const response = await drupal.getResourceCollection("node--film", {
				params: {
					"fields[node--film]": "drupal_internal__nid,path"
				},
				deserialize: false,
			})
			
			// set
			setData(response);
			
			// store
			const jsonData = JSON.stringify(response)
			localStorage.setItem(pathsCacheValueKey, jsonData);
			localStorage.setItem(pathsCacheTimeKey, Date.now())
			
		} catch (error) {
			console.error('useFetchFilmsPaths : Erreur lors du chargement des données', error);
		}
	}
	
	//// -- Async functions calls -- ////
	// cache check
	useEffect(() => {
		if (typeof window !== 'undefined' && isLoading && !data && cacheIsUsable === null) {
			const resultBool = cacheCheck(pathsCacheValueKey, pathsCacheTimeKey)
			setCacheIsUsable(resultBool)
		}
	}, [cacheIsUsable, data, isLoading])
	
	// set or fetch and set data
	useEffect( () => {
		// set data with usable cached data
		if (!data && cacheIsUsable === true && isLoading) {
			const cachedData = JSON.parse(localStorage.getItem(pathsCacheValueKey))
			console.log('[paths]Taking data from cache')
			setData(cachedData)
		}
		
		// Fetch data from drupal db and set data
		if (!data && cacheIsUsable === false && isLoading) {
			console.log('[paths] Fetching data from Drupal DB')
			fetchFilmsPaths()
		}
		
	}, [data, cacheIsUsable, isLoading])
	
	// Disable loading state
	useEffect( () => {
		if (data && isLoading) {
			setIsLoading(false);
		}
	},[data, isLoading])
	
	return { data, isLoading, error };
	
}


// OBSOLETE Utilitaire pour charger les données de taxonomies
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
				console.log('[taxo] Checking cache')
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
			console.log('[taxo] Taking data from cache')
			setData(cachedData)
		}
		
		// Fetch data from drupal db
		if (!data && cacheIsUsable.current === false && !fetchedData) {
			
			console.log('[taxo] Fetching data from Drupal')
			
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
				console.log('[taxo] Process data')
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
			console.log('[taxo] Updating local storage with new data')
			localStorage.setItem(cacheKey, jsonData);
			localStorage.setItem('taxoTimestamp', Date.now())
			
			setData(newData)
		}
		
	}, [fetchedData, data])
	
	// Disable loading state
	useEffect( () => {
		if (data) {
			console.log('[taxo] Disabling loading state')
			setLoading(false);
		}
	},[data])
	
	return { data, loading, error };
};