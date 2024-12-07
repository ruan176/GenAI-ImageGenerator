async function generateImage(prompt, size) {
    const apiUrl = 'https://api.openai.com/v1/images/generations';  // The endpoint for DALL-E
    const apiKey = "ADD_OPENAI_KEY"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
    };

    const body = {
        model: "dall-e-3",  
        prompt: prompt,      
        n: 1,                
        size: size 
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body) 
        });

        // Check the response is ok
        if (!response.ok) {
            const errorText = await response.text(); // Get the error message
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json(); 
        return data.data;  // Return the array of generated image objects
    } catch (error) {
        console.error("Error in API call:", error);
        throw error;  
    }
}

// Event listener for the submit button
document.getElementById("submitButton").addEventListener("click", async function() {
    const userInput = document.getElementById("inputText").value; // Get user input
    const imageSize = document.getElementById("imageSize").value; // Get selected size

    if (userInput.trim() === "") {
        alert("Please enter some text");
        return; // Exit if no input
    }

    // Show loading indicator with message
    showLoading(true, "Generating AI Image...");

    try {
        const images = await generateImage(userInput, imageSize); // Call the generateImage function with inputs
        displayImages(images); // Display the returned images
    } catch (error) {
        console.error("Error generating image:", error);
        alert("There was an error generating the image. Please try again.");
    } finally {
        // Hide loading indicator
        showLoading(false);
    }
});

// Function to display the generated images on the front end
function displayImages(images) {
    const outputContainer = document.getElementById("outputImages");
    outputContainer.innerHTML = ""; 

    images.forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = image.url; 
        imgElement.alt = "Generated Image";
        imgElement.style.display = 'block'; 
        outputContainer.appendChild(imgElement);
    });
}

// Function to show/hide loading indicator with dynamic message
function showLoading(isLoading, message = "") {
    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.textContent = message; 
    loadingIndicator.style.display = isLoading ? 'block' : 'none'; // Show or hide the loading indicator
}
