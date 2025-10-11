'use client'
import React, { useEffect, useState } from 'react';

/* // Note sur un bogue d'hydratation et le composant TempProtectLayout //
Le composant de protection temporaire par mot de passe est laissé volontairement même en prod
On y a retiré les fonctionnalités de prompt pour verification de mot de passe
Il inclue un useEffect qui prévient un bogue d'hydratation React.
Le bogue demanderait un refactor de tous les appels à localStorage, date(now) et typeof window !== 'undefined')
Semble-t-il que l'appel d'un premier useEffect avant tout rendu html, comme le fait TempProtectLayout dans sa plus simple expression, prévient le bogue d'hydratation React.
https://nextjs.org/docs/messages/react-hydration-error
*/

export function TempProtectLayout({children}) {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		// Vérifier si l'utilisateur est déjà authentifié
		let localyAuthenticated = true;
		
		// if (localStorage.getItem('isAuthenticated')) {
		// 	localyAuthenticated = localStorage.getItem('isAuthenticated');
		// }
		// 
		// const answer = process.env.NEXT_PUBLIC_TEMP_DEV_PROTECTION;
		
		if (localyAuthenticated) {
			setIsAuthenticated(true);
		} 
		
		// else {
		// 	const verif = prompt('Authentification requise :');
		// 	if (verif === answer) {
		// 		localStorage.setItem('isAuthenticated', 'true');
		// 		setIsAuthenticated(true);
		// 	} else {
		// 		setIsAuthenticated(false);
		// 	}
		// }
	}, []);
	
	// if (isAuthenticated === null) {
	// 	return ''
	// } 
	
	if (isAuthenticated) {
		return <>{children}</>
	} 
	
	// if (isAuthenticated === false) {
	// 	return <p>Authentification requise. Recharger la page.</p>
	// }
};

export default TempProtectLayout;