## TODOS 

- Page film : thematique pas en italic; Consultants: retirer si aucune donnée (pas de s.o. pour celui-là)

- Iconographie 

- Nav et footer : rassembler en un seul composant ?

- Header : Sticky; Réparer z-index conflit avec filmcards

- Pied de page 

- Version mobile 

- Page 404 pour les paths de films et en général


### Optimisations
- Vérifier si l'appel au fichier drupal.ts est redondant dans les différents fichiers de hook et de composant
- Optimiser les images avec le composant Image de Next https://nextjs.org/docs/app/getting-started/images
- Utils useFetchAllFilms : intégrer un objet global par cache qui réuni le timestamp et les valeurs.
- Utils fieldTerm : accepter un nombre représentant l'id.
- FilmGrille : renommer les states et autres pour plus de clareté. Comme :
	- SelectedThematique = SelectedThematiqueNom
	- prefix underscore pour les fonctions et variables internes

### Phase 2
- thematiqueFilter : chemin d'url pour chacune des thématiques
- filmPage : intégrer les champs optionnels pour la section "voir plus" 