function getRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

window.onload = function () {
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');

    fetch('./data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const randomQuote = getRandomQuote(quotes);
            quoteElement.textContent = `"${randomQuote.text}"`;
            authorElement.textContent = `- ${randomQuote.author.name}, ${randomQuote.author.description}`;
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            quoteElement.textContent = "Error loading quotes.";
            authorElement.textContent = "";
        });
};
