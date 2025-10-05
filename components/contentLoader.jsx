'use client'
import React, { useState, useRef } from 'react'
import { useFetchAllFilms, useFetchAllDocuments } from '../lib/fecthDrupalData'
import { FilmsGrille } from '../components/filmsGrille';

const defautlContent = { 
  data: [{
    attributes: {
      drupal_internal__nid: 0,
      title: 'chargement from GRILLE',
      field_annees_de_sortie: '...',
      filmThematiques: {noms: '', ids: []},
      styles: {
        elemHeight: 'var(--ficheWidth)',
        couleur: '#eee',
      }
    },
    type: 'squeletton'
  }],
  included: []
}


export default function ContentLoader({isCollection, isRemontage, isDocuments}) {
  const { data, isLoading, error } = useFetchAllFilms()
  const { docData, docIsLoading, docError } = useFetchAllDocuments()
  const [content, setContent] = useState(null)
  
  if ( !content && data && docData && !isLoading && !error && !docIsLoading && !docError) {
    let result = null;
    if (isCollection) {
      const filteredData = data.data.filter( item => {
        return item.attributes.field_site_collection === 'collection'
      })
      result = {...data, data: filteredData}
      
    } 
    
    else if (isRemontage) {
      const filteredData = data.data.filter( item => {
        return item.attributes.field_site_collection === 'cadavre_exquis'
      })
      result = {...data, data: filteredData}
    } 
    
    else if (isDocuments) {
      result = docData
    } 
    
    else {
      // fill content variable with films
      result = data
      
      // then add documents to content variable
      docData.data.forEach( item => {
        result.data.push(item) 
      })
      
      docData.included.forEach( item => {
        if (item.type === 'file--file') {
          result.included.push(item)
        }
      })
    }
    
    setContent(result)
  }
  
  // Set page titles according to prop
  let title = null
  if (isCollection) {
    title = <h1>Les films de la Collection</h1>
  }
  
  if (isRemontage) {
    title = (<>
      <h1 className='mb-0'>Les cadavres exquis</h1>
      <p className='mb-4'>Films de remontage</p>
    </>)
  }
  
  if (isDocuments) {
    title = <h1>Documents</h1>
  }
  
  if (!content || isLoading || docIsLoading) { return (
    <main className='content-loader'>
      {title} TEST sans Content
      <FilmsGrille 
        allFilmsData={defautlContent}
        error={error} 
        docError={docError}
      >
      </FilmsGrille>
    </main>
  )}
  
  // Render a content grid
  if (content && !isLoading && !docIsLoading && !error && !docError) {
    console.log('contentLoader content state', content)
    return (
      <main className='content-loader'>
        {title} TEST avec Content
        <FilmsGrille 
          allFilmsData={content}
          error={error} 
          docError={docError}
          random 
          lazyload={10}
        >
        </FilmsGrille>
      </main>
    );
  }
}
