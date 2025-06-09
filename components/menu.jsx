'use client'
import React, { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'

import pictoCollection from 'assets/picto-collection.svg'
import cadavIcone from 'assets/picto-remontage.svg'
import docIcone from 'assets/picto-document.svg'

const primaryNavItems = [
	{ 
		titre: 'Collection', 
		sousTitre: 'Ensemble des films de la collection', 
		icone: pictoCollection, 
		href: '/films/collection',
	}, 
	{ 
		titre: 'Cadavres exquis', 
		sousTitre: 'Films de remontage', 
		icone: cadavIcone, 
		href: '/films/cadavres-exquis'
	},
	{ 
		titre: 'Documentation', 
		sousTitre: 'Textes et dossier d’archives', 
		icone: pictoCollection, 
		href: '/films/documents'
	}
];

console.log('primaryNavItems', primaryNavItems)

const secondaryNavItems = [
	{ linkText: 'À propos', href: '/a-propos' },
	{ linkText: 'Code d’éthique du réemploi', href: '/code-ethique'},
	{ linkText: 'Événements', href: 'https://horschamp.qc.ca/calendrier'},
	{ linkText: 'Bibliographie et ressources documentaires', href: '/bibliographie'}
];

const Styled = styled.nav`
	width: 100%;
	display: grid;
	gap: calc(var(--spacing) * 8);
	
	.primary-nav {
		display: grid;
		gap: calc(var(--spacing) * 4) calc(var(--spacing) * 8);
		
		.lien {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 0.5rem;
			font-size: 1.25rem;
			line-height: 1.25;
			img {
				height: 2.25em;}
			&__titre {
				text-transform: uppercase;
			}
		}
		
		&--horizontal {
			display: flex;
			flex-wrap: wrap;}
	}
		
	.secondary-nav {}
`

export function Menu({horizontal, pictoCouleur}) {
	
	return (
		<Styled>
		
			<hr/>
			
			<div className='primary-nav'>
				<h3>Explorez</h3>
				<ul className={horizontal ? 'primary-nav primary-nav--horizontal' : 'primary-nav'}>
					{primaryNavItems.map((item, index) => (
						<li key={index}> 
							<Link href={item.href} className='lien'>
								<Image src={item.icone} alt={item.titre} />
								<div>
									<div className='lien__titre'>{item.titre}</div>
									{item.sousTitre}
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
			
			<hr/>
		
			<ul className="secondary-nav">
				{secondaryNavItems.map((item, index) => (
					<li key={index}> 
						<Link
							href={item.href}
						>
							{item.linkText}
						</Link>
					</li>
				))}
			</ul>
		</Styled>
	);
};