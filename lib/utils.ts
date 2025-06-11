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
 * @param {string} url - The url to convert into an video id
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
 * @param {string} uri - The slug to convert
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

/**
  * Create random values for filmCard styles (color, height and bg image focus)
  * @param {array} filmsArray - array of objects, data for all the films to be presented in cards - 
  * @returns {string} the array of objects with aditionnal styles values
 */
export function createRandomStyles(filmsArray) {
  const couleurs = ['#fd8abd', '#35cdff', '#f5d437', '#19f76b', '#ff8049', '#a081ff']
  const focus = ['left top', 'top', 'right top', 'left center', 'center', 'right center', 'left bottom', 'bottom', 'right bottom']
  filmsArray.forEach( film => {
    // prepare object for new values
    if (!film.attributes) {
      film.attributes = {}
    }
    film.attributes.styles = {}
    
    // height style
    const randomHeightFactor = Math.random() * (1.5 - 0.75) + 0.3;
    const height = `calc( var(--ficheWidth) * ${randomHeightFactor})`
    film.attributes.styles.elemHeight = height;
    
    // couleur
    const totalCouleurs = couleurs.length;
    const randomCouleurIndex = Math.floor(Math.random() * totalCouleurs);
    film.attributes.styles.couleur = couleurs[randomCouleurIndex];
    
    // focus (image)
    const totalFocus = focus.length;
    const randomFocusIndex = Math.floor(Math.random() * totalFocus);
    film.attributes.styles.focus = focus[randomFocusIndex];
  })
}

/**
  * Images in page body : Replace relative src attributes in body html strings with absolute paths
  * @param {string} htmlString - the body.value from Drupal page data fetch
  * @returns {string} The new string with absolutes path for each image.
 */
export function modifyImageSources(htmlString) {
  // Regular expression to match img tags with src attributes
  // This pattern looks for src="..." within img tags
  const regex = /<img[^>]*src="([^"]*)"[^>]*>/g;
  
  // Replace each occurrence with the modified src attribute
  return htmlString.replace(regex, (match, srcValue) => {
    // Check if the src starts with "/sites/default/files"
    if (srcValue.startsWith('/sites/default/files')) {
      // Replace the src value with the new URL
      const newSrc = `https://database.cadavrexquis.ca${srcValue}`;
      // Replace the old src with the new src in the original match
      return match.replace(`src="${srcValue}"`, `src="${newSrc}"`);
    }
    // If the src doesn't match our pattern, return the original match
    return match;
  });
}