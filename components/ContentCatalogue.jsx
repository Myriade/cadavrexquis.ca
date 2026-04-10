'use client'
import React, { useState, useRef } from 'react'
import { useCardsData } from '../lib/CardsDataProvider'
import { ContentGrid } from '../components/contentGrid';

const defautlContent = { 
  data: [{
    attributes: {
      drupal_internal__nid: 0,
      title: 'chargement...',
      field_annees_de_sortie: '...',
      filmThematiques: {noms: '', ids: []},
      styles: {
        elemHeight: 'var(--cardWidth)',
        couleur: '#ddd',
      }
    },
    type: 'skeleton'
  },{
    attributes: {
      drupal_internal__nid: 999,
      title: '...',
      field_annees_de_sortie: '...',
      filmThematiques: {noms: '', ids: []},
      styles: {
        elemHeight: 'calc( var(--cardWidth) * 0.8)',
        couleur: '#f1f1f1',
      }
    },
    type: 'skeleton'
  }]
}


export default function ContentCatalogue({isCollection, isRemontage, isDocuments}) {
  const { data, isLoading, error } = useCardsData()
  const [content, setContent] = useState(null)
  
  if ( !content && data && !isLoading && !error) {
    let result = null;
    if (isCollection) {
      const filteredData = data.data.filter( item => {
        if (Object.hasOwn(item.attributes, "field_site_collection")) {
          return item.attributes.field_site_collection === 'collection'
        }
      })
      result = {...data, data: filteredData}
    } 
    
    else if (isRemontage) {
      const filteredData = data.data.filter( item => {
        if (Object.hasOwn(item.attributes, "field_site_collection")) {
          return item.attributes.field_site_collection === 'cadavre_exquis'
        }
      })
      result = {...data, data: filteredData}
    } 
    
    else if (isDocuments) {
      const filteredData = data.data.filter( item => {
        return item.type === 'node--article'
      })
      result = {...data, data: filteredData}
    } 
    
    else {
      result = data
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
  
  // render a temp skeloton
  if (!content || isLoading) { return (
    <main id='content-catalogue'>
      {title}
      <ContentGrid 
        contentData={defautlContent} 
        hideItemCount
      />
    </main>
  )}
  
  // Render a content grid
  if (content && !isLoading && !error) {
    return (
      <main id='content-catalogue'>
        {title}
        <ContentGrid 
          contentData={content}
          error={error}
          random 
          lazyload={10}
          showFilter={!isDocuments}
          showTotalCount
        />
      </main>
    );
  }
}
