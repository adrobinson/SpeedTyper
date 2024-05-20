// VARIABLES

// WORD VARS
const words = [] // array to hold the original JSON data
const longerWords = [] // array to hold a filtered version of the 'words' array
const JSON_WORDS = 'https://raw.githubusercontent.com/bevacqua/correcthorse/master/wordlist.json'

// HTML VARS
const input = document.querySelector("#input") 
const displayWord = document.querySelector("#word")
const displayScore = document.querySelector("#score")
const difficulty = document.querySelector('#difficulty-menu')



// TIMER VARS
let secondsLeft = 15 ; 
let increment = 4; // base difficulty
let interval = null;
const time = document.getElementById("timer")
let score = 0;


// GAME FUNCTIONS
async function fetchWords() { 
    try{
        const response = await fetch(JSON_WORDS); // fetches the data
        const readable = await response.json(); // turns data into readable json data
        words.push(...readable) // spreads JSON data into the 'words' array
        longerWords.push(...words.filter(word => word.length > 3)) // filters out any words with less than 4 letters
    } catch (error) {
        console.error("Error fetching data.")
    }
    
}

const getRandomInt = (max) => { 
    return Math.floor(Math.random() * max)
}

const generateRandomWord = () => { // generates a random word from the longerWords array, then displays word
    randomWord = longerWords[getRandomInt(longerWords.length)]
    displayWord.innerHTML = (`${randomWord}`)
}

function setDifficulty() { // gets difficulty from local storage, if difficulty has not yet been changed, then default is easy
    try{
        difficulty.value = localStorage.getItem('difficulty') 
        changeDifficulty() // needs to call the changeDifficulty function, as it will always be easy when page reloads
    } catch (e) {
        difficulty.value = 'easy'
    }
}

function changeDifficulty() { // changes the difficulty of the game
    if (difficulty.value == 'easy') {
        window.localStorage.setItem('difficulty', 'easy') // sets the local storage key to the difficulty selects & changes the time incrememnt
        increment = 4;
    } else if (difficulty.value == 'medium') {
        window.localStorage.setItem('difficulty', 'medium')
        increment = 3;
    } else if(difficulty.value == 'hard') {
        window.localStorage.setItem('difficulty', 'hard')
        increment = 2;
    }
    
}


function reset() {
    location.reload() // when user clicks the 'Play Again' button, page will reload
}

function gameOver() {
    const container = document.querySelector(".word-container") 
    const paragraphs = document.querySelectorAll(".word-container p")
    paragraphs.forEach(paragraph => paragraph.remove()) // gets rid of everything in the 'word'container'
    input.remove()

    //replaces contents of 'word-container' with the following:
    container.innerHTML = `
    <h3>Game Over</h3> 
    <p>Score: ${score}</p>
    <button onclick="reset()">Play Again</button>
    `
}


// TIMER FUNCTIONS 
function padStart(value) { // this function makes sure the clock is displayed correctly
    return String(value).padStart(2, "0");
}

function setTime() { // this function will be called every second, and will update the time displayed on screen
    const minutes = Math.floor(secondsLeft / 60); 
    const seconds = secondsLeft % 60;
    time.innerHTML = (`${padStart(minutes)}:${padStart(seconds)}`)
    checkTime();
}

function stopTimer(){ // this will run when timer hits 0, and will clear the interval. Making the clock stop.
    clearInterval(interval)
}

function timer() { 
    secondsLeft --; // decrements the time every second
    setTime()
}

function checkTime() { // checks if timer hits 0.
    if(secondsLeft <= 0) {
        stopTimer()
        gameOver()
    }
}

function startTimer(){
    interval = setInterval(timer, 1000) // every 1000 ms, the timer function will run
}


// START GAME
(async () => {
    await fetchWords() // waits for the fetchWords function to complete before any other functions are run
    generateRandomWord()
    startTimer()
    setDifficulty()
})();


input.addEventListener('input', function checkWord() { // Every time a letter is entered, this letter will be checked against the word
    if(this.value === displayWord.innerHTML){
        generateRandomWord() // once the word has been inputted correctly, generate a new word, clear the input box, increment score and timer.
        this.value = '' 
        score += 1
        displayScore.innerHTML = score
        secondsLeft += increment;
    }
    else{
        return
    }
})

difficulty.addEventListener('change', changeDifficulty) // when a different difficulty is selected, it will change the difficulty