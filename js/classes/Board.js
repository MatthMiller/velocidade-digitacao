import sortText from '../functions/sortText.js';

class Board {
  lettersMap = [];
  letterPointer = 0;

  constructor() {
    this.firstStart();
  }

  attemptToScore(key) {
    this.refreshElementsData();
    this.checkScroll();

    const actualElement = this.letterBoxesElements[this.letterPointer];
    const actualLetter = actualElement.firstChild.innerText;
    const isCorrect = actualLetter === key;

    if (isCorrect || (key === ' ' && actualLetter === '')) {
      this.markAsCorrect(actualElement);
    } else {
      this.markAsWrong(actualElement);
      actualElement.appendChild(this.createGhostLetter(key));
    }
  }

  markAsCorrect(element) {
    element.classList.add('correct');
    this.lettersMap[this.letterPointer].isCorrect = true;
    this.increasePointer();
  }

  markAsWrong(element) {
    element.classList.add('wrong');
    this.lettersMap[this.letterPointer].isCorrect = false;
  }

  refreshPointer() {
    this.letterBoxesElements.forEach((actualElement, index) => {
      actualElement.classList.remove('pointer');
      if (index === this.letterPointer) {
        actualElement.classList.add('pointer');
      }
    });
  }

  increasePointer() {
    if (this.letterPointer !== this.letterBoxesElements.length - 1) {
      this.letterPointer++;
      this.refreshPointer();
    }
  }

  createLettersMap() {
    this.refreshElementsData();

    this.lettersMap = Array.from(this.letterBoxesElements).map(
      (actualLetterBox) => {
        return {
          letter: actualLetterBox.firstChild.innerText,
          isCorrect: null,
        };
      }
    );

    console.log(this.lettersMap);
  }

  createGhostLetter(character) {
    const letterElement = document.createElement('p');
    letterElement.classList.add('ghost-letter');
    letterElement.innerText = character;
    return letterElement;
  }

  // Arrumar essa bosta abaixo
  topAccumulator = 0;
  checkScroll() {
    const boardElement = document.querySelector('#js-board');
    this.refreshPointer();
    const actualElement = this.letterBoxesElements[this.letterPointer];
    const distanceFromTop = actualElement.offsetTop;

    console.log(distanceFromTop, this.lastDistanceFromTop);

    if (this.lastDistanceFromTop === undefined) {
      this.lastDistanceFromTop = distanceFromTop;
      return;
    }

    if (this.lastDistanceFromTop !== distanceFromTop) {
      const compensation = actualElement.offsetHeight + 20;
      this.topAccumulator += compensation;
      boardElement.scrollTo({
        top: this.topAccumulator,
        behavior: 'smooth',
      });

      this.lastDistanceFromTop = distanceFromTop;
      console.log(this.lastDistanceFromTop, distanceFromTop);
    }
  }

  appendInitialLetters() {
    const boardElement = document.querySelector('#js-board');
    boardElement.innerHTML = '';

    [...this.rawText].forEach((actualCharacter) => {
      const letterBox = document.createElement('div');
      letterBox.classList.add('letter-box');
      letterBox.innerHTML = `<p class="letter">${actualCharacter}</p>`;
      boardElement.appendChild(letterBox);
    });

    console.log(boardElement);
  }

  setSortedText() {
    let isSameIndex = false;
    // Check if isn't the same old text
    do {
      const [sortedText, lastTextIndex] = sortText();

      if (lastTextIndex === this.lastTextIndex) {
        isSameIndex = true;
      } else {
        this.lastTextIndex = lastTextIndex;
        this.rawText = sortedText;
        isSameIndex = false;
      }
    } while (isSameIndex);
  }

  refreshElementsData() {
    this.letterBoxesElements = document.querySelectorAll('.letter-box');
  }

  handleKeypress = (event) => {
    event.preventDefault();
    if (event.key === 'Enter') {
      return;
    }
    this.attemptToScore(event.key);
  };

  addEventListeners() {
    window.addEventListener('keypress', this.handleKeypress);
  }

  firstStart() {
    this.setSortedText();
    this.addEventListeners();
    this.appendInitialLetters();
    this.createLettersMap();
    this.refreshPointer();
  }
}

export default Board;
