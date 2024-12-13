let calendar;
let currentUserId;
let currentUserType;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventClick: function(info) {
            showEventDetails(info.event);
        },
        events: function(info, successCallback, failureCallback) {
            if (!currentUserId) {
                successCallback([]);
                return;
            }

            const start = info.start.toISOString();
            const end = info.end.toISOString();

            console.log('Fetching events for:', {
                userId: currentUserId,
                userType: currentUserType,
                start: start,
                end: end
            });

            const url = currentUserType === 'tutor'
                ? `/api/lessons/tutor/${currentUserId}?start=${start}&end=${end}`
                : `/api/lessons/student/${currentUserId}?start=${start}&end=${end}`;

            fetch(url)
                .then(response => response.json())
                .then(lessons => {
                    const events = lessons.map(lesson => ({
                        id: lesson.id,
                        title: lesson.subject,
                        start: lesson.startTime,
                        end: lesson.endTime,
                        backgroundColor: getStatusColor(lesson.status),
                        extendedProps: {
                            description: lesson.description,
                            status: lesson.status,
                            tutor: lesson.tutor,
                            student: lesson.student
                        }
                    }));
                    console.log('Mapped events:', events);
                    successCallback(events);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    failureCallback(error);
                });
        }
    });
});

function loadCalendar() {
    currentUserId = document.getElementById('userId').value;
    currentUserType = document.getElementById('userType').value;

    if (!currentUserId) {
        alert('Please enter user ID');
        return;
    }

    console.log('Loading calendar for:', {
        userId: currentUserId,
        userType: currentUserType
    });

    // Показываем/скрываем кнопки в зависимости от типа пользователя
    document.getElementById('createRequestBtn').style.display = 'inline-block';
    document.getElementById('viewRequestsBtn').style.display = 'inline-block';

    calendar.render();
    updateUserTypeLabel();
}

function updateUserTypeLabel() {
    const label = currentUserType === 'student' ? 'Tutor' : 'Student';
    document.getElementById('userTypeLabel').textContent = label;
}

function showRequestModal() {
    const modal = document.getElementById('requestModal');
    modal.style.display = 'block';
    loadOtherUsers();
}

