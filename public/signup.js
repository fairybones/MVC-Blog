// logic for handling signupForm
async function signupFormHandler(event) {
    // prevent form from automatically clearing
    event.preventDefault();

    const userName = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    // if we have both variables, proceed with login
    if (userName && password) {
        const res = await fetch('/api/users', {
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
document.querySelector('.signup-form').addEventListener('submit', loginFormHandler);