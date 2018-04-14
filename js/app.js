/*
 * Create a list that holds all of your cards
 */

var cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf',
'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
var moves = document.querySelector('.moves');
var stars = document.querySelector('.stars');
var START_MOVES = 0;



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function displayCards() {
	var cardsFragment = document.createDocumentFragment();

	shuffle(cards);

	cards.forEach(function(card) {
		var iconElem = document.createElement('i');
		iconElem.classList.add('fa');
		iconElem.classList.add(card);

		var cardElem = document.createElement('li');
		cardElem.classList.add('card');
		cardElem.appendChild(iconElem);

		cardsFragment.appendChild(cardElem);
	});

	deck.appendChild(cardsFragment);
}



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function showMatch(cardsToShow) {
	cardsToShow.forEach(function(card) {
		card.classList.remove('open');
		card.classList.remove('show');
		card.classList.add('match');
	});
}



function showMismatch(cardsToShow) {
	setTimeout(function() {
		cardsToShow.forEach(function(card) {
			card.classList.remove('open');
			card.classList.remove('show');
		});
	}, 1000);
}



function addMove() {
	numMoves = parseInt(moves.textContent, 10);
	numMoves++;
	moves.textContent = numMoves;

	updateStars(numMoves);
}



function updateStars(moveCount) {
	var starIcons = stars.querySelectorAll('.fa');
	if(moveCount <= 10) {
		starIcons.forEach(function(star) {
			star.classList.remove('fa-star-o');
			star.classList.add('fa-star');
		});
	} else if (moveCount <= 15) {
		starIcons[2].classList.remove('fa-star');
		starIcons[2].classList.add('fa-star-o');
	} else {
		starIcons[1].classList.remove('fa-star');
		starIcons[1].classList.add('fa-star-o');
	}
}



var deck = document.querySelector('.deck');
deck.addEventListener('click', function(event) {
	if(event.target.nodeName !== 'LI')
		return;

	var cardsOpen = deck.querySelectorAll('.card.open');
	if(cardsOpen.length < 2) {
		event.target.classList.add('open');
		event.target.classList.add('show');

		cardsOpen = deck.querySelectorAll('.card.open');
		if(cardsOpen.length === 2) {
			var firstCard = cardsOpen[0].querySelector('.fa').classList[1];
			var secondCard = cardsOpen[1].querySelector('.fa').classList[1];

			firstCard === secondCard
				? showMatch(cardsOpen)
				: showMismatch(cardsOpen);

			addMove();
		}
	}
});


var restart = document.querySelector('.restart');
restart.addEventListener('click', function() {
	while(deck.firstChild) {
		deck.removeChild(deck.firstChild);
	}

	moves.textContent = START_MOVES;

	updateStars(START_MOVES);
	displayCards();
});



displayCards();
