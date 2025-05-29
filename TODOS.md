## TODOS 

- Header : Sticky

- Nav et footer : rassembler en un seul composant ?

- thematiqueFilter : chemin d'url pour chacune des thematiques

- filmPage : intégrer les champs optionels pour la section "voir plus" 

- Page 404 pour les paths de films et en général


### Optimisations
- Vérifier si l'appel au fichier drupal.ts est redondant dans les différents fichiers de hook et de composant
- Optimiser les images avec le composant Image de Next https://nextjs.org/docs/app/getting-started/images
- Utils useFetchAllFilms : intégrer un objet global par cache qui réuni le timestamp et les valeurs.
- Utils fieldTerm : accepter un nombre représentant l'id.
- FilmGrille : renommer les states et autres pour plus de clareté. Comme :
	- SelectedThematique = SelectedThematiqueNom
	- prefix underscore pour les fictions et variables internes

