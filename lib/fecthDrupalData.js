import { useState, useEffect, useRef } from 'react';
import { drupal } from "./drupal.ts"

const cacheDuration = 0.25 // en heures

const uniqueFilmRelationFields = [ 
	'field_site_thematique', 
	'field_realisation',
	'field_production',
	'field_langue',
	'field_consultants',
	'field_pays_origine',
	'field_vedettes_matiere',
	'field_films_relies',
]

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


// Charger tous films pour la grille de films. 
export const useFetchAllFilms = (isSearch) => {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const basicCacheValue = 'allFilmsBasic'
	const basicCacheTime = 'allFilmsTimestampBasic'
	const searchCacheValue = 'searchableFilms'
	const searchCacheTime = 'searchTimestamp'
	const cacheValueKey = isSearch ? searchCacheValue : basicCacheValue
	const cacheTimeKey = isSearch ? searchCacheTime : basicCacheTime
	
	const basicQueryParams = {
		fields: {
			"node--film": "path,drupal_internal__nid,title,field_annees_de_sortie,field_site_thematique,field_site_collection,field_site_visible,field_site_photogramme",
		},
		"filter[field_site_visible]": 1,
		include: "field_site_thematique,field_site_photogramme"
	}
	const searchQueryParams = {fields: {
			"node--film": "path,drupal_internal__nid,title,field_annees_de_sortie,field_site_thematique,field_realisation,field_site_collection,field_site_visible,field_vedettes_matiere,field_site_photogramme,field_descriptions_cadavrexquis",
		},
		"filter[field_site_visible]": 1,
		include: "field_site_thematique,field_site_photogramme,field_realisation,field_vedettes_matiere"}
	const queryParams = isSearch ? searchQueryParams : basicQueryParams
	
	//// -- Async functions calls -- ////
	// cache check
	useEffect(() => {
		if (typeof window !== 'undefined' && isLoading && !data && cacheIsUsable === null) {
			const resultBool = cacheCheck(cacheValueKey, cacheTimeKey)
			setCacheIsUsable(resultBool)
		}
	}, [isLoading, data, cacheIsUsable, cacheTimeKey, cacheValueKey])
	
	// set or fetch and set data
	useEffect( () => {
		// set data with usable cached data
		if (!data && cacheIsUsable === true && isLoading) {
			const cachedData = JSON.parse(localStorage.getItem(cacheValueKey))
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
						params: queryParams
					});
					
					// set
					setData(response);
					
					// store
					const jsonData = JSON.stringify(response)
					localStorage.setItem(cacheValueKey, jsonData);
					localStorage.setItem(cacheTimeKey, Date.now())
					
				} catch (error) {
					console.warn('useFetchAllFilms : Erreur lors du chargement des données', error);
					setError(true);
				}
			}
			fetchDrupalFilms()
		}
		
	}, [data, cacheIsUsable, isLoading, queryParams, cacheTimeKey, cacheValueKey])
	
	// Disable loading state
	useEffect( () => {
		if (data && isLoading) {
			setIsLoading(false);
		}
	},[data, isLoading])
	
	return { data, isLoading, error };
	
}


// Charger la liste des path alias et nid des films (pour la page d'un film unique, fetch le bon nid selon le path)
const useFetchFilmsPaths = () => {
	const [paths, setPaths] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const pathsCacheValueKey = 'allPaths'
	const pathsCacheTimeKey = 'pathsTimestamp'
	
	//// --  Functions declaration -- ////	
	// fetch all paths names and nid
	async function fetchFilmsPaths() {
		try {	
			// fetch
			const response = await drupal.getResourceCollection("node--film", {
				params: {
					"filter[field_site_visible]": 1,
					"fields[node--film]": "drupal_internal__nid,path"
				},
				deserialize: false,
			})
			
			// set
			setPaths(response);
			
			// store
			const jsonData = JSON.stringify(response)
			localStorage.setItem(pathsCacheValueKey, jsonData);
			localStorage.setItem(pathsCacheTimeKey, Date.now())
			
		} catch (error) {
			console.warn('useFetchFilmsPaths : Erreur lors du chargement des données', error);
			setError(true)
		}
	}
	
	//// -- Async functions calls -- ////
	// cache check
	useEffect(() => {
		if (typeof window !== 'undefined' && isLoading && !paths && cacheIsUsable === null) {
			const resultBool = cacheCheck(pathsCacheValueKey, pathsCacheTimeKey)
			setCacheIsUsable(resultBool)
		}
	}, [cacheIsUsable, paths, isLoading])
	
	// set or fetch and set paths
	useEffect( () => {
		// set paths with usable cached data
		if (!paths && cacheIsUsable === true && isLoading) {
			const cachedData = JSON.parse(localStorage.getItem(pathsCacheValueKey))
			console.log('[paths] Taking data from cache')
			setPaths(cachedData)
		}
		
		// Fetch paths from drupal db and set paths
		if (!paths && cacheIsUsable === false && isLoading) {
			console.log('[paths] Fetching data from DB')
			fetchFilmsPaths()
		}
		
	}, [paths, cacheIsUsable, isLoading])
	
	// Disable loading state
	useEffect( () => {
		if (paths && isLoading) {
			setIsLoading(false);
		}
	},[paths, isLoading])
	
	return { paths, isLoading, error };
}


// Fetch unique film node id in Drupal DB
export function useFetchUniqueFilm(initialData, path) {
	const { paths, isLoading: pathsIsLoading, error: pathsError } = useFetchFilmsPaths()
	const [ressourceId, setRessourceId] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [ film, setFilm ] = useState(initialData)
	
	useEffect(() => {
		if (pathsError && !error) {
			setError(true)
		}
	}, [pathsError, error])
	
	// Trouver l'id de ressource unique à partir du path
	useEffect(() => {
		if (!pathsIsLoading && paths && path && !ressourceId) {
			// trouver l'id ressource du node qui a le path.alias === path prop
			function findRessourceId(allPaths, uniquePath) {
				const nodeArr = allPaths.filter( node => node.attributes.path.alias === `/${path}`);
				const uniqueNodeRessourceId = nodeArr[0].id
				return uniqueNodeRessourceId
			}
			const id = findRessourceId(paths.data, path)
			setRessourceId(id)
		}
	}, [paths, pathsIsLoading, path, ressourceId])
	
	// Fetch le node à partir de l'id de ressource unique
	useEffect(()=> {
		if (ressourceId && !film.id) {
			// D'abord, monter le string pour le parametre include avec les relations
			const relationships = uniqueFilmRelationFields.join(',')
			
			// obtenir le node complet avec le nid
			async function fetchDrupal(id) {
				console.log('[Film unique] Fetching data from DB')
				try {	
					// fetch
					const response = await drupal.getResource(
						"node--film",
						id,
						{
							params: {
								include: relationships,
							}
						}
					);
					
					// set
					if (response.id) {
						setFilm(response);
					}
					
				} catch (error) {
					console.warn('useFetchUniqueFilm : Erreur lors du chargement des données', error);
					setError(true);
				}
			}
			fetchDrupal(ressourceId)
			
		}
	}, [ressourceId, film])
	
	// Disable loading state
	useEffect( () => {
		if (film.id && isLoading) {
			setIsLoading(false);
		}
	},[film, isLoading])
	
	return { film, isLoading, error };
	
}

