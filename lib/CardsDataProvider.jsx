'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { useFetchCards } from './fecthDrupalData'

const CardsDataContext = createContext(null)

export function CardsDataProvider({ children, isSearch = false }) {
  const { data, isLoading, error } = useFetchCards(isSearch)

  const value = useMemo(() => ({
    data,
    isLoading,
    error
  }), [data, isLoading, error])

  return (
    <CardsDataContext.Provider value={value}>
      {children}
    </CardsDataContext.Provider>
  )
}

export function useCardsData() {
  const context = useContext(CardsDataContext)
  if (!context) {
    throw new Error('useCardsData must be used within a CardsDataProvider')
  }
  return context
}