function loadOtherUsers() {
    const url = currentUserType === 'student' ? '/api/lessons/tutors' : '/api/lessons/students';

    fetch(url)
        .then(response => response.json())
        .then(users => {
            const select = document.getElementById('otherUserSelect');
            select.innerHTML = '<option value="">Select...</option>';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.username} (${user.email})`;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading users:', error));
}

function showPendingRequestsModal() {
    const modal = document.getElementById('pendingRequestsModal');
    const requestsList = document.getElementById('pendingRequestsList');
    requestsList.innerHTML = '<p>Loading requests...</p>';
    modal.style.display = 'block';

    console.log('Fetching pending requests for user:', currentUserId);

    fetch(`/api/lessons/pending/${currentUserId}`)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(requests => {
            console.log('Received requests:', requests);
            requestsList.innerHTML = '';

            if (requests.length === 0) {
                requestsList.innerHTML = '<p>No pending requests found.</p>';
                return;
            }

            requests.forEach(request => {
                const requestCard = document.createElement('div');
                requestCard.className = 'request-card';

                const otherUser = currentUserType === 'student' ?
                    request.tutor : request.student;

                requestCard.innerHTML = `
                    <h3>${request.subject}</h3>
                    <div class="request-details">
                        <p><strong>${currentUserType === 'student' ? 'Tutor' : 'Student'}:</strong> 
                            ${otherUser.username}</p>
                        <p><strong>Date:</strong> 
                            ${new Date(request.startTime).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> 
                            ${new Date(request.startTime).toLocaleTimeString()} - 
                            ${new Date(request.endTime).toLocaleTimeString()}</p>
                        <p><strong>Description:</strong> ${request.description || 'No description'}</p>
                    </div>
                    <div class="request-actions">
                        <button class="approve-btn" onclick="handleRequest(${request.id}, 'approve')">
                            Approve
                        </button>
                        <button class="reject-btn" onclick="handleRequest(${request.id}, 'reject')">
                            Reject
                        </button>
                    </div>
                `;
                requestsList.appendChild(requestCard);
            });
        })
        .catch(error => {
            console.error('Error loading pending requests:', error);
            requestsList.innerHTML = '<p>Error loading pending requests. Please try again.</p>';
        });
}

function handleRequest(lessonId, action) {
    console.log(`Handling ${action} for lesson ${lessonId}`);

    fetch(`/api/lessons/${lessonId}/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(updatedLesson => {
            console.log('Lesson updated:', updatedLesson);
            showPendingRequestsModal(); // Перезагружаем список
            calendar.refetchEvents(); // Обновляем календарь
            alert(`Lesson ${action}ed successfully!`);
        })
        .catch(error => {
            console.error(`Error ${action}ing lesson:`, error);
            alert(`Error ${action}ing lesson. Please try again.`);
        });
}

// Form submission handler
document.getElementById('lessonRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const startTime = new Date(
        document.getElementById('lessonDate').value + 'T' +
        document.getElementById('lessonTime').value
    );

    // Проверка на прошедшую дату
    if (startTime < new Date()) {
        alert('Cannot schedule lessons in the past');
        return;
    }

    const duration = parseInt(document.getElementById('duration').value);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const requestData = {
        tutorId: document.getElementById('otherUserSelect').value,
        studentId: currentUserId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        subject: document.getElementById('subject').value,
        description: document.getElementById('description').value
    };

    console.log('Sending lesson request:', requestData);

    fetch('/api/lessons/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(newLesson => {
            console.log('Lesson request created:', newLesson);
            document.getElementById('requestModal').style.display = 'none';
            document.getElementById('lessonRequestForm').reset();
            calendar.refetchEvents();
            alert('Lesson request sent successfully!');
        })
        .catch(error => {
            console.error('Error creating lesson request:', error);
            alert('Error creating lesson request. Please try again.');
        });
});

function getStatusColor(status) {
    switch (status) {
        case 'PENDING':
            return '#FFA500'; // Orange
        case 'APPROVED':
            return '#4CAF50'; // Green
        case 'REJECTED':
            return '#f44336'; // Red
        case 'COMPLETED':
            return '#2196F3'; // Blue
        case 'CANCELLED':
            return '#9E9E9E'; // Grey
        default:
            return '#9E9E9E'; // Grey
    }
}

function showEventDetails(event) {
    const props = event.extendedProps;
    const otherUser = currentUserType === 'student' ? props.tutor : props.student;
    const modal = document.getElementById('eventDetailsModal');
    const content = document.getElementById('eventDetailsContent');

    // Получаем цвет для статуса
    const statusColor = getStatusColor(props.status);

    // Форматируем дату и время
    const date = event.start.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const startTime = event.start.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const endTime = event.end.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    content.innerHTML = `
        <div class="event-details">
            <div class="event-header">
                <h2 class="event-title">${event.title}</h2>
                <span class="event-status" style="background-color: ${statusColor}">
                    ${props.status}
                </span>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">${currentUserType === 'student' ? 'Tutor' : 'Student'}</div>
                    <div class="info-value">${otherUser.username}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Date</div>
                    <div class="info-value">${date}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Start time</div>
                    <div class="info-value">${startTime}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">End time</div>
                    <div class="info-value">${endTime}</div>
                </div>
            </div>

            <div class="description-section">
                <div class="description-label">Description</div>
                <div class="description-text">${props.description || 'No description'}</div>
            </div>
        </div>
    `;

    // Показываем модальное окно
    modal.style.display = 'block';

    // Закрытие модального окна при клике на крестик
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Закрытие модального окна при клике вне его области
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Close modal handlers
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}