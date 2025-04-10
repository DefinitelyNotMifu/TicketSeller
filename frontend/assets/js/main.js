const URL = "http://localhost:8000";

// Hàm đăng ký
async function register(e) {
    e.preventDefault();

    const formData = {
        fullname: document.getElementById("fullname").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        role: document.getElementById("role").value,
        password: document.getElementById("password").value,
        password_confirmation: document.getElementById("password_confirmation")
            .value,
    };

    if (!validatePasswords(formData.password, formData.password_confirmation)) {
        return;
    }

    try {
        let response = await fetch(`${URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        let result = await response.json();

        if (response.ok) {
            showSuccessToast("Đăng ký", "Đăng ký thành công!");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showErrorToast("Đăng ký", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    } catch (error) {
        showErrorToast("Đăng ký", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}
//LOGIN
async function login(e) {
    e.preventDefault();

    const formData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    };

    try {
        let response = await fetch(`${URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        let result = await response.json();

        if (response.ok) {
            showSuccessToast("Đăng nhập", "Đăng nhập thành công!");

            localStorage.setItem("user", JSON.stringify(result));
            localStorage.setItem("token", result.accessToken);
            localStorage.setItem("username", result.username);

            updateUI();
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showErrorToast("Đăng nhập", "Thông tin đăng nhập chưa chính xác!");
        }
    } catch (error) {
        showErrorToast("Đăng nhập", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}

// LOGOUT
function logout(e) {
    if (e) e.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");

    updateUI();
    showSuccessToast("Đăng xuất", "Đăng xuất thành công!");
}

// UPDATE UI
function updateUI() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);

    if (token) {
        document.getElementById("auth").style.display = "none";
        document.getElementById("userDropdown").style.display = "block";
        document.getElementById(
            "usernameDisplay"
        ).innerText = `Hi,  ${username}`;
    } else {
        document.getElementById("auth").style.display = "block";
        document.getElementById("userDropdown").style.display = "none";
    }
    const customerElement = document.getElementById("customer");
    const sellerElement = document.getElementById("seller");
    const managerElement = document.getElementById("manager");
    if (userObj) {
        const role = userObj.role;

        switch (role) {
            case "customor":
                {
                    sellerElement && (sellerElement.style.display = "none");
                    managerElement && (managerElement.style.display = "none");
                }
                break;
            case "seller":
                {
                    managerElement && (managerElement.style.display = "none");
                }
                break;
            case "manager":
                {
                    customerElement &&
                        (customerElement.style.display = "block");
                    sellerElement && (sellerElement.style.display = "block");
                    managerElement && (managerElement.style.display = "block");
                }
                break;
            default:
                {
                }
                break;
        }
    } else {
        const footerElement = document.getElementById("footer-contact");
        customerElement && (customerElement.style.display = "none");
        sellerElement && (sellerElement.style.display = "none");
        managerElement && (managerElement.style.display = "none");
        footerElement && (footerElement.style.display = "none");
    }
}

// CHECK VALIDATION PASSWORD
function validatePasswords(password, password_confirmation) {
    if (password === password_confirmation) {
        return true;
    } else {
        showErrorToast("Đăng ký", "Mật khẩu và xác nhận mật khẩu không khớp!");
        return false;
    }
}

// TOAST
function showSuccessToast(activity, state) {
    myToast({
        title: activity,
        message: state,
        type: "success",
        duration: 5000,
    });
}

function showErrorToast(activity, state) {
    myToast({
        title: activity,
        message: state,
        type: "error",
        duration: 5000,
    });
}

function myToast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("myToast");
    if (main) {
        const myToast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(myToast);
        }, duration + 1000);

        // Remove toast when clicked
        myToast.onclick = function (e) {
            if (e.target.closest(".myToast__close")) {
                main.removeChild(myToast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle",
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        myToast.classList.add("myToast", `myToast--${type}`);
        myToast.style.animation = `slideInLeft ease .1s, fadeOut linear 1s ${delay}s forwards`;

        myToast.innerHTML = `
                      <div class="myToast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="myToast__body">
                          <h3 class="myToast__title">${title}</h3>
                          <p class="myToast__msg">${message}</p>
                      </div>
                      <div class="myToast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
        main.appendChild(myToast);
    }
}

// PAGINATION
function setupPagination(type, totalPages, currentPage, fetchFunction) {
    const prevPage = document.getElementById(`${type}PrevPage`);
    const nextPage = document.getElementById(`${type}NextPage`);

    if (prevPage && nextPage) {
        prevPage.classList.toggle("disabled", currentPage === 1);
        prevPage.querySelector("a").onclick =
            currentPage > 1 ? () => fetchFunction(currentPage - 1) : null;

        nextPage.classList.toggle("disabled", currentPage === totalPages);
        nextPage.querySelector("a").onclick =
            currentPage < totalPages
                ? () => fetchFunction(currentPage + 1)
                : null;

        const pageItems = [];
        for (let i = 1; i <= totalPages; i++) {
            pageItems.push(i);
        }

        const displayPages = [];
        if (totalPages <= 3) {
            displayPages.push(...pageItems);
        } else {
            if (currentPage === 1) {
                displayPages.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                displayPages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                displayPages.push(
                    currentPage - 1,
                    currentPage,
                    currentPage + 1
                );
            }
        }

        for (let i = 1; i <= 3; i++) {
            const pageItem = document.getElementById(`${type}Page${i}`);
            if (pageItem) {
                const pageNum = displayPages[i - 1];
                pageItem.classList.toggle("active", currentPage === pageNum);
                pageItem.querySelector("a").textContent = pageNum;
                pageItem.querySelector("a").onclick = () =>
                    fetchFunction(pageNum);
                pageItem.style.display =
                    pageNum <= totalPages ? "block" : "none";
            }
        }
    }
}

// Post feedback
async function postFeedback(e) {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    const userObject = JSON.parse(storedUser);

    const imageFile = document.getElementById("feedback-image").files[0];
    const contentElement = document.getElementById("feedback-content");

    let imageURL;

    //Nếu có ảnh, tải lên Cloudinary trước
    if (imageFile) {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        if (imageUrl) {
            imageURL = imageUrl;
        } else {
            console.error("Lỗi khi tải ảnh lên Cloudinary");
            return;
        }
    }

    const formData = {
        user: userObject._id,
        content: contentElement.value,
        images: imageURL,
    };

    try {
        let response = await fetch(`${URL}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            showErrorToast("Phản hồi", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }

        const result = await response.json();
        if (response.ok) {
            showSuccessToast("Phản hồi", "Gửi phản hồi thành công!");
            setTimeout(() => {
                window.location.href = "feedback.html";
            }, 1000);
        } else {
            showErrorToast("Phản hồi", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    } catch (error) {
        showErrorToast("Phản hồi", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}

// AUTO UPDATE UI WHEN LOADING PAGE
window.onload = function () {
    updateUI();
};
