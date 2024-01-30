


document.addEventListener("DOMContentLoaded", () => {

    createSquares();
    getNewWord(); 
    
    const guessedWords = [[]];
    
    let availableSpace = 1;
    
    let word;
    
    let guessedWordCount = 0;
    
    const keys = document.querySelectorAll('.keyboard-row button');
    
    function getNewWord() {
        const url = 'https://wordsapiv1.p.rapidapi.com/words/';
        const params = new URLSearchParams({
            random: 'true',
            lettersMin: '5',
            lettersMax: '5'
        });
    
        fetch(`${url}?${params.toString()}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "6e9de6409emsh941e7b01617e467p1b5ee3jsnbd6ad0832559",
                "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
            },
        })
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            word = res.word;
            console.log(word);
        })
        .catch((err) => {
            console.error(err);
        });
    }
    
    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
      }
    
      function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
    
        if (currentWordArr && currentWordArr.length < 5) {
          currentWordArr.push(letter);
    
          const availableSpaceEl = document.getElementById(String(availableSpace));
    
          availableSpace = availableSpace + 1;
          availableSpaceEl.textContent = letter;
        }
      }
    
      function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);
    
        if (!isCorrectLetter) {
          return "rgb(188, 192, 194)";
        }
    
        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;
    
        if (isCorrectPosition) {
          return "rgb(83, 141, 78)";
        }
    
        return "#c9b458";
      }
    
      function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
          window.alert("Word must be 5 letters");
        }
    
        const currentWord = currentWordArr.join("");
    
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
                method: "GET",
                headers: {
                    "X-Rapidapi-Key": "6e9de6409emsh941e7b01617e467p1b5ee3jsnbd6ad0832559",
                    "X-Rapidapi-Host": "wordsapiv1.p.rapidapi.com",
                },
            }
        ).then((res) => {
            if (!res.ok) {
                throw Error()
            }
            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index);
    
                    const letterId = firstLetterId + index; 
                    const letterEl = document.getElementById(letterId);
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                }, interval * index);
                })
            
            guessedWordCount += 1;
            if(currentWord === word){
                window.alert(`Yay, you did it! Your word is ${currentWord}`);
            }
    
            if(guessedWords.length === 6){
                window.alert(`This guy stinks! The word was ${word}.`);
            }
    
            guessedWords.push([]);
    
        }).catch(() => window.alert("Not a word"))
    
        
    
    }
    function createSquares() {
        const gameBoard = document.getElementById("board");
    
        for (let index = 0; index < 30; index++) {
          let square = document.createElement("div");
          square.classList.add("square");
          square.classList.add("animate__animated");
          square.setAttribute("id", index + 1);
          gameBoard.appendChild(square);
        }
      }
    
      function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();
    
        guessedWords[guessedWords.length - 1] = currentWordArr;
    
        const lastLetterEl = document.getElementById(String(availableSpace - 1));
    
        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
      }
    
      for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
          const letter = target.getAttribute("data-key");
    
          if (letter === "enter") {
            handleSubmitWord();
            return;
          }
    
          if (letter === "del") {
            handleDeleteLetter();
            return;
          }
    
          updateGuessedWords(letter);
        };
      }
    });
    