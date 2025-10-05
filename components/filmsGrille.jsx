'use client'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components';
import { GridCard } from '../components/gridCard';
import { ThematiqueFilter } from '../components/thematiqueFilter';
import { findTermName, createRandomStyles } from '../lib/utils.ts'

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
    
  &.grille-skeleton {
    display: flex;
    gap: 1rem;
    align-items: start;
    .card {
      width: var(--ficheWidth);}
  }
`;

const breakpointColumnsObj = {
  default: 5,
  1325: 4,
  1075: 3,
  825: 2
};

export function FilmsGrille({allFilmsData, error, docError, random, lazyload, isSearch, isRelated}) {
  const [filmsItems, setFilmsItems] = useState()
  const [selectedThematique, setSelectedThematique] = useState('default')
  const [thematiqueVocab, setThematiqueVocab] = useState()
  const [allImages, setAllImages] = useState()
  const [loadBatchQty, setLoadBatchQty] = useState()
  const [isLoading, setIsLoading] = useState(true)
  
  const displayableFilms = useRef([])
  const newLoadStart = useRef(0)
  const newLoadEnd = useRef()
  const isDisplayReady = useRef(false)
  const loadModeBtnRef = useRef()
  const gsapContainer = useRef()
  
  gsap.registerPlugin(useGSAP);
  
  // Determine if content data is loading and squeleton is presented
  useEffect(()=>{
    if (isLoading && allFilmsData.data.length) {
      const typeIsSkeleton = allFilmsData.data[0].type === 'skeleton'
      if (!typeIsSkeleton) {
        setIsLoading(false)
      }
    }
  },[isLoading, allFilmsData])
  
  // Thématiques vocabulary (l'ensemble de tous les termes présents dans l'ensemble de tous les films)
  useEffect(() => {
    if ( !isLoading && allFilmsData && !error && !docError && !thematiqueVocab ) {
      const result = allFilmsData.included.filter( item => {
        return item.type === "taxonomy_term--site_categorie"
      });
      setThematiqueVocab(result)
    }
  },[isLoading, allFilmsData, error, docError, thematiqueVocab ])
  
  // Les images (l'ensemble de toutes les images présentes dans l'ensemble de tous les films)
  useEffect(()=>{
    if ( !isLoading && allFilmsData && !error && !docError && !allImages) {
      const result = allFilmsData.included.filter( item => {
        return item.type === "file--file"
      });
      setAllImages(result)
    }
  }, [isLoading, allFilmsData, error, docError, allImages])
  
  // Set loadBatchQty value to int or false from Lazyload prop. 
  useEffect(() => {
    if (!isLoading && allFilmsData && !error && !docError && !loadBatchQty) {
      function batchQtySetValue(prop) {
        if (!prop) {
          return false
        } else {
          
          let batchQty = parseInt(prop)
          
          if (isNaN(batchQty) || batchQty < 2) batchQty = 10; // par défaut
          
          // set start and end index for the first lazyload click
          if (!isDisplayReady.current) {
            newLoadEnd.current = batchQty * 2;
          } 
          
          return batchQty
        }
      }
      const qty = batchQtySetValue(lazyload);
      setLoadBatchQty(qty)
    }
  },[isLoading, allFilmsData, error, docError, lazyload, loadBatchQty])
  
  // Process Data array with prop options and set visible items
  useEffect(()=>{
    if ( !isLoading && !filmsItems && allFilmsData && !error && !docError && thematiqueVocab && !isDisplayReady.current && !displayableFilms.current.length) {
      
      function processData(filmsArray) {
        let resultArray = null;
        
        // Randomize items order if random prop is present
        function randomizeData(arr) {
          const array = [...arr];
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        
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
        
        // Create random values for GridCard styles (color and height)      
        createRandomStyles(resultArray)
        
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
      processData(allFilmsData.data)
    }
  }, [isLoading, filmsItems, allFilmsData, error, docError, allImages, loadBatchQty, random, thematiqueVocab])
  
  // GSAP
  const gsapInstance = useGSAP( async () => {
    if ( !isLoading && !error && !docError && filmsItems) {
      
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
      
      const cardsToLoad = await setCardsToLoad();
      gsap.from(cardsToLoad, {
        height: 0,
        stagger: {
          amount: 0.5
        }
      });
    }
  }, { dependencies: [isLoading, filmsItems, error, docError, selectedThematique, loadBatchQty], scope: gsapContainer });
  
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
  
  // render error 
  if (error || docError) { return (
    <div className='film-grille grid content-center text-center'>
      <p className='error'>Une erreur de chargement sest produite. Vérifiez votre connexion internet, ou avisez-nous si le problème persite.</p>
    </div>
  );}
  
  // render temp skeleton 
  if (isLoading && allFilmsData) { 
    return (
    <div className='film-grille'>
      <Styled className='mt-8 grille-skeleton'>
        {allFilmsData.data.map( (item) => (
          <GridCard 
            key={item.attributes.drupal_internal__nid}
            contentObj={item.attributes}
          />
        ))} 
      </Styled>
    </div>
  );}
  
  // render content grid
  if (!isLoading && allFilmsData && filmsItems) { 
    return (
    <div className='film-grille'>
      { !isSearch && !isRelated ? <ThematiqueFilter 
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
          {filmsItems.map( (item) => (
            <GridCard 
              key={item.attributes.drupal_internal__nid}
              contentObj={item.attributes}
              contentType={item.type}
              shouldwait={lazyload ? 700 : 0}
            />
          ))}  
        </Masonry>
        
        { !isRelated ? 
          <p className='text-center mb-0'>
            {selectedThematique !== 'default' ? `${selectedThematique} : ` : ''}
            {!isSearch && `${filmsItems.length} sur ${allFilmsData.data.length}`}
          </p>
        : '' }
        
        {lazyload ? (
          <button 
            id='load-more' 
            className='button' 
            onClick={loadMoreClick}
            ref={loadModeBtnRef}
          >
            Charger plus
          </button>
        ) : ''}
      </Styled>
    </div>
  );}
};
