// Create a list of all possible cards in the deck
const CARDS = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf',
'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];



/*
 * Display the cards on the page
 *	- shuffle the list of cards using the provided "shuffle" method below
 *	- loop through each card and create its HTML
 *	- add each card's HTML to the page
 */
function displayCards() {
	const cardsFragment = document.createDocumentFragment();

	shuffle(CARDS);

	CARDS.forEach(function(card) {
		const iconElem = document.createElement('i');
		iconElem.classList.add('fa');
		iconElem.classList.add(card);

		const cardElem = document.createElement('li');
		cardElem.setAttribute('data-value', card);
		cardElem.classList.add('card');
		cardElem.appendChild(iconElem);

		cardsFragment.appendChild(cardElem);
	});

	document.querySelector('.deck').appendChild(cardsFragment);
}



// `shuffle` function copied directly from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

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
 * Show a pair of matching cards. For each matched card:
 *	- Remove the `open` and `show` classes
 *	- Add the `match` class to signify the match
 */
function showMatch(cardsToShow) {
	cardsToShow.forEach(function(card) {
		card.classList.remove('open');
		card.classList.remove('show');
		card.classList.add('match');
	});
}



/*
 * Show a pair of mismatching cards for 1 second. For each mismatched card:
 *	- Remove the `open` and `show` classes after 1 second
 */
function showMismatch(cardsToShow) {
	setTimeout(function() {
		cardsToShow.forEach(function(card) {
			card.classList.remove('open');
			card.classList.remove('show');
		});
	}, 1000);
}


/*
 * Increment the number of moves. Based on the number of moves, display the
 * corresponding number of stars to the user.
 */
function addMove() {
	const moves = document.querySelector('.container .moves');
	let numMoves = parseInt(moves.textContent, 10);
	numMoves++;
	if(numMoves === 1)
		gameTimer.addOneSecond();
	moves.textContent = numMoves;
	updateStars(numMoves);
}



// `gameTimer` modifies the stopwatch functionality from https://jsfiddle.net/Daniel_Hug/pvk6p/
const gameTimer = {};

// Initial values
gameTimer.totalSeconds = 0;
gameTimer.seconds = 0;
gameTimer.minutes = 0;
gameTimer.timeout = null;

// Add one second to the game timer.
gameTimer.addOneSecond = function() {
	gameTimer.timeout = setTimeout(gameTimer.updateView, 1000);
};

// Stop the game timer.
gameTimer.stop = function() {
	clearTimeout(gameTimer.timeout);
};

/*
 * Reset the game timer:
 *	- Reset the time on the game board to "00:00"
 *	- Reset all gameTimer properties back to their initial values
 */
gameTimer.reset = function() {
	document.querySelector('.timer > .time').innerHTML = '00:00';
	gameTimer.totalSeconds = 0;
	gameTimer.seconds = 0;
	gameTimer.minutes = 0;
	gameTimer.timeout = null;
};

/*
 * Update the game timer that's visible to the player while s/he is playing the game.
 * EXAMPLE: "02:48" denotes 2 minutes and 48 seconds
 */
