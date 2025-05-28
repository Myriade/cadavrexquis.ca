'use client'
import React, { useState, useRef } from 'react'
import { useFetchAllFilms } from '../lib/fecthDrupalData'
import { FilmsGrille } from '../components/filmsGrille';

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

export default function AccueilPage() {
  const { data, isLoading, error } = useFetchAllFilms(defautlFilm)
  
  console.log('isLoading', isLoading, 'error', error, 'data', data)
  
  return (
    <>
      <FilmsGrille 
        allFilmsData={data} 
        isLoading={isLoading} 
        error={error} 
        random 
        lazyload
      >
      </FilmsGrille>
    </>
  );
}
