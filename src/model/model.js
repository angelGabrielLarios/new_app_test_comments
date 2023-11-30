import * as tf from '@tensorflow/tfjs';

let model = null;
let tokenizerConfig = null;
/* const vocabSize = 2097;  // Vocabulary size */
const max_length = 42;  // Maximum length of comments

// Load the model
(async () => {
    console.log("Loading the model...");
    model = await tf.loadLayersModel("/assets/model.json");
    console.log("Model loaded!");

    // Load the tokenizer configuration
    try {
        const response = await fetch('/assets/tokenizer_config.json');
        tokenizerConfig = await response.json();
        console.log("Tokenizer configuration loaded");
    } catch (error) {
        console.error('Error loading tokenizer configuration:', error);
    }
})();

// Function to preprocess comments before sending them to the model
export function preprocessComment(comment) {
    if (tokenizerConfig !== null) {
        const words = comment.split(' ');
        const numericSequence = words.map(word => {
            const index = tokenizerConfig[word] || 0; // If the word is not in the tokenizer, assign the padding token (0)
            return index;
        });

        // Apply padding if necessary to match the maximum length
        while (numericSequence.length < max_length) {
            numericSequence.push(0); // Use the padding token (or PAD) used during training
        }

        return numericSequence;
    } else {
        console.error("Tokenizer configuration not loaded");
        return null;
    }
}

// Function to make predictions
export async function predictComment(processedComment) {
    if (model !== null) {
        if (processedComment !== null) {
            // Convert the preprocessed comment to a tensor
            const tensor = tf.tensor2d([processedComment], [1, max_length]);

            // Make the prediction
            const prediction = model.predict(tensor);

            // Get the predicted label
            const labels = ['Negative', 'Neutral', 'Positive'];
            const predictedLabelIndex = tf.argMax(prediction, 1).dataSync()[0];
            const predictedLabel = labels[predictedLabelIndex];

            return predictedLabel;
        } else {
            console.error("Unprocessed comment");
            return "Error";
        }
    } else {
        console.error("Model not loaded");
        return "Error";
    }
}

(async () => {
    // Wait for the model and tokenizer configuration to load
    while (model === null || tokenizerConfig === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before checking again
    }
})();
