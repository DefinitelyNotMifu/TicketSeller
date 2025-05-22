// Lấy danh sách xuất chiếu
async function loadShowtimes() {
    try {
        const response = await fetch('/api/showtimes');
        const showtimes = await response.json();
        displayShowtimes(showtimes);
    } catch (error) {
        showToast('Lỗi khi tải danh sách xuất chiếu', 'error');
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
                <p>Còn lại: ${showtime.availableSeats} ghế</p>
            </div>
            <div class="showtime-actions">
                <input type="number" min="1" max="${showtime.availableSeats}" value="1" class="form-control mb-2" id="quantity-${showtime.id}">
                <button class="btn btn-primary" onclick="sellTickets(${showtime.id})">Bán vé</button>
            </div>
        `;
        showtimesList.appendChild(showtimeElement);
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

// Bán vé
async function sellTickets(showtimeId) {
    const quantity = document.getElementById(`quantity-${showtimeId}`).value;
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch(`/api/showtimes/${showtimeId}/sell`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: parseInt(quantity),
                userRole: user.role
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Bán vé thành công', 'success');
            loadShowtimes(); // Tải lại danh sách xuất chiếu
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi khi bán vé', 'error');
    }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadShowtimes();
}); 