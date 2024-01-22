'use strict';

(function quoteGenerator() {
  let apiQuotes;
  let quoteNumber = 0;
  // Quotes quantity per request
  const quotesLimit = 50;
  // Fallback quote in the case if api request will be failed
  const fallbackQuote = {
    quote: 'You must be the change you wish to see in the world.',
    author: 'Mahatma Gandhi',
  };

  const getElBySelector = (selector) => {
    return document.querySelector(selector);
  };

  const quoteContainer = getElBySelector('#quote-container');
  const quoteText = getElBySelector('#quote');
  const authorText = getElBySelector('#author');
  const twitterBtn = getElBySelector('#twitter');
  const newQuoteBtn = getElBySelector('#new-quote');
  const loader = getElBySelector('#loader');

  // Show loader
  const loading = () => {
    loader.hidden = false;
    quoteContainer.hidden = true;
  };

  // Hide loader
  const complete = () => {
    loader.hidden = true;
    quoteContainer.hidden = false;
  };

  const printQuote = ({ quote, author }) => {
    loading();
    const quoteLen = quote.length;
    // Reduce font size for long quotes
    if (quoteLen > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.textContent = quote;
    authorText.textContent = author;
    complete();
  };

  const getQuotes = () => {
    loading();
    // Total: 1454 quotes
    const skip = Math.floor(Math.random() * 1405);
    const apiUrl = `https://dummyjson.com/quotes?limit=${quotesLimit}&skip=${skip}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        apiQuotes = data.quotes;
        printQuote(apiQuotes[0]);
      })
      .catch((error) => {
        console.log('whoops, no quote', error);
        quoteNumber = quotesLimit - 1;
        printQuote(fallbackQuote);
      });
  };

  const tweetQuote = () => {
    const { quote, author } = { ...apiQuotes[quoteNumber] };
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
  };

  const printNewQuote = () => {
    quoteNumber++;
    if (quoteNumber === quotesLimit) {
      quoteNumber = 0;
      getQuotes();
    } else {
      printQuote(apiQuotes[quoteNumber]);
    }
  };

  twitterBtn.addEventListener('click', tweetQuote);
  newQuoteBtn.addEventListener('click', printNewQuote);
  getQuotes();
})();
