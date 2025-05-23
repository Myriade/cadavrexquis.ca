'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import Script from 'next/script'
import { drupal } from "/lib/drupal.ts"
import { useFetchFilmsPaths, useLoadTaxonomies } from '../lib/fecthDrupalData'
import { findVocabularyTermNames, getVimeoId } from '../lib/utils.ts'


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

  .type, .infos {
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
  "field_url_interne": [{uri: null}],
  "field_site_collection": null,
  "title": '\u00A0',
  "field_annees_de_sortie": '... chargement',
  "field_site_thematique": [],
  "field_descriptions_cadavrexquis": [{processed: ''}],
  "field_realisation": [],
  "field_langue": [],
  "type": null,
  "id": null,
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
  const { data: taxonomyData, loading, error: taxoError } = useLoadTaxonomies()
  
  let { vimeoSource, type, thematique, realisation, langues } = ''
  
  // Fetch film node id Drupal DB
  useEffect(() => {
    if (allFilmsPaths && !film.type) {
      console.log('Fetching film node data')
      async function fetchFilm() {
        // trouver le nid du node qui a le path.alias === path prop
        const node = await allFilmsPaths.data.filter( node => node.attributes.path.alias === `/${path}`);
        
        // get le node complet avec le nid  
        const filmData = await drupal.getResource(
          "node--film",
          node[0].id
        )
        
        if (filmData.type) {
          setFilm(filmData);
        }
      }
      fetchFilm();
    }
  }, [allFilmsPaths, film])
  
  // Process taxonomies and other data for presentation
  if (film.type && taxonomyData) {
    // console.log('film.field x output', field_url_interne)
    
    realisation = findVocabularyTermNames(film.field_realisation, taxonomyData.realisation)
    langues = findVocabularyTermNames(film.field_langue, taxonomyData.langue)
    thematique = findVocabularyTermNames(film.field_site_thematique, taxonomyData.site_categorie)
    
    if (film.field_url_interne.length && film.field_url_interne[0] !== null) {  
      const vimeoId = getVimeoId(film.field_url_interne[0].uri)
      vimeoSource = `https://player.vimeo.com/video/${vimeoId}?badge=0&amp;byline=false&amp;title=false&amp;autopause=0&amp;player_id=0&amp;app_id=58479`
    }
    
    if (film.field_site_collection) {
      if (film.field_site_collection === 'collection') {
        type = 'Collection'
      } else if (film.field_site_collection === 'cadavre_exquis') {
        type= 'Cadavre exquis'
      }
    }
  }
  
  return (
    <>
      <Styled>
        { vimeoSource ? (
          <div className='vimeo mb-6'>
            <iframe src={vimeoSource} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title=""></iframe>
            <Script src="https://third-party-script.js"></Script>
          </div>
        ): ( <div className='vimeo mb-6 loading'><span className='text-6xl'>...</span></div>)}
        <p className='type text-xl mb-6'>{type ? type : ''}</p>
        <h1 className='mb-6'>{film.title}</h1>
        <p className='infos text-xl font-sans mb-6'>
          {film.field_annees_de_sortie}
          {thematique ? (<> / <i>{thematique}</i></>) : ''}
        </p>
        <div 
          dangerouslySetInnerHTML={ film.field_descriptions_cadavrexquis.length ? { __html: film.field_descriptions_cadavrexquis[0].processed } : {__html: '! Le champ « Descriptions et résumés de l’équipe de Cadavre exquis » est vide'}}
          className='texte text-lg font-serif mb-6'
        ></div>
        <dl className='mb-6'>
          <div><dt>Réalisation :</dt> <dd>{ realisation ? realisation : '...' }</dd></div>
          <div><dt>Langues :</dt> <dd>{ langues ? langues : '...' }</dd></div>
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
