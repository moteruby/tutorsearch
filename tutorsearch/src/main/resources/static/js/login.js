document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const searchParams = new URLSearchParams();
    for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
    }

    fetch('/api/auth/login', {
        method: 'POST',
        body: searchParams
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/index.html';
        } else {
            throw new Error('Login failed');
        }
    })
    .catch(error => {
        alert('Login failed. Please check your credentials.');
    });
}); 