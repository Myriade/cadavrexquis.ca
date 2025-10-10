'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styled from 'styled-components';
import { useHeadTitle } from "../components/head-title/provider";
import { notFound } from 'next/navigation'
import { useFetchUniqueDocument } from '../lib/fecthDrupalData'
import { modifyImageSources } from '../lib/utils'
import richTextCss from '../styles/richtext'

import Icone from '../components/icone'

const Main = styled.main`
	${richTextCss()}
	.image-wrapper {
		position: relative;
		height: 50vh;
		&--skeleton {
			background: var(--color-grispale);}}
			
	.body-skeleton {
		text-transform: uppercase;
		color: var(--color-rouge);}
		
	.surtitre, .infos {
		color: var(--color-rouge);}
		
	i {
		width: 1.35em;
		padding-bottom: 0.35em;}
		
	.surtitre {
		text-decoration: none;
		text-transform: uppercase;
		margin-bottom: 0.7em;
		display: inline-flex;
		gap: 0.5em;
		align-items: end;
		&:hover {
			background: none;
			text-decoration: underline;
		}}
`

const defautlDocument = {
	"title": '\u00A0',
	"body": [{processed: '\u00A0'}],
}
	
export function DocumentPage( {path} ) {
	const { document, isLoading, error } = useFetchUniqueDocument(defautlDocument, path)
	const { setTitle } = useHeadTitle()
	
	// Titre meta pour la page
	useEffect(() => {
		if (document?.title) {
			setTitle(`${document.title} - Cadavre exquis`);
		}
		
		// Cleanup: reset title when component unmounts
		return () => setTitle("");
	}, [document?.title, setTitle]);
	
	// Process images in body : change relative src path to absolutes
	let body = null
	if ( !isLoading && document ) {
		const rawBody = document.body.processed
		if (rawBody.includes('<img ') ) {
			body = modifyImageSources(rawBody)
		} else {
			body = rawBody
		}
	}
	
	if (document === 'not-found') {
		return notFound()
	}
	
	if (error) {
		return (
			<main className='grid content-center text-center'>
				<p className='error'>Une erreur de chargement s&apos;est produite. Vérifiez votre connexion internet, ou avisez-nous si le problème persite.</p>
			</main>
		)
	}
	
	return (
		<Main>
			{ !isLoading && document.field_site_photogramme && document.field_site_photogramme.uri ? (
				<div className='image-wrapper'>
					<Image 
						src={`https://database.cadavrexquis.ca${document.field_site_photogramme.uri.url}`}
						alt=""
						fill={true}
						style={{objectFit: "cover"}}
					/>
				</div>
			) : (
				<div className='image-wrapper image-wrapper--skeleton p-4'>
					<p className='text-xl'>...</p>
				</div>
			)}
			
			<p className='mt-10 mb-6'>
				<a href='/documents' className='surtitre text-xl'>
					<Icone nom='document' couleur='var(--color-rouge)' />
					<span className='info'>{isLoading ? 'Chargement ...' : 'Document'}</span>
				</a>
			</p>
			
			<h1 className='mb-8'>{document.title}</h1>
			
			<p className='infos text-xl font-sans mb-4'>
				{document.field_auteurs ? document.field_auteurs : '' }
				{document.field_annees_de_sortie ? <span> 
					{document.field_auteurs && ' / '} 
					{document.field_annees_de_sortie}
				</span> : ''}
			</p>
			
			<div className='min-h-[25vh] mb-10' dangerouslySetInnerHTML={{__html: 
				!isLoading && body ? body : `<span class='body-skeleton text-xl'>...</span>`
			}} />
		</Main>
	)
}