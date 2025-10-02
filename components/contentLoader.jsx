'use client'
import React, { useState, useRef } from 'react'
import { useFetchAllFilms, useFetchAllDocuments } from '../lib/fecthDrupalData'
import { FilmsGrille } from '../components/filmsGrille';

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
  
  console.log('content', content)
  
  if (content) {
    return (
      <main className='content-loader'>
        {title}
        <FilmsGrille 
          allFilmsData={content} 
          isLoading={isLoading} 
          error={error} 
          random 
          lazyload={10}
        >
        </FilmsGrille>
      </main>
    );
  }
}
