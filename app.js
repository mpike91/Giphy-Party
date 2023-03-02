// Grab form, giphy wrapper, input, and button
const giphyForm = document.querySelector("form")
const giphyWrapper = document.querySelector("#giphy-wrapper");
const input = document.querySelector("input");
const removeBtn = document.querySelector("#remove-btn");
// Set API Key
const apiKey = "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym";
// Create gifCollection object
const gifCollection = {};

// When user submits form, run this function to handle the input
async function submitForm(e) {
    e.preventDefault();
    // Grab value from the user input, set to origSearchTearm. This will be used in an alert message at end of function.
    const origSearchTerm = input.value;
    // Set searchTerm to the lowercase of user input. This way the logic ignores all casing.
    const searchTerm = origSearchTerm.toLowerCase();
    // If the user searchTerm is not already in gifCollection object, then use try/catch block to get a gif using the giphy API
    if (!gifCollection[searchTerm]) {
        try {
            // Add the giphy API object to the gifCollection object using axios.get
            gifCollection[searchTerm] = await axios.get(`https://api.giphy.com/v1/gifs/search`, {params: {q: searchTerm, api_key: apiKey}});
            // If the returned object has no images in data.data array, then it is an invalid search term. Delete it from the gifCollection object and return alert
            if (!gifCollection[searchTerm].data.data.length) {
                delete gifCollection[searchTerm];
                return alert("Invalid Search Term!");
            }
        } catch (e) {
            return alert("Invalid Search Term!");
        }
    }
    // Use splice on gifCollection[searchTerm] object to delete 1 random element from the array, and set the deleted element to "gif". If the array is empty, the splice method will set "gif" to undefined.
    const gif = gifCollection[searchTerm].data.data.splice(Math.floor(Math.random() * gifCollection[searchTerm].data.data.length), 1)[0];
    // If gif is truthy (ie, the splice method did not return undefined), pass the url in gif object to addGIF function. Otherwise, alert the user that they've generated all 50 GIF's using that search term.
    return gif ? addGIF(gif.images.original.url) : alert(`You've generated all 50 available GIFs for "${origSearchTerm}"! Please use a new search term.`);
}

// Receive url and create a new img element. Adjust styling by bootstrap class names, and prepend to the giphyWrapper so it appears first in order.
function addGIF (url) {
    const newImg = document.createElement("img");
    newImg.setAttribute("src", url);
    newImg.classList.add("m-4", "rounded");
    giphyWrapper.prepend(newImg);
}

// Delete all HTML content from giphyWrapper, thus deleting all GIFs. Then clear out the gifCollection object so start fresh.
function removeGIF (e) {
    giphyWrapper.innerHTML = "";
    for (let key in gifCollection) {
        delete gifCollection[key];
    }
}

giphyForm.addEventListener("submit", submitForm);
removeBtn.addEventListener("click", removeGIF);
