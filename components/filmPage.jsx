'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { notFound } from 'next/navigation'
import { useFetchUniqueFilm, useFetchAllFilms } from '../lib/fecthDrupalData'
import { getVimeoId, findTermName } from '../lib/utils.ts'

import { FilmsGrille } from '../components/filmsGrille'
import Icone from '../components/icone'

const Main = styled.main`
	.vimeo {
		background-color: black;
		transition: all 0.5s;}
			
	.vimeo.loading {
		background-color: #777;
		display: grid;
		align-content: center;
		justify-content: center;
		color: white;}
		
	h1 {
		max-width: 35ch;}

	.film-type, .infos {
		color: var(--color-rouge);}
		
	.film-type {
		text-transform: uppercase;
		margin-bottom: 0.7em;
		display: flex;
		gap: 0.5em;
		align-items: end;}
	
	i {
		width: 1.35em;
		padding-bottom: 0.35em;}
		
	.description {
		p {
			margin-bottom: 1em}}
		
	dt, dd {
		display: inline;}
		
	dt {
		font-weight: bold;}
	
	@container (min-width: 250px) { }
		
	@container (min-width: 500px) { }
	
	@container (min-width: 750px) { }
	
	@container (min-width: 1000px) { }
	
`;

const Curated = styled.aside``

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
	"field_films_relies": [],
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
	const { film, isLoading, error } = useFetchUniqueFilm(defautlFilm, path)
	const [ processedFields, setProcessedFields ] = useState(null)
	const [ relatedFilms, setRelatedFilms ] = useState(null)
	const { data : allFilms, isLoading : allFilmsIsLoading, error : allFilmsError } = useFetchAllFilms();
	
	// Process fields for presentation
	useEffect(() => {
		if (film.id && !isLoading && !error && !processedFields) {
			const _fields = {}
			function joinTerms(fieldSource, fieldOutput, optional) {
				if (fieldSource.length) {
					const array = fieldSource.map( item => item.name )
					_fields[fieldOutput] = array.join(', ')
				} else if (!optional) {
					_fields[fieldOutput] = 's.o.'
				}
				// TODO : optional fields pourla section "voir plus"
			}
			
			// Taxonomies
			joinTerms(film.field_site_thematique, 'thematique')
			joinTerms(film.field_production, 'production')
			joinTerms(film.field_realisation, 'realisation')
			joinTerms(film.field_langues, 'langues')
			joinTerms(film.field_consultants, 'consultants', true)
			joinTerms(film.field_pays_origine, 'pays')
			joinTerms(film.field_vedettes_matiere, 'matiere')
			
			// Vimeo
			if (film.field_url_interne.length && film.field_url_interne[0] !== null) {  
				const vimeoId = getVimeoId(film.field_url_interne[0].uri)
				_fields.vimeoSource = `https://player.vimeo.com/video/${vimeoId}&amp;end_screen=empty&amp;badge=0&amp;byline=false&amp;title=false&amp;autopause=0&amp;player_id=0&amp;app_id=58479`
			}
			
			// Collection filmType
			if (film.field_site_collection === 'collection') {
				_fields.filmType = 'Collection'
			} else if (film.field_site_collection === 'cadavre_exquis') {
				_fields.filmType = 'Cadavre exquis'
			} else {
				_fields.filmType = 's.o.'
			}
			
			setProcessedFields(_fields)
		}
	}, [film, isLoading, error, processedFields])
	
	// Films reliés, À voir aussi
	useEffect(() => {
		if (film.id && film.field_films_relies.length && !relatedFilms && !allFilmsIsLoading && allFilms) {
			
			const films = allFilms.data.filter(item => 
				film.field_films_relies.some(selection => 
					selection.drupal_internal__nid === item.attributes.drupal_internal__nid
				)
			);
			
			setRelatedFilms({
				...allFilms,
				data: films
			});
		}
	}, [film, relatedFilms, allFilmsIsLoading, allFilms ])
	
	if (film === 'not-found') {
		return notFound()
	}
	
	if (error) {
		return (
			<main className='grid content-center text-center'>
				<p className='error'>Une erreur de chargement sest produite. Vérifiez votre connexion internet, ou avisez-nous si le problème persite.</p>
			</main>
		)
	}
	
	return (
		<>
			<Main>
				{ processedFields && processedFields.vimeoSource ? (
					<div className='vimeo mb-10'>
						<iframe 
							src={processedFields.vimeoSource} 
							frameBorder="0" 
							allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
							title=""
							className='w-full min-h-60 md:min-h-80 lg:min-h-[65vh]'
						></iframe>
					</div>
				) : ( 
					<div className='vimeo min-h-60 md:min-h-80 lg:min-h-[65vh] mb-6 loading'><span className='text-6xl'>...</span></div>
				)}
				
				<p className='film-type text-xl mb-6'>
					{film.field_site_collection === 'collection' ? 
						<Icone nom='collection' couleur='var(--color-rouge)' />
					: ''}
					{film.field_site_collection === 'cadavre_exquis' ? 
						<Icone nom='remontage' couleur='var(--color-rouge)' />
					: ''}
					{processedFields && processedFields.filmType ? processedFields.filmType : '... chargement'}
				</p>
				
				<h1 className='mb-8'>{film.title}</h1>
				
				<p className='infos text-xl font-sans mb-4'>
					{film.field_annees_de_sortie ? film.field_annees_de_sortie : 's.o. (annee de sortie)'}
					{processedFields && processedFields.thematique ? <span> / {processedFields.thematique}</span> : ''}
				</p>
				
				<div 
					dangerouslySetInnerHTML={ film.field_descriptions_cadavrexquis.length ? { 
						__html: film.field_descriptions_cadavrexquis[0].processed 
					} : null}
					className='description text-lg font-serif mb-6'
				></div>
				<div 
					dangerouslySetInnerHTML={ film.field_resume_de_l_institution_de ? { 
						__html: film.field_resume_de_l_institution_de.processed 
					} : null}
					className='description text-lg font-serif mb-6'
				></div>
				
				
				<dl className='mb-6'>
					<div>
						<dt>Production: </dt>
						<dd>{ processedFields ? processedFields.production : '...' }</dd>
					</div>
					<div>
						<dt>Réalisation: </dt>
						<dd>{ processedFields ? processedFields.realisation : '...' }</dd>
					</div>
					{ processedFields && processedFields.consultants ? (
						<div>
							<dt>Consultants: </dt>
							<dd>{processedFields.consultants}</dd>
						</div>
					) : '' }
					<div>
						<dt>Année de sortie: </dt>
						<dd>{film.field_annees_de_sortie ? film.field_annees_de_sortie : 's.o.'}</dd>
					</div>
					<div>
						<dt>Pays d’origine: </dt>
						<dd>{processedFields ? processedFields.pays : '...'}</dd>
					</div>
					<div>
						<dt>Langues: </dt>
						<dd>{ processedFields ? processedFields.langues : '...' }</dd>
					</div>
					<div>
						<dt>Durée: </dt>
						<dd>{ film.field_duree ? film.field_duree : 's.o.' }</dd>
					</div>
					<div>
						<dt>Vedettes-matières sujet: </dt>
						<dd>{ processedFields ? processedFields.matiere : '...' }</dd>
					</div>
				</dl>
				
			</Main>
			
			{ relatedFilms ?
				<Curated className='mb-6'>
					<hr className='mb-6' />
					<h2>À voir aussi</h2>
					<FilmsGrille 
						allFilmsData={relatedFilms}
						error={allFilmsError}
						isLoading={allFilmsIsLoading}
						isRelated
					>
					</FilmsGrille>
					
				</Curated>
			: ''}
		</>
	);
};


/* Pour phase 2 : bouton Voir +
<button className='button'>Voir plus + </button>
<dl className='mb-6'>
	<dd>[ Au clic sur voir +, les autres champs s&apos;afficheront au cas par cas, visibles seulement si contient une donné ]</dd>
</dl> 
*/