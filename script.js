const textInput = document.getElementById("textInput");
const clarifyButton = document.getElementById("clarifyButton");
const summary = document.getElementById("summary");
const wordCount = document.getElementById("wordCount");
const sentenceCount = document.getElementById("sentenceCount");


/* COUNT WORDS */

textInput.addEventListener("input", () => {

    const text = textInput.value.trim();

    if (text === "") {
        wordCount.textContent = "0 words";
        return;
    }

    const words = text.split(/\s+/);

    wordCount.textContent =
        words.length + (words.length === 1 ? " word" : " words");
});


/* SUMMARIZE */

clarifyButton.addEventListener("click", () => {

    const text = textInput.value.trim();

    if (text === "") {
        summary.innerHTML =
            '<p class="placeholder">Please enter some text first.</p>';

        return;
    }

    const sentences = text
        .replace(/\n/g, " ")
        .match(/[^.!?]+[.!?]+/g);


    if (!sentences || sentences.length <= 3) {

        summary.innerHTML = `<p>${text}</p>`;

        sentenceCount.textContent =
            "Already short";

        return;
    }


    /*
       Give each sentence a score.

       Important sentences usually contain
       important words repeated throughout the text.
    */

    const cleanSentences = sentences.map(sentence =>
        sentence.trim()
    );


    const words = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/);


    const stopWords = new Set([
        "the", "a", "an", "and", "or", "but",
        "is", "are", "was", "were", "to",
        "of", "in", "on", "for", "with",
        "as", "by", "from", "that", "this",
        "it", "its", "at", "be", "has",
        "have", "had", "their", "they"
    ]);


    const frequency = {};

    words.forEach(word => {

        if (
            word.length > 3 &&
            !stopWords.has(word)
        ) {
            frequency[word] =
                (frequency[word] || 0) + 1;
        }
    });


    const scoredSentences = cleanSentences.map(
        (sentence, index) => {

            const sentenceWords = sentence
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .split(/\s+/);

            let score = 0;

            sentenceWords.forEach(word => {

                if (frequency[word]) {
                    score += frequency[word];
                }

            });


            return {
                sentence: sentence,
                score: score,
                index: index
            };
        }
    );


    /* Choose the 3 most important sentences */

    const bestSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .sort((a, b) => a.index - b.index);


    const finalSummary = bestSentences
        .map(item => item.sentence)
        .join(" ");


    summary.innerHTML = `
        <p>${finalSummary}</p>
    `;


    sentenceCount.textContent =
        bestSentences.length + " key sentences";
});
