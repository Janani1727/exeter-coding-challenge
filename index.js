const fs = require("fs");


// Reads the input text file
const shakespeare = fs.readFileSync("t8.shakespeare.txt", "utf8");


// Reads the find words list
const findWordsText = fs.readFileSync("find_words.txt", "utf8");

const findWords = findWordsText.split("\n").filter(Boolean);

// Reads the dictionary CSV and converts it to lowercase 
const dictionary_Text = fs.readFileSync("french_dictionary.csv", "utf8");
const dictionary_obj = {};
const lines = dictionary_Text.split("\n");
for (const line of lines) {
  const [englishWord, frenchWord] = line.split(",");
  dictionary_obj[englishWord.toLowerCase()] = frenchWord;
}
// console.log(dictionary_obj)



// Replace words in the input text
const forSpecialChar = /\b(\w+)\b/g;

const replacedWords = {};

const theWordsGettingTranslated = shakespeare.replace(forSpecialChar, (ele, word) => {

  // console.log(ele,word)

  const theTranslatedWords = dictionary_obj[word.toLowerCase()];
  if (theTranslatedWords && findWords.includes(word)) {
    const replacedWord = ele.replace(word, theTranslatedWords);
    replacedWords[replacedWord] = (replacedWords[replacedWord] || 0) + 1;
    return replacedWord;
  }
  return ele;
});



// Generates the frequency.csv file

let frequencyCSV = "English word    ,    French word    ,   Frequency\n";
for (const [replacedWord, frequency] of Object.entries(replacedWords)) {
  const englishWord = replacedWord.split(",")[0];
  frequencyCSV += `${englishWord},${replacedWord},${frequency}\n`;
}



// Measures execution time
const startTime = process.hrtime();
const endTime = process.hrtime(startTime);

const executionTime = (endTime - startTime).toFixed(2);




// Generate performance.txt file
const memoryUsage = `${Math.round( process.memoryUsage().heapUsed / 1024 / 1024)} MB`;


const performanceData = `Time to process: ${executionTime} seconds\nMemory used: ${memoryUsage}`;
fs.writeFileSync("performance.txt", performanceData, "utf8");


const Solution = async () => {
  try {
    await fs.writeFileSync("frequency.csv", frequencyCSV, "utf8");
    await fs.writeFileSync(
      "t8.shakespeare.translated.txt",
      theWordsGettingTranslated,
      "utf8"
    );
    console.log("Task Completed  Successfully");
  } catch (err) {
    console.log("Translation Failed", err);
  }
};
Solution();
// console.log(translatedText)