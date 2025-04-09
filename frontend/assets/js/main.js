const URL = "http://localhost:8000";

// Hàm đăng ký
async function register(e) {
    e.preventDefault();

    const imageFile = document.getElementById("organizationCertificate")
        .files[0];

    let imageURL;

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
        fullname: document.getElementById("fullname").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        role: document.getElementById("role").value,
        organizationCertificate: imageURL,
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
            showErrorToast("Đăng nhập", "Có lỗi xảy ra, vui lòng thử lại sau!");
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
    const donationElement = document.getElementById("donation");
    const distributionElement = document.getElementById("distribution");
    const campaignElement = document.getElementById("campaign");
    const addCampaignElement = document.getElementById("addCampaign");
    if (userObj) {
        const role = userObj.role;

        switch (role) {
            case "donor":
                {
                    distributionElement &&
                        (distributionElement.style.display = "none");
                    campaignElement &&
                        (campaignElement.style.display = "block");
                }
                break;
            case "recipient":
                {
                    donationElement && (donationElement.style.display = "none");
                    campaignElement && (campaignElement.style.display = "none");
                }
                break;
            case "organization":
                {
                    distributionElement &&
                        (distributionElement.style.display = "none");

                    addCampaignElement &&
                        (addCampaignElement.style.display = "block");
                }
                break;
            case "adminstrator":
                {
                    addCampaignElement &&
                        (addCampaignElement.style.display = "block");
                }
                break;
            default:
                {
                }
                break;
        }
    } else {
        const footerElement = document.getElementById("footer-contact");
        donationElement && (donationElement.style.display = "none");
        distributionElement && (distributionElement.style.display = "none");
        campaignElement && (campaignElement.style.display = "none");
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

//RENDER INFORMATION
function userInformation() {
    const userTableBody = document.getElementById("userTableBody");

    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);

    let roleDisplay;
    switch (userObj.role) {
        case "donor":
            roleDisplay = "Người đóng góp";
            break;
        case "recipient":
            roleDisplay = "Người cần hỗ trợ";
            break;
        case "organization":
            roleDisplay = "Tổ chức từ thiện";
            break;
        case "adminstrator":
            roleDisplay = "Quản trị viên hệ thống";
            break;
        default:
            roleDisplay = "";
            break;
    }

    const table = `
        <tbody>
                        <tr>
                            <th>Họ Và Tên</th>
                            <td>${userObj.fullname}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>${userObj.email}</td>
                        </tr>
                        <tr>
                            <th>Số Điện Thoại</th>
                            <td>${userObj.phoneNumber}</td>
                        </tr>
                        <tr>
                            <th>Địa Chỉ</th>
                            <td>${userObj.address}</td>
                        </tr>
                        <tr>
                            <th>Vai trò</th>
                            <td>${roleDisplay}</td>
                        </tr>
                    </tbody>
    `;

    userTableBody.innerHTML = table;
}

// FEEDBACK
let currentFeedbackPage = 1;

// Fetch feedback
async function fetchFeedbacks(page = 1) {
    try {
        const response = await fetch(`${URL}/feedback?page=${page}&limit=3`); // Gọi API với giới hạn là 3
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { feedbacks, totalPages } = await response.json();
        displayFeedback(feedbacks); // Hiển thị phản hồi
        currentFeedbackPage = page; // Cập nhật trang hiện tại
        setupPagination(
            "feedback",
            totalPages,
            "currentFeedbackPage",
            fetchFeedbacks
        ); // Thiết lập phân trang
    } catch (error) {
        console.error("Error fetching feedback:", error);
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

// Display feedback
function displayFeedback(feedbacks) {
    const feedbackContainer = document.getElementById("feedback-container");

    if (feedbackContainer) {
        feedbackContainer.innerHTML = "";

        feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        feedbacks.forEach((feedback) => {
            const article = document.createElement("article");
            article.className = "feedback__article";

            article.innerHTML = `
                <section class="feedback__info--user">
                    <img
                        src=""
                        alt="Avatar"
                        class="feedback__avatar"
                        onerror="this.onerror=null; this.src='../assets/image/pink_panther.jpg';"
                    />
                    <h3 class="feedback__fullname">
                        ${feedback.user.fullname}
                    </h3>
                </section>
    
                <figure class="feedback__figure">
                    <img
                        src="${feedback.images[0]}"
                        alt="Feedback"
                        class="feedback--img"
                        onerror="this.onerror=null; this.src='../assets/image/catastrophe.jpg';"
                    />
                </figure>
    
                <figcaption class="feedback__figcaption">
                    <p class="feedback__content">
                        ${feedback.content}
                    </p>
                </figcaption>
            `;
            feedbackContainer.appendChild(article);
        });
    }
}

// BLOGS
let currentBlogsPage = 1; // Trang hiện tại

// Fetch blogs
async function fetchBlogs(page = 1) {
    try {
        const response = await fetch(`${URL}/blog?page=${page}&limit=4`); // Gọi API với giới hạn là 3
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { blogs, totalPages } = await response.json();
        displayBlog(blogs); // Hiển thị phản hồi
        currentBlogsPage = page; // Cập nhật trang hiện tại
        setupPagination("blog", totalPages, "currentBlogsPage", fetchBlogs); // Thiết lập phân trang
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

// Display blogs
function displayBlog(blogs) {
    const blogContainer = document.getElementById("blog-container");
    const storedUser = localStorage.getItem("user");
    const userObject = JSON.parse(storedUser);

    if (blogContainer) {
        blogContainer.innerHTML = "";

        blogs.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

        blogs.forEach((blog) => {
            const article = document.createElement("article");
            article.className = "blog-item";

            const commentsQuantity = blog.comments.length;
            const blogId = blog._id;

            const authorName = "NCHMF";
            const authorAddress = "Trung tâm dự báo KTTV Quốc gia";

            article.innerHTML = `
            <h3>
                <a class="blog-item__title" href="#!">${blog.title}</a>
            </h3>
            <section class="blog-item__details">
                <p class="blog-item__info">
                    by <span class="blog-item__author">${authorName}</span>
                    on <a href="https://nchmf.gov.vn/" class="blog-item__link">${authorAddress}</a>
                </p>
            </section>
            <figure class="blog-item__img-wrap">
                <img
                    src="${blog.image}"
                    alt="${blog.title}"
                    class="blog-item__img"
                    onerror="this.onerror=null; this.src='../assets/image/catastrophe.jpg';"
                />
                <figcaption class="blog-item__figcation">
                    <p class="blog-item__desc">${blog.content}</p>
                    <a href="#!" class="blog-item__comments" onclick="toggleComments(event, 'blog-${blogId}')">
                        Comments (<span class="comment__quantity">${commentsQuantity}</span>)
                    </a>
                </figcaption>
            </figure>

            <section id="addComments-blog-${blogId}" style="display: none">
                <h4 class="comment--title">Bình luận</h4>
                
                    ${blog.comments.map(
                        (comment) => `
                            <section class="blog-comments__wrap">
                           
                                <h5 class="blog-comments--author">${
                                    comment.userName ?? "Người dùng"
                                }</h5>
                                <section class="blog-comments--info">
                                    <p class="blog-comments--desc">${
                                        comment.content
                                    }</p>
                                    <img class="blog-comments--img" src="${
                                        comment.image ||
                                        "../assets/image/catastrophe_01.webp"
                                    }" alt="Comments Image" />
                                </section>
                            </section>
                        `
                    )}
                <section class="blog--add-comments">
                    <form action="#" method="post" id="formAddcomments" onsubmit="addComments(event, '${blogId}')" enctype="multipart/form-data">
                        <div class="spacer"></div>
                        <div class="send__form--group">
                            <label for="comment-content" class="send--label">Thêm bình luận</label>
                            <textarea
                                id="comment-content"
                                name="comment-content"
                                class="comment-content"
                                placeholder="Nhập bình luận..."
                                required
                                minlength="1"
                                maxlength="600"
                            ></textarea>
                            <span class="send--message"></span>
                        </div>
                        <div class="send--group">
                            <label for="comment-image" class="send--label">Tải ảnh từ thiết bị:</label>
                            <input type="file" id="comment-image" name="comment-image" class="send-control" accept="image/*" />
                        </div>
                        <button type="submit" class="send--submit"
                        >Gửi bình luận</button>
                    </form>
                </section>
            </section>
        `;
            blogContainer.appendChild(article);
        });
    }
}

// Hide or display comment section
function toggleComments(event, blogId) {
    event.preventDefault();

    const commentsSection = document.getElementById(`addComments-${blogId}`);
    commentsSection.style.display =
        commentsSection.style.display === "none" ? "block" : "none";
}

// Post blogs
async function postBlog(e) {
    e.preventDefault();

    const imageFile = document.getElementById("blog-image").files[0];
    const titleElement = document.getElementById("blog-title");
    const contentElement = document.getElementById("blog-content");

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
        title: titleElement.value,
        content: contentElement.value,
        image: imageURL,
    };

    console.log(formData);

    try {
        let response = await fetch(`${URL}/blog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            showErrorToast("Tin tức", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }

        const result = await response.json();
        if (response.ok) {
            showSuccessToast("Tin tức", "Gửi Tin tức thành công!");
            setTimeout(() => {
                window.location.href = "blogs.html";
            }, 1000);
        } else {
            showErrorToast("Tin tức", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    } catch (error) {
        showErrorToast("Tin tức", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}

// Add comments
async function addComments(event, blogId) {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");
    const userObject = JSON.parse(storedUser);

    const commentsSection = document.getElementById(
        `addComments-blog-${blogId}`
    );
    if (!commentsSection) {
        console.error(`Section with id addComments-blog-${blogId} not found!`);
        return;
    }

    const commentContent = commentsSection.querySelector("#comment-content");
    if (!commentContent) {
        console.error("Comment content textarea not found!");
        return;
    }

    const imageFile = commentsSection.querySelector("#comment-image").files[0];

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
        blogId: blogId,
        userName: userObject.fullname,
        content: commentContent.value,
        image: imageURL,
    };

    try {
        let response = await fetch(`${URL}/blog/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            showSuccessToast("Bình luận", "Gửi Bình luận thành công!");
            setTimeout(() => {
                window.location.href = "blogs.html";
            }, 1000);
        } else {
            showErrorToast("Bình luận", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    } catch (error) {
        showErrorToast("Bình luận", "Có lỗi xảy ra, vui lòng thử lại sau!");
        console.log(error);
    }
}

async function uploadImageToCloudinary(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "my-preset");
    formData.append("cloud_name", "dyjofozsg");

    try {
        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dyjofozsg/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();
        return data.secure_url; // URL ảnh đã tải lên
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        return null;
    }
}

// DONATION

// Get Donate
async function getDonate(e) {
    e.preventDefault();

    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);

    const donationType = document.getElementById("donationType").value;
    const amount =
        donationType === "money"
            ? document.getElementById("donationAmount").value
            : 0;
    const items = donationType === "inKind" ? [] : [];
    if (donationType === "inKind") {
        const rows = document.querySelectorAll("#inKindTableBody tr");

        rows.forEach((row) => {
            const itemNameElement = row.querySelector(".itemDonateName");
            const itemQuantityElement = row.querySelector(
                ".itemDonateQuantity"
            );
            const itemUnitElement = row.querySelector(".itemDonateUnit");

            if (itemUnitElement && itemNameElement && itemQuantityElement) {
                const itemName = itemNameElement.value;
                const itemQuantity = itemQuantityElement.value;
                const itemUnit = itemUnitElement.value;

                if (itemName && itemQuantity && itemUnit) {
                    items.push({
                        name: itemName,
                        quantity: Number(itemQuantity),
                        unit: itemUnit,
                    });
                }
            }
        });
    }

    //  formData
    const formData = {
        donor: {
            donorId: userObj._id,
            donorName: userObj.fullname,
            phoneNumber: userObj.phoneNumber,
        },
        amount: amount,
        items: items,
    };

    try {
        let response = await fetch(`${URL}/donate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            showErrorToast("Ủng hộ", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }

        const result = await response.json();
        if (response.ok) {
            showSuccessToast("Ủng hộ", "Cảm ơn bạn đã đóng góp!");
            setTimeout(() => {
                window.location.href = "donate.html";
            }, 1000);
        } else {
            showErrorToast("Ủng hộ", "Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    } catch (error) {
        showErrorToast("Ủng hộ", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}

// DISPLAY DONATE
let currentDonatePage = 1;

// Fetch Donor
async function fetchDonor(page = 1) {
    try {
        const response = await fetch(`${URL}/donate?page=${page}&limit=3`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { donates, totalPages } = await response.json();

        displayDonates(donates);
        currentDonatePage = page;
        setupPagination("donate", totalPages, "currentDonatePage", fetchDonor);
    } catch (error) {
        console.error("Error fetching donate:", error);
    }
}

// Display donate
function displayDonates(donates) {
    const donateContainer = document.getElementById("donate-container");
    if (donateContainer) {
        donateContainer.innerHTML = "";

        donates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        donates.forEach((donate, index) => {
            const article = document.createElement("article");
            article.className = `donate__article donate__article-${index}`;

            let itemsHTML = "";
            if (donate.amount === 0 && donate.items.length > 0) {
                // Tạo danh sách các item nếu amount = 0
                itemsHTML = donate.items
                    .map((item) => {
                        const nameDisplay =
                            item.name === "Rice"
                                ? "Gạo"
                                : item.name === "Noodle"
                                ? "Mì"
                                : item.name === "Water"
                                ? "Nước"
                                : item.name === "Medicine"
                                ? "Thuốc"
                                : item.name === "Clothes"
                                ? "Quần áo"
                                : item.name === "Shoes"
                                ? "Giày (Dép)"
                                : item.name === "Lamp"
                                ? "Đèn"
                                : item.name;
                        const unitDisplay =
                            item.unit === "Kg"
                                ? "Kg"
                                : item.unit === "Piece"
                                ? "Cái"
                                : item.unit === "Litre"
                                ? "Lít"
                                : item.unit === "Set"
                                ? "Bộ"
                                : item.unit === "Box"
                                ? "Thùng"
                                : item.unit === "Pair"
                                ? "Đôi"
                                : item.unit === "Strip"
                                ? "Vỉ"
                                : item.unit;
                        return `<p class="donate__item">${item.quantity} ${unitDisplay} ${nameDisplay} </p>`;
                    })
                    .join("");
            }

            article.innerHTML = `
                <p class="donate__name">
                    Mạnh thường quân<br />
                    <strong>${donate.donor.donorName}</strong>
                </p>
               <p class="donate__phoneNumber">
                    SĐT: <strong>${donate.donor.phoneNumber}</strong>
                </p>
                <p class="donate__content">
                    Đã ủng hộ đồng bào gặp khó khăn vì bão lũ:
                </p>
                ${
                    donate.amount !== 0
                        ? `<p class="donate__amount"><strong>${formatAmount(
                              donate.amount
                          )}</strong> VND</p>`
                        : ""
                }
                <div class="donate__items" style="display: ${
                    donate.amount === 0 ? "block" : "none"
                };">
                    ${itemsHTML}
                </div>
                <button id="download-statement" onclick="downloadImage(${index})">Xuất sao kê</button>
            `;

            donateContainer.appendChild(article);
        });
    }
}

// Download donation statement
function downloadImage(index) {
    const captureArea = document.querySelector(`.donate__article-${index}`);
    html2canvas(captureArea).then((canvas) => {
        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "screenshot.png";
        link.click();
    });
}

// Add comma in amount
function formatAmount(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// DISTRIBUTION

// Get distribution
async function getDistribution(e) {
    e.preventDefault();

    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);

    const donationTotal = localStorage.getItem("donationTotal");
    const donationTotalObj = JSON.parse(donationTotal);

    const distributionType = document.getElementById("distributionType").value;
    const amount =
        distributionType === "money"
            ? document.getElementById("distributionAmount").value
            : 0;
    const items = distributionType === "inKind" ? [] : [];

    if (distributionType === "inKind") {
        const rows = document.querySelectorAll("#inKindTableBody tr");

        rows.forEach((row) => {
            const itemNameElement = row.querySelector(".itemDistributionName");
            const itemQuantityElement = row.querySelector(
                ".itemDistributionQuantity"
            );
            const itemUnitElement = row.querySelector(".itemDistributionUnit");

            if (itemUnitElement && itemNameElement && itemQuantityElement) {
                const itemName = itemNameElement.value;
                const itemQuantity = itemQuantityElement.value;
                const itemUnit = itemUnitElement.value;

                if (itemName && itemQuantity && itemUnit) {
                    items.push({
                        name: itemName,
                        quantity: Number(itemQuantity),
                        unit: itemUnit,
                    });
                }
            }
        });
    }

    if (amount > donationTotalObj.amountTotal) {
        showErrorToast(
            "Đăng ký nhận ủng hộ",
            "Số tiền phân phối vượt quá số tiền có sẵn."
        );
        return;
    }

    for (const distributionItem of items) {
        const matchingItem = donationTotalObj.itemsTotal.find(
            (item) =>
                item.name.toLowerCase() === distributionItem.name.toLowerCase()
        );

        if (!matchingItem) {
            showErrorToast(
                "Đăng ký nhận ủng hộ",
                `Mặt hàng ${distributionItem.name} không có trong danh sách hiện vật.`
            );
            return;
        }

        if (distributionItem.quantity > matchingItem.quantity) {
            showErrorToast(
                "Đăng ký nhận ủng hộ",
                `Số lượng của mặt hàng ${distributionItem.name} vượt quá số lượng có sẵn.`
            );
            return;
        }
    }

    //  formData
    const formData = {
        reception: {
            receptionName: userObj.fullname,
            phoneNumber: userObj.phoneNumber,
        },
        distributionAmount: amount,
        distributionItems: items,
    };

    try {
        let response = await fetch(`${URL}/distribution`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            showErrorToast(
                "Đăng ký nhận ủng hộ",
                "Có lỗi xảy ra, vui lòng thử lại sau!"
            );
        }

        const result = await response.json();
        if (response.ok) {
            showSuccessToast(
                "Đăng ký nhận ủng hộ",
                "Tình nguyện viên sẽ liên hệ bạn sớm nhất có thể"
            );
            setTimeout(() => {
                window.location.href = "distribution.html";
            }, 1000);
        } else {
            showErrorToast(
                "Đăng ký nhận ủng hộ",
                "Có lỗi xảy ra, vui lòng thử lại sau!"
            );
        }
    } catch (error) {
        showErrorToast(
            "Đăng ký nhận ủng hộ",
            "Có lỗi xảy ra, vui lòng thử lại sau!"
        );
    }
}

// DONATION TOTAL

// Updating donation Total
async function updateDonationTotal() {
    try {
        const response = await fetch(`${URL}/donationTotal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to update donation total");
        } else {
            const result = await response.json();
        }
    } catch (error) {
        console.error("Error fetching donation total:", error);
    }
}

// Fetch Donation Total
async function fetchDonationTotal() {
    try {
        const response = await fetch(`${URL}/donationTotal`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const donationTotal = await response.json();

        localStorage.setItem("donationTotal", JSON.stringify(donationTotal));
    } catch (error) {
        console.error("Error fetching donation total:", error);
    }
}

// Display Donation Total
function displayDonationTotal() {
    const donationTotal = localStorage.getItem("donationTotal");
    const donationTotalObj = JSON.parse(donationTotal);

    const donationTotalElement = document.getElementById("donationTotal");
    if (donationTotalElement) {
        donationTotalElement.innerHTML += `
                                            <p class="donationTotal__amount">
                                            <strong>${formatAmount(
                                                donationTotalObj.amountTotal
                                            )}</strong>&nbsp;&nbsp;VND
                                            </p>
                                            <span>&</span>
                                            `;

        const itemsHTML = donationTotalObj.itemsTotal
            .map((item) => {
                const nameDisplay =
                    item.name === "Rice"
                        ? "Gạo"
                        : item.name === "Noodle"
                        ? "Mì"
                        : item.name === "Medicine"
                        ? "Thuốc"
                        : item.name === "Water"
                        ? "Nước"
                        : item.name === "Clothes"
                        ? "Quần áo"
                        : item.name === "Shoes"
                        ? "Giày (Dép)"
                        : item.name === "Lamp"
                        ? "Đèn"
                        : item.name;
                const unitDisplay =
                    item.unit === "Kg"
                        ? "Kg"
                        : item.unit === "Piece"
                        ? "Cái"
                        : item.unit === "Litre"
                        ? "Lít"
                        : item.unit === "Set"
                        ? "Bộ"
                        : item.unit === "Pair"
                        ? "Đôi"
                        : item.unit === "Box"
                        ? "Thùng"
                        : item.unit === "Strip"
                        ? "Vỉ"
                        : item.unit;

                return `<p class="donationTotal__item">
                    <strong>${item.quantity}</strong>&nbsp;${unitDisplay}&nbsp;${nameDisplay}
                    </p>`;
            })
            .join("");

        donationTotalElement.innerHTML += `<div class="donationTotal__items">${itemsHTML}</div>`;
    }
}

// CAMPAIGN
let currentCampaignPage = 1;

// Fetch feedback
async function fetchCampaign(page = 1) {
    try {
        const response = await fetch(`${URL}/campaign?page=${page}&limit=3`); // Gọi API với giới hạn là 3
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { campaigns, totalPages } = await response.json();
        displayCampaign(campaigns); // Hiển thị phản hồi
        currentCampaignPage = page; // Cập nhật trang hiện tại
        setupPagination(
            "campaign",
            totalPages,
            "currentCampaignPage",
            fetchCampaign
        ); // Thiết lập phân trang
    } catch (error) {
        console.error("Error fetching campaign:", error);
    }
}

// Post campaign
async function postCampaign(e) {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    const userObject = JSON.parse(storedUser);

    const tileElement = document.getElementById("campaign-title");
    const contentElement = document.getElementById("campaign-content");
    const timeElement = document.getElementById("campaign-time");
    const budgetElement = document.getElementById("campaign-budget");

    const formData = {
        user: userObject._id,
        title: tileElement.value,
        content: contentElement.value,
        time: timeElement.value,
        budget: budgetElement.value,
    };

    try {
        let response = await fetch(`${URL}/campaign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            showErrorToast(
                "Chiến dịch",
                "Có lỗi xảy ra, vui lòng thử lại sau!"
            );
        }

        const result = await response.json();
        if (response.ok) {
            showSuccessToast("Chiến dịch", "Gửi thành công!");
            setTimeout(() => {
                window.location.href = "campaign.html";
            }, 1000);
        } else {
            showErrorToast(
                "Chiến dịch",
                "Có lỗi xảy ra, vui lòng thử lại sau!"
            );
        }
    } catch (error) {
        showErrorToast("Chiến dịch", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}

// Display campain
function displayCampaign(campaigns) {
    const CampaignContainer = document.getElementById("campaign-container");

    if (CampaignContainer) {
        CampaignContainer.innerHTML = "";

        campaigns.forEach((campaign) => {
            const article = document.createElement("article");
            article.className = "campaign__article";

            article.innerHTML = `
                            <h4 class="article--title">${campaign.title}</h4>
                             <p class="article--desc">
                                <span>Mô tả:</span> &nbsp;&nbsp; 
                                ${campaign.content}
                            </p>
                            <p class="article--time">
                                <span>Thời gian:</span> &nbsp;&nbsp;
                                <strong>${campaign.time}</strong>
                            </p>
                            <p class="article--budget">
                                <span>Ngân sách:</span>
                                &nbsp;&nbsp;<strong>${formatAmount(
                                    campaign.budget
                                )}</strong>&nbsp;&nbsp;VND
                            </p>
            `;
            CampaignContainer.appendChild(article);
        });
    }
}

// AUTO UPDATE UI WHEN LOADING PAGE
window.onload = function () {
    updateUI();
    fetchFeedbacks(currentFeedbackPage);
    fetchBlogs(currentBlogsPage);
    fetchDonor(currentDonatePage);
    fetchCampaign(currentCampaignPage);
    updateDonationTotal();
    fetchDonationTotal();
    displayDonationTotal();
};
