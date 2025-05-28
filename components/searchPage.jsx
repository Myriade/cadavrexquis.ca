'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useFetchAllFilms } from '../lib/fecthDrupalData'
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
  const [filteredData, setFilteredData] = useState(null)
  const [hasNoResult, setHasNoResult] = useState(null)
  const { data, error } = useFetchAllFilms(defautlFilm, true)
  
  useEffect(()=>{
    if (data && !filteredData && !isLoading && hasNoResult === null) {
      
      // Loop through Titles
      const matchFilms = data.data.filter( item => {
        const match = item.attributes.title.includes(searchSlug)
        //console.log('match', match)
        return match
      });
      
      //console.log('matchFilms', matchFilms)
      
      // Set Filtered Data 
      if (!matchFilms.length) {
        setHasNoResult(true)
      } else {
        // Reconstruct data array with included relationships (taxonomy_term--site_categorie and file--file)
        const dataObj = {data: matchFilms}
        
        const relationshipsArray = data.included.filter( item => {
          const isTaxoOrImage = item.type === 'taxonomy_term--site_categorie' || item.type === 'file--file'
          console.log('isTaxoOrImage', isTaxoOrImage)
          return isTaxoOrImage
        });
        
        //console.log('relationshipsArray', relationshipsArray)
        dataObj.included = relationshipsArray
        
        setFilteredData(dataObj)
      }
    }
  },[filteredData, data, isLoading])
  
  useEffect(()=>{
    if ( (filteredData || hasNoResult) && !isLoading) {
      setIsloading(false)
    }
  },[filteredData, hasNoResult, isLoading])
  
  if (hasNoResult && !isLoading) {
    return (
      <p>Aucun résultat pour {searchSlug}</p>
    )
  }
  
  if (filteredData && !isLoading) {
    return (
      <>
        <h1>Résultats pour « {searchSlug} »</h1>
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
