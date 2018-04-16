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
	}, 1000); // Show mismatched cards for 1 second
}



function addMove() {
	var moves = document.querySelector('.container .moves');
	var numMoves = parseInt(moves.textContent, 10);
	numMoves++;
	if(numMoves === 1)
		gameTimer.addOneSecond();
	moves.textContent = numMoves;
	updateStars(numMoves);
}



var gameTimer = {};

gameTimer.totalSeconds = 0;
gameTimer.seconds = 0;
gameTimer.minutes = 0;
gameTimer.timeout = null;

gameTimer.addOneSecond = function() {
	gameTimer.timeout = setTimeout(gameTimer.updateView, 1000);
};

gameTimer.stop = function() {
	clearTimeout(gameTimer.timeout);
};

gameTimer.reset = function() {
	document.querySelector('.timer > .time').innerHTML = '00:00';
	gameTimer.totalSeconds = 0;
	gameTimer.seconds = 0;
	gameTimer.minutes = 0;
	gameTimer.timeout = null;
};

gameTimer.updateView = function() {
	++gameTimer.totalSeconds;
	++gameTimer.seconds;
	if (gameTimer.seconds >= 60) {
		gameTimer.seconds = 0;
		++gameTimer.minutes;
	}

	var seconds = gameTimer.seconds;
	var minutes = gameTimer.minutes;

	document.querySelector('.timer > .time').textContent =
		(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

	gameTimer.addOneSecond();
};

gameTimer.displayMessage = function() {
	var totalSeconds = gameTimer.totalSeconds;
	var timeElapsed = document.querySelector('.win-overlay .time-elapsed');

	if (totalSeconds < 60)
		timeElapsed.textContent = totalSeconds + ' seconds';
	else {
		var minutes = Math.floor(totalSeconds / 60);
		var seconds = totalSeconds % 60;
		minutes = minutes === 1 ? minutes + ' minute' : minutes + ' minutes';
		seconds = seconds === 1 ? seconds + ' second' : seconds + ' seconds';
		timeElapsed.textContent = minutes + ' and ' + seconds;
	}
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
	gameTimer.stop();
	populateWinOverlay();
	document.querySelector('.win-overlay').classList.add('open');
}


/*
 * Populate the Win Overlay with:
 *  - Number of moves
 *  - Number of stars
 *  - User's concentration level (based on number of stars)
 *  - Total time elapsed
 */
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

	gameTimer.displayMessage();
}



function resetGameBoard() {
	document.querySelector('.deck').innerHTML = '';
	document.querySelector('.score-panel .moves').textContent = 0;
	gameTimer.stop();
	gameTimer.reset();
	updateStars(0);
	displayCards();
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol
 *  - add the card to a *list* of "open" cards
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position
 *    + if the cards do not match, hide the cards again
 *    + increment the move counter and display it on the page
 *    + if all cards have matched, display a message with the final score
 */
document
.querySelector('.deck')
.addEventListener('click', function(event) {
	if(!event.target.classList.contains('card') || event.target.classList.contains('match'))
		return;

	var cardsOpen = document.querySelectorAll('.card.open');
	if(cardsOpen.length < 2) {
		event.target.classList.add('open');
		event.target.classList.add('show');

		// Update "open" cards
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
