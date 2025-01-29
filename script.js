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

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
    console.log('Menu toggled');
}

window.onload = function () {
    const menuButton = document.getElementById('menu-button');

    menuButton.addEventListener('click', toggleMenu);

    document.getElementById('review').addEventListener('click', function() {
        const reviewUrl = 'https://chromewebstore.google.com/detail/millionaire-quotes/ompkpkafcfljggikfipodidceijgelim/reviews';
        window.open(reviewUrl, '_blank');
    });

    document.getElementById('share').addEventListener('click', function() {
        const extensionUrl = 'https://chromewebstore.google.com/detail/millionaire-quotes/ompkpkafcfljggikfipodidceijgelim';
    
        navigator.clipboard.writeText(extensionUrl)
            .then(() => {
                alert('Link copied to clipboard! You can now share it.');
            })
            .catch((err) => {
                console.error('Error copying link to clipboard:', err);
                alert('Failed to copy the link. Please try again.');
            });
    });
    
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
