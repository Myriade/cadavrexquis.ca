/**
 * Compares two arrays to find corresponding vocabulary term names
 * @param {array} fieldTermsArray (one film's term ids) and vocabArray (all available terms ids ans names)
 * @returns {string} A list of term names separated with coma
 */
export function findTermName(fieldTermsArray, vocabArray) {
  const matchingItems = [];
  
  fieldTermsArray.forEach( fieldTerm => {
    const idMatch = vocabArray.find( vocabTerm => {
      const ref1 = vocabTerm.attributes.termid
      const ref2 = vocabTerm.attributes.drupal_internal__tid 
      const test = fieldTerm.meta.drupal_internal__target_id
      return ref1 === test || ref2 === test
    });
    
    // If a match is found, add its name to the array
    if (idMatch && idMatch.attributes.name) {
      matchingItems.push(idMatch.attributes.name)
    }
  });
  
  // Join all names with commas and return
  return matchingItems.join(', ');
}

/**
 * Converts a Vimeo URL into a video ID string to use in a Vimeo embeded reader
 * @param {string} str - The url to convert into an video id
 * @returns {string} The video ID (one on two series of number with slash)
 */
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


/**
 * Converts a slug back to a readable string
 * @param {string} slug - The slug to convert
 * @returns {string} The decoded, human-readable string
 */
export const uriToString = (uri) => {
  if (!uri) return '';
  try {
    // Decode the URL-encoded string
    const decoded = decodeURIComponent(uri);
    return decoded
  } catch (error) {
    console.error('Error decoding slug:', error);
    return slug; // Return original slug if decoding fails
  }
};