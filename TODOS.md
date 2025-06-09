## TODOS 

- Nav et footer : rassembler en un seul composant ?

- Header : 
	- Sticky; 
	- Réparer z-index conflit avec filmcards;
	- Remplacer logo temp par svg

- Pied de page 

- Version mobile 

- Optimiser les images avec le composant Image de Next https://nextjs.org/docs/app/getting-started/images


### Optimisations
- Vérifier si l'appel au fichier drupal.ts est redondant dans les différents fichiers de hook et de composant
- Utils useFetchAllFilms : intégrer un objet global par cache qui réuni le timestamp et les valeurs.
- Utils fieldTerm : accepter un nombre représentant l'id.
- FilmGrille : renommer les states et autres pour plus de clareté. Comme :
	- SelectedThematique = SelectedThematiqueNom
	- prefix underscore pour les fonctions et variables internes

### Phase 2
- thematiqueFilter : chemin d'url pour chacune des thématiques
- filmPage : intégrer les champs optionnels pour la section "voir plus" 