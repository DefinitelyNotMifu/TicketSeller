// Kiểm tra trạng thái đăng nhập
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authSection = document.getElementById('auth');
    const userDropdown = document.getElementById('userDropdown');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const sellerNav = document.getElementById('seller');
    const managerNav = document.getElementById('manager');
    const customerNav = document.getElementById('customer');

    if (user) {
        authSection.style.display = 'none';
        userDropdown.style.display = 'block';
        usernameDisplay.textContent = user.name;

        // Hiển thị menu theo role
        if (user.role === 'ticket_seller') {
            sellerNav.style.display = 'block';
            managerNav.style.display = 'none';
            customerNav.style.display = 'none';
        } else if (user.role === 'manager') {
            sellerNav.style.display = 'none';
            managerNav.style.display = 'block';
            customerNav.style.display = 'none';
        } else {
            sellerNav.style.display = 'none';
            managerNav.style.display = 'none';
            customerNav.style.display = 'block';
        }
    } else {
        authSection.style.display = 'block';
        userDropdown.style.display = 'none';
        sellerNav.style.display = 'none';
        managerNav.style.display = 'none';
        customerNav.style.display = 'block';
    }
}

// Xử lý đăng nhập
async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            showToast('Đăng nhập thành công', 'success');
            setTimeout(() => {
                window.location.href = data.user.role === 'ticket_seller' ? 'seller.html' : 'statistics.html';
            }, 1000);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi server', 'error');
    }
}

// Xử lý đăng xuất
function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('user');
    showToast('Đăng xuất thành công', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Hiển thị thông báo
function showToast(message, type) {
    const toast = document.getElementById('myToast');
    toast.innerHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    const toastElement = new bootstrap.Toast(toast.querySelector('.toast'));
    toastElement.show();
}

// Kiểm tra quyền truy cập trang
function checkPageAccess() {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPage = window.location.pathname.split('/').pop();

    if (!user) {
        if (currentPage !== 'login.html' && currentPage !== 'index.html') {
            window.location.href = 'login.html';
        }
        return;
    }

    if (user.role === 'ticket_seller' && currentPage === 'statistics.html') {
        window.location.href = 'seller.html';
    } else if (user.role === 'manager' && currentPage === 'seller.html') {
        window.location.href = 'statistics.html';
    }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    checkPageAccess();
}); 