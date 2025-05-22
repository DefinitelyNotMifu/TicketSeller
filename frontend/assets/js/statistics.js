// Lấy thống kê bán vé
async function loadStatistics() {
    const month = document.getElementById('month').value;
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch(`/api/showtimes/statistics?month=${month}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userRole: user.role
            })
        });

        const data = await response.json();
        displayStatistics(data);
    } catch (error) {
        showToast('Lỗi khi tải thống kê', 'error');
    }
}

// Hiển thị thống kê
function displayStatistics(data) {
    const statisticsTable = document.getElementById('statisticsTable');
    const totalTickets = document.getElementById('totalTickets');
    const monthDisplay = document.getElementById('monthDisplay');

    monthDisplay.textContent = data.month;
    totalTickets.textContent = data.totalTickets;

    const tbody = statisticsTable.querySelector('tbody');
    tbody.innerHTML = '';

    data.showtimes.forEach(showtime => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${showtime.showTime}</td>
            <td>${showtime.soldTickets}</td>
            <td>${showtime.percentage}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Tìm kiếm xuất chiếu
async function searchShowtimes() {
    const filmTitle = document.getElementById('filmTitle').value;
    const showTime = document.getElementById('showTime').value;
    const date = document.getElementById('date').value;

    try {
        const response = await fetch(`/api/showtimes/search?filmTitle=${filmTitle}&showTime=${showTime}&date=${date}`);
        const showtimes = await response.json();
        displayShowtimes(showtimes);
    } catch (error) {
        showToast('Lỗi khi tìm kiếm xuất chiếu', 'error');
    }
}

// Hiển thị danh sách xuất chiếu
function displayShowtimes(showtimes) {
    const showtimesList = document.getElementById('showtimesList');
    showtimesList.innerHTML = '';

    showtimes.forEach(showtime => {
        const showtimeElement = document.createElement('div');
        showtimeElement.className = 'showtime-item';
        showtimeElement.innerHTML = `
            <div class="showtime-info">
                <h3>${showtime.filmTitle}</h3>
                <p>Phòng: ${showtime.roomName}</p>
                <p>Ngày: ${showtime.date}</p>
                <p>Ca chiếu: ${showtime.showTime}</p>
                <p>Đã bán: ${showtime.soldSeats} vé</p>
            </div>
        `;
        showtimesList.appendChild(showtimeElement);
    });
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
}); 