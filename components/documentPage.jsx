'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { notFound } from 'next/navigation'
import { useFetchUniqueDocument } from '../lib/fecthDrupalData'
import { modifyImageSources } from '../lib/utils'
import richTextCss from '../styles/richtext'

const Main = styled.main`
	${richTextCss()}
`

const defautlDocument = {
	"title": '\u00A0',
	"body": [{processed: '\u00A0'}],
}
	
export function DocumentPage( {path} ) {
	const { document, isLoading, error } = useFetchUniqueDocument(defautlDocument, path)
	let body = null
	
	//Process images : change relative src path to absolutes
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
			<h1>{document.title}</h1>
			<div dangerouslySetInnerHTML={{__html: 
				!isLoading && body ? body : '... chargement'
			}} />
		</Main>
	)
}