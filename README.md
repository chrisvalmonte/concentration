# Memory Game Project

## Table of Contents

* [About](#about)
* [How The Game Works](#how-the-game-works)
* [Game Functionality](#game-functionality)
* [Dependencies](#dependencies)
* [Contributing](#contributing)

## About

This project demonstrates my HTML, CSS, and JavaScript fundamentals. It is a browser-based card matching game, also known as Concentration. Provided with a starter project consisting of some HTML and CSS styling, I converted the static project into an interactive one and customized it as well.

## How The Game Works

The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

Each turn:

* The player flips one card over to reveal its underlying symbol.
* The player then turns over a second card, trying to find the corresponding card with the same symbol.
* If the cards match, both cards stay flipped over.
* If the cards do not match, both cards are flipped face down.
* The game ends once all cards have been correctly matched.

## Game Functionality

The goal of this project was to recreate the real-life game. There are a couple of interactions that I handled:

* Flipping cards
* What happens when cards match
* What happens when cards do not match
* When the game finishes

## Dependencies

* `shuffle` function copied directly from http://stackoverflow.com/a/2450976
* `gameTimer` function modified from https://jsfiddle.net/Daniel_Hug/pvk6p/

## Contributing

I will not accept _any_ pull requests. For details, check out [CONTRIBUTING.md](CONTRIBUTING.md).
