import { stringSimilarity } from "string-similarity-js";
import { arraysEqual } from "./errayEqual";



export const keywordMatching = (text, keywordPhrases) => {

// Rearranged words
const words1 = text ? text.split(" ") : []
const words2 = keywordPhrases ? keywordPhrases.split(" "): []

const contained =  arraysEqual(words1 , words2)

const scrore = stringSimilarity(text, keywordPhrases)
// Returns a score of 0.9

console.log(scrore)

return scrore

}