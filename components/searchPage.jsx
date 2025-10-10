'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useFetchFilmsAndDocuments } from '../lib/fecthDrupalData'
import { uriToString, findTermName } from '../lib/utils.ts';
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
      field_annees_de_sortie: 'la première recherche est plus longue, merci de patienter',
      filmThematiques: {noms: '', ids: []},
      styles: {
        elemHeight: 'calc( var(--cardWidth) * 0.8)',
        couleur: '#f1f1f1',
      }
    },
    type: 'skeleton'
  }]
}

export function SearchPage({searchSlug}) {
  const [isLoading, setIsloading] = useState()
  const [searchTerms, setSearchTerms] = useState()
  const [filteredData, setFilteredData] = useState(null)
  const [hasNoResult, setHasNoResult] = useState(null)
  const [vocabs, setVocabs] = useState(null)
  const { data, isloading, error } = useFetchFilmsAndDocuments(true)
  
  // Taxonomy Search fields
  const taxoFields = [{ 
    fieldName: 'field_site_thematique', vocabName: 'site_categorie' },{
    fieldName: 'field_realisation', vocabName: 'realisation' },{
    fieldName: 'field_vedettes_matiere', vocabName: 'vedette_matiere' },{
    fieldName: 'field_langue', vocabName: 'langue' },{
    fieldName: 'field_production', vocabName: 'production' },{
    fieldName: 'field_consultants', vocabName: 'consultant' },{
    fieldName: 'field_pays_origine', vocabName: 'pays' },{
    fieldName: 'field_format', vocabName: 'format' },{
    fieldName: 'field_son', vocabName: 'son' },{
    fieldName: 'field_langues', vocabName : 'langue' },{
    fieldName: 'field_fabricant', vocabName: 'fabricant' },{
    fieldName: 'field_emulsion', vocabName : 'emulsion' }, {
    fieldName: 'field_ratio', vocabName : 'ratio' }, {
    fieldName: 'field_institution_detentrice', vocabName : 'institution' }, {
    fieldName: 'field_commanditaires', vocabName: 'commanditaire' },{
    fieldName: 'field_distribution', vocabName: 'distribution' },{
    fieldName: 'field_scenario', vocabName: 'scenario' },{
    fieldName: 'field_narration', vocabName: 'narration' },{
    fieldName: 'field_direction_de_la_photograph', vocabName: 'direction_de_la_photographie' },{
    fieldName: 'field_son_sound', vocabName: 'son_sound' },{
    fieldName: 'field_musique', vocabName: 'musique' },{
    fieldName: 'field_montage', vocabName: 'montage' },{
    fieldName: 'field_effets_speciaux_et_animati', vocabName: 'effets_speciaux_et_animation' },{
    fieldName: 'field_jeu', vocabName: 'jeu' },{
    fieldName: 'field_participation', vocabName: 'participation' },{
    fieldName: 'field_autres', vocabName: 'autres' },{
    fieldName: 'field_format_de_production', vocabName: 'format_de_production' },{
    fieldName: 'field_personnes', vocabName: 'personnes' }
  ]
  
  // Convert uri back to readable string
  useEffect(()=>{
    if (!searchTerms) {
      const readableSearchTerms = uriToString(searchSlug);
      setSearchTerms(readableSearchTerms)
    }
  },[searchSlug, searchTerms])
  
  // Set vocab references obj
  useEffect( () => {
    if (!vocabs && data) {
      const result = {}
      
      const getTermNamesByVocab = (vocabularyName) => {
        const terms =  data.included.filter( item => {
          return item.type === `taxonomy_term--${vocabularyName}`
        })
        result[vocabularyName] = terms
      }
      
      taxoFields.forEach( vocab => {
        getTermNamesByVocab(vocab.vocabName)
      })
      
      setVocabs(result)
    }
    
  },[vocabs, data])
  
  
  useEffect(()=>{
    if (data && searchTerms && vocabs && !filteredData && !isLoading && hasNoResult === null) {
      
      const allMatch = []
      
      // Loop through all Attribute object values recursively
      function rechercherValeur(objet, valeurRecherchee, index) {
        const lowerCaseRecherche = valeurRecherchee.toLowerCase();
        
        // Recherche récursive dans les propriétés de type string uniquement
        function chercherDansChaines(elementToTest) {
          if (typeof elementToTest === 'string') {
            const elemLowerCase = elementToTest.toLowerCase()
            if (elemLowerCase.includes(lowerCaseRecherche)) {
              return true
            }
          }
          else if (Array.isArray(elementToTest)) {
            return elementToTest.some(item => chercherDansChaines(item));
          }
          else if (typeof elementToTest === 'object' && elementToTest !== null) {
            return Object.values(elementToTest).some(valeur => chercherDansChaines(valeur));
          }
          return false;
        }
        
        const hasTerm = chercherDansChaines(objet)
        
        if (hasTerm) {
          allMatch.push(data.data[index])
        }
      }
      
      data.data.forEach( (item, index) => {
        rechercherValeur(item.attributes, searchTerms, index)
      })
      
      function loopThroughVocabTerms(fieldName, vocabName) {
        const match = data.data.filter( item => {
          if (Object.hasOwn(item.relationships, fieldName) ) {
            const termNames = findTermName( item.relationships[fieldName].data, vocabs[vocabName], vocabName);
            return termNames.toLowerCase().includes(searchTerms.toLowerCase())
          }
        })
        match.forEach( item => { allMatch.push(item) })
      }
      
      taxoFields.forEach( item => {
        loopThroughVocabTerms(item.fieldName, item.vocabName)
      })
      
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
  },[searchTerms, vocabs, filteredData, isLoading, hasNoResult, data])
  
  // Disable loading state
  useEffect(()=>{
    if ( (filteredData || hasNoResult) && !isLoading) {
      setIsloading(false)
    }
  },[filteredData, hasNoResult, isLoading])
  
  // No results message render
  if (data && hasNoResult && !isLoading) {
    return (
      <div>
        <p className='mb-6 text-3xl md:text-4xl'>Aucun résultat pour « {searchTerms} »</p>
      </div>
    )
  }
  
  // render a temp skeloton
  if (!data || isLoading) { return (
    <main className='content-loader'>
      <ContentGrid 
        contentData={defautlContent} 
        hideItemCount
      />
    </main>
  )}
  
  // Results render 
  if (data && !hasNoResult && !isLoading) { return (
    <>
      <h1>Recherche pour « {searchTerms} »</h1>
      {filteredData ? (<p>Résultat : {filteredData.data.length} contenus sur {data.data.length}</p>) : ''}
      <ContentGrid
        contentData={filteredData} 
        error={error} 
      />
    </>
  )}
}
