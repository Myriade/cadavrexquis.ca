import { useState, useEffect, useRef } from 'react';
import { drupal } from "./drupal.ts"

const cacheDuration = 0.5 // en heures

// Pour que les champs associés à un vocabulaire de taxonomie soient répertoriés avec les noms de termes.
const uniqueFilmRelationFields = [ 
	'field_site_thematique', 
	'field_realisation',
	'field_production',
	'field_langue',
	'field_consultants',
	'field_pays_origine',
	'field_vedettes_matiere',
	'field_films_relies',
	'field_format',
	'field_son',
	'field_langues',
	'field_fabricant',
	'field_emulsion',
	'field_ratio',
	'field_institution_detentrice',
	'field_commanditaires',
	'field_distribution',
	'field_scenario',
	'field_narration',
	'field_direction_de_la_photograph',
	'field_son_sound',
	'field_musique',
	'field_montage',
	'field_effets_speciaux_et_animati',
	'field_jeu',
	'field_participation',
	'field_autres',
	'field_format_de_production',
	'field_personnes'
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

///// ---- GRILLE FILMS et DOCUMENTS -----/////
// Charger tous films et les documents pour la grille d'accueil 
export const useFetchFilmsAndDocuments = (isSearch) => {
	const [filmData, setFilmData] = useState(null)
	const [docData, setDocData] = useState(null)
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const basicCacheValue = 'allCards'
	const basicCacheTime = 'cardsTimestamp'
	const searchCacheValue = 'searchContent'
	const searchCacheTime = 'searchTimestamp'
	const cacheValueKey = isSearch ? searchCacheValue : basicCacheValue
	const cacheTimeKey = isSearch ? searchCacheTime : basicCacheTime
	
	//  Films Query params mount
	const basicFilmsQueryParams = {
		fields: {
			"node--film": "path,created,promote,drupal_internal__nid,title,field_annees_de_sortie,field_site_thematique,field_site_collection,field_site_visible,field_site_photogramme"
		},
		"filter[field_site_visible]": 1,
		include: "field_site_thematique,field_site_photogramme",
		"page[limit]": 400
	}
	const staticSearchFieldsArr = [
		'path',
		'drupal_internal__nid',
		'title',
		'field_site_collection',
		'field_annees_de_sortie',
		'field_site_visible',
		'field_descriptions_cadavrexquis',
		'field_resume_de_l_institution_de',
	]
	const staticSearchFields = staticSearchFieldsArr.join(',')
	const taxoSearchFieldsArr = [
		'field_site_photogramme',
		'field_site_thematique',
		'field_realisation',
		'field_vedettes_matiere',
		'field_langue',
		'field_production',
		'field_consultants',
		'field_pays_origine',
		'field_format',
		'field_son',
		'field_langues',
		'field_fabricant',
		'field_emulsion',
		'field_ratio',
		'field_institution_detentrice',
		'field_commanditaires',
		'field_distribution',
		'field_scenario',
		'field_narration',
		'field_direction_de_la_photograph',
		'field_son_sound',
		'field_musique',
		'field_montage',
		'field_effets_speciaux_et_animati',
		'field_jeu',
		'field_participation',
		'field_autres',
		'field_format_de_production',
		'field_personnes'
	]
	const taxoSearchFields = taxoSearchFieldsArr.join(',')
	const allSearchFields = staticSearchFields.concat(',', taxoSearchFields)
	const searchFilmsQueryParams = {
		fields: {
			"node--film": allSearchFields
		},
		"filter[field_site_visible]": 1,
		include: taxoSearchFields,
		"page[limit]": 400
	}
	const filmsQueryParams = isSearch ? searchFilmsQueryParams : basicFilmsQueryParams
	
	// Documents query params mount
	const docBasicQueryParams = {
		fields: {
			"node--article": 'path,created,promote,drupal_internal__nid,field_site_visible,title,field_site_thematique,field_site_photogramme,field_annees_de_sortie'
		},
		"filter[field_site_visible]": 1,
		"include": 'field_site_thematique,field_site_photogramme',
		"page[limit]": 200
	}
	const docSearchQueryParams = {
		fields: {
			"node--article": 'path,drupal_internal__nid,field_site_visible,title,body,field_site_thematique,field_site_photogramme,field_annees_de_sortie'
		},
		"filter[field_site_visible]": 1,
		"include": 'field_site_thematique,field_site_photogramme',
		"page[limit]": 200
	}
	const docsQueryParams = isSearch ? docSearchQueryParams : docBasicQueryParams
	
	//// -- Async functions calls -- ////
	// cache check
	useEffect(() => {
		if (typeof window !== 'undefined' && isLoading && !data && cacheIsUsable === null) {
			const resultBool = cacheCheck(cacheValueKey, cacheTimeKey)
			setCacheIsUsable(resultBool)
		}
	}, [isLoading, data, cacheIsUsable, cacheTimeKey, cacheValueKey])
	
	// set data with usable cached data
	useEffect( () => {
		if (!data && cacheIsUsable === true && isLoading) {
			const cachedData = JSON.parse(localStorage.getItem(cacheValueKey))
			console.log('[films & documents] Taking data from cache')
			setData(cachedData)
		}
	}, [data, cacheIsUsable, isLoading, cacheValueKey])
	
	// Fetch data from drupal db and set data
	useEffect( () => {	
		if (!data && !filmData && !docData && cacheIsUsable === false && isLoading) {
			
			// Fonction pour alléger le poids des données
			function filtrerProprietes(objet) {
				// Vérifier si l'objet est valide
				if (!objet || typeof objet !== 'object') {
					return {};
				}
			
				const nouvelObjet = {
					type: objet.type,
					attributes: {}
				};
			
				// Filtrer les propriétés du niveau attributes
				if (objet.attributes && typeof objet.attributes === 'object') {
					nouvelObjet.attributes.name = objet.attributes.name;
					nouvelObjet.attributes.drupal_internal__fid = objet.attributes.drupal_internal__fid;
					nouvelObjet.attributes.termid = objet.attributes.termid;
					nouvelObjet.attributes.drupal_internal__tid = objet.attributes.drupal_internal__tid
					
					// Gérer la propriété uri.url
					if (objet.attributes.uri && objet.attributes.uri.url) {
						nouvelObjet.attributes.uri = {
							url: objet.attributes.uri.url
						};
					}
				}
			
				return nouvelObjet;
			}
			
			async function fetchDrupalFilms() {
				console.log('[films] Fetching data from DB')
				try {	
					// fetch
					const response = await drupal.getResourceCollection("node--film", {
						deserialize: false,
						params: filmsQueryParams
					});
					
					const leanIncludedData = response.included.map(filtrerProprietes);
					const leanData = { ...response, included: leanIncludedData };
					
					// Set state
					setFilmData(leanData);
					
				} catch (error) {
					console.warn('useFetchFilmsAndDocuments : Erreur lors du chargement des données', error);
					setError(true);
				}
			}
			
			async function fetchDrupalDocuments() {
				console.log('[documents] Fetching data from DB')
				try {	
					// fetch
					const response = await drupal.getResourceCollection("node--article", {
						deserialize: false,
						params: docsQueryParams
					});
					
					const leanIncludedData = response.included.map(filtrerProprietes);
					const leanData = { ...response, included: leanIncludedData };
					
					// Set Sate
					setDocData(leanData);
					
				} catch (error) {
					console.warn('useFetchAllDocuments : Erreur lors du chargement des données de documents', error);
					setError(true);
				}
			}
			
			fetchDrupalFilms()
			fetchDrupalDocuments()
		}
	}, [data, filmData, docData, cacheIsUsable, isLoading, filmsQueryParams, docsQueryParams])
		
	// Concatenate films & docs data + store in cache
	useEffect( () => {	
		if (!data && filmData && docData && cacheIsUsable === false && isLoading) {
			let result = filmData;
			
			// add documents data
			docData.data.forEach( item => {
				result.data.push(item) 
			})
			
			// add documents included files refs
			docData.included.forEach( item => {
				if (item.type === 'file--file') {
					result.included.push(item)
				}
			})
			
			setData(result)
			
			// store
			const jsonData = JSON.stringify(result)
			localStorage.setItem(cacheValueKey, jsonData);
			localStorage.setItem(cacheTimeKey, Date.now())
		}
		
	}, [data, filmData, docData, cacheIsUsable, isLoading, cacheTimeKey, cacheValueKey])
	
	// Disable loading state
	useEffect( () => {
		if (data && isLoading) {
			setIsLoading(false);
		}
	},[data, isLoading])
	
	return { data, isLoading, error };
	
}

// FILMS : Charger la liste des path alias et nid des films (pour la page d'un film unique, fetch le bon nid selon le path)
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
					"fields[node--film]": "path,drupal_internal__nid",
					"page[limit]": 400
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

// FILM : Fetch unique film node in Drupal DB from its unique identifier
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
				if (nodeArr.length) {
					const uniqueNodeRessourceId = nodeArr[0].id
					return uniqueNodeRessourceId
				} else {
					setFilm('not-found')
				}
			}
			const id = findRessourceId(paths.data, path)
			if (id) {
				setRessourceId(id)
			}
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
		if ( (film.id || film === 'not-found') && isLoading) {
			setIsLoading(false);
		}
	},[film, isLoading])
	
	return { film, isLoading, error };
	
}

