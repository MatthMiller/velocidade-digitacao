import sortText from '../functions/sortText.js';

class Board {
  lettersMap = [];
  letterPointer = 0;
  hasStartedTyping = false;
  globalStats = {
    wrongAttempts: 0,
    correctAttempts: 0,
  };

  constructor() {
    this.init();
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
    this.refreshStats();
  }

  markAsCorrect(element) {
    element.classList.add('correct');
    this.lettersMap[this.letterPointer].isCorrect = true;
    this.globalStats.correctAttempts++;
    this.increasePointer();
  }

  markAsWrong(element) {
    element.classList.add('wrong');
    this.lettersMap[this.letterPointer].isCorrect = false;
    this.globalStats.wrongAttempts++;
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
  }

  createGhostLetter(character) {
    const letterElement = document.createElement('p');
    letterElement.classList.add('ghost-letter');
    letterElement.innerText = character;
    return letterElement;
  }

  topAccumulator = 0;
  checkScroll() {
    const boardElement = document.querySelector('#js-board');
    this.refreshPointer();
    const actualElement = this.letterBoxesElements[this.letterPointer];
    const distanceFromTop = actualElement.offsetTop;

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
    }
  }

  startCounting() {
    const timeDisplayElement = document.querySelector('#js-time');

    let counter = 60;
    const timer = setInterval(() => {
      counter--;
      timeDisplayElement.innerText = `0:${
        counter < 10 ? '0' + counter : counter
      }`;

      if (counter === 0) {
        clearInterval(timer);
        this.finishGame();
      }
    }, 1000);
  }

  finishGame() {
    const restartButton = document.querySelector('#js-restart');
    restartButton.addEventListener('click', this.handleRestartButton);
    window.removeEventListener('keypress', this.handleKeypress);

    this.openModal();
  }

  handleRestartButton = () => {
    location.reload();
  };

  openModal() {
    const endGameModal = document.querySelector('#js-modal');
    endGameModal.ariaHidden = false;
    endGameModal.classList.add('active');
  }

  refreshStats() {
    const [pointsHeader, pointsFinal] = document.querySelectorAll('.js-points');
    const [accuracyHeader, accuracyFinal] =
      document.querySelectorAll('.js-accuracy');

    pointsHeader.innerText = this.globalStats.correctAttempts;
    pointsFinal.innerText = this.globalStats.correctAttempts;
    const precisionRate =
      (this.globalStats.correctAttempts /
        (this.globalStats.correctAttempts + this.globalStats.wrongAttempts)) *
      100;
    accuracyHeader.innerText = `${precisionRate.toFixed(0)}%`;
    accuracyFinal.innerText = `${precisionRate.toFixed(0)}%`;
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

    if (this.hasStartedTyping === false) {
      this.hasStartedTyping = true;
      this.startCounting();
    }

    if (event.key === 'Enter') {
      return;
    }
    this.attemptToScore(event.key);
  };

  addEventListeners() {
    window.addEventListener('keypress', this.handleKeypress);
  }

  init() {
    this.setSortedText();
    this.addEventListeners();
    this.appendInitialLetters();
    this.createLettersMap();
    this.refreshPointer();
  }
}

export default Board;
