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


export function findVocabularyTermNames(fieldTermsArray, vocabArray) {
    const matchingItems = [];
    
    fieldTermsArray.forEach( fieldTerm => {
      let termId = null
      
      // from FilmPage
      if (fieldTerm.resourceIdObjMeta) {
        termId = fieldTerm.resourceIdObjMeta.drupal_internal__target_id
      }
      
      // from FilmsGrille 
      if (fieldTerm.meta) {
        termId = fieldTerm.meta.drupal_internal__target_id
      }
      
      const idMatch = vocabArray.find( vocabTerm => 
        vocabTerm.id === termId
      );
      
      // If a match is found, add its name to the array
      if (idMatch && idMatch.name) {
        matchingItems.push(idMatch.name)
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

  // Match numbers after .com/
  const match = url.match(/\.com\/(\d+)/);
  
  if (!match) {
    throw new Error('Invalid Vimeo URL format');
  }
  
  return match[1];
}