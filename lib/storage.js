import localforage from 'localforage';

// Configuration de localForage
if (typeof window !== 'undefined') {
	localforage.config({
		driver: [
			localforage.INDEXEDDB,
			localforage.WEBSQL,
			localforage.LOCALSTORAGE // Fallback
		],
		name: 'cadavreexquis',
		version: 1.0,
		storeName: 'keyvaluepairs',
		description: 'Stockage local des données recueillies dans Drupal'
	});
}