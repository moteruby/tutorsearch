let users = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('roleFilter').addEventListener('change', filterUsers);
    document.getElementById('searchInput').addEventListener('input', filterUsers);
}

function loadUsers() {
    fetch('/api/admin/users')
        .then(response => response.json())
        .then(data => {
            users = data;
            displayUsers(users);
        })
        .catch(error => console.error('Error loading users:', error));
}

function displayUsers(usersToDisplay) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    usersToDisplay.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.enabled ? 'Active' : 'Disabled'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="action-btn status-btn" onclick="toggleUserStatus(${user.id})">
                    ${user.enabled ? 'Disable' : 'Enable'}
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterUsers() {
    const roleFilter = document.getElementById('roleFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredUsers = users.filter(user => {
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesSearch = user.username.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm);
        return matchesRole && matchesSearch;
    });

    displayUsers(filteredUsers);
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Заполняем форму данными пользователя
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editPassword').value = '';

    // Показываем модальное окно
    document.getElementById('editUserModal').style.display = 'block';
}

// Добавляем обработчик отправки формы
document.getElementById('editUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('editUserId').value;
    const userData = {
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        role: document.getElementById('editRole').value,
        password: document.getElementById('editPassword').value
    };

    // Если пароль пустой, удаляем его из объекта
    if (!userData.password) {
        delete userData.password;
    }

    fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Update failed');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('editUserModal').style.display = 'none';
        loadUsers(); // Перезагружаем список пользователей
        alert('User updated successfully');
    })
    .catch(error => {
        alert('Error updating user: ' + error.message);
    });
});

// Добавляем обработчик закрытия модального окна
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('editUserModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его области
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editUserModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function toggleUserStatus(userId) {
    fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            loadUsers();
        }
    })
    .catch(error => console.error('Error toggling user status:', error));
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadUsers();
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

function logout() {
    fetch('/api/auth/logout', {
        method: 'POST'
    })
    .then(() => {
        window.location.href = '/login.html';
    });
} 