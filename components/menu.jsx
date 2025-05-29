'use client'
import React, { useState } from 'react';
import Link from 'next/link'
import styled from 'styled-components'

const HamburgerIcon = () => {
	return (
		<svg
			width="30"
			height="17"
			viewBox="0 0 29.95 16.91"
			aria-hidden="true"
		>
			<line className="hamburger-line" y1=".5" x2="29.95" y2=".5"/>
			<line className="hamburger-line" y1="8.45" x2="29.95" y2="8.45"/>
			<line className="hamburger-line" y1="16.41" x2="29.95" y2="16.41"/>
		</svg>
	);
};

const CloseIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
			<line className="close-line" x1="15" y1="0" x2="0" y2="15"/>
			<line className="close-line" x1="0" y1="0" x2="15" y2="15"/>
		</svg>
	)
};

const navItems = [
	{ linkText: 'À propos', href: '/a-propos' },
	{ linkText: 'Code d’éthique du réemploi', href: 'code-ethique'},
	{ linkText: 'Bibliographie et ressources documentaires', href: ''}
];

const Styled = styled.div`
	button:hover {
		cursor: pointer;}
	
	button.hamburger:hover {
		background: #eee;
		outline: #eee solid 5px;}
		
	.hamburger-line {
		fill: none;
		stroke: #000;
		stroke-miterlimit: 10;}
		
	button.close {
		width: 15px;
		height: 15px;}
		
	.close-line {
		fill: none;
		stroke: #fff;
		stroke-miterlimit: 10;}
		
	button.close:hover line {
		stroke: #000;}
		
	.menu__banniere {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: var(--color-rouge);
		color: #fff;}
		
		.menu__container {
			display: grid;
			gap: 2rem;
			justify-items: left;}
		
		hr {
			width: 100%;}
		
		.primary-nav {}
		
		.secondary-nav {}
	}
`

export function Menu() {
	// State to track if the banner is open or closed
	const [isOpen, setIsOpen] = useState(false);
	
	// Toggle function for opening/closing the banner
	const toggleBanner = () => {
		setIsOpen(!isOpen);
	};
	
	// Function to close the banner
	const closeBanner = () => {
		setIsOpen(false);
	};
	
	return (
		<Styled>
			<button 
				aria-expanded={isOpen} 
				onClick={toggleBanner}
				className='hamburger'
			>
				<HamburgerIcon />
			</button>
			
			<div className={`menu__banniere ${isOpen ? '' : 'hidden'}`}>
				<div className='menu__container max-w-7xl mx-auto py-12 grow'>
				
					<button className="close" onClick={closeBanner}>
					<CloseIcon />
					</button>
					
					<hr />
					
					<div className='primary-nav'>
						<p>[Navigation principale]</p>
					</div>
					
					<hr />
					
					<ul className="secondary-nav">
						{navItems.map((item, index) => (
							<li key={index}> 
								<Link
									href={item.href}
								>
									{item.linkText}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</Styled>
	);
};