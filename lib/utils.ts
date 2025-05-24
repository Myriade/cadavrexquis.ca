export function findTermName(fieldTermsArray, vocabArray) {
  const matchingItems = [];
  
  fieldTermsArray.forEach( fieldTerm => {
    const idMatch = vocabArray.find( vocabTerm => {
        return vocabTerm.attributes.termid === fieldTerm.meta.drupal_internal__target_id
      }
    );
    
    // If a match is found, add its name to the array
    if (idMatch && idMatch.attributes.name) {
      matchingItems.push(idMatch.attributes.name)
    }
  });
  
  // Join all names with commas and return
  return matchingItems.join(', ');
}

export function getVimeoId(url) {
  // Check if input is valid
  const validUrl = url.startsWith('https://')
  if (!url || typeof url !== 'string' || !validUrl) {
    console.error("getVimeoId Erreur : format d'url invalide. - ");
    return null
  }
  
  const regex = /(?:vimeo\.com\/)([^\/\?\s]+)(?:\/([^\/\?\s]+))?/;
  const match = url.match(regex)
  
  if (!match) {
    console.error("getVimeoId Erreur : le lien n'est pas un lien valide de Viméo. - ");
    return null
  }
  
  const string = match.slice(1).join('?h=')
  
  return string;
}