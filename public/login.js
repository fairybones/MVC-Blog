// logic for handling loginForm
async function loginFormHandler(event) {
    // prevent form from automatically clearing
    event.preventDefault();

    const userName = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    // if we have both variables, proceed with login
    if (userName && password) {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: { 'Content-Type': 'application/json' }
        });
    if (res.ok) {
        document.location.replace('/homepage');
    } else {
        console.log('An error occurred while logging in', err);
    }}
}
// add event listener for form submit
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);