// ==========================================
// SSRU DRINK LAB - PREMIUM INTERACTIVE SCRIPT
// Discrete Mathematics Applied Web Application
// ==========================================

const products = [
    { id: 1, name: "ชาไทย", category: "ชานม", price: 45, type: "ชา", temperature: "เย็น", image: "images/thai-tea.png" },
    { id: 2, name: "อเมริกาโน่เย็น", category: "กาแฟ", price: 50, type: "กาแฟ", temperature: "เย็น", image: "images/iced-americano.png" },
    { id: 3, name: "มัทฉะลาเต้", category: "ชานม", price: 60, type: "ชา", temperature: "เย็น", image: "images/matcha-latte.png" },
    { id: 4, name: "โกโก้เย็น", category: "โกโก้", price: 55, type: "โกโก้", temperature: "เย็น", image: "images/iced-cocoa.png" },
    { id: 5, name: "ลาเต้เย็น", category: "กาแฟ", price: 55, type: "กาแฟ", temperature: "เย็น", image: "images/iced-latte.png" },
    { id: 6, name: "ชานมไต้หวัน", category: "ชานม", price: 50, type: "ชานม", temperature: "เย็น", image: "images/taiwan-milk-tea.png" },
    { id: 7, name: "เลมอนที", category: "ชา", price: 45, type: "ชา", temperature: "เย็น", image: "images/lemon-tea.png" },
    { id: 8, name: "สตรอว์เบอร์รี่มิลค์", category: "ผลไม้", price: 65, type: "ผลไม้", temperature: "เย็น", image: "images/strawberry-milk.png" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// [DISCRETE MATH - SET THEORY]: ดึงหมวดหมู่สินค้าที่ไม่ซ้ำด้วย Set Object
const uniqueCategories = new Set(products.map(item => item.category));

// ฟังก์ชันแสดง Toast แจ้งเตือนสุดพรีเมียม (แทน Alert ธรรมดา)
function showToast(message) {
    let existingToast = document.querySelector(".custom-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerHTML = `✨ ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// เพิ่มสินค้าลงตะกร้า
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }

    saveCart();
    showToast(`เพิ่ม "${product.name}" ลงในตะกร้าแล้ว`);
}

// บันทึกตะกร้า
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");

    if (!badge) return;

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    badge.textContent = itemCount;
}

// แสดงสินค้าในหน้า Cart
function renderCart() {
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #888;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">🛒 ยังไม่มีสินค้าในตะกร้าของคุณ</p>
                <a href="products.html" style="color: #6c3cff; font-weight: bold; text-decoration: underline;">เลือกซื้อเครื่องดื่มเลย</a>
            </div>
        `;
        
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setVal("subtotal", "฿0");
        setVal("discount", "- ฿0");
        setVal("total", "฿0");
        setVal("cartCount", "0 รายการ");
        return;
    }

    // [DISCRETE MATH - FUNCTION / ARRAY REDUCE]: คำนวณราคารวมและจำนวนชิ้น
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        let imageSrc = "images/thai-tea.png"; 
        const product = products.find(p => p.id === item.id);
        if (product && product.image) imageSrc = product.image;

        const itemHTML = `
            <div class="cart-item" style="animation: fadeIn 0.3s ease;">
                <div class="cart-product-image" style="background: none; padding: 0;">
                    <img src="${imageSrc}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                </div>
                <div class="cart-product-info">
                    <p class="product-category">เครื่องดื่มยอดฮิต</p>
                    <h3>${item.name}</h3>
                    <p>ราคา ฿${item.price} / แก้ว</p>
                    <div class="quantity">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <strong class="cart-price">฿${itemTotal}</strong>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });

    // [DISCRETE MATH - BOOLEAN LOGIC]: Subtotal >= 300 AND IsMember === TRUE
    const memberCheck = document.getElementById("memberCheck");
    const isMember = memberCheck ? memberCheck.checked : false;
    let discount = (subtotal >= 300 && isMember) ? subtotal * 0.10 : 0;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    setVal("subtotal", `฿${subtotal}`);
    setVal("discount", `- ฿${Math.round(discount)}`);
    setVal("total", `฿${subtotal - Math.round(discount)}`);
    setVal("cartCount", `${itemCount} รายการ`);
}

