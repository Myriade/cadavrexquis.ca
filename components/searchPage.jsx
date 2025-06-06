'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useFetchAllFilms } from '../lib/fecthDrupalData'
import { uriToString, findTermName } from '../lib/utils.ts';
import { FilmsGrille } from '../components/filmsGrille';

export function SearchPage({searchSlug}) {
  const [isLoading, setIsloading] = useState()
  const [searchTerms, setSearchTerms] = useState()
  const [filteredData, setFilteredData] = useState(null)
  const [hasNoResult, setHasNoResult] = useState(null)
  const [vocabs, setVocabs] = useState(null)
  const { data, isloading, error } = useFetchAllFilms(true)
  
  useEffect(()=>{
    if (!searchTerms) {
      // Convert uri back to readable string
      const readableSearchTerms = uriToString(searchSlug);
      setSearchTerms(readableSearchTerms)
    }
  },[searchTerms])
  
  // Set vocab references obj
  useEffect( () => {
    if (!vocabs && data) {
      const result = {}
      
      // Vedette matiere
      const vedettematieres = data.included.filter( item => {
        return item.type === "taxonomy_term--vedette_matiere"
      });
      result.vedettematieres = vedettematieres
      
      // realisation
      const realisations = data.included.filter( item => {
        return item.type === "taxonomy_term--realisation"
      });
      result.realisations = realisations
      
      // thematiques
      const thematiques = data.included.filter( item => {
        return item.type === "taxonomy_term--site_categorie"
      });
      result.thematiques = thematiques
      
      setVocabs(result)
    }
    
  },[vocabs, data])
  
  useEffect(()=>{
    if (searchTerms && vocabs && !filteredData && !isLoading && hasNoResult === null) {
      
      const allMatch = []
      
      // Loop through Titles
      const matchTitles = data.data.filter(
        item => item.attributes.title.toLowerCase().includes(searchTerms.toLowerCase())
      );
      matchTitles.forEach( item => { allMatch.push(item) })
      
      // Loop through Description
      const matchDescr = data.data.filter(
        item => item.attributes.field_descriptions_cadavrexquis[0].value.toLowerCase().includes(searchTerms.toLowerCase())
      );
      matchDescr.forEach( item => { allMatch.push(item) }) 
      
      // Loop through vedettes-matières
      const matchVedettes = data.data.filter( item => {
        const termNames = findTermName( item.relationships.field_vedettes_matiere.data, vocabs.vedettematieres);
        return termNames.toLowerCase().includes(searchTerms.toLowerCase())
      })
      matchVedettes.forEach( item => { allMatch.push(item) })
      
      // Loop through realisations
      const matchReal = data.data.filter( item => {
        const termNames = findTermName( item.relationships.field_realisation.data, vocabs.realisations);
        return termNames.toLowerCase().includes(searchTerms.toLowerCase())
      })
      matchReal.forEach( item => { allMatch.push(item) })
      
      // Loop through thematiques
      const matchThematiques = data.data.filter( item => {
        const termNames = findTermName( item.relationships.field_site_thematique.data, vocabs.thematiques);
        return termNames.toLowerCase().includes(searchTerms.toLowerCase())
      })
      matchThematiques.forEach( item => { allMatch.push(item) })
      
      // Remove duplicates
      let set = new Set(allMatch);
      const matchFilms = [...set]
      
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
  },[searchTerms, vocabs, filteredData, isLoading, hasNoResult])
  
  useEffect(()=>{
    if ( (filteredData || hasNoResult) && !isLoading) {
      setIsloading(false)
    }
  },[filteredData, hasNoResult, isLoading])
  
  if (hasNoResult && !isLoading) {
    return (
      <div>
        <p className='mb-6 text-3xl md:text-4xl'>Aucun résultat pour « {searchTerms} »</p>
        <p>La recherche est effectuée dans les champs titre, description, réalisation, thématique et vedette-matière.</p>
      </div>
    )
  }
  
  return (
    <>
      <h1>Recherche pour « {searchTerms} »</h1>
      {filteredData ? (<p>Résultat : {filteredData.data.length} films sur {data.data.length}</p>) : ''}
      <FilmsGrille
        allFilmsData={filteredData} 
        isLoading={isLoading} 
        error={error} 
        isSearch
      ></FilmsGrille>
      <p>La recherche est effectuée dans les champs titre, description, réalisation, thématique et vedette-matière.</p>
    </>
  )
}
