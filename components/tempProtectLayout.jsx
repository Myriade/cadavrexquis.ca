'use client'
import React, { useEffect, useState } from 'react';

export function TempProtectLayout({children}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Vérifier si l'utilisateur est déjà authentifié
		const isAuthenticated = localStorage.getItem('isAuthenticated');
		
		const corectPassword = 'Duvivier';
		
		if (isAuthenticated) {
			setIsAuthenticated(true);
		} else {
			const password = prompt('Veuillez entrer le mot de passe pour accéder au site :');
			if (password === corectPassword) {
				localStorage.setItem('isAuthenticated', 'true');
				setIsAuthenticated(true);
			} else {
				alert('Mot de passe incorrect');
			}
		}
	}, []);

	return isAuthenticated ? <>{children}</> : <div>Accès refusé</div>
};

export default TempProtectLayout;