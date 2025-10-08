'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styled from 'styled-components';
import { notFound } from 'next/navigation'
import { useFetchUniqueDocument } from '../lib/fecthDrupalData'
import { modifyImageSources } from '../lib/utils'
import richTextCss from '../styles/richtext'

const Main = styled.main`
	${richTextCss()}
	.image-wrapper {
		position: relative;
		height: 50vh;
		&--skeleton {
			background: var(--color-grispale);}}
			
	.body-skeleton {
		text-transform: uppercase;
		color: var(--color-rouge);
	}
`

const defautlDocument = {
	"title": '\u00A0',
	"body": [{processed: '\u00A0'}],
}
	
export function DocumentPage( {path} ) {
	const { document, isLoading, error } = useFetchUniqueDocument(defautlDocument, path)
	
	// Process images in body : change relative src path to absolutes
	let body = null
	if ( !isLoading && document ) {
		console.log('document', document)
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
			<h1 className='mt-10'>{document.title}</h1>
			<div className='min-h-[25vh]' dangerouslySetInnerHTML={{__html: 
				!isLoading && body ? body : `<span class='body-skeleton text-xl'>Chargement...</span>`
			}} />
		</Main>
	)
}