## TODOS 

- Permettre 2 s/ries de chiffres dans l'url Vimeo

- FAIT (75%) remplacer des variables globales let par des useRef pour éviter les re-renders?
Surtout celles qui sont utilisées comme condition à d'autre exécution.
Comme certains appels à taxonomie. 

- Vérifier si l'appel au fichier drupal.ts est redondant dans les différents fichiers de hook et de composant

- FilmGrille : renommer les states et autres pour plus de clareté. Comme :
  - SelectedThematique = SelectedThematiqueNom
	- prefix underscore pour les fictions et variables internes 
	
- Utils findVocabularyTermNames : accepter un nombre représentant l'id.