gameTimer.updateView = function() {
	++gameTimer.totalSeconds;
	++gameTimer.seconds;
	if (gameTimer.seconds >= 60) {
		gameTimer.seconds = 0;
		++gameTimer.minutes;
	}

	const seconds = gameTimer.seconds;
	const minutes = gameTimer.minutes;

	document.querySelector('.timer > .time').textContent =
		(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

	gameTimer.addOneSecond();
};

/*
 * Display the total time elapsed in the Win Overlay
 * EXAMPLES:
 *	- 45 seconds
 *	- 1 minute and 1 second
 *	- 2 minutes and 30 seconds
 */
gameTimer.displayMessage = function() {
	const totalSeconds = gameTimer.totalSeconds;
	const timeElapsed = document.querySelector('.win-overlay .time-elapsed');

	if (totalSeconds < 60)
		timeElapsed.textContent = totalSeconds + ' seconds';
	else {
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		minutes = minutes === 1 ? minutes + ' minute' : minutes + ' minutes';
		seconds = seconds === 1 ? seconds + ' second' : seconds + ' seconds';
		timeElapsed.textContent = minutes + ' and ' + seconds;
	}
};



// Update the number of stars based on the player's number of moves.
function updateStars(moveCount) {
	const starIcons = document.querySelectorAll('.stars .fa');
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


/*
 * Once the player wins:
 *	- stop the game timer
 *	- populate and display the Win Overlay
 */
function checkWin() {
	const numMatches = document.querySelectorAll('.card.match').length;
	if(numMatches !== CARDS.length)
		return;

	// Player won
	gameTimer.stop();
	populateWinOverlay();
	document.querySelector('.win-overlay').classList.add('open');
}


/*
 * Populate the Win Overlay with:
 *	- Number of moves
 *	- Number of stars
 *	- Player's concentration level (based on number of stars)
 *	- Total time elapsed
 */
function populateWinOverlay() {
	const overlay = document.querySelector('.win-overlay');

	// Number of moves
	overlay.querySelector('.moves').textContent =
		document.querySelector('.score-panel .moves').textContent;

	const overlayStars = document.querySelectorAll('.score-panel .fa-star');
	const starsFragment = document.createDocumentFragment();

	// Number of stars
	overlayStars.forEach(function() {
		const iconElem = document.createElement('i');
		iconElem.classList.add('fa');
		iconElem.classList.add('fa-star');

		const starElem = document.createElement('li');
		starElem.appendChild(iconElem);

		starsFragment.appendChild(starElem);
	});

	overlay.querySelector('.stars').appendChild(starsFragment);

	// Concentration level
	const level = overlay.querySelector('.level');
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

	// Time elapsed
	gameTimer.displayMessage();
}


/*
 * Reset the game board:
 *	- Clear the game board
 *	- Reset the number of moves to 0
 *	- Reset the number of stars to 3
 *	- Stop and reset the game timer
 *	- Display the newly shuffled deck
 */
function resetGameBoard() {
	document.querySelector('.deck').innerHTML = '';
	document.querySelector('.score-panel .moves').textContent = 0;
	gameTimer.stop();
	gameTimer.reset();
	updateStars(0);
	displayCards();
}


/*
 * Set up the event listener for a card. If a card is clicked:
 *	- display the card's symbol
 *	- add the card to a list of "open" cards
 *	- if the list already has another card, check to see if the two cards match:
 *		+ if the cards do match, lock the cards in the open position
 *		+ if the cards do not match, hide the cards again
 *		+ increment the move counter and display it on the page
 *		+ if all cards have matched, display the Win Overlay with the final score
 */
document
.querySelector('.deck')
.addEventListener('click', function(event) {
	if(!event.target.classList.contains('card') || event.target.classList.contains('match'))
		return;

	let cardsOpen = document.querySelectorAll('.card.open');
	if(cardsOpen.length < 2) {
		event.target.classList.add('open');
		event.target.classList.add('show');

		// Update the "open" cards
		cardsOpen = document.querySelectorAll('.card.open');

		if(cardsOpen.length === 2) {
			const firstCard = cardsOpen[0].getAttribute('data-value');
			const secondCard = cardsOpen[1].getAttribute('data-value');

			firstCard === secondCard
				? showMatch(cardsOpen)
				: showMismatch(cardsOpen);

			addMove();
			checkWin();
		}
	}
});



/*
 * Set up the event listener for the restart button in the score panel.
 * If the restart button in the score panel is clicked:
 *	- stop the game timer
 *	- reset the game timer
 *	- reset the number of moves to 0
 *	- reset the number of stars to 3
 *	- shuffle and display a new deck
 */
document
.querySelector('.score-panel .restart')
.addEventListener('click', resetGameBoard);



/*
 * Set up the event listener for the restart button in the Win Overlay.
 * If the restart button in the Win Overlay is clicked:
 *	- stop the game timer
 *	- reset the game timer
 *	- reset the number of moves to 0
 *	- reset the number of stars to 3
 *	- shuffle and display a new deck
 *	- close the Win Overlay
 *	- remove the stars in the Win Overlay
 */
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



// Display the cards on the page once the HTML markup has been parsed.
document.addEventListener('DOMContentLoaded', displayCards);
