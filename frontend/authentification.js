const API_URL = window.ENV_API_URL || "http://localhost:8000";

function showLogin() {
    document.getElementById('form-login').style.display = 'flex';
    document.getElementById('form-register').style.display = 'none';
    document.getElementById('btn-login').classList.add('active');
    document.getElementById('btn-register').classList.remove('active');
}

function showRegister() {
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('form-register').style.display = 'flex';
    document.getElementById('btn-register').classList.add('active');
    document.getElementById('btn-login').classList.remove('active');
}

// Register
document.getElementById('form-register').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;
    const confirm = document.getElementById('password-confirm').value;

    if (password !== confirm) {
        alert("Les mots de passe ne correspondent pas !");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Compte créé ! Tu peux te connecter.");
            showLogin();
        } else {
            alert(data.detail || "Erreur lors de l'inscription");
        }
    } catch (error) {
        alert("Erreur de connexion au serveur");
    }
});

// Login
document.getElementById('form-login').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('email', email);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.detail || "Email ou mot de passe incorrect");
        }
    } catch (error) {
        alert("Erreur de connexion au serveur");
    }
});

window.showLogin = showLogin;
window.showRegister = showRegister;