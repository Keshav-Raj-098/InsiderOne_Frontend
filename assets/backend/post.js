
const Backend_URL = "https://insider-one.onrender.com/api";
const Title = "Title of Post";
const userId = localStorage.getItem('userId');



const description = document.getElementById("title");
const fileInput = document.getElementById("file-upload");
const post = document.getElementById("post");

let Description = "";
let filePost = null;

// Handle file change event
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        filePost = file;
    } else {
        console.log('No file selected');
    }
});

// Handle description input event
description.addEventListener("input", function() {
    Description = description.value;
});

// Handle post submission
const handlePost = async () => {
    try {
        // Create FormData object to handle both text and file
        const formData = new FormData();
        formData.append('title', Title);
        formData.append('description', Description);
        if (filePost) {
            formData.append('post', filePost);  // Append file if available
        }

        const requestOptions = {
            method: 'POST',
            body: formData // Do not set Content-Type, FormData will handle it
        };

        const url = `${Backend_URL}/post/create/${userId}`;
        console.log(url);
        
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (data.statusCode === 200) {
            console.info("Post Uploaded Successfully");
            window.location.reload();
        } else {
            console.error("Error:", data);
        }
    } catch (err) {
        console.log(err.message);
    }
};

// Add event listener to post button
post.addEventListener("click", handlePost);


