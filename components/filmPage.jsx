'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"
import { useLoadTaxonomies } from '../lib/fecthDrupalData'
import { findVocabularyTermNames } from '../lib/utils.ts'

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
  "field_annees_de_sortie": '... chargement',
  "title": '\u00A0',
  "field_descriptions_cadavrexquis": [{processed: ''}],
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
  "field_site_collection": null,
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
  "field_langue": [],
  "field_langues": [],
  "field_montage": [],
  "field_musique": [],
  "field_narration": [],
  "field_participation": [],
  "field_pays_origine": [],
  "field_personnes": [],
  "field_production": [],
  "field_ratio": null,
  "field_realisation": [],
  "field_scenario": [],
  "field_site_photogramme": {},
  "field_site_thematique": [],
  "field_son": null,
  "field_son_sound": [],
  "field_type_d_image": null,
  "field_vedettes_matiere": []
}

let realisation = ''
let langues = ''
let thematique = ''
let vimeoSource = ''

export function FilmPage( {path} ) {
  const [ film, setFilm ] = useState(defautlFilm)
  const { data: taxonomyData, loading, error } = useLoadTaxonomies()
  
  // Handle loading state
  if (loading) {
    console.log('useLoadTaxonomies() loading...')
  }
  
  // Handle error state
  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }
  
  // Fetch film node id Drupal DB 
  async function fetchFilm() {
    console.log('Fetching film node data...')
    // fetch tous les nodes films avec seulement leur path alias
    const fetchedData = await drupal.getResourceCollection("node--film", {
      params: {
        "fields[node--film]": "drupal_internal__nid,path"
      },
      deserialize: false,
    })
    
    // trouver le nid du node qui a le path.alias === au prop path
    const node = await fetchedData.data.filter((node) => node.attributes.path.alias === `/${path}`);
    
    // get le node complet avec le nid  
    const filmFetchedData = await drupal.getResource(
      "node--film",
      node[0].id
    )
    
    if (filmFetchedData.type) {
      setFilm(filmFetchedData);
    }
  }
  
  if (!film.type) {
    fetchFilm();
  } 
  
  if (film.type && taxonomyData) {
    // console.log('film.field x output', field_url_interne)
    
    realisation = findVocabularyTermNames(film.field_realisation, taxonomyData.realisation)
    langues = findVocabularyTermNames(film.field_langue, taxonomyData.langue)
    thematique = findVocabularyTermNames(film.field_site_thematique, taxonomyData.site_categorie)
    
    if (film.field_url_interne.length && film.field_url_interne[0] !== null) {
      function getVimeoId(url) {
        // Check if input is valid
        if (!url || typeof url !== 'string') {
          throw new Error('Invalid input: URL must be a non-empty string');
        }
    
        // Match numbers after .com/
        const match = url.match(/\.com\/(\d+)/);
        
        if (!match) {
          throw new Error('Invalid Vimeo URL format');
        }
        
        return match[1];
      }    
      const vimeoId = getVimeoId(film.field_url_interne[0].uri)
      vimeoSource = `https://player.vimeo.com/video/${vimeoId}?badge=0&amp;byline=false&amp;title=false&amp;autopause=0&amp;player_id=0&amp;app_id=58479`
    }
  }
  
  return (
    <>
      <Styled>
        { vimeoSource ? (
          <div className='vimeo mb-6'>
            <iframe src={vimeoSource} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title=""></iframe>
          </div>
        ): ( <div className='vimeo mb-6 loading'><span className='text-6xl'>...</span></div>)}
        <script src="https://player.vimeo.com/api/player.js"></script>
        <p className='type text-xl mb-6'>{film.field_site_collection}</p>
        <h1 className='mb-6'>{film.title}</h1>
        <p className='infos text-xl font-sans mb-6'>
          {film.field_annees_de_sortie}
          {taxonomyData && thematique ? (<> / <i>{thematique}</i></>) : ''}
        </p>
        <div 
          dangerouslySetInnerHTML={ film.field_descriptions_cadavrexquis.length ? { __html: film.field_descriptions_cadavrexquis[0].processed } : {__html: '! Le champ « Descriptions et résumés de l’équipe de Cadavre exquis » est vide'}}
          className='texte text-lg font-serif mb-6'
        ></div>
        <dl className='mb-6'>
          <div><dt>Réalisation :</dt> <dd>{ taxonomyData ? realisation : '...' }</dd></div>
          <div><dt>Langues :</dt> <dd>{ taxonomyData ? langues : '...' }</dd></div>
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
