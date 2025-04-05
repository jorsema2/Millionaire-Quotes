function getRandomQuote(quotes) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidQuote(quote) {
  return typeof quote.text === "string" && typeof quote.author_id === "number";
}

function isValidAuthor(author) {
  return (
    typeof author.author_id === "number" &&
    typeof author.name === "string" &&
    typeof author.description === "string"
  );
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu.classList.contains("open")) {
    menu.classList.remove("open");
    console.log("Menu closed");
  } else {
    menu.classList.add("open");
    console.log("Menu opened");
  }
}

function closeMenu(event) {
  const menu = document.getElementById("menu");
  const menuButton = document.getElementById("menu-button");
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
    menu.classList.remove("open");
  }
}

window.onload = function () {
  const menuButton = document.getElementById("menu-button");

  menuButton.addEventListener("click", toggleMenu);

  document.addEventListener("click", closeMenu);

  document.getElementById("review").addEventListener("click", function () {
    const reviewUrl =
      "https://chromewebstore.google.com/detail/millionaire-quotes/ompkpkafcfljggikfipodidceijgelim/reviews";
    window.open(reviewUrl, "_blank");
  });

  document.getElementById("share").addEventListener("click", function () {
    const extensionUrl =
      "https://chromewebstore.google.com/detail/millionaire-quotes/ompkpkafcfljggikfipodidceijgelim";

    navigator.clipboard
      .writeText(extensionUrl)
      .then(() => {
        alert("Extension link copied to clipboard. You can now share it!");
      })
      .catch((err) => {
        console.error("Error copying link to clipboard:", err);
        alert("Failed to copy the link. Please try again.");
      });
  });

  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");

  fetch("./data/quotes.json")
    .then((response) => response.json())
    .then((data) => {
      const authors = data.authors;
      const quotes = data.quotes;

      const validAuthors = authors.filter(isValidAuthor);
      const validQuotes = quotes.filter(isValidQuote);

      if (validQuotes.length === 0 || validAuthors.length === 0) {
        throw new Error("No valid quotes or authors found");
      }

      const randomQuote = getRandomQuote(validQuotes);

      const author = authors.find((a) => a.author_id === randomQuote.author_id);

      const sanitizedQuoteText = escapeHtml(randomQuote.text);
      const sanitizedAuthorName = escapeHtml(author.name);
      const sanitizedAuthorDescription = escapeHtml(author.description);

      quoteElement.textContent = sanitizedQuoteText;
      authorElement.textContent = `${sanitizedAuthorName}, ${sanitizedAuthorDescription}`;

      quoteElement.classList.add("loaded");
      authorElement.classList.add("loaded");
    })
    .catch(() => {
      console.error("Error loading quotes");
      quoteElement.textContent =
        "Sorry, we couldn’t load the quotes right now. Please refresh the page and try again.";
      if (authorElement) {
        authorElement.remove();
      }
    });
};
