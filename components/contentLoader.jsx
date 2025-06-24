'use client'
import React, { useState, useRef } from 'react'
import { useFetchAllFilms } from '../lib/fecthDrupalData'
import { FilmsGrille } from '../components/filmsGrille';

export default function ContentLoader({isCollection, isRemontage, isDocments}) {
  const { data, isLoading, error } = useFetchAllFilms()
  let content = null;
  
  if ( data && !isLoading && !error) {
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
    } else if (isDocments) {
      
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
      <h1>Les cadavres exquis</h1>
      <p>Films de remontage</p>
    </>)
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
