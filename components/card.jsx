  'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Icone from '../components/icone'

const CloseIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
      <line className="close-line" x1="15" y1="0" x2="0" y2="15"/>
      <line className="close-line" x1="0" y1="0" x2="15" y2="15"/>
    </svg>
  )
};

const zoomFactor = 1.75;

const Styled = styled.div`
  --padding: 1.25rem;
  
  .close-line {
    fill: none;
    stroke: #000;
    stroke-miterlimit: 10;}
  
  display: grid;
  container-type: inline-size;
  overflow: hidden;
  
  .card__inner {
    display: grid;
    grid-template: 1fr / 1fr;
    margin-bottom: var(--cardMarge);
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
    height: 100%;
    object-fit: none;}
  
  .card__infos {
    grid-area: 1 / 1;
    position: relative;
    display: grid;}
  
  .card__link {
    display: block;
    padding: var(--padding);
    display: grid;
    align-content: space-between;
    break-inside: avoid-column;}
    
  .card__close {
    position: absolute;
    inset: 5px 5px auto auto;
    width: 1rem;
    height: 1rem;}
    
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
    
  @media (max-width: 500px) {
    h2 {
      font-size: var(--text-xl)}
    .card__footer {
      font-size: 0.9rem}
  }
  
  @media (pointer: fine) {
    .card__close {
      display: none;}}
`;

export function Card({contentObj, contentType, shouldwait}) {
  const gsapCardContainer = useRef()
  const imageElemRef = useRef()
  gsap.registerPlugin(useGSAP);
  
  let pathAlias = '#'
  if (contentType === 'node--film') {
    pathAlias = contentObj.path ? `/film${contentObj.path.alias}` : '#'
  } 
  
  if (contentType === 'node--article') {
    pathAlias = contentObj.path ? `/document${contentObj.path.alias}` : '#'
  }
  
  const photogrammeUrl = contentObj && contentObj.filmImageUrl ? `https://database.cadavrexquis.ca${contentObj.filmImageUrl}` : ''
  
  let verticalFocus = '';
  if (contentObj.styles && contentObj.styles.focus) {
    if (contentObj.styles.focus.includes('top')) {
      verticalFocus = 'center 25%'
    } else if (contentObj.styles.focus.includes('bottom')) {
      verticalFocus = 'center 70%'
    }
  }
  
  // GSAP
  const gsapCardInstance = useGSAP(() => {
    if (contentType !== 'squeletton') {
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
      
      const closeBtn = gsapCardContainer.current.querySelector('.card__close');
      gsapCardContainer.current.addEventListener("click", handleMouseLeave);
      
    }
  }, { dependencies: [imageElemRef, contentType], scope: gsapCardContainer })
  
  return (
    <Styled
      className='card'
      style={ contentObj.styles ? {minHeight: contentObj.styles.elemHeight} : {}}
      ref={gsapCardContainer}
    >
      <div className='card__inner' data-cardindex={contentObj.filmIndex}>
        <div 
          className='card__infos'
          style={ contentObj.styles ? {background: contentObj.styles.couleur} : {background: 'var(--color-rouge)'}}
        >
          <a className='card__link' href={ pathAlias }>
            <h2>{contentObj.title}</h2>
            <div className='card__footer'>
              <p>{contentObj.field_annees_de_sortie}<br/>
              {contentObj.filmThematiques ? contentObj.filmThematiques.noms : ''}</p>
              {contentObj.field_site_collection ? (
                <div className='card__icone'>
                  {contentType === 'node--film' && contentObj.field_site_collection === 'collection' ? 
                    <Icone nom='collection' title='Film de la collection' />
                  : ''}
                  {contentObj.field_site_collection === 'cadavre_exquis' ? 
                    <Icone nom='remontage' title='Film de remontage' />              
                  : ''}
                </div>
              ) : ''}
              {contentType === 'node--article' ?
                <div className='card__icone'>
                  <Icone nom='document' title='Document' />
                </div>
              : ''}
            </div>
          </a>
          
          { contentType !== 'squeletton' ?
            <button className="card__close">
              <CloseIcon />
            </button>
          : ''}
        </div>
        <div 
          className='card__image'
          ref={imageElemRef}
        >
          { photogrammeUrl && contentObj.styles ? (
            <div 
              className='image-wrapper'
              style={{transformOrigin: verticalFocus }}
            >
              <Image 
                src={photogrammeUrl}
                width={400}
                height={700}
                alt=""
                style={{ objectPosition: contentObj.styles.focus }}
              />
            </div>
          ): ''}
        </div>
      </div>
    </Styled>
  );
};