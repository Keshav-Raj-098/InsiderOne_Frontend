const Backend_URL = "https://insider-one.onrender.com/api";


let isLogin = true; // Track whether the form is for login or registration
var Name;
var email;
var password;

document.getElementById("Name").addEventListener("input", function(e) {
    Name = e.target.value;
});
document.getElementById("email").addEventListener("input", function(e) {
    email = e.target.value;
});
document.getElementById("password").addEventListener("input", function(e) {
    password = e.target.value;
});

document.getElementById('submitBtn').addEventListener('click', async function (e) {
    e.preventDefault();
    const data = {
        "name": Name,
        "email": email,
        "password": password,
    };

    const endpoint = isLogin ? `${Backend_URL}/user/login` : `
    ${Backend_URL}/user/register`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
    if (result.statusCode===200) {
      
            console.log("User ID:", result.data);
            localStorage.setItem('userId', result.data)
            window.location.href = '/feed.html'; // Redirect after login
       
    }
    else {
        window.location.href = '/'; // Redirect to login page after registration
    }
});


document.getElementById('toggleFormLink').addEventListener('click', function () {
    isLogin = !isLogin; // Toggle the form type
    document.getElementById('formTitle').textContent = isLogin ? 'Login' : 'Register';
    document.getElementById('nameField').style.display = isLogin ? 'none' : 'block';
    document.getElementById('submitBtn').textContent = isLogin ? 'Login' : 'Register';
    document.getElementById('toggleFormLink').textContent = isLogin ? "Don't have an account? Register" : "Already have an account? Login";
});