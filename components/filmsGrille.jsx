'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Fragment } from 'react';
import styled from 'styled-components';
import { useLoadData } from '../lib/fecthAllFilms'
import { FilmCard } from '../components/filmCard';
import { CategoryFilter } from '../components/categoryFilter';
import Masonry from 'react-masonry-css'

const Styled = styled.section`
  container-type: inline-size;
  padding-bottom: 10vh;
  
  .grille {
    display: flex;
    margin-left: -0px; /* gutter size offset */
    width: auto;
    margin-bottom: 2rem;
  }
  .grille__column {
    padding-left: 0px; /* gutter size */
    background-clip: padding-box;
  }
    
  .button {
    margin-inline: auto;}
  
  @container (min-width: 500px) {
    .grille {}
  }
 
  @container (min-width: 750px) {
   .grille {}
  }
  
  @container (min-width: 1000px) {
    .grille {}
  }
`;

const defautlFilm = {attributes: {
  drupal_internal__nid: 0,
  title: '...',
  field_annees_de_sortie: 'chargement',
  styles: {
    elemHeight: 'var(--ficheWidth)',
    couleur: '#ff8049',
    categorie: {nom: '...'}
  },
  filmIndex: 0
}}

const couleurs = ['#fd8abd', '#35cdff', '#f5d437', '#19f76b', '#ff8049', '#a081ff']

// temporaire dev
const tempCategories = [{nom:'Biologie', id:1}, {nom: 'Chimie', id:2}, {nom:'Santé mentale',id:3}, {nom:'Botanique',id:4}, {nom:'Médecine',id:5}]

export function FilmsGrille({random, lazyload}) {
  const [fetchedData, setFetchedData] = useState(null)
  const isLoadingData = useLoadData(setFetchedData, defautlFilm, 'allFilmsCache')
  const [filmsItems, setFilmsItems] = useState([defautlFilm])
  const [selectedCategory, setSelectedCategory] = useState('default')
  
  const allFilms = useRef([])
  const newLoadEnd = useRef()
  const isDataReady = useRef(false)
  const loadModeBtnRef = useRef()
  
  // Set loadBatchQty value to int or false from Lazyload prop
  function setLoadBatchQty(value) {
    
    if (!value) {
      return false
    } else {
      
      let batchQty = parseInt(value)
      
      if (isNaN(batchQty) || batchQty < 2) batchQty = 10; // par défaut
      
      // set start and end index for the first lazyload click
      if (!isDataReady.current) {
        newLoadEnd.current = batchQty * 2;
      } 
      
      return batchQty
    }
  }
  
  const loadBatchQty = setLoadBatchQty(lazyload);
 
 // Process Data array with prop options and set visible items
  function processData(filmsArray) {
    let resultArray = null;
    
    // Randomize items order 
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
        
        // couleur
        const total = couleurs.length;
        const randomCouleurIndex = Math.floor(Math.random() * total);
        film.attributes.styles.couleur = couleurs[randomCouleurIndex];
        
        // catégories Temporaire
        const catTotal = tempCategories.length;
        const randomCatIndex = Math.floor(Math.random() * catTotal);
        film.attributes.styles.categorie = tempCategories[randomCatIndex];
        
      })
    }
    randomStyles()
    
    // Set visible films according to loadBatchQty value
    function setFirstVisibleItems(arr) {
      if (loadBatchQty) {
        setFilmsItems(arr.slice(0, loadBatchQty)) // set first batch
      } else {
        setFilmsItems(arr) // set full array
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
  
  // event handlers
  function loadMoreClick() {
    
    const newVisibleBatch = allFilms.current.slice(0, newLoadEnd.current);
    setFilmsItems(newVisibleBatch)
    
    if (filmsItems.length + loadBatchQty >= allFilms.current.length) {
      loadModeBtnRef.current.style.display = "none"
    } else {
      newLoadEnd.current += loadBatchQty
    }
  }
  
  function categoryChangeHandler(id) {
    loadModeBtnRef.current.style.display = "none"
    
    if (id === 'all') {
      setFilmsItems(allFilms.current)
      setSelectedCategory('Toutes catégories')
    } else {
      //console.log('categorie clicked', id)
      const visibleCards = allFilms.current.filter( film => {
        return film.attributes.styles.categorie.id === id
      })
      setFilmsItems(visibleCards)
      setSelectedCategory(tempCategories[id - 1].nom)
    }
  }
  
  return (<>
    <CategoryFilter onCategoryChange={categoryChangeHandler} />
    <Styled>
      <Masonry
        breakpointCols={4}
        className="grille"
        columnClassName="grille__column">
        {filmsItems.map( (item, index) => (
          <FilmCard 
            key={item.attributes.drupal_internal__nid}
            filmdata={item.attributes}
          ></FilmCard>
        ))}  
      </Masonry>
      
      <p className='text-center mb-0'>
        {selectedCategory !== 'default' ? `${selectedCategory} : ` : ''}
        {fetchedData ? `${filmsItems.length} films sur ${fetchedData.length}` : '...'}
      </p>
      
      {lazyload ? (
        <button 
          id='load-more' 
          className='button' 
          onClick={loadMoreClick}
          ref={loadModeBtnRef}
        >
          Charger plus de films
        </button>
      ) : ''}
    </Styled>
  </>);
};
