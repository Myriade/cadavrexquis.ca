'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"
import { useLoadTaxonomies } from '../lib/fecthDrupalData'

const Styled = styled.section`

  .type, .infos {
    color: var(--color-rouge);}
    
  dt, dd {
    display: inline;}
  
  @container (min-width: 250px) { }
    
  @container (min-width: 500px) { }
  
  @container (min-width: 750px) { }
  
  @container (min-width: 1000px) { }
  
`;

const Curated = styled.section``

// const defautlFilm = {}

let realisation = ''
let langues = ''

export function FilmPage( {path} ) {
  const [ film, setFilm ] = useState(null)
  
  const taxoArray = ['realisation', 'langue']
  const { data: taxonomyData, loading, error } = useLoadTaxonomies(taxoArray, 'taxonomiesCache')
  
  // Handle loading state
  if (loading) {
    console.log('useLoadTaxonomies() loading...')
  }
  
  // Handle error state
  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }
  
  // Fetch film node id Drupal DB 
  async function fetchFilm() {
    console.log('Fetching film node data...')
    // fetch tous les nodes films avec seulement leur path alias
    const fetchedData = await drupal.getResourceCollection("node--film", {
      params: {
        "fields[node--film]": "drupal_internal__nid,path"
      },
      deserialize: false,
    })
    
    // trouver le nid du node qui a le path.alias === au prop path
    const node = await fetchedData.data.filter((node) => node.attributes.path.alias === `/${path}`);
    
    // get le node complet avec le nid  
    const filmFetchedData = await drupal.getResource(
      "node--film",
      node[0].id
    )
    
    if (filmFetchedData.type) {
      setFilm(filmFetchedData);
    }
  }
  
  if (!film) {
    fetchFilm();
  } 
  
  if (film && taxonomyData) {
    // console.log('film.field_langue', film.field_langue)
    // console.log('taxoData', taxonomyData)
    
    function findMatchingNames(fieldArray, dataArray) {
        const matchingNames = [];
        
        // Loop through each item in fieldArray
        fieldArray.forEach((fieldItem, fieldIndex) => {
            // Find corresponding item in dataArray
            const dataMatch = dataArray.find(dataItem => 
                fieldItem.resourceIdObjMeta.drupal_internal__target_id === dataItem.id
            );
            
            // If a match is found, add its name to the array
            if (dataMatch && dataMatch.name) {
                matchingNames.push(dataMatch.name);
            }
        });
        
        // Join all names with commas and return
        return matchingNames.join(', ');
    }
    
    realisation = findMatchingNames(film.field_realisation, taxonomyData.realisation)
    langues = findMatchingNames(film.field_langue, taxonomyData.langue)
    // console.log(realisation);
  }
  
  return (
    <>
      <Styled>
        <img src='/images/video-temp.png' alt='' className='video mb-8'/>
        <p className='type text-xl mb-6'>Collection</p>
        <h1 className='mb-6'>{film ? film.title : '...'}</h1>
        <p className='infos text-xl font-sans mb-6'>
          {film ? film.field_annees_de_sortie : 'chargement'} / 
          <i> [un autre champ]</i>
        </p>
        <div 
          dangerouslySetInnerHTML={film ? { __html: film.field_resume_de_l_institution_de.processed } : {__html: ''}}
          className='texte text-lg font-serif mb-6'
        ></div>
        <dl className='mb-6'>
          <div><dt>Réalisation :</dt> <dd>{ taxonomyData ? realisation : '...' }</dd></div>
          <div><dt>Langues :</dt> <dd>{ taxonomyData ? langues : '...' }</dd></div>
        </dl>
      </Styled>
      
      <Curated className='mb-6'>
        <hr className='mb-6' />
        <h2>À voir aussi</h2>
        <p><i>[ Fiches d&apos;autres films liés (curation) ]</i></p>
      </Curated>
    </>
  );
};
