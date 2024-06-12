//Time
//loginpage part

//create cookies  register function
function setCookie(name, value, days) {  
    var date = new Date();  
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  
    var expires = "; expires=" + date.toUTCString();  
    document.cookie = name + "=" + (value || "") + expires + "; path=/";  
}  
function register() {  
    var username = document.getElementById("usernameInput").value;  
    var password = document.getElementById("userpassword").value;  
    var isEmail = isEmailValid(username);
    if (isEmail){
        if(cookiesObj[username]){
            alert('Repeat username!')
        }else{
            setCookie(username, password, 7);  
            alert("Account created and it will be saved 7 days.");
            window.location.href = 'loginpage.html'  
        }
    }else{
        alert('Wrong email format!')
    }
}
//verify part
function isEmailValid(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
//login part
function parseCookies() {  
    var cookies = {};
    if (document.cookie && document.cookie !== '') {  
        var cookiesArray = document.cookie.split(';');
        for (var i = 0; i < cookiesArray.length; i++) {  
            var cookiePair = cookiesArray[i].split('=');  
            cookies[decodeURIComponent(cookiePair[0].trim())] = decodeURIComponent(cookiePair[1].trim());
        }  
    }
    return cookies; 
} 
var cookiesObj = parseCookies();  
function login() {  
    var username = document.getElementById('usernameInput').value;
    var password = document.getElementById('userpassword').value;
    var isEmail = isEmailValid(username);

    if (isEmail){
        if( password == cookiesObj[username]){
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'cart.html'
        }else{
            alert('Please enter correct account or password.');
        }
    }else{
        alert('Wrong email format!');
    }
}  

function checkIfLoggedIn() {  

    var isLoggedIn = localStorage.getItem('isLoggedIn');    
    var username = localStorage.getItem('username');    
    var currentPageTitle = document.title;   
  
    if(isLoggedIn !== 'true') {  
        if(currentPageTitle === 'Cart') {    
            alert('Please login to view your cart.');  
            window.location.href = 'loginpage.html';   
        } else if(currentPageTitle === 'Cookies Demo') {    
            alert('Please login in');  
        }  
    } else { 
        if(currentPageTitle === 'Cookies Demo'){  
            window.location.href = 'cart.html';  
        } else {  
            alert('Welcome, ' + username + '!');    
        }  
    }
}
window.onload = checkIfLoggedIn;

//loginout part
function loginout() {
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('username'); 
    window.location.href = 'loginpage.html'; 
}

//delete cookies
function eraseCookie(name) {  
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';  
}
function deleteUsername() {  
    var cookieName = document.getElementById('usernameInput').value; 
    eraseCookie(cookieName);  
    alert('cookie deleted.'); 
    window.location.href = 'loginpage.html'
}


//Cart part
const cartContainer = document.querySelector('.cartcontainor');
const totalDisplay = document.querySelector('.totalprice'); // select the element to display totalprice

// calculate total price of the all courses
function calculateTotal626() {
    let total = 0;
    const cartItems = cartContainer.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('p').textContent.split('$')[1]); 
        const count = parseInt(item.querySelector('.cart-count').textContent, 10); 
        total += price * count;
    });
    return total;
}

// update total price of the all courses
function updateTotal626() {
    const total = calculateTotal626();
    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// function of removing items
function removeItem626(event) {
    if (event.target.className === 'remove-button') {
        const itemToRemove = event.target.closest('.cart-item');
        cartContainer.removeChild(itemToRemove);
        updateTotal626();
    }
}

function addToCart626(event) {
    if (event.target.className === 'button') {
        const courseContainer = event.target.closest('.course');
        if (!courseContainer) return;

        const courseTitle = courseContainer.querySelector('h1').textContent;
        const coursePrice = parseFloat(courseContainer.querySelector('p').textContent.replace('$', ''));

        // get the number of the users entered, default value is 1
        const quantity = parseInt(courseContainer.querySelector('input[type="text"]').value, 10) || 1;
        const cartContainer = document.querySelector('.cartcontainor');

        // Find if the same course item already exists in the cart
        let existingItem = null;
        const cartitem = cartContainer.querySelectorAll('.cart-item')
        for (const item of cartitem) {
            if (item.querySelector('h2').textContent === courseTitle) {
                existingItem = item;
                break;
            }
        }

        let item;
        if (existingItem) {
            item = existingItem;
            // If present, update the quantity and total price
            const currentCount = parseInt(existingItem.querySelector('.cart-count').textContent, 10);
            const newQuantity = currentCount + quantity;
            existingItem.querySelector('.cart-count').textContent = `${currentCount + quantity} x`;
            existingItem.querySelector('.coursetotal').textContent = `Total: $${(coursePrice * newQuantity).toFixed(2)}`;
        } else {
            // If it doesn't exist, create a new item
            item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <h2>${courseTitle}</h2>
                <p>Price: $${coursePrice.toFixed(2)}</p>
                <p class="cart-count">${quantity} </p>
                <p class="coursetotal">Total: $${(coursePrice * quantity).toFixed(2)}</p>
                <button class="remove-button">Remove</button>
            `;
            cartContainer.appendChild(item);
        }

        // Call the function
        updateTotal626();

        // Add a Remove button event to a newly created course item
        if (!existingItem) {
            item.querySelector('.remove-button').addEventListener('click', removeItem626);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {

    // get the button
    var emptyCartButton = document.getElementById('empty-cart');
    // add listener to the empty button
    emptyCartButton.addEventListener('click', function() {
        if (window.confirm('Are you sure you want to empty the cart?')) {
            // sure to empty cart
            while (cartContainer.firstChild) {
                cartContainer.removeChild(cartContainer.firstChild);
            }
            updateTotal626();
        }
    });
});

// Once the page loads, add click event listeners to all the 'Add to Cart' buttons
document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.button');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', addToCart626);
    });

    // Once the page loads, add an event listener for each remove button in the cart
    var removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(function(btn) {
        btn.addEventListener('click', removeItem626);
    });
});

//checkout window alert
function checkoutbutton626(){
    window.confirm('Succeed to buy! Tanks a lot!')
}

//equire button
function equirebutton626(){
    window.confirm('Succeed to submit!')
}
