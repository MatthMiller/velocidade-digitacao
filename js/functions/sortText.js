import { texts } from '../data/texts.js';

const sortText = () => {
  const maxIndex = texts.length;
  const randomIndex = Math.floor(Math.random() * maxIndex);
  const randomText = texts[randomIndex];

  return [randomText, randomIndex];
};

export default sortText;
