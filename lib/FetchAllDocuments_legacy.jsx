///// ---- DOCUMENTS -----/////
// Charger tous les documents pour la grille. 
export const useFetchAllDocuments = (isSearch) => {
	const [docData, setDocData] = useState(null)
	const [docIsLoading, setDocIsLoading] = useState(true)
	const [docError, setDocError] = useState(null)
	const [cacheIsUsable, setCacheIsUsable] = useState(null)
		
	const basicCacheValue = 'allDocsBasic'
	const basicCacheTime = 'allDocsTimestampBasic'
	const searchCacheValue = 'searchableDocs'
	const cacheValueKey = isSearch ? searchCacheValue : basicCacheValue
	const cacheTimeKey = isSearch ? 'searchTimestamp' : basicCacheTime
	
	const docBasicQueryParams = {
		fields: {
			"node--article": 'path,drupal_internal__nid,title,field_site_thematique,field_site_photogramme,field_annees_de_sortie'
		},
		"filter[status]": 1,
		"include": 'field_site_thematique,field_site_photogramme',
		"page[limit]": 200
	}
	
	const docSearchQueryParams = {
		fields: {
			"node--article": 'path,drupal_internal__nid,title,body,field_site_thematique,field_site_photogramme,field_annees_de_sortie'
		},
		"filter[status]": 1,
		"include": 'field_site_thematique,field_site_photogramme',
		"page[limit]": 200
	}
	
	const docsQueryParams = isSearch ? docSearchQueryParams : docBasicQueryParams
	
	//// -- Async functions calls -- ////
	// cache check
	useEffect(() => {
		if (typeof window !== 'undefined' && docIsLoading && !docData && cacheIsUsable === null) {
			const resultBool = cacheCheck(cacheValueKey, cacheTimeKey)
			setCacheIsUsable(resultBool)
		}
	}, [docIsLoading, docData, cacheIsUsable, cacheTimeKey, cacheValueKey])
	
	// set or fetch and set data
	useEffect( () => {
		// set data with usable cached data
		if (!docData && cacheIsUsable === true && docIsLoading) {
			const cachedData = JSON.parse(localStorage.getItem(cacheValueKey))
			console.log('[documents] Taking data from cache')
			setDocData(cachedData)
		}
		
		// Fetch data from drupal db and set data
		if (!docData && cacheIsUsable === false && docIsLoading) {
			async function fetchDrupalDocuments() {
				console.log('[documents] Fetching data from DB')
				try {	
					// fetch
					const response = await drupal.getResourceCollection("node--article", {
						deserialize: false,
						params: queryParams
					});
					
					// set
					setDocData(response);
					
					// store
					const jsonData = JSON.stringify(response)
					localStorage.setItem(cacheValueKey, jsonData);
					localStorage.setItem('searchTimestamp', Date.now())
					
				} catch (docError) {
					console.warn('useFetchAllDocuments : Erreur lors du chargement des données de documents', docError);
					setDocError(true);
				}
			}
			fetchDrupalDocuments()
		}
		
	}, [docData, cacheIsUsable, docIsLoading, queryParams, cacheTimeKey, cacheValueKey])
	
	// Disable loading state
	useEffect( () => {
		if (docData && docIsLoading) {
			setDocIsLoading(false);
		}
	},[docData, docIsLoading])
	
	return { docData, docIsLoading, docError };
	
}