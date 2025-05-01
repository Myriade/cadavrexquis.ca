'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
//import { drupal } from "/lib/drupal.ts"
import { useLoadData } from '../lib/fecthAllFilms'

const Styled = styled.section`
  --ficheWidth: 250px;
  container-type: inline-size;
  padding-block: 10vh;
  
  .grille {
    column-count: 1;
    column-gap: 0;
    max-width: var(--ficheWidth);
  }
  
  .film {
    display: block;
    overflow: hidden;
    break-inside: avoid-column;
    border: 1px dotted;
    width: var(--ficheWidth);
    transition: all 0.7s ease-in;}
  
  .film.hidden {border: 0;}
  
  @container (min-width: 500px) {
    .grille {
      column-count: 2;
      max-width: calc( var(--ficheWidth) * 2 );}
  }
 
  @container (min-width: 750px) {
   .grille {
      column-count: 3;
      max-width: calc( var(--ficheWidth) * 3 );}
  }
  
  @container (min-width: 1000px) {
    .grille {
      column-count: 4;
      max-width: calc( var(--ficheWidth) * 4 );}
  }
  
  #load-more {
    margin: 2rem auto;
    border: 1px solid black;
    display: block;
    padding: 0.5em 1em;
    &:hover {
      background: black;
      color: white;
      cursor: pointer;
    }
  }
  
`;

const defautlFilm = {attributes: {
  drupal_internal__nid: 0,
  title: '...',
  field_annees_de_sortie: 'chargement'
}}

export function FilmsGrille({random, lazylaod}) {
  const [fetchedData, setFetchedData] = useState(null)
  const isLoadingFilms = useLoadData(setFetchedData, defautlFilm, 'allFilms');
  const [allFilms, setAllFilms] = useState([defautlFilm])
  const isDataReady = useRef(false)
  
  function parseData(array) {
    
    function randomizeData(array) {
      if (!isDataReady.current) {
        if (random) {
          const randomizedData = fetchedData.sort((a, b) => 0.5 - Math.random());
          setAllFilms(randomizedData)
          isDataReady.current = true
        } else {
          setallFilms(fetchedData)
          isDataReady.current = true
        }
      }
    }
    
    randomizeData(array)
  }
  
  if (fetchedData) {
    parseData(fetchedData)
  }
  
  // event handler
  const loadMoreClick = () => {
    console.log('Charger plus clicked')
  }
  
  return (
    <>
      <Styled>
        <div className="grille">
          {allFilms.map( (item, index) => { 
            const film = item.attributes;
            
            const randomHeightFactor = Math.random() * (1.5 - 0.5) + 0.5;
            const elemHeight = `calc( var(--ficheWidth) * ${randomHeightFactor})`
            
            return (
              <a 
                key={film.drupal_internal__nid}
                href={ film.path ? `/film${film.path.alias}` : '#' }
                className="film p-4"
                style={{minHeight: elemHeight}}
              >
                {/*index*/} {film.title}<br/>
                <small>{film.field_annees_de_sortie}{film.field_duree ? `, ${film.field_duree}` : ''}</small>
                <div>{ film.path || !isDataReady.current ? '' : '!! pas de path !!' }</div>
              </a>
            )
          })}
        </div>
        {lazylaod ? <button id='load-more' onClick={loadMoreClick}>Charger plus de films</button> : ''}
      </Styled>
    </>
  );
};
