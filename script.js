
const resetButton = document.querySelector("#resetButton")
const symbols = ["🍕", "🍷", "🚅", "🌏", "🍁", "😎", "💗", "💥"]

let confettiSettings = { target: 'confetti-canvas' };
let confetti = new ConfettiGenerator(confettiSettings);

const matchSound = new Audio("./match.wav")
const winSound = new Audio("./win.wav")



let cards = []
let flippedCards = [];
let matchedPairs = 0;
let moves = 0; // to keep count of total the moves;
let canFlip = true;


// create pairs of cards
const cardPairs = [...symbols, ...symbols];

// shuffle the cards
for (let i = cardPairs.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[random]] = [cardPairs[random], cardPairs[i]]
}



// create block for each symbols
cardPairs.forEach((symbol, index) => {
    const card = document.createElement("div")
    card.className = "card";
    card.dataset.symbol = symbol;
    card.addEventListener("click", flipCard)
    cards.push(card);
    gameBoard.appendChild(card)
})



// flip the card
// note: this keyword does not work with arrow function

function flipCard() {
    const card = this;

    // don't let flip the card when card length is 2
    if (!canFlip || flippedCards.includes(card) || card.classList.contains("flipped")) {
        return;
    }

    card.classList.add("flipped")
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves ++;
        updateStats()
        canFlip = false;

        // now check for a matched card
        if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
            matchedPairs ++;
            updateStats()
            flippedCards = [];
            canFlip = true;


            // look for game completion or last pair
            if (matchedPairs === symbols.length) {
                console.log("congratulations! you won", moves + " " + "moves taken")
                confetti.render()
                showMessage()
                winSound.play()
            } else {
                matchSound.play()
            }
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove("flipped");
                    card.textContent = "";
                });
                flippedCards = [];
                canFlip = true;
            }, 700)
        }
    }
}

function updateStats() {
    document.getElementById("moves").textContent = moves;
    document.getElementById("pairs").textContent = matchedPairs;
}

function showMessage() {
    const template = document.querySelector('template')
    const messageElement = template.content.cloneNode(true)
    const msg = `Congratulation! you've won in ${moves} moves`
    messageElement.querySelector('.message').textContent = msg
    document.body.appendChild(messageElement)

    const playAgainBtn = document.querySelector('.play-again-btn')
    playAgainBtn.addEventListener('click', () => resetButton.click())
}


// reset the game
resetButton.addEventListener("click", () => {
    cards = []
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    updateStats()

    // flip the card back
    const flippedCard = document.querySelectorAll(".card")
    if (flippedCard && flippedCard.length > 0) {
        flippedCard.forEach(card => {
            card.classList.remove("flipped")
            card.textContent = '';
            confetti.clear()
        })
    }

    const messageContainer = document.querySelector('.message__container')
    if (messageContainer) {
        messageContainer.remove()
    }

    winSound.pause()
    winSound.currentTime = 0
})
