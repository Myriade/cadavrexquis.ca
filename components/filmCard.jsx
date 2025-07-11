'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Icone from '../components/icone'

const zoomFactor = 1.75;

const Styled = styled.div`
  --padding: 1.25rem;
  
  display: grid;
  container-type: inline-size;
  overflow: hidden;
  
  .card__inner {
    display: grid;
    grid-template: 1fr / 1fr;
    margin-bottom: var(--ficheMarge);
    overflow: hidden;}
  
  .card__image {
    grid-area: 1 / 1;
    position: relative;
    overflow: hidden;}
    
  .image-wrapper {
    position: absolute;
    inset: 0;
    transform: scale(${zoomFactor});}
  
  .image-wrapper > img {
    position: absolute;
    width: 100%;
    height: 90%;
    object-fit: none;}
  
  .card__infos {
    grid-area: 1 / 1;
    padding: var(--padding);
    display: grid;
    align-content: space-between;
    break-inside: avoid-column;}
    
  .card__footer {
    display: grid;
    gap: 0.5em;
    grid-template-columns: 1fr auto;
    align-items: end;
    font-size: 1rem;
    line-height: 1.2;}
    
  .card__icone {
    padding-block: 0.2em;
    i {
      display: block;
      width: 1.6em;
    }
  }
    
  h2 {
    font-weight: normal;
    text-wrap: balance;
    word-break: normal;
    max-width: 21ch;
    overflow: hidden;
    text-overflow: ellipsis;}
  
  a:hover {
    text-decoration: none;}
`;

export function FilmCard({filmdata, shouldwait}) {
  const gsapCardContainer = useRef()
  const imageElemRef = useRef()
  gsap.registerPlugin(useGSAP);
  
  const filmAlias = filmdata.path ? `/film${filmdata.path.alias}` : '#'
  const photogrammeUrl = filmdata.filmImageUrl ? `https://database.cadavrexquis.ca${filmdata.filmImageUrl}` : ''
  
  // GSAP
  const gsapCardInstance = useGSAP(() => {
    const imageElem = imageElemRef.current
    const waitTime = parseInt(shouldwait)
    
    let hide = gsap.to(imageElem, {
      yPercent: 100,
      y: 'bottom',
      duration: 0.4,
      ease: 'none',
    });
    hide.pause()
    
    const handleMouseEnter = (e) => {
      if ( e ) e.preventDefault()
      hide.play()
    };
    
    const handleMouseLeave = () => {
      hide.reverse()
    };
    
    setTimeout( () => {
      if (gsapCardContainer.current && imageElem) {
        gsapCardContainer.current.addEventListener("mouseover", () => handleMouseEnter());
        imageElem.addEventListener("touchstart", (e) => handleMouseEnter(e));
        gsapCardContainer.current.addEventListener("mouseout", handleMouseLeave);
      }
    }, waitTime)
  }, { dependencies: [imageElemRef], scope: gsapCardContainer })
    
  if (!filmdata) {
    return (
      <Styled className='card'>
        <div className='card__inner'>
          <div className='card__infos'>
            <h2>... chargement</h2>
          </div>
        </div>
      </Styled>
    )
  }
  
  return (
    <Styled
      className='card'
      style={ filmdata.styles ? {minHeight: filmdata.styles.elemHeight} : {}}
      ref={gsapCardContainer}
    >
      <div className='card__inner' data-cardindex={filmdata.filmIndex}>
        <a 
          className='card__infos'
          style={ filmdata.styles ? {background: filmdata.styles.couleur} : {background: 'var(--color-rouge)'}}
          href={ filmAlias }
        >
          <h2>{filmdata.title}</h2>
          <div className='card__footer'>
            <p>{filmdata.field_annees_de_sortie}<br/>
            {filmdata.filmThematiques ? filmdata.filmThematiques.noms : ''}</p>
            {filmdata.field_site_collection ? (
              <div className='card__icone'>
              {filmdata.field_site_collection === 'collection' ? 
                <Icone nom='collection' title='Film de la collection' />
              : ''}
              {filmdata.field_site_collection === 'cadavre_exquis' ? 
                <Icone nom='remontage' title='Film de remontage' />              
              : ''}
              </div>
            ) : ''}
          </div>
        </a>
        <div 
          className='card__image'
          ref={imageElemRef}
        >
          { photogrammeUrl && filmdata.styles ? (
            <div className='image-wrapper'>
              <Image 
                src={photogrammeUrl}
                width={400}
                height={700}
                alt=""
                style={{ objectPosition: filmdata.styles.focus }}
              />
            </div>
          ): ''}
        </div>
      </div>
    </Styled>
  );
};