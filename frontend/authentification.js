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