'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { useFetchPageNode } from '../lib/fecthDrupalData'

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
  
    
  @container (min-width: 250px) { }
    
  @container (min-width: 500px) { }
  
  @container (min-width: 750px) { }
  
  @container (min-width: 1000px) { }
  
`;

export function DrupalPage( {nid} ) {
  const { data, isLoading, error } = useFetchPageNode(nid)
  
  // if (data && !isLoading) {
  //   console.log('data', data)
  // }
  
  if (error) {
    return (
      <main className='grid content-center text-center'>
        <p className='error'>Une erreur de chargement sest produite. Vérifiez votre connexion internet, ou avisez-nous si le problème persite.</p>
      </main>
    )
  }
  
  return (
    <>
      <Styled dangerouslySetInnerHTML={{__html: 
        !isLoading ? data.attributes.body.processed : '... chargement'
      }}></Styled>
    </>
  );
};
