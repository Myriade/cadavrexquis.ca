'use client'
import React, { useState, useRef } from 'react'
import { Fragment } from 'react';
import styled from 'styled-components';
import { useLoadData } from '../lib/fecthAllFilms'
import { FilmCard } from '../components/filmCard';
import { CategoryFilter } from '../components/categoryFilter';

import Masonry from 'react-masonry-css'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Styled = styled.section`
  container-type: inline-size;
  padding-bottom: 10vh;
  
  .grille {
    display: flex;
    margin-left: calc( -1 * var(--ficheMarge)); /* gutter size offset */
    width: auto;
    margin-bottom: 2rem;}
  
  .grille__column {
    padding-left: var(--ficheMarge); /* gutter size */
    background-clip: padding-box;
    max-width: var(--ficheWidth);}
    
  .button {
    margin-inline: auto;}
`;

const defautlFilm = {attributes: {
  drupal_internal__nid: 0,
  title: 'chargement',
  field_annees_de_sortie: '...',
  styles: {
    elemHeight: 'var(--ficheWidth)',
    couleur: '#eee',
    categorie: {nom: ''}
  }
}}

const breakpointColumnsObj = {
  default: 5,
  1325: 4,
  1075: 3,
  825: 2
};

const couleurs = ['#fd8abd', '#35cdff', '#f5d437', '#19f76b', '#ff8049', '#a081ff']
const focus = ['left top', 'top', 'right top', 'left center', 'center', 'right center', 'left bottom', 'bottom', 'right bottom']

///// temporaire dev /////
const tempCategories = [{nom:'Biologie', id:1}, {nom: 'Chimie', id:2}, {nom:'Santé mentale',id:3}, {nom:'Botanique',id:4}, {nom:'Médecine',id:5}]

const tempPhotograms = ['photogramme-temp-1.jpg', 'photogramme-temp-2.jpg', 'photogramme-temp-3.jpg', 'photogramme-temp-4.jpg', 'photogramme-temp-5.jpg', 'photogramme-temp-6.jpg']
//////               /////

export function FilmsGrille({random, lazyload}) {
  const [fetchedData, setFetchedData] = useState(null)
  const isLoadingData = useLoadData(setFetchedData, defautlFilm, 'allFilmsCache')
  const [filmsItems, setFilmsItems] = useState([defautlFilm])
  const [selectedCategory, setSelectedCategory] = useState('default')
  
  const allFilms = useRef([])
  const newLoadStart = useRef(0)
  const newLoadEnd = useRef()
  const isDataReady = useRef(false)
  const loadModeBtnRef = useRef()
  const gsapContainer = useRef();
  
  gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies 
  
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
        const randomHeightFactor = Math.random() * (1.5 - 0.75) + 0.3;
        const height = `calc( var(--ficheWidth) * ${randomHeightFactor})`
        film.attributes.styles = {}
        film.attributes.styles.elemHeight = height;
        
        // couleur
        const totalCouleurs = couleurs.length;
        const randomCouleurIndex = Math.floor(Math.random() * totalCouleurs);
        film.attributes.styles.couleur = couleurs[randomCouleurIndex];
        
        // focus (image)
        const totalFocus = focus.length;
        const randomFocusIndex = Math.floor(Math.random() * totalFocus);
        film.attributes.styles.focus = focus[randomFocusIndex]; 
        
        /////// catégories Temporaire ///////
        const catTotal = tempCategories.length;
        const randomCatIndex = Math.floor(Math.random() * catTotal);
        film.attributes.styles.categorie = tempCategories[randomCatIndex];
        
        ////// Photogrammes Temporaire
        const photoTotal = tempPhotograms.length;
        const randomPhotoIndex = Math.floor(Math.random() * photoTotal);
        film.attributes.styles.photogramme = tempPhotograms[randomPhotoIndex];
        ///////                       ///////
        
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
  
  // GSAP
  const gsapInstance = useGSAP( async () => {
    
    function setCardsToReveal() {
      const all = gsapContainer.current.querySelectorAll('.card__inner');
      let result = null
      
      if (all.length > 1) {
        if (selectedCategory === 'default') {
          const startIndex = newLoadStart.current
          let endIndex = startIndex + loadBatchQty
          all.forEach( elem => {
            const num = parseInt(elem.dataset.cardindex);
            if (num >= startIndex && num <= endIndex) {
              elem.classList.add('to-be-revealed');
            } else {
              elem.classList.remove('to-be-revealed');
            }
          })
           console.log('startIndex', startIndex, 'endIndex', endIndex)
          result = gsapContainer.current.querySelectorAll('.card__inner.to-be-revealed');
        } else {
           console.log('categoy', selectedCategory)
          result = all
        }
        return result 
      }
    }
    
    if (filmsItems.length > 1) {
      const cardsToReveal = await setCardsToReveal();
      gsap.from(cardsToReveal, {
        height: 0,
        stagger: {
          amount: 0.5
        }
      });
    }
    
  }, { dependencies: [filmsItems], scope: gsapContainer });
  
  // event handlers
  function loadMoreClick() {
    
    const newVisibleBatch = allFilms.current.slice(0, newLoadEnd.current);
    setFilmsItems(newVisibleBatch)
    
    if (filmsItems.length + loadBatchQty >= allFilms.current.length) {
      loadModeBtnRef.current.style.display = "none"
      newLoadEnd.current = allFilms.current.length
      newLoadStart.current += loadBatchQty
    } else {
      newLoadEnd.current += loadBatchQty
      newLoadStart.current += loadBatchQty
    }
  }
  
  function categoryChangeHandler(id) {
    if (loadModeBtnRef.current) {
      loadModeBtnRef.current.style.display = 'none'
    }
    
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
    
    newLoadStart.current = 0
    newLoadEnd.current = filmsItems.length
  }
  
  return (<>
    <CategoryFilter onCategoryChange={categoryChangeHandler} />
    <Styled
      className='mt-8' 
      ref={gsapContainer}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="grille"
        columnClassName="grille__column">
        {filmsItems.map( (item, index) => (
          <FilmCard 
            key={item.attributes.drupal_internal__nid}
            filmdata={item.attributes}
            shouldwait={lazyload ? 700 : 0}
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