///// ---- PAGES -----/////
// Fetch PAGE node from its node ID in Drupal DB (Code d'éthique réemploi, Bibliographie...)
export function useFetchPageNode(nid) {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [data, setData] = useState(null)
	
	// Fetch le node à partir de son node ID.
	useEffect(()=> {
		if (nid && !data) {
			// obtenir le node complet avec le nid
			async function fetchDrupal() {
				try {	
					
					console.log('[Page] Fetching data from DB ')
					// fetch
					const response = await drupal.getResourceCollection("node--page", {
						params: {
							"filter[nid]": nid,
						},
						deserialize: false,
					})
					
					// set
					if ( response && response.data.length) {
						setData(response.data[0]);
					}
					
				} catch (error) {
					console.warn('useFetchPageNode : Erreur lors du chargement des données', error);
					setError(true);
				}
			}
			fetchDrupal()
		}
	}, [nid, data])
	
	// Disable loading state
	useEffect( () => {
		if ( data && isLoading) {
			setIsLoading(false);
		}
	},[data, isLoading])
	
	return { data, isLoading, error };
}


///// ---- DOCUMENTS -----/////
// DOCUMENTS : Charger la liste des path alias et nid des documents (pour la page d'un document unique, fetch le bon nid selon le path)
const useFetchDocumentsPaths = () => {
	const [paths, setPaths] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const pathsCacheValueKey = 'allDocuments'
	const pathsCacheTimeKey = 'paths2Timestamp'
	
	//// --  Functions declaration -- ////	
	// fetch all paths names and nid
	async function fetchDocumentsPaths() {
		try {	
			// fetch
			const response = await drupal.getResourceCollection("node--article", {
				params: {
					"filter[field_site_visible]": 1,
					"fields[node--film]": "path,drupal_internal__nid",
					"page[limit]": 200
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
			console.warn('useFetchDocumentsPaths : Erreur lors du chargement des données de chemins pour les Documents', error);
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
			console.log('[paths] Taking Documents data from cache')
			setPaths(cachedData)
		}
		
		// Fetch paths from drupal db and set paths
		if (!paths && cacheIsUsable === false && isLoading) {
			console.log('[paths] Fetching Documents data from DB')
			fetchDocumentsPaths()
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

// DOCUMENT : Fetch unique document node in Drupal DB from its unique identifier
export function useFetchUniqueDocument(initialData, path) {
	const { paths, isLoading: pathsIsLoading, error: pathsError } = useFetchDocumentsPaths()
	const [ressourceId, setRessourceId] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [ document, setDocument ] = useState(initialData)
	
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
				if (nodeArr.length) {
					const uniqueNodeRessourceId = nodeArr[0].id
					return uniqueNodeRessourceId
				} else {
					setDocument('not-found')
				}
			}
			const id = findRessourceId(paths.data, path)
			if (id) {
				setRessourceId(id)
			}
		}
	}, [paths, pathsIsLoading, path, ressourceId])
	
	// Fetch le node à partir de l'id de ressource unique
	useEffect(()=> {
		if (ressourceId && !document.id) {
			
			// obtenir le node complet avec le nid
			async function fetchDrupal(id) {
				console.log('[Document unique] Fetching data from DB')
				try {	
					// fetch
					const response = await drupal.getResource(
						"node--article",
						id,
						{
							params: {
								include: 'field_site_photogramme',
							}
						}
					);
					
					// set
					if (response.id) {
						setDocument(response);
					}
					
				} catch (error) {
					console.warn('useFetchUniqueDocument : Erreur lors du chargement des données', error);
					setError(true);
				}
			}
			fetchDrupal(ressourceId)
		}
	}, [ressourceId, document])
	
	// Disable loading state
	useEffect( () => {
		if ( (document.id || document === 'not-found') && isLoading) {
			setIsLoading(false);
		}
	},[document, isLoading])
	
	return { document, isLoading, error };
	
}
