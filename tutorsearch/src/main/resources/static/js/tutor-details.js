let currentRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tutorId = urlParams.get('id');

    if (tutorId) {
        loadTutorDetails(tutorId);
        setupReviewForm(tutorId);
    }
});

function setupReviewForm(tutorId) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = this.dataset.rating;
            updateStars();
        });
    });

    document.getElementById('submitReview').addEventListener('click', function() {
        const reviewText = document.getElementById('reviewText').value;

        if (!currentRating || !reviewText) {
            alert('Please provide both rating and review text');
            return;
        }

        submitReview({
            tutorId: tutorId,
            rating: currentRating,
            text: reviewText
        });
    });
}

function updateStars() {
    document.querySelectorAll('.star').forEach((star, index) => {
        star.textContent = index < currentRating ? '★' : '☆';
    });
}

function loadTutorDetails(tutorId) {
    fetch(`/api/tutors/${tutorId}`)
        .then(response => response.json())
        .then(tutor => {
            document.getElementById('tutorName').textContent = tutor.username;
            document.getElementById('tutorEmail').textContent = tutor.email;
            document.getElementById('tutorSubjects').textContent = tutor.subjects.join(', ');
            document.getElementById('tutorDescription').textContent = tutor.description || 'No description available';
            document.getElementById('tutorRating').textContent =
                `Rating: ${tutor.averageRating ? tutor.averageRating.toFixed(1) : 'No ratings yet'}`;
            if (tutor.imageUrl) {
                document.getElementById('tutorImage').src = tutor.imageUrl;
            }
            loadTutorReviews(tutorId);
        });
}

function loadTutorReviews(tutorId) {
    fetch(`/api/reviews/tutor/${tutorId}`)
        .then(response => response.json())
        .then(reviews => {
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = '';
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                        <div class="review-info">
                            <span class="review-author">By: ${review.studentName}</span>
                            <span class="review-date">Date: ${new Date(review.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="review-text">${review.text}</div>
                `;
                reviewsList.appendChild(reviewElement);
            });
        });
}

function submitReview(review) {
    fetch('/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review)
    })
        .then(response => response.json())
        .then(savedReview => {
            alert('Thank you for your review!');
            document.getElementById('reviewText').value = '';
            currentRating = 0;
            updateStars();
            loadTutorReviews(review.tutorId);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting review. Please try again.');
        });
}