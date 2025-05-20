export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

export function findVocabularyTermNames(fieldArray, dataArray, outputType) {
    const matchingItems = [];
    
    // Loop through each item in fieldArray
    fieldArray.forEach((fieldItem, fieldIndex) => {
      // Find corresponding item in dataArray
      const dataMatch = dataArray.find(dataItem => 
        fieldItem.resourceIdObjMeta.drupal_internal__target_id === dataItem.id
      );
      
      // If a match is found, add its name to the array
      if (dataMatch && dataMatch.name && !outputType) {
        matchingItems.push(dataMatch.name);
      } else if (dataMatch && dataMatch.name && outputType === 'id') {
        matchingItems.push(dataMatch.id);
      }
    });
    
    // Join all names with commas and return
    return matchingItems.join(', ');
}
