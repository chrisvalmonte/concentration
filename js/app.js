/*
 * Create a list that holds all of your cards
 */

var START_MOVES = 0;
var LEVEL_BEGINNER = 1;
var LEVEL_INTERMEDIATE = 2;
var LEVEL_EXPERT = 3;
var cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf',
'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
var moves = document.querySelector('.moves');
var stars = document.querySelector('.stars');
var overlay = document.querySelector('.win-overlay');



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
		cardElem.setAttribute('data-value', card);
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



function checkWin() {
	var numMatches = document.querySelectorAll('.card.match').length;
	if(numMatches !== cards.length)
		return;

	// won
	populateWinOverlay();
	overlay.classList.add('open');
}



function populateWinOverlay() {
	overlay.querySelector('.moves').textContent = moves.textContent;

	var overlayStars = stars.querySelectorAll('.fa-star');
	var starsFragment = document.createDocumentFragment();

	overlayStars.forEach(function() {
		var iconElem = document.createElement('i');
		iconElem.classList.add('fa');
		iconElem.classList.add('fa-star');

		var starElem = document.createElement('li');
		starElem.appendChild(iconElem);

		starsFragment.appendChild(starElem);
	});

	var level = overlay.querySelector('.level');
	switch(overlayStars.length) {
		case LEVEL_BEGINNER:
			level.textContent = 'Beginner';
			break;
		case LEVEL_INTERMEDIATE:
			level.textContent = 'Intermediate';
			break;
		case LEVEL_EXPERT:
			level.textContent = 'Expert';
			break;
	}

	overlay.querySelector('.stars').appendChild(starsFragment);
}



function resetGameBoard() {
	while(deck.firstChild) {
		deck.removeChild(deck.firstChild);
	}

	moves.textContent = START_MOVES;

	updateStars(START_MOVES);
	displayCards();
}



var deck = document.querySelector('.deck');
deck.addEventListener('click', function(event) {
	if(event.target.nodeName !== 'LI' || event.target.classList.contains('match'))
		return;

	var cardsOpen = deck.querySelectorAll('.card.open');
	if(cardsOpen.length < 2) {
		event.target.classList.add('open');
		event.target.classList.add('show');

		cardsOpen = deck.querySelectorAll('.card.open');
		if(cardsOpen.length === 2) {
			var firstCard = cardsOpen[0].getAttribute('data-value');
			var secondCard = cardsOpen[1].getAttribute('data-value');

			firstCard === secondCard
				? showMatch(cardsOpen)
				: showMismatch(cardsOpen);

			addMove();
			checkWin();
		}
	}
});



var restart = document.querySelector('.restart');
restart.addEventListener('click', resetGameBoard);



overlay.addEventListener('click', function(event) {
	if(event.target.classList.contains('restart')) {
		resetGameBoard();
		overlay.classList.remove('open');
		var overlayStars = overlay.querySelector('.stars');
		overlayStars.innerHTML = '';
	}
});



document.addEventListener('DOMContentLoaded', displayCards);