// เปลี่ยนจำนวนสินค้า
function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    saveCart();
    renderCart();
}

// ระบบชำระเงิน (Checkout)
function checkout() {
    if (cart.length === 0) {
        showToast("กรุณาเลือกสินค้าลงตะกร้าก่อนทำการสั่งซื้อครับ");
        return;
    }
    showToast("🎉 สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ SSRU DRINK LAB");
    cart = [];
    saveCart();
    renderCart();
}

// บันทึกและโหลดสถานะสมาชิก
function saveMemberStatus() {
    const memberCheck = document.getElementById("memberCheck");
    if (memberCheck) {
        localStorage.setItem("isMember", memberCheck.checked);
    }
}

function loadMemberStatus() {
    const memberCheck = document.getElementById("memberCheck");
    if (memberCheck) {
        if (localStorage.getItem("isMember") === "true") {
            memberCheck.checked = true;
        }
        memberCheck.addEventListener("change", () => {
            saveMemberStatus();
            renderCart();
        });
    }
}

// อัปเดตจำนวนสินค้าที่แสดง
function updateVisibleCount() {
    const countElement = document.querySelector(".section-heading p strong");
    if (countElement) {
        const visibleCards = document.querySelectorAll(".shop-card:not([style*='display: none'])");
        countElement.textContent = visibleCards.length;
    }
}

// [DISCRETE MATH - SET THEORY]: A ∩ B (ชา ∩ เมนูฮิต BEST/HOT)
function applySetIntersection() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    const productCards = document.querySelectorAll(".shop-card");
    productCards.forEach(card => {
        const isTea = card.dataset.type === "ชา" || card.dataset.category === "ชา" || card.dataset.category === "ชานม";
        const badgeText = card.querySelector(".badge")?.innerText.trim() || "";
        const isPopular = badgeText === "BEST" || badgeText === "HOT";

        // เงื่อนไข Intersection (A AND B)
        card.style.display = (isTea && isPopular) ? "" : "none";
    });
    updateVisibleCount();
}

// แสดงสินค้าทั้งหมด
function showAllProducts() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    document.querySelectorAll(".shop-card").forEach(card => card.style.display = "");
    updateVisibleCount();
}

// เริ่มต้นทำงาน
document.addEventListener("DOMContentLoaded", () => { 
    loadMemberStatus(); 
    renderCart();
    updateCartBadge();

    const topIntersectionBtn = document.getElementById("intersectionBtn");
    if (topIntersectionBtn) topIntersectionBtn.addEventListener("click", applySetIntersection);

    const bottomIntersectionBtn = document.getElementById("setIntersectionBtn");
    if (bottomIntersectionBtn) {
        bottomIntersectionBtn.addEventListener("click", () => {
            document.querySelector(".product-section")?.scrollIntoView({ behavior: "smooth" });
            applySetIntersection();
        });
    }

    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);

    const showAllBtn = document.getElementById("showAll");
    if (showAllBtn) showAllBtn.addEventListener("click", showAllProducts);

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = searchInput.value.toLowerCase();
            document.querySelectorAll(".shop-card").forEach(card => {
                const productName = card.querySelector("h3").textContent.toLowerCase();
                card.style.display = productName.includes(keyword) ? "" : "none";
            });
            updateVisibleCount();
        });
    }

    document.querySelectorAll(".filter-buttons [data-category]").forEach(button => {
        button.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            const category = this.dataset.category;
            document.querySelectorAll(".shop-card").forEach(card => {
                card.style.display = (card.dataset.category === category) ? "" : "none";
            });
            updateVisibleCount();
        });
    });
});

// เสริม CSS สไตล์แจ้งเตือนแบบพรีเมียมฉบับฉับไว
const customStyle = document.createElement("style");
customStyle.innerHTML = `
    .custom-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #2d2342;
        color: #fff;
        padding: 12px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        font-family: 'Sarabun', sans-serif;
        font-size: 0.95rem;
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        border-left: 5px solid #ff4f81;
    }
    .custom-toast.show {
        opacity: 1;
        transform: translateY(0);
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(customStyle);