'use client'
import React, { useState, useRef } from 'react'
import { useFetchFilmsAndDocuments } from '../lib/fecthDrupalData'
import { ContentGrid } from '../components/contentGrid';

const defautlContent = { 
  data: [{
    attributes: {
      drupal_internal__nid: 0,
      title: 'chargement...',
      field_annees_de_sortie: '...',
      filmThematiques: {noms: '', ids: []},
      styles: {
        elemHeight: 'var(--cardWidth)',
        couleur: '#ddd',
      }
    },
    type: 'skeleton'
  },{
    attributes: {
      drupal_internal__nid: 999,
      title: '...',
      field_annees_de_sortie: '...',
      filmThematiques: {noms: '', ids: []},
      styles: {
        elemHeight: 'calc( var(--cardWidth) * 0.8)',
        couleur: '#f1f1f1',
      }
    },
    type: 'skeleton'
  }]
}

export default function FeaturedContent() {
  const { data, isLoading, error } = useFetchFilmsAndDocuments()
  const [content, setContent] = useState(null)
  
  if ( !content && data && !isLoading && !error) {
    let result = null;
    
    const allPromoted = data.data.filter( item => item.attributes.promote === true);
    //console.log('allPromoted', allPromoted)
    const tenNewest = data.data
      .sort((a, b) => new Date(b.attributes.created) - new Date(a.attributes.created))
      .slice(0, 10);
    //console.log('tenNewest', tenNewest);
    
    if (allPromoted.length === 5) {
      //console.log('allPromoted.length === 5');
      result = {...data, data: allPromoted}
    }
    
    else if (allPromoted.length > 5) {
      //console.log('allPromoted.length >= 5')
      const dernieresEntrees = allPromoted
        .sort((a, b) => new Date(b.attributes.created) - new Date(a.attributes.created))
        .slice(0, 5);
      result = {...data, data: dernieresEntrees}
    }
    
    else if (allPromoted.length < 5) {
      //console.log('allPromoted.length < 5')
      const nonPromotedCount = 5 - allPromoted.length;
      const nonEqualtoPromoted = [];
      for (let itemB of tenNewest) {
        let matchFound = false;
        for (let itemA of allPromoted) {
          if (itemB.attributes.drupal_internal__nid === itemA.attributes.drupal_internal__nid) {
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          nonEqualtoPromoted.push(itemB);
        }
      }
      const slicedNonEqualtoPromote = nonEqualtoPromoted.slice(0, nonPromotedCount);
      const itemsToShow = allPromoted.concat(slicedNonEqualtoPromote);
      
      result = {...data, data: itemsToShow}
    }
    
    setContent(result)
  }
  
  // render a temp skeloton
  if (!content || isLoading) { return (
    <aside className='mt-8' id='featured'>
      <h3 className='mb-10'>Nouveautés</h3>
      <ContentGrid 
        contentData={defautlContent} 
        hideItemCount
      />
    </aside>
  )}
  
  // Render a content grid
  if (content && !isLoading && !error) {
    return (
      <aside className='mt-8' id='featured'>
        <h3 className='mb-10'>Nouveautés</h3>
        <ContentGrid 
          contentData={content}
          error={error}
          hideItemCount
        />
      </aside>
    );
  }
}
