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
		
	dl > div {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5ch;}
		
	dt {
		font-weight: bold;}
		
	dd {
		overflow: hidden;
		a {
			display: block;
			max-width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;}}
		
	#voir-plus {
		&.hidden {
			display: none;}
		&.visible {
			display: block;}
	}
	
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
	"field_annees_de_production": null,
	"field_dates_de_production_estime": false,
	"field_descriptions_autres": [],
	"field_duree": null,
	"field_films_relies": [],
	"field_resume_de_l_institution_de": null,
	"field_site_visible": null,
	"field_titre_attribue": false,
	"field_consultants": [],
	"field_jeu": [],
	"field_pays_origine": [],
	"field_vedettes_matiere": []
}
	
export function FilmPage( {path} ) {
	const { film, isLoading, error } = useFetchUniqueFilm(defautlFilm, path)
	const [ primaryFields, setPrimaryFields ] = useState(null)
	const [ secondaryFields, setSecondaryFields ] = useState(null)
	const [ fieldConfigs, setFieldConfigs ] = useState(null)
	const [ voirPlusOpen, setVoirPlusOpen ] = useState(false)
	const [ relatedFilms, setRelatedFilms ] = useState(null)
	const { data : allFilms, isLoading : allFilmsIsLoading, error : allFilmsError } = useFetchAllFilms();
	
	function formatField(fieldSource, visibleIfEmpty) {
		
		// TODO : Check if taxonomy terms has links to view more related content
		if (fieldSource) {
			
			if (Array.isArray(fieldSource) && typeof fieldSource[0] === 'object' && "vid" in fieldSource[0]) {
				// if source is an array of taxonomy term, join terms
				const array = fieldSource.map( item => item.name )
				return array.join(', ') 
			} 
				
			else if (typeof fieldSource === 'object' && "vid" in fieldSource) {
				// if source is an object with just one taxonomy term
				return fieldSource.name 
			} 
			
			else if (typeof fieldSource === 'string' || typeof fieldSource === 'number') {
				// if source is a string, output it as is
				return fieldSource
			}
			
			if (Array.isArray(fieldSource) && typeof fieldSource[0] === 'string' ) {
				// if source is an array of string, join strings
				const array = fieldSource.map( item => item )
				return array.join(', ') 
			} 
			
			if (typeof fieldSource === 'object' && 'first' in fieldSource ) {
				// if source is an object from a drupal double string field (with a first key)
				const resultat = Object.values(fieldSource).reduce((acc, valeur) => acc + " - " + valeur);
				return resultat
			} 
			
			else if (typeof fieldSource === 'object' && "uri" in fieldSource) {
				// if source is a URL field
				return (<a href={fieldSource.uri} target='_blank' title={fieldSource.uri}>{fieldSource.uri}</a>)
			}
			
			else if (typeof fieldSource === 'object' && "processed" in fieldSource) {
				// si source is a rich html text field
				return (<div dangerouslySetInnerHTML={ { __html: fieldSource.processed } } />)
			}
				
			else if (visibleIfEmpty) {
				// if source is empty but must be presented anyway, output s.o.
				return 's.o.'
			}
		} 
	}
	
	// Format primary visibles fields for presentation
	useEffect(() => {
		if (film.id && !isLoading && !error && !primaryFields) {
			const _fields = {}
			
			// Standards fields //
			// Todo : function to loop in standards fields
			_fields.thematique = formatField(film.field_site_thematique, true)
			_fields.production = formatField(film.field_production, true)
			_fields.realisation = formatField(film.field_realisation,  true)
			_fields.langue = formatField(film.field_langue, true)
			_fields.consultants = formatField(film.field_consultants)
			_fields.pays = formatField(film.field_pays_origine, true)
			_fields.matiere = formatField(film.field_vedettes_matiere, true)
			
			// Special fields //
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
			
			setPrimaryFields(_fields)
		}
	}, [film, isLoading, error, primaryFields])
	
	// Format and aggregate Secondary "Voir plus" fields 
	useEffect(() => {
		if (primaryFields && !secondaryFields) {
			const _fields = {}
			//const _markup = null;
			
			_fields.numero = formatField(film.field_numero_identification)
			_fields.format = formatField(film.field_format)
			_fields.son = formatField(film.field_son)
			_fields.langues = formatField(film.field_langues)
			_fields.fabricant = formatField(film.field_fabricant)
			_fields.emulsion = formatField(film.field_emulsion)
			_fields.ratio = formatField(film.field_ratio)
			_fields.longueurM = formatField(film.field_longueur_metrage)
			_fields.longueurB = formatField(film.field_longueur_nombre_de_bobines)
			_fields.longueurP = formatField(film.field_longueur_pietage)
			_fields.institution = formatField(film.field_institution_detentrice)
			_fields.cote = formatField(film.field_cote)
			_fields.url = formatField(film.field_url)
			_fields.titres = formatField(film.field_titres_alternatifs)
			_fields.serie = formatField(film.field_titre_de_serie)
			_fields.commanditaires = formatField(film.field_commanditaires)
			_fields.distribution = formatField(film.field_distribution)
			_fields.scenario = formatField(film.field_scenario)
			_fields.narration = formatField(film.field_narration)
			_fields.photo = formatField(film.field_direction_de_la_photograph)
			_fields.creditSon = formatField(film.field_son_sound)
			_fields.musique = formatField(film.field_musique)
			_fields.montage = formatField(film.field_montage),
			_fields.effets = formatField(film.field_effets_speciaux_et_animati)
			_fields.jeu = formatField(film.field_jeu),
			_fields.participation = formatField(film.field_participation)
			_fields.autre = formatField(film.field_autres)
			_fields.anneesProd = formatField(film.field_annees_de_production)
			_fields.formatProd = formatField(film.field_format_de_production)
			_fields.lieux = formatField(film.field_lieux)
			_fields.personnes = formatField(film.field_personnes)
			_fields.commentaires = formatField(film.field_commentaires)
			
			setSecondaryFields(_fields)
		}
	}, [primaryFields, secondaryFields])
	
	useEffect(() => {
		if (secondaryFields && !fieldConfigs) {
			setFieldConfigs([{
				label: 'Numéro d\'identification', value: secondaryFields.numero },{
				label: 'Format', value: secondaryFields.format },{
				label: 'Son', value: secondaryFields.son },{
				label: 'Langues de la copie', value: secondaryFields.langues },{
				label: 'Fabricant de la pellicule', value: secondaryFields.fabricant },{
				label: 'Émulsion', value: secondaryFields.emulsion },{
				label: 'Ratio', value: secondaryFields.ratio},{
				label: 'Longueur : métrage', value : secondaryFields.longueurM },{
				label: 'Longueur : nombre de bobines', value : secondaryFields.longueurB },{
				label: 'Longueur : piétage', value : secondaryFields.longueurP },{
				label: 'Institution détentrice', value: secondaryFields.institution},{
				label: 'Cote', value: secondaryFields.cote},{
				label: 'URL institutionnelle', value: secondaryFields.url },{
				label: 'Titres alternatifs', value: secondaryFields.titres },{
				label: 'Titre de série', value: secondaryFields.serie },{
				label: 'Commanditaires', value: secondaryFields.commanditaires },{
				label: 'Distribution', value: secondaryFields.distribution },{
				label: 'Scénario', value: secondaryFields.scenario },{
				label: 'Narration', value: secondaryFields.narration },{
				label: 'Direction de la photographie', value: secondaryFields.photo },{
				label: 'Son (crédit)', value: secondaryFields.creditSon },{
				label: 'Musique', value: secondaryFields.musique },{
				label: 'Montage', value: secondaryFields.montage },{
				label: 'Effets spéciaux et animation', value: secondaryFields.effets}, {
				label: 'Jeu', value: secondaryFields.jeu },{
				label: 'Participation', value: secondaryFields.participation },{
				label: 'Autre', value: secondaryFields.autre },{
				label: 'Années de production', value: secondaryFields.anneesProd },{
				label: 'Format de production', value: secondaryFields.formatProd },{
				label: 'Lieux', value: secondaryFields.lieux },{
				label: 'Personnes', value: secondaryFields.personnes },{
				label: 'Commentaires', value: secondaryFields.commentaires }
			])
		}
	}, [secondaryFields, fieldConfigs])
	
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
	
	// Voir Plus click event handlers
	function voirPlusToggle() {
		console.log('Voir plus clicked');
		if (!voirPlusOpen) {
			setVoirPlusOpen(true)
			return
		}
		if (voirPlusOpen) {
			setVoirPlusOpen(false)
			return
		}
	}
	
	if (film === 'not-found') {
		return notFound()
	}
	
	if (error) {
		return (
			<main className='grid content-center text-center'>
				<p className='error'>Une erreur de chargement s'est produite. Vérifiez votre connexion internet, ou avisez-nous si le problème persite.</p>
			</main>
		)
	}
	
	return (
		<>
			<Main>
				{ primaryFields && primaryFields.vimeoSource ? (
					<div className='vimeo mb-10'>
						<iframe 
							src={primaryFields.vimeoSource} 
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
					{primaryFields && primaryFields.filmType ? primaryFields.filmType : '... chargement'}
				</p>
				
				<h1 className='mb-8'>{film.title}</h1>
				
				<p className='infos text-xl font-sans mb-4'>
					{film.field_annees_de_sortie ? film.field_annees_de_sortie : 's.o. (annee de sortie)'}
					{primaryFields && primaryFields.thematique ? <span> / {primaryFields.thematique}</span> : ''}
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
						<dd>{ primaryFields ? primaryFields.production : '...' }</dd>
					</div>
					<div>
						<dt>Réalisation: </dt>
						<dd>{ primaryFields ? primaryFields.realisation : '...' }</dd>
					</div>
					{ primaryFields && primaryFields.consultants ? (
						<div>
							<dt>Consultants: </dt>
							<dd>{primaryFields.consultants}</dd>
						</div>
					) : '' }
					<div>
						<dt>Année de sortie: </dt>
						<dd>{film.field_annees_de_sortie ? film.field_annees_de_sortie : 's.o.'}</dd>
					</div>
					<div>
						<dt>Pays d’origine: </dt>
						<dd>{primaryFields ? primaryFields.pays : '...'}</dd>
					</div>
					<div>
						<dt>Langues: </dt>
						<dd>{ primaryFields ? primaryFields.langue : '...' }</dd>
					</div>
					<div>
						<dt>Durée: </dt>
						<dd>{ film.field_duree ? film.field_duree : '...' }</dd>
					</div>
					<div>
						<dt>Vedettes-matières sujet: </dt>
						<dd>{ primaryFields ? primaryFields.matiere : '...' }</dd>
					</div>
				</dl>
				
				<button className='button mb-6' onClick={voirPlusToggle}>Voir {voirPlusOpen ? 'moins -' : 'plus +'} </button>
				<dl id='voir-plus' className={ !voirPlusOpen ? `hidden mb-6` : `visible mb-6`}>
					{ fieldConfigs ? fieldConfigs.map( (field, index) => {
						return field.value ? (
							<div key={index}>
								<dt>{field.label}: </dt>
								<dd>{field.value}</dd>
							</div> 
						) : ''
					}) : '...' }
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