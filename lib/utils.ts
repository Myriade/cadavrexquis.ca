export function findTermName(fieldTermsArray, vocabArray) {
  const matchingItems = [];
  
  fieldTermsArray.forEach( fieldTerm => {
    const idMatch = vocabArray.find( vocabTerm => {
        // console.log('vocabTerm.attributes.termid', vocabTerm.attributes.termid)
        // console.log('fieldTerm.meta.drupal_internal__target_id', fieldTerm.meta.drupal_internal__target_id)
        return vocabTerm.attributes.termid === fieldTerm.meta.drupal_internal__target_id
      }
    );
    
    // If a match is found, add its name to the array
    if (idMatch && idMatch.name) {
      matchingItems.push(idMatch.name)
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

// export function formatDate(input: string): string {
//   const date = new Date(input)
//   return date.toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   })
// }
// 
// export function absoluteUrl(input: string) {
//   return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
// }
