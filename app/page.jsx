
import { FilmsGrille } from '../components/filmsGrille';

export default async function Page() {
    
  // const fetchedData = await drupal.getResourceCollection("node--film", {
  //   params: {
  //     //"filter[status]": "1",
  //   },
  //   deserialize: false,
  // })
  // 
  // console.log(fetchedData.data[1].attributes);
  // const data = fetchedData.data;
  
  return (
    <>
      <h1>Cadavre exquis</h1>
      <pre><code>Prototype 1.0</code></pre>
      
      <FilmsGrille></FilmsGrille>
    </>
  );
}
