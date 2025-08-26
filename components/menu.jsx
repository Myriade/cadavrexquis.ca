'use client'
import React, { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import Icone from '../components/icone'

const primaryNavItems = [
	{ 
		titre: 'Collection', 
		sousTitre: 'Ensemble des films de la collection', 
		icone: 'collection', 
		href: '/collection',
	}, 
	{ 
		titre: 'Cadavres exquis', 
		sousTitre: 'Films de remontage', 
		icone: 'remontage', 
		href: '/remontage'
	},
	{ 
		titre: 'Documents', 
		sousTitre: 'Textes et dossier d’archives', 
		icone: 'document', 
		href: '/documents'
	}
];

const secondaryNavItems = [
	{ linkText: 'À propos', href: '/a-propos' },
	{ linkText: 'Code d’éthique du réemploi', href: '/code-ethique'},
	{ linkText: 'Événements', href: 'https://horschamp.qc.ca/programmation/cadavre-exquis'},
	{ linkText: 'Bibliographie et ressources documentaires', href: '/bibliographie'}
];

const Styled = styled.nav`
	width: 100%;
	display: grid;
	gap: calc(var(--spacing) * 8);
	
	.primary-nav {
		
		h3 {
			font-weight: bold;}
		
		display: grid;
		gap: calc(var(--spacing) * 4) calc(var(--spacing) * 8);
		
		.lien {
			display: grid;
			grid-template-columns: auto 1fr;
			align-items: top;
			gap: 1rem;
			font-size: 1rem;
			line-height: 1.3;
			text-decoration-line: none;
			
			svg {
				height: 2rem;
				width: auto;
				margin-top: 0.25em;}
				
			&__titre {
				text-transform: uppercase;}
				
			&:hover .lien__titre {
				text-decoration: underline;
			}
		}	
		
		&--horizontal {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;}
	}
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
								<Icone nom={item.icone} couleur={pictoCouleur} />
								<div>
									<div className='lien__titre'>{item.titre}</div>
									<div className='lien__sous-titre'>{item.sousTitre}</div>
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