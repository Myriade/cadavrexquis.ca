'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { useFetchPageNode } from '../lib/fecthDrupalData'
import { modifyImageSources } from '../lib/utils'
import richTextCss from '../styles/richtext'

const Styled = styled.section`
  ${richTextCss()}
    
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
