import { drupal } from "/lib/drupal.ts"

export default async function Page() {
    
  const data = await drupal.getView(
    "cadavre_exquis--page_1",
    {
      withAuth : {
        username: process.env.NEXT_PUBLIC_DRUPAL_USERNAME,
        password: process.env.NEXT_PUBLIC_DRUPAL_PASSWORD,
      }
    }
  )
  
  console.log(data.results);
  
  return (
    <>
      <h1>Cadavre exquis</h1>
      <pre><code>Prototype 1.0</code></pre>
    </>
  );
}
