'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { useLoadData } from '../lib/fecthAllFilms'
import { FilmCard } from '../components/filmCard';

const Styled = styled.section`
  --ficheWidth: 250px;
  container-type: inline-size;
  padding-bottom: 10vh;
  
  .grille {
    column-count: 1;
    column-gap: 0;
    max-width: var(--ficheWidth);}
  
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

export function FilmsGrille({random, lazyload}) {
  const [fetchedData, setFetchedData] = useState(null)
  const isLoadingFilms = useLoadData(setFetchedData, defautlFilm, 'allFilmsCache')
  const [visibleItems, setVisibleItems] = useState([defautlFilm])
  const allFilms = useRef([])
  const isDataReady = useRef(false)
  
  // Set load batch qty from Lazyload prop
  function setLazyLoad(value) {
    let result = null
    
    if (!value) {
      return result
    } else {  
      result = parseInt(value)
      if (isNaN(result) || result < 2) {
        result = 10; // par défaut
      }
    }
    
    return result
  }
  
  const loadBatchQty = setLazyLoad(lazyload);
 
 // Process Data array with prop options and set visible items
  function processData(filmsArray) {
    let resultArray = null;
    
    // Randomize if random prop is present 
    function randomizeData(array) {
      const randomizedData = fetchedData.sort((a, b) => 0.5 - Math.random());
      return randomizedData;
    }
    
    if (random) { 
      resultArray = randomizeData(filmsArray) 
    } else {
      resultArray = filmsArray
    }
    
    // Set visibleItems according to loadBatchQty value
    function setFirstVisibleItems(arr) {
      if (loadBatchQty) {
        setVisibleItems(arr.slice(0, loadBatchQty)) // set first batch
      } else {
        setVisibleItems(arr) // set full array
      }
    }
    
    // Finalize
    allFilms.current = resultArray 
    setFirstVisibleItems(resultArray)
    isDataReady.current = true
  }
  
  if (fetchedData && !isDataReady.current) {
    processData(fetchedData)
  }
  
  // event handler
  const loadMoreClick = () => {
    const startIndex = visibleItems.length;
    const endIndex = Math.min(startIndex + loadBatchQty, allFilms.current.length);
    
    if (startIndex >= allFilms.current.length) return;
    
    setVisibleItems(prevItems => [...prevItems, ...allFilms.current.slice(startIndex, endIndex)]);
  }
  
  return (
    <>
      <Styled>
        <div className="grille">
          {visibleItems.map( (item, index) => (
            <FilmCard 
              key={item.attributes.drupal_internal__nid}
              filmdata={item.attributes}
            ></FilmCard>
          ))}
        </div>
        {lazyload ? <button id='load-more' onClick={loadMoreClick}>Charger plus de films</button> : ''}
      </Styled>
    </>
  );
};
