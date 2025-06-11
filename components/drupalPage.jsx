'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { useFetchPageNode } from '../lib/fecthDrupalData'
import { modifyImageSources } from '../lib/utils'

const Styled = styled.section`

  p, ul, ol {
    margin-bottom: 1em;}
    
  h2, h3 {
    margin-block: 1.5em 0.25em}

  ul {
    margin-left: 1em;
    list-style-type: circle;}
    
  ol {
    margin-left: 2em;
    list-style-type: number;}
    
  a {
    text-decoration: underline;
    &:hover {
      background-color: var(--color-grispale);}}
      
  blockquote {
    border-left: 4px solid var(--color-grispale);
    padding-left: 1em;}
    
  figure.caption-img {
    display: table;
    width: max-content;}
  
  figure.caption-img img {
    display: block;}
  
  figure.caption-img figcaption {
    display: table-caption;
    caption-side: bottom;
    padding: 0.5em 0;
    font-size: 0.9em;}
    
  figure.align-left {
    float: left;
    margin-right: 1.5em;}
  
  figure.align-right {
    float: right;
    margin-left: 1.5em;}
    
  @container (min-width: 250px) { }
    
  @container (min-width: 500px) { }
  
  @container (min-width: 750px) { }
  
  @container (min-width: 1000px) { }
  
`;

export function DrupalPage( {nid} ) {
  const { data, isLoading, error } = useFetchPageNode(nid)
  let body = null
  
  if (error) {
    return (
      <main className='grid content-center text-center'>
        <p className='error'>Une erreur de chargement sest produite. Vérifiez votre connexion internet, ou avisez-nous si le problème persite.</p>
      </main>
    )
  }
  
  // Process images : change relative src path to absolutes
  if ( !isLoading && data ) {
    const rawBody = data.attributes.body.processed
    if (rawBody.includes('<img ') ) {
      body = modifyImageSources(rawBody)
    } else {
      body = rawBody
    }
  }
  
  return (
    <>
      <Styled dangerouslySetInnerHTML={{__html: 
        !isLoading && body ? body : '... chargement'
      }}></Styled>
    </>
  );
};
