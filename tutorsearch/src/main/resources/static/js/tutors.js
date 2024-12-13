document.addEventListener('DOMContentLoaded', function() {
    loadTutors();
});

function loadTutors() {
    fetch('/api/tutors')
        .then(response => response.json())
        .then(tutors => {
            const tutorsGrid = document.getElementById('tutorsGrid');
            tutorsGrid.innerHTML = '';

            tutors.forEach(tutor => {
                const card = createTutorCard(tutor);
                tutorsGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading tutors:', error));
}

function createTutorCard(tutor) {
    const card = document.createElement('div');
    card.className = 'tutor-card';

    const avgRating = calculateAverageRating(tutor.reviews);

    card.innerHTML = `
        <img src="${tutor.imageUrl || '/images/default-avatar.png'}" alt="${tutor.username}">
        <h2>${tutor.username}</h2>
        <div class="subjects">${tutor.subjects.join(', ')}</div>
        <div class="rating">
            ${getStarRating(avgRating)}
            <span>(${tutor.reviews.length} reviews)</span>
        </div>
        <button class="view-profile-btn" onclick="window.location.href='/tutor-details.html?id=${tutor.id}'">
            View profile
        </button>
    `;

    return card;
}

function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

function getStarRating(rating) {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
} 