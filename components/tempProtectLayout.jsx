'use client'
import React, { useEffect, useState } from 'react';

export function TempProtectLayout({children}) {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		// Vérifier si l'utilisateur est déjà authentifié
		let localyAuthenticated = null;
		
		if (localStorage.getItem('isAuthenticated')) {
			localyAuthenticated = localStorage.getItem('isAuthenticated');
		}
		
		// ----
		const answer = process.env.NEXT_PUBLIC_TEMP_DEV_PROTECTION;
		
		if (localyAuthenticated) {
			setIsAuthenticated(true);
		} else {
			const verif = prompt('Authentification requise :');
			if (verif === answer) {
				localStorage.setItem('isAuthenticated', 'true');
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		}
	}, []);
	
	if (isAuthenticated === null) {
		return ''
	} else if (isAuthenticated) {
		return <>{children}</>
	} else if (isAuthenticated === false) {
		return <p>Authentification requise. Recharger la page.</p>
	}
};

export default TempProtectLayout;