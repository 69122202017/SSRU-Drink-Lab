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

    setTimeout(() => { toast.classList.add("show"); }, 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// เพิ่มสินค้าลงตะกร้า (อัปเดตให้บันทึกรูปภาพด้วย)
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

// ==========================================
// ส่วนของการแสดงผลตะกร้าและการคำนวณ (รวมไว้ในนี้ทั้งหมด)
// ==========================================

function updateOrderSummary() {
    // [DISCRETE MATH - FUNCTION / ARRAY REDUCE]: คำนวณราคารวม
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        updateOrderSummary();
        return;
    }

    // วนลูปแสดงรายการสินค้า พร้อมเพิ่ม Checkbox วงกลมด้านหน้า
    cart.forEach((item, index) => {
        // ดึงรูปภาพ กรณีของเก่าใน LocalStorage ไม่มีรูปภาพ
        let imageSrc = item.image;
        if (!imageSrc) {
            const product = products.find(p => p.id === item.id);
            imageSrc = (product && product.image) ? product.image : "images/default-drink.png";
        }

        const itemTotal = item.price * item.quantity;
        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = "display: flex; align-items: center; gap: 15px; padding: 15px; background: #fff; margin-bottom: 10px; border-radius: 12px; border: 1px solid #eee; animation: fadeIn 0.3s ease;";

        itemDiv.innerHTML = `
            <input type="checkbox" class="item-checkbox" data-index="${index}" style="width: 20px; height: 20px; cursor: pointer; accent-color: #ff6b6b; border-radius: 50%;">
            
            <img src="${imageSrc}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
            
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 5px 0; font-size: 1rem;">${item.name}</h4>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">ราคา ฿${item.price} / แก้ว</p>
                
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                    <button onclick="changeQuantity(${item.id}, -1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #f9f9f9; cursor: pointer;">-</button>
                    <span style="font-weight: bold;">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #f9f9f9; cursor: pointer;">+</button>
                </div>
            </div>

            <div style="font-weight: bold; font-size: 1.1rem; color: #d97706;">
                ฿${itemTotal}
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });

    updateOrderSummary(); // คำนวณราคาทั้งหมด
    
    // รีเซ็ตปุ่มเลือกทั้งหมด
    const selectAllEl = document.getElementById('selectAllItems');
    if (selectAllEl) selectAllEl.checked = false;
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
            renderCart(); // โหลดส่วนลดใหม่
        });
    }
}

// อัปเดตจำนวนสินค้าที่แสดง (หน้าแรก)
function updateVisibleCount() {
    const countElement = document.querySelector(".section-heading p strong");
    if (countElement) {
        const visibleCards = document.querySelectorAll(".shop-card:not([style*='display: none'])");
        countElement.textContent = visibleCards.length;
    }
}

// [DISCRETE MATH - SET THEORY]: A ∩ B
function applySetIntersection() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    const productCards = document.querySelectorAll(".shop-card");
    productCards.forEach(card => {
        const isTea = card.dataset.type === "ชา" || card.dataset.category === "ชา" || card.dataset.category === "ชานม";
        const badgeText = card.querySelector(".badge")?.innerText.trim() || "";
        const isPopular = badgeText === "BEST" || badgeText === "HOT";


        card.style.display = (isTea && isPopular) ? "" : "none";
    });
    updateVisibleCount();
}


function showAllProducts() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    document.querySelectorAll(".shop-card").forEach(card => card.style.display = "");
    updateVisibleCount();
}

// ==========================================
// Event Listeners เริ่มต้น
// ==========================================

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

// เสริม CSS สไตล์แจ้งเตือนแบบพรีเมียม
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
    .custom-toast.show { opacity: 1; transform: translateY(0); }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(customStyle);

// ==========================================
// ระบบ Checkbox และปุ่มลบที่เลือก
// ==========================================

document.addEventListener('change', function (e) {
    // 1. กรณีคลิกที่ Checkbox "เลือกทั้งหมด"
    if (e.target && e.target.id === 'selectAllItems') {
        const isChecked = e.target.checked;
        document.querySelectorAll('.item-checkbox').forEach(cb => {
            cb.checked = isChecked;
        });
    }

    // 2. กรณีคลิกที่ Checkbox "ของสินค้าแต่ละชิ้น" (เช็คแบบเรียลไทม์)
    if (e.target && e.target.classList.contains('item-checkbox')) {
        const totalItems = document.querySelectorAll('.item-checkbox').length;
        const checkedItems = document.querySelectorAll('.item-checkbox:checked').length;
        const selectAllEl = document.getElementById('selectAllItems');

        if (selectAllEl) {
            selectAllEl.checked = (totalItems === checkedItems && totalItems > 0);
        }
    }
});

// 3. ฟังก์ชันสั่งงานปุ่ม "ลบที่เลือก" (ด้านบน)
document.addEventListener('click', function (e) {
    if (e.target && (e.target.id === 'deleteSelectedBtn' || e.target.closest('#deleteSelectedBtn'))) {
        const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked');

        if (selectedCheckboxes.length === 0) {
            alert('กรุณาเลือกสินค้าที่ต้องการลบอย่างน้อย 1 รายการ');
            return;
        }

        if (confirm(`คุณต้องการลบสินค้าที่เลือกจำนวน ${selectedCheckboxes.length} รายการ ใช่หรือไม่?`)) {
            // เก็บ Index ของสินค้าที่ถูกเลือก (เรียงจากหลังไปหน้า)
            let indicesToRemove = Array.from(selectedCheckboxes).map(cb => parseInt(cb.getAttribute('data-index')));
            indicesToRemove.sort((a, b) => b - a);

            // ลบออกจาก Array
            indicesToRemove.forEach(index => {
                cart.splice(index, 1);
            });

            // บันทึกและวาดตะกร้าใหม่
            saveCart();
            renderCart();
            showToast(`ลบสินค้าเรียบร้อยแล้ว`);
        }
    }
});ขข