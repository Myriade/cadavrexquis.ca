'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useFetchAllFilms } from '../lib/fecthDrupalData'
import { unslugify } from '../lib/utils.ts';
import { FilmsGrille } from '../components/filmsGrille';

const defautlFilm = {
  attributes: {
    drupal_internal__nid: 0,
    title: 'chargement',
    field_annees_de_sortie: '...',
    filmThematiques: {noms: '', ids: []},
    styles: {
      elemHeight: 'var(--ficheWidth)',
      couleur: '#eee',
    }
  }
}

export function SearchPage({searchSlug}) {
  const [isLoading, setIsloading] = useState()
  const [searchTerms, setSearchTerms] = useState()
  const [filteredData, setFilteredData] = useState(null)
  const [hasNoResult, setHasNoResult] = useState(null)
  const { data, error } = useFetchAllFilms(defautlFilm, true)
  
  useEffect(()=>{
    if (!searchTerms) {
      // Convert slug back to readable string
      const readableSearchTerms = unslugify(searchSlug);
      setSearchTerms(readableSearchTerms)
    }
  },[searchTerms])
  
  useEffect(()=>{
    if (searchTerms && data && !filteredData && !isLoading && hasNoResult === null) {
      
      // Loop through Titles
      const matchFilms = data.data.filter(
        item => item.attributes.title.toLowerCase().includes(searchTerms.toLowerCase())
      );
      //console.log('matchFilms', match Films)
      
      // Set Filtered Data 
      if (!matchFilms.length) {
        setHasNoResult(true)
      } else {
        // Reconstruct data array with included relationships (taxonomy_term--site_categorie and file--file)
        const dataObj = {data: matchFilms}
        const relationshipsArray = data.included.filter( item => {
          return item.type === 'taxonomy_term--site_categorie' || item.type === 'file--file'
        });
        dataObj.included = relationshipsArray
        setFilteredData(dataObj)
      }
    }
  },[searchTerms, data, filteredData, isLoading, hasNoResult])
  
  useEffect(()=>{
    if ( (filteredData || hasNoResult) && !isLoading) {
      setIsloading(false)
    }
  },[filteredData, hasNoResult, isLoading])
  
  if (hasNoResult && !isLoading) {
    return (
      <p className='mb-6 text-3xl md:text-4xl'>Aucun résultat pour {searchTerms}</p>
    )
  }
  
  if (filteredData && !isLoading) {
    return (
      <>
        <h1>Résultats pour « {searchTerms} »</h1>
        <FilmsGrille
          allFilmsData={filteredData} 
          isLoading={isLoading} 
          error={error} 
          isSearch
        ></FilmsGrille>
      </>
    )
  }
}
