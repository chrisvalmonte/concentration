/*
 * Create a list that holds all of your cards
 */

var CARDS = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf',
'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function displayCards() {
	var cardsFragment = document.createDocumentFragment();

	shuffle(CARDS);

	CARDS.forEach(function(card) {
		var iconElem = document.createElement('i');
		iconElem.classList.add('fa');
		iconElem.classList.add(card);

		var cardElem = document.createElement('li');
		cardElem.setAttribute('data-value', card);
		cardElem.classList.add('card');
		cardElem.appendChild(iconElem);

		cardsFragment.appendChild(cardElem);
	});

	document.querySelector('.deck').appendChild(cardsFragment);
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
	var moves = document.querySelector('.container .moves');
	numMoves = parseInt(moves.textContent, 10);
	numMoves++;
	moves.textContent = numMoves;

	updateStars(numMoves);
}



function updateStars(moveCount) {
	var starIcons = document.querySelectorAll('.stars .fa');
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
	if(numMatches !== CARDS.length)
		return;

	// won
	populateWinOverlay();
	document.querySelector('.win-overlay').classList.add('open');
}



function populateWinOverlay() {
	var overlay = document.querySelector('.win-overlay');
	overlay.querySelector('.moves').textContent =
		document.querySelector('.score-panel .moves').textContent;

	var overlayStars = document.querySelectorAll('.score-panel .fa-star');
	var starsFragment = document.createDocumentFragment();

	overlayStars.forEach(function() {
		var iconElem = document.createElement('i');
		iconElem.classList.add('fa');
		iconElem.classList.add('fa-star');

		var starElem = document.createElement('li');
		starElem.appendChild(iconElem);

		starsFragment.appendChild(starElem);
	});

	overlay.querySelector('.stars').appendChild(starsFragment);

	var level = overlay.querySelector('.level');
	switch(overlayStars.length) {
		case 1: // 1 star
			level.textContent = 'Beginner';
			break;
		case 2: // 2 stars
			level.textContent = 'Intermediate';
			break;
		case 3: // 3 stars
			level.textContent = 'Expert';
			break;
	}
}



function resetGameBoard() {
	document.querySelector('.deck').innerHTML = '';
	document.querySelector('.score-panel .moves').textContent = 0;
	updateStars(0);
	displayCards();
}



document
.querySelector('.deck')
.addEventListener('click', function(event) {
	if(!event.target.classList.contains('card') || event.target.classList.contains('match'))
		return;

	var cardsOpen = document.querySelectorAll('.card.open');
	if(cardsOpen.length < 2) {
		event.target.classList.add('open');
		event.target.classList.add('show');

		cardsOpen = document.querySelectorAll('.card.open');
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



document
.querySelector('.score-panel .restart')
.addEventListener('click', resetGameBoard);



document
.querySelector('.win-overlay')
.addEventListener('click', function(event) {
	if(event.target.classList.contains('restart')) {
		resetGameBoard();
		var overlay = document.querySelector('.win-overlay');
		overlay.classList.remove('open');
		overlay.querySelector('.stars').innerHTML = '';
	}
});



document.addEventListener('DOMContentLoaded', displayCards);
