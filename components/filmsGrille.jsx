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

const defaultStyles = {
  elemHeight: 'var(--ficheWidth)'
}

export function FilmsGrille({random, lazyload}) {
  const [fetchedData, setFetchedData] = useState(null)
  const isLoadingFilms = useLoadData(setFetchedData, defautlFilm, 'allFilmsCache')
  const [firstFilmBatch, setFirstFilmBatch] = useState([defautlFilm])
  const [isStyleReady, setIsStyleReady] = useState(false)
  const [newFilmBatch, setNewFilmBatch] = useState([])
  
  const allFilms = useRef([])
  const allCardStyles = useRef([defaultStyles])
  const newLoadStart = useRef(0) 
  const newLoadEnd = useRef()
  const isDataReady = useRef(false)
  
  // Set load batch qty from Lazyload prop
  function setLazyLoad(value) {
    
    if (!value) {
      return false
    } else {
      
      let batchQty = parseInt(value)
      
      if (isNaN(batchQty) || batchQty < 2) {
        batchQty = 10; // par défaut
      }
      
      // set start and end index for the first lazyload click
      if (!isDataReady.current) {
        newLoadStart.current = batchQty;
        newLoadEnd.current = batchQty * 2;
      } 
      
      return batchQty
    }
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
    
    // Set filmIndex attribute
    resultArray.forEach( (film, index) => {
      film.attributes.filmIndex = index
    })
    
    // Set firstFilmBatch according to loadBatchQty value
    function setFirstVisibleItems(arr) {
      if (loadBatchQty) {
        setFirstFilmBatch(arr.slice(0, loadBatchQty)) // set first batch
      } else {
        setFirstFilmBatch(arr) // set full array
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
  
  // Create random values for film Card styles
  function randomizeCardStyles() {
    
    let resultArray = [];
    
    for (let i = 0; i < allFilms.current.length; i++) {
      
      // create object with height style
      const randomHeightFactor = Math.random() * (1.5 - 0.5) + 0.5;
      const height = `calc( var(--ficheWidth) * ${randomHeightFactor})`
      resultArray.push({elemHeight: height})
    }
    
    return resultArray
  }
  
  if (allFilms.current.length && !isStyleReady) {
    allCardStyles.current = randomizeCardStyles()
    setIsStyleReady(true)
  }
  
  // event handler
  const loadMoreClick = () => {
    
    if (newLoadEnd.current >= allFilms.current.length + loadBatchQty) return;
    
    const newBatch = allFilms.current.slice(newLoadStart.current, newLoadEnd.current);
    
    setNewFilmBatch( prevItems => {
      const result = [...prevItems, newBatch];
      return result
    })
    
    newLoadStart.current += loadBatchQty
    newLoadEnd.current += loadBatchQty
  }
  
  return (
    <>
      <Styled>
        <div className="grille grille_first">
          {firstFilmBatch.map( (item, index) => (
            <FilmCard 
              key={item.attributes.drupal_internal__nid}
              filmdata={item.attributes}
              styles={allCardStyles.current ? allCardStyles.current[index] : defaultStyles}
            ></FilmCard>
          ))}
        </div>
        
        {newFilmBatch.map( (batch, index) => (
          <div className="grille" key={index}>
            {batch.map( (item, i) => (
              <FilmCard 
                key={item.attributes.drupal_internal__nid}
                filmdata={item.attributes}
                styles={defaultStyles}
              ></FilmCard>
            ))}
          </div>
        ))}
        
        {lazyload ? <button id='load-more' onClick={loadMoreClick}>Charger plus de films</button> : ''}
      </Styled>
    </>
  );
};
