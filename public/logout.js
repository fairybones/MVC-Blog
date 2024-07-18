async function logout() {
    const res = await fetch('/api/users/logout', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (res.ok) {
        document.location.replace('/');
    } else {
        alert(res.statusText);
    }
}
// add event listener for logout button
document.querySelector('#logout').addEventListener('click', logout)