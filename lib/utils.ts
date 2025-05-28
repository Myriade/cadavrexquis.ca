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

/**
 * Converts a string to a URL-friendly slug while preserving special characters
 * @param {string} str - The string to convert to a slug
 * @returns {string} The URL-encoded slug
 */
export const slugify = (str) => {
  if (!str) return '';
  
  // First, trim the string
  const trimmed = str.trim();
  
  // Replace spaces with dashes
  const spacesReplaced = trimmed.replace(/\s+/g, '-');
  
  // Encode the string for URL compatibility
  return encodeURIComponent(spacesReplaced);
};

/**
 * Converts a slug back to a readable string
 * @param {string} slug - The slug to convert
 * @returns {string} The decoded, human-readable string
 */
export const unslugify = (slug) => {
  if (!slug) return '';
  
  try {
    // Decode the URL-encoded string
    const decoded = decodeURIComponent(slug);
    
    // Replace dashes with spaces
    return decoded.replace(/-/g, ' ');
  } catch (error) {
    console.error('Error decoding slug:', error);
    return slug; // Return original slug if decoding fails
  }
};