'use client'
import React, { useState, useRef } from 'react'
import { useFetchAllFilms, useFetchAllDocuments } from '../lib/fecthDrupalData'
import { FilmsGrille } from '../components/filmsGrille';

export default function ContentLoader({isCollection, isRemontage, isDocuments}) {
  const { data, isLoading, error } = useFetchAllFilms()
  const { docData, docIsLoading, docError } = useFetchAllDocuments()
  
  let content = null;
  
  if ( data && docData && !isLoading && !error && !docIsLoading && !docError) {
    if (isCollection) {
      const filteredData = data.data.filter( item => {
        return item.attributes.field_site_collection === 'collection'
      })
      content = {...data, data: filteredData}
    } else if (isRemontage) {
      const filteredData = data.data.filter( item => {
        return item.attributes.field_site_collection === 'cadavre_exquis'
      })
      content = {...data, data: filteredData}
    } else if (isDocuments) {
      console.log('intend to be a documents collection grid')
      console.log(docData)
      content = docData
    } else {
      content = data
    }
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
