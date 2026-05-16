// --- Modal Sliding Logic ---
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const modalContainer = document.getElementById('modalContainer');
const authModal = document.getElementById('authModal');

// Slide to Sign Up (Adds class to move panels)
signUpBtn.addEventListener('click', () => {
    modalContainer.classList.add("right-panel-active");
});

// Slide to Sign In (Removes class)
signInBtn.addEventListener('click', () => {
    modalContainer.classList.remove("right-panel-active");
});

// Open Modal Function
function openModal(type) {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Choose which side to show based on button clicked
    if (type === 'signup') {
        modalContainer.classList.add("right-panel-active");
    } else {
        modalContainer.classList.remove("right-panel-active");
    }
}

// Close Modal Function
function closeModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside the container
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModal();
    }
});

// --- Scroll Fade-In Animation ---
document.addEventListener("DOMContentLoaded", function() {
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after fading in if you only want it to happen once
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// --- Authentication Logic ---
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupMessage = document.getElementById('signupMessage');
const loginMessage = document.getElementById('loginMessage');

function getUsers() {
    const users = localStorage.getItem('teachstackUsers');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('teachstackUsers', JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem('teachstackCurrentUser', username);
}

function showMessage(element, message, isError = true) {
    element.textContent = message;
    element.style.color = isError ? '#F47C20' : '#009A55';
}

function clearMessages() {
    signupMessage.textContent = '';
    loginMessage.textContent = '';
}

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessages();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;

    if (!username || !email || !password) {
        showMessage(signupMessage, 'Please complete all fields.');
        return;
    }

    if (password.length < 8) {
        showMessage(signupMessage, 'Password must be at least 8 characters.');
        return;
    }

    const users = getUsers();
    const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() || user.email === email);

    if (existingUser) {
        showMessage(signupMessage, 'That username or email is already registered.');
        return;
    }

    users.push({ username, email, password });
    saveUsers(users);
    setCurrentUser(username);
    showMessage(signupMessage, 'Account created successfully! Redirecting...', false);

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 800);
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessages();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage(loginMessage, 'Please enter your username and password.');
        return;
    }

    const users = getUsers();
    const user = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

    if (!user) {
        showMessage(loginMessage, 'Invalid username or password.');
        return;
    }

    setCurrentUser(user.username);
    showMessage(loginMessage, 'Login successful! Redirecting...', false);

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
});
