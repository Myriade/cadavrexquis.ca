import { FilmsGrille } from '../components/filmsGrille';

export default async function Page() {
  
  return (
    <>
      <h1>Cadavre exquis</h1>
      <pre><code>Prototype 1.1</code></pre>
      
      <FilmsGrille random></FilmsGrille>
    </>
  );
}
