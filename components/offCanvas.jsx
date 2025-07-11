'use client'
import React, { useState, useRef } from 'react';
import Link from 'next/link'
import { Menu } from '../components/menu'
import Icone from '../components/icone'
import styled from 'styled-components'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from 'assets/cadavre-exquis-logo.svg'

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

const Styled = styled.div`
	z-index: 50;
	
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
		
	.off-canvas {
		position: absolute;
		top: -2vh;
		left: 50%;
		transform: translateX(-51%);
		width: 101vw;
		
		&__wrapper {			
			padding-inline: 5vw;
			background: var(--color-rouge);}
		
		&__container {
			display: grid;
			gap: 2rem;
			justify-items: left;}
			
		&__header {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			a {
				margin-inline: auto;
				width: clamp(80px ,7vw, 250px)}
		}
		
		&__content {
			width: 100%;
			color: #fff;}
	}
	
	hr {
		width: 100%;}
		
	.lien svg path {
		fill: white;}
`

export function OffCanvas() {
	const [isOpen, setIsOpen] = useState(null);
	const gsapContainer = useRef()
	const elemRef = useRef();
	gsap.registerPlugin(useGSAP);
	
	// Toggle function for opening/closing the banner
	const toggleBanner = () => {
		setIsOpen(!isOpen);
	};
	
	// Function to close the banner
	const closeBanner = () => {
		setIsOpen(false);
	};
	
	// GSAP : slide top open
	const gsapCardInstance = useGSAP(() => {
		const elem = elemRef.current
		
		const duree = 0.4
		
		// Setting at laod, avoid glitch
		if (isOpen === null) {
			gsap.set(elem, {
				yPercent: -100,
			})
			
			gsap.set('.off-canvas__content a', {
				opacity: 0,
			});
		}
		
		// Opening
		if (isOpen) {
			gsap.to(elem, {
				yPercent: 0, 
				duration: duree * 1.25,
				ease: 'none',	
				height: '100vh'
			});
			
			gsap.to('.off-canvas__content a', {
				opacity: 1,
				duration: duree * 2.5,
			});
		}
		
		// Closing
		if (isOpen === false) {
			gsap.to(elem, {
				yPercent: -100, 
				color: 'var(--color-rouge)',
				duration: duree,
				ease: 'none',
			});
			
			gsap.to('.off-canvas__content a', {
				opacity: 0,
				duration: duree,
			});
		}
		
	}, { dependencies: [elemRef, isOpen], scope: gsapContainer })
	
	return (
		<Styled ref={gsapContainer}>
			<button 
				aria-expanded={isOpen} 
				onClick={toggleBanner}
				className='hamburger'
				title='Ouvrir le menu'
			>
				<HamburgerIcon />
			</button>
			
			<div 
				className='off-canvas'
				ref={elemRef}
				onClick={closeBanner}
			>
				<div className='off-canvas__wrapper'>
					<div className='off-canvas__container max-w-7xl mx-auto py-12 grow'>
						<div className='off-canvas__header'>
							<button className="close">
								<CloseIcon />
							</button>
							
							<Link href="/">
								<Icone nom='logo' titre="Cadavre exquis" couleur='white' />
							</Link>
						</div>
						
						<div className='off-canvas__content'>
							<Menu horizontal pictoCouleur='white' />
						</div>
					</div>
				</div>
			</div>
		</Styled>
	);
};