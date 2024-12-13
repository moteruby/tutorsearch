document.getElementById('registerAdminForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: 'ADMIN'
    };

    fetch('/api/auth/register/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(data => {
        alert('Admin registration successful!');
        window.location.href = '/admin/dashboard.html';
    })
    .catch(error => {
        alert(error.error || 'Registration failed. Please try again.');
    });
}); 