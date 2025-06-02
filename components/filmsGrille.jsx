'use client'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components';
import { FilmCard } from '../components/filmCard';
import { ThematiqueFilter } from '../components/thematiqueFilter';
import { findTermName } from '../lib/utils.ts'

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

const breakpointColumnsObj = {
  default: 5,
  1325: 4,
  1075: 3,
  825: 2
};

const couleurs = ['#fd8abd', '#35cdff', '#f5d437', '#19f76b', '#ff8049', '#a081ff']
const focus = ['left top', 'top', 'right top', 'left center', 'center', 'right center', 'left bottom', 'bottom', 'right bottom']

export function FilmsGrille({allFilmsData, isLoading, error, random, lazyload, isSearch}) {
  const [filmsItems, setFilmsItems] = useState([defautlFilm])
  const [selectedThematique, setSelectedThematique] = useState('default')
  const [thematiqueVocab, setThematiqueVocab] = useState()
  const [allImages, setAllImages] = useState()
  
  const displayableFilms = useRef([])
  const newLoadStart = useRef(0)
  const newLoadEnd = useRef()
  const isDisplayReady = useRef(false)
  const loadModeBtnRef = useRef()
  const gsapContainer = useRef()
  
  gsap.registerPlugin(useGSAP);
  
  // Thématiques vocabulary (l'ensemble de tous les termes présents dans l'ensemble de tous les films)
  useEffect(()=>{
    if (allFilmsData && !isLoading && !thematiqueVocab) {
      const result = allFilmsData.included.filter( item => {
        return item.type === "taxonomy_term--site_categorie"
      });
      setThematiqueVocab(result)
    }
  },[thematiqueVocab, isLoading])
  
  // Les images (l'ensemble de toutes les images présentes dans l'ensemble de tous les films)
  useEffect(()=>{
    if (allFilmsData && !isLoading && !allImages) {
      const result = allFilmsData.included.filter( item => {
        return item.type === "file--file"
      });
      setAllImages(result)
    }
  }, [allFilmsData, isLoading, allImages])
  
  // Set loadBatchQty value to int or false from Lazyload prop. 
  // Run only once or at every change ? Or use a ref ?
  //useEffect(()=>{
    function setLoadBatchQty(value) {
      
      if (!value) {
        return false
      } else {
        
        let batchQty = parseInt(value)
        
        if (isNaN(batchQty) || batchQty < 2) batchQty = 10; // par défaut
        
        // set start and end index for the first lazyload click
        if (!isDisplayReady.current) {
          newLoadEnd.current = batchQty * 2;
        } 
        
        return batchQty
      }
    }
    const loadBatchQty = setLoadBatchQty(lazyload);
  //},[])
  
  // Process Data array with prop options and set visible items
  useEffect(()=>{
    function processData(filmsArray) {
      let resultArray = null;
      
      // Randomize items order if random prop is present
      function randomizeData(array) {
        const randomizedData = array.sort((a, b) => 0.5 - Math.random());
        return randomizedData;
      }
      
      if (random) { 
        resultArray = randomizeData(allFilmsData.data) 
      } else {
        resultArray = filmsArray
      }
      
      // Set filmIndex filmThematiques & filmImage attributes
      resultArray.forEach( (film, index) => {
        // Index (pour garder le même ordre jusqu'au prochain vrai page load)
        film.attributes.filmIndex = index
        
        // Thématique
        const thematiquesValueArray = film.relationships.field_site_thematique.data;
        
        if (thematiquesValueArray.length && thematiqueVocab.length) {
          film.attributes.filmThematiques = {}
          
          // Les noms des termes pour affichage sur les cartes (string)
          const termNames = findTermName(thematiquesValueArray, thematiqueVocab)
          film.attributes.filmThematiques.noms = termNames
          
          // les ID pour pouvoir filtrer les films
          const termIds = thematiquesValueArray.map( term => term.meta.drupal_internal__target_id)
          film.attributes.filmThematiques.ids = termIds
        } else {
          // Si aucune thematique, envoyer les donnees par defaut
          film.attributes.filmThematiques = defautlFilm.attributes.filmThematiques
        }
        
        // Image  
        let imagePath = null 
        function findImagePath(imgId, imagesArray) {
          const matchImage = imagesArray.find( img => {
            return img.attributes.drupal_internal__fid === imgId
          });
          return matchImage.attributes.uri.url
        }
        
        if (film.relationships.field_site_photogramme.data && !imagePath) {
          const id = film.relationships.field_site_photogramme.data.meta.drupal_internal__target_id
          imagePath = findImagePath(id, allImages)
        }
        
        if (imagePath)
          film.attributes.filmImageUrl = imagePath;
        
      })
      
      // Create random values for filmCard styles (color and height)
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
      displayableFilms.current = resultArray 
      setFirstVisibleItems(resultArray)
      isDisplayReady.current = true
    }
    if (!isLoading && thematiqueVocab && !isDisplayReady.current && !displayableFilms.current.length) {
      //console.log(displayableFilms.current.length)
      processData(allFilmsData.data)
    }
  },[allFilmsData, isLoading, thematiqueVocab])
  
  
  // GSAP
  const gsapInstance = useGSAP( async () => {
    function setCardsToLoad() {
      const all = gsapContainer.current.querySelectorAll('.card__inner');
      let result = null
      
      if (all.length > 1) {
        
        if (selectedThematique === 'default' && loadBatchQty) {
          const startIndex = newLoadStart.current
          let endIndex = startIndex + loadBatchQty
          all.forEach( elem => {
            const num = parseInt(elem.dataset.cardindex);
            if (num >= startIndex && num <= endIndex) {
              elem.classList.add('loaded');
            } else {
              elem.classList.remove('loaded');
            }
          })
          result = gsapContainer.current.querySelectorAll('.card__inner.loaded');
        } else {
          result = all
        }
      }
      
      return result 
    }
    
    if (filmsItems.length > 1) {
      const cardsToLoad = await setCardsToLoad();
      gsap.from(cardsToLoad, {
        height: 0,
        stagger: {
          amount: 0.5
        }
      });
    }
  }, { dependencies: [filmsItems], scope: gsapContainer });
  
  // event handlers
  function loadMoreClick() {
    const newVisibleBatch = displayableFilms.current.slice(0, newLoadEnd.current);
    setFilmsItems(newVisibleBatch)
    
    if (filmsItems.length + loadBatchQty >= displayableFilms.current.length) {
      loadModeBtnRef.current.style.display = "none"
      newLoadEnd.current = displayableFilms.current.length
      newLoadStart.current += loadBatchQty
    } else {
      newLoadEnd.current += loadBatchQty
      newLoadStart.current += loadBatchQty
    }
  }
  
  function thematiqueChangeHandler(id) {
    if (loadModeBtnRef.current) {
      loadModeBtnRef.current.style.display = 'none'
    }
    
    if (id === 'all') {
      setFilmsItems(displayableFilms.current)
      setSelectedThematique('Toutes catégories')
    } else {
      const filteredCards = displayableFilms.current.filter( film => {
        if (film.attributes.filmThematiques) {
          return film.attributes.filmThematiques.ids.includes(id)
        }
      })
      setFilmsItems(filteredCards)
      
      // Outputs thematique name at the bottom near the film count
      const termName = findTermName([{meta: {drupal_internal__target_id: id}}], thematiqueVocab); // simuler l'objet comme s'il vient de la db
      setSelectedThematique(termName)
    }
    
    newLoadStart.current = 0
    newLoadEnd.current = filmsItems.length
  }
  
  return allFilmsData ? (<>
    { !isSearch ? <ThematiqueFilter 
      allThematiques={thematiqueVocab} 
      onThematiqueChange={thematiqueChangeHandler} 
    /> : ''}
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
        {selectedThematique !== 'default' ? `${selectedThematique} : ` : ''}
        {isLoading ? '...' : `${filmsItems.length} films sur ${allFilmsData.data.length}`}
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
  </>) : (<p>...</p>);
};
