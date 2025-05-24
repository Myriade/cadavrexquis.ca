'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import Script from 'next/script'
import { drupal } from "/lib/drupal.ts"
import { useFetchFilmsPaths } from '../lib/fecthDrupalData'
import { getVimeoId } from '../lib/utils.ts'


const Styled = styled.section`

  .vimeo {
    background-color: black;
    transition: all 0.5s;
    min-height: 500px;}
      
  .vimeo.loading {
    background-color: #777;
    display: grid;
    align-content: center;
    justify-content: center;
    color: white;}
  
  .vimeo iframe {
    min-height: 500px;
    width: 100%;}

  .film-type, .infos {
    color: var(--color-rouge);}
    
  dt, dd {
    display: inline;}
  
  @container (min-width: 250px) { }
    
  @container (min-width: 500px) { }
  
  @container (min-width: 750px) { }
  
  @container (min-width: 1000px) { }
  
`;

const Curated = styled.section``

const defautlFilm = {
  "id": null,
  "field_url_interne": [{uri: null}],
  "field_site_collection": null,
  "title": '\u00A0',
  "field_annees_de_sortie": '\u00A0',
  "field_site_thematique": [],
  "field_descriptions_cadavrexquis": [{processed: '\u00A0'}],
  "field_realisation": [],
  "field_langue": [],
  "drupal_internal__nid": null,
  "path": {},
  "created": null,
  "changed": null,
  "field_annees_de_production": null,
  "field_commentaires": null,
  "field_cote": null,
  "field_credits_notes": null,
  "field_dates_de_production_estime": false,
  "field_descriptions_autres": [],
  "field_duree": null,
  "field_edge_code": null,
  "field_emplacements": [],
  "field_liens_avec_d_autres_films": [],
  "field_lieux": [],
  "field_longueur_metrage": null,
  "field_longueur_nombre_de_bobines": null,
  "field_longueur_pietage": null,
  "field_notes": null,
  "field_numero_identification": null,
  "field_resume_de_l_institution_de": null,
  "field_site_visible": null,
  "field_statut_legal": null,
  "field_titres_alternatifs": [],
  "field_titre_attribue": false,
  "field_titre_de_serie": [],
  "field_traitement": null,
  "field_autres": [],
  "field_commanditaires": [],
  "field_consultants": [],
  "field_direction_de_la_photograph": [],
  "field_distribution": [],
  "field_effets_speciaux_et_animati": [],
  "field_emulsion": null,
  "field_fabricant": null,
  "field_format": null,
  "field_format_de_production": [],
  "field_institution_detentrice": null,
  "field_jeu": [],
  "field_langues": [],
  "field_montage": [],
  "field_musique": [],
  "field_narration": [],
  "field_participation": [],
  "field_pays_origine": [],
  "field_personnes": [],
  "field_production": [],
  "field_ratio": null,
  "field_scenario": [],
  "field_site_photogramme": {},
  "field_son": null,
  "field_son_sound": [],
  "field_type_d_image": null,
  "field_vedettes_matiere": []
}
  
export function FilmPage( {path} ) {
  const [ film, setFilm ] = useState(defautlFilm)
  const { data : allFilmsPaths, isLoading, error } = useFetchFilmsPaths(defautlFilm)
  
  // Fetch film node id in Drupal DB
  useEffect(() => {
    if (allFilmsPaths && !film.id) {
      console.log('Fetching film node data')
      async function fetchFilm() {
        // trouver le nid du node qui a le path.alias === path prop
        const node = await allFilmsPaths.data.filter( node => node.attributes.path.alias === `/${path}`);
        
        // get le node complet avec le nid  
        const filmData = await drupal.getResource(
          "node--film",
          node[0].id,
          {
            params: {
              include: "field_site_thematique,field_realisation,field_langue"
            }
          }
        )
        
        if (filmData.id) {
          setFilm(filmData);
        }
      }
      fetchFilm();
    }
  }, [allFilmsPaths, film])
  
  // Process fields for presentation
  const _fields =  { vimeoSource: null, filmType: null, thematique:null, realisation:null, langues:null }
  if (film.id) {
    // console.log(film)
    
    function joinTerms(fieldSource, fieldOutput) {
      if (fieldSource) {
        const array = fieldSource.map( item => item.name )
        _fields[fieldOutput] = array.join(', ')
      }
    }
    
    joinTerms(film.field_site_thematique, 'thematique')
    joinTerms(film.field_realisation, 'realisation')
    joinTerms(film.field_langues, 'langues')
    
    // Vimeo
    if (film.field_url_interne.length && film.field_url_interne[0] !== null) {  
      const vimeoId = getVimeoId(film.field_url_interne[0].uri)
      _fields.vimeoSource = `https://player.vimeo.com/video/${vimeoId}?badge=0&amp;byline=false&amp;title=false&amp;autopause=0&amp;player_id=0&amp;app_id=58479`
    }
    
    // Collection filmType
    if (film.field_site_collection === 'collection') {
      _fields.filmType = 'Collection'
    } else if (film.field_site_collection === 'cadavre_exquis') {
      _fields.filmType = 'Cadavre exquis'
    } else {
      _fields.filmType = 's.o.'
    }
  }
  
  return (
    <>
      <Styled>
        { _fields.vimeoSource ? (
          <div className='vimeo mb-6'>
            <iframe src={_fields.vimeoSource} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title=""></iframe>
            <Script src="https://third-party-script.js"></Script>
          </div>
        ) : ( 
          <div className='vimeo mb-6 loading'><span className='text-6xl'>...</span></div>
        )}
        
        <p className='film-type text-xl mb-6'>
          {_fields.filmType ? _fields.filmType : '... chargement'}
        </p>
        
        <h1 className='mb-6'>{film.title}</h1>
        
        <p className='infos text-xl font-sans mb-6'>
          {film.field_annees_de_sortie ? film.field_annees_de_sortie : 's.o.'}
          {_fields.thematique ? (
            <> / <i>{_fields.thematique}</i></>
          ) : ''}
        </p>
        
        <div 
          dangerouslySetInnerHTML={ film.field_descriptions_cadavrexquis.length ? { 
            __html: film.field_descriptions_cadavrexquis[0].processed 
          } : { 
            __html: '! Le champ « Descriptions et résumés de l’équipe de Cadavre exquis » est vide'
          }}
          className='texte text-lg font-serif mb-6'
        ></div>
        
        <dl className='mb-6'>
          <div>
            <dt>Réalisation : </dt>
            <dd>{ _fields.realisation ? _fields.realisation : 's.o.' }</dd>
          </div>
          <div>
            <dt>Langues : </dt>
            <dd>{ _fields.langues ? _fields.langues : 's.o.' }</dd>
          </div>
        </dl>
      </Styled>
      
      <Curated className='mb-6'>
        <hr className='mb-6' />
        <h2>À voir aussi</h2>
        <p><i>[ Fiches d&apos;autres films liés (curation) ]</i></p>
      </Curated>
    </>
  );
};
