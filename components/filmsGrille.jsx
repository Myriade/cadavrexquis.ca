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
    max-width: var(--ficheWidth);
    margin-bottom: 2rem;}
  
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
  field_annees_de_sortie: 'chargement',
  styles: {
    elemHeight: 'var(--ficheWidth)'
  }
}}

export function FilmsGrille({random, lazyload}) {
  const [fetchedData, setFetchedData] = useState(null)
  const isLoadingFilms = useLoadData(setFetchedData, defautlFilm, 'allFilmsCache')
  const [firstFilmBatch, setFirstFilmBatch] = useState([defautlFilm])
  const [newFilmBatch, setNewFilmBatch] = useState([])
  
  const allFilms = useRef([])
  const newLoadStart = useRef(0) 
  const newLoadEnd = useRef()
  const isDataReady = useRef(false)
  
  // Set loadBatch value to int or false from Lazyload prop
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
  
  const loadBatch = setLazyLoad(lazyload);
 
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
    
    // Create random values for filmCard styles
    function randomStyles() {
      resultArray.forEach( film => {
        // height style
        const randomHeightFactor = Math.random() * (1.5 - 0.5) + 0.5;
        const height = `calc( var(--ficheWidth) * ${randomHeightFactor})`
        film.attributes.styles = {}
        film.attributes.styles.elemHeight = height;
      })
    }
    randomStyles()
    
    // Set firstFilmBatch according to loadBatch value
    function setFirstVisibleItems(arr) {
      if (loadBatch) {
        setFirstFilmBatch(arr.slice(0, loadBatch)) // set first batch
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
  
  // event handler
  const loadMoreClick = () => {
    
    if (newLoadEnd.current >= allFilms.current.length + loadBatch) return;
    
    const newBatch = allFilms.current.slice(newLoadStart.current, newLoadEnd.current);
    
    setNewFilmBatch( prevItems => {
      const result = [...prevItems, newBatch];
      return result
    })
    
    newLoadStart.current += loadBatch
    newLoadEnd.current += loadBatch
  }
  
  return (
    <>
      <Styled>
        <div className="grille">
          {firstFilmBatch.map( (item, index) => (
            <FilmCard 
              key={item.attributes.drupal_internal__nid}
              filmdata={item.attributes}
            ></FilmCard>
          ))}
        </div>
        
        {newFilmBatch.map( (batch, index) => (
          <div className="grille grille--lazyloaded" key={index}>
            {batch.map( (item, i) => (
              <FilmCard 
                key={item.attributes.drupal_internal__nid}
                filmdata={item.attributes}
              ></FilmCard>
            ))}
          </div>
        ))}
        
        {lazyload ? <button id='load-more' onClick={loadMoreClick}>Charger plus de films</button> : ''}
      </Styled>
    </>
  );
};
