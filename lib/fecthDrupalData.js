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
			console.log('[films] Fetching data from DB')
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
			fetchDrupalFilms()
		}
		
	}, [data, cacheIsUsable, isLoading, initialData])
	
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
			console.log('[paths] Taking data from cache')
			setData(cachedData)
		}
		
		// Fetch data from drupal db and set data
		if (!data && cacheIsUsable === false && isLoading) {
			console.log('[paths] Fetching data from DB')
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