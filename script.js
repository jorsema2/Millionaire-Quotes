function getRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

function isValidQuote(quote) {
    return (
        typeof quote.text === 'string' &&
        typeof quote.author === 'object' &&
        typeof quote.author.name === 'string' &&
        typeof quote.author.description === 'string'
    );
}

window.onload = function () {
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');

    fetch('./data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const validQuotes = quotes.filter(isValidQuote);

            if (validQuotes.length === 0) {
                throw new Error('No valid quotes found');
            }

            const randomQuote = getRandomQuote(validQuotes);
            const sanitizedQuoteText = escapeHtml(randomQuote.text);
            const sanitizedAuthorName = escapeHtml(randomQuote.author.name);
            const sanitizedAuthorDescription = escapeHtml(randomQuote.author.description);

            quoteElement.textContent = sanitizedQuoteText;
            authorElement.textContent = `${sanitizedAuthorName}, ${sanitizedAuthorDescription}`;

            quoteElement.classList.add('loaded');
            authorElement.classList.add('loaded');
        })
        .catch(() => {
            console.error('Error loading quotes');
            quoteElement.textContent = "Sorry, we couldn’t load the quotes right now. Please refresh the page and try again.";
            if (authorElement) {
                authorElement.remove();
            }
        });
};
