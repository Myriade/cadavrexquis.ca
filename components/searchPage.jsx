import { FilmsGrille } from '../components/filmsGrille';

export async function SearchPage({searchSlug}) {
  
  return (
    <>
      <h1>Résultats pour « {searchSlug} »</h1>
      <FilmsGrille 
        lazyload 
        searchTerm={searchSlug}
      ></FilmsGrille>
    </>
  );
}
