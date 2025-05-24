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
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid input: URL must be a non-empty string');
  }
  
  const regex = /(?:vimeo\.com\/)([^\/\?\s]+)(?:\/([^\/\?\s]+))?/;

  // Match numbers after .com/
  const match = url.match(regex)
  console.log('match', match)
  
  if (!match) {
    throw new Error('Invalid Vimeo URL format');
  }
  
  const string = match.slice(1).join('?h=')
  console.log('string', string)
  
  return string;
}