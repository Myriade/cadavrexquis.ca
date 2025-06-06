'use client'
import React, { useState, useRef } from 'react'
import { useFetchAllFilms } from '../lib/fecthDrupalData'
import { FilmsGrille } from '../components/filmsGrille';

export default function AccueilPage() {
  const { data, isLoading, error } = useFetchAllFilms()
  
  return (
    <>
      <FilmsGrille 
        allFilmsData={data} 
        isLoading={isLoading} 
        error={error} 
        random 
        lazyload={10}
      >
      </FilmsGrille>
    </>
  );
}
