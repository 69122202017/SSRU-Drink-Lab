// ==========================================
// SSRU DRINK LAB - COMPLETE MINIMAL SCRIPT
// ==========================================

const products = [
    { id: 1, name: "ชาไทย", category: "ชานม", price: 45, type: "ชา", temperature: "เย็น", image: "images/thai-tea.png" },
    { id: 2, name: "อเมริกาโน่เย็น", category: "กาแฟ", price: 50, type: "กาแฟ", temperature: "เย็น", image: "images/iced-americano.png" },
    { id: 3, name: "มัทฉะลาเต้", category: "ชา", price: 60, type: "ชา", temperature: "เย็น", image: "images/matcha-latte.png" },
    { id: 4, name: "โกโก้เย็น", category: "โกโก้", price: 55, type: "โกโก้", temperature: "เย็น", image: "images/iced-cocoa.png" },
    { id: 5, name: "ลาเต้เย็น", category: "กาแฟ", price: 55, type: "กาแฟ", temperature: "เย็น", image: "images/iced-latte.png" },
    { id: 6, name: "ชานมไต้หวัน", category: "ชานม", price: 50, type: "ชานม", temperature: "เย็น", image: "images/taiwan-milk-tea.png" },
    { id: 7, name: "เลมอนที", category: "ชา", price: 45, type: "ชา", temperature: "เย็น", image: "images/lemon-tea.png" },
    { id: 8, name: "สตรอว์เบอร์รี่มิลค์", category: "ผลไม้", price: 65, type: "ผลไม้", temperature: "เย็น", image: "images/strawberry-milk.png" },
    { id: 9, name: "ช็อกโกแลตมิ้นท์", category: "โกโก้", price: 60, type: "โกโก้", temperature: "เย็น", image: "images/choco-mint.png" },
    { id: 10, name: "นมสดคาราเมล", category: "นมสด", price: 50, type: "นมสด", temperature: "เย็น", image: "images/caramel-milk.png" },
    { id: 11, name: "ชาเขียวมะลิ", category: "ชา", price: 45, type: "ชา", temperature: "เย็น", image: "images/jasmine-green-tea.png" },
    { id: 12, name: "บ๊วยโซดา", category: "ผลไม้", price: 40, type: "ผลไม้", temperature: "เย็น", image: "images/plum-soda.png" },
    { id: 13, name: "นมชมพูเย็น", category: "นมสด", price: 45, type: "นมสด", temperature: "เย็น", image: "images/pink-milk.png" },
    { id: 14, name: "อเมริกาโน่น้ำผึ้ง", category: "กาแฟ", price: 60, type: "กาแฟ", temperature: "เย็น", image: "images/honey-americano.png" },
    { id: 15, name: "พีชโซดา", category: "ผลไม้", price: 50, type: "ผลไม้", temperature: "เย็น", image: "images/peach-soda.png" },
    { id: 16, name: "เอสเพรสโซ่เย็น", category: "กาแฟ", price: 55, type: "กาแฟ", temperature: "เย็น", image: "images/espresso.png" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCartIds = JSON.parse(localStorage.getItem("selectedCartIds")) || [];
let appliedPromoCode = localStorage.getItem("appliedPromoCode") || "";
let promoDiscountAmount = parseFloat(localStorage.getItem("promoDiscountAmount")) || 0;

let luckyDiscountAmount = parseFloat(localStorage.getItem("luckyDiscountAmount")) || 0;
let hasSpunLucky = localStorage.getItem("hasSpunLucky") === "true";
let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

// [DISCRETE MATH - SET THEORY]: ดึงหมวดหมู่สินค้าที่ไม่ซ้ำด้วย Set Object
const uniqueCategories = new Set(products.map(item => item.category));

function showToast(message) {
    let existingToast = document.querySelector(".custom-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerHTML = `✨ ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Modal ปรับระดับความหวาน
function openCustomizeModal(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    let existingModal = document.getElementById("customizeModal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "customizeModal";
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(60,40,30,0.4); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;";

    modal.innerHTML = `
        <div style="background: #fdfbf7; width: 90%; max-width: 380px; padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(80,50,30,0.15); font-family: 'Sarabun', sans-serif; border: 1px solid #ebdccf;">
            <h3 style="color: #6b4423; margin-bottom: 5px;">🧊 ${product.name}</h3>
            <p style="font-size: 0.85rem; color: #8c7355; margin-bottom: 20px;">เลือกระดับความหวานตามใจชอบ</p>
            
            <div style="margin-bottom: 25px;">
                <label style="font-size: 0.9rem; font-weight: bold; color: #5c3a21; display: block; margin-bottom: 10px;">ระดับความหวาน:</label>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                    <button type="button" class="sweet-btn active" onclick="selectOption(this, 'sweet')" data-val="100%" style="padding: 10px; border: 1px solid #a47551; background: #a47551; color: white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: bold;">100%</button>
                    <button type="button" class="sweet-btn" onclick="selectOption(this, 'sweet')" data-val="70%" style="padding: 10px; border: 1px solid #d4c3b3; background: #fff; color: #5c3a21; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: bold;">70%</button>
                    <button type="button" class="sweet-btn" onclick="selectOption(this, 'sweet')" data-val="50%" style="padding: 10px; border: 1px solid #d4c3b3; background: #fff; color: #5c3a21; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: bold;">50%</button>
                    <button type="button" class="sweet-btn" onclick="selectOption(this, 'sweet')" data-val="0%" style="padding: 10px; border: 1px solid #d4c3b3; background: #fff; color: #5c3a21; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: bold;">0%</button>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button type="button" onclick="closeCustomizeModal()" style="flex: 1; background: #ebdccf; color: #5c3a21; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">ยกเลิก</button>
                <button type="button" onclick="confirmAddToCart(${product.id})" style="flex: 1; background: #a47551; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">ใส่ตะกร้า</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectOption(btn, groupClass) {
    document.querySelectorAll(`.${groupClass}-btn`).forEach(b => {
        b.style.background = "#fff";
        b.style.color = "#5c3a21";
        b.style.borderColor = "#d4c3b3";
        b.classList.remove("active");
    });
    btn.style.background = "#a47551";
    btn.style.color = "#fff";
    btn.style.borderColor = "#a47551";
    btn.classList.add("active");
}

function closeCustomizeModal() {
    const modal = document.getElementById("customizeModal");
    if (modal) modal.remove();
}

function confirmAddToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const activeSweetBtn = document.querySelector(".sweet-btn.active");
    const activeSweet = activeSweetBtn ? activeSweetBtn.dataset.val : "100%";
    let customName = `${product.name} (หวาน ${activeSweet})`;

    const existingProduct = cart.find(item => item.uniqueName === customName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            uniqueName: customName,
            price: product.price,
            quantity: 1,
            sweet: activeSweet
        });
    }

    saveCart();
    closeCustomizeModal();
    showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}

function saveSelectedState() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    selectedCartIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.dataset.id));
    localStorage.setItem("selectedCartIds", JSON.stringify(selectedCartIds));
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = itemCount;
}

function injectPromoCodeUI() {
    const orderSummary = document.querySelector(".order-summary") || document.querySelector(".cart-container");
    if (!orderSummary || document.getElementById("promoCodeSection")) return;

    const inputValue = appliedPromoCode ? appliedPromoCode : "";
    const msgColor = appliedPromoCode ? "#5a8264" : "#8c7355";
    const msgText = appliedPromoCode ? "✅ ใช้โค้ดสำเร็จ! ลด 20 บาท" : "ลองใช้โค้ด: ssru69017";

    const promoHTML = `
        <div id="promoCodeSection" style="margin: 15px 0; padding: 12px; background: #f7f3ed; border-radius: 10px; border: 1px dashed #d4c3b3;">
            <strong style="font-size: 0.9rem; color: #5c3a21; display: block; margin-bottom: 8px;">🎟️ โค้ดส่วนลดพิเศษ</strong>
            <div style="display: flex; gap: 8px;">
                <input type="text" id="promoInput" placeholder="กรอกโค้ด เช่น ssru69017" value="${inputValue}" style="flex: 1; padding: 6px 10px; border: 1px solid #d4c3b3; border-radius: 6px; font-size: 0.9rem; outline: none; background: #fff;">
                <button type="button" onclick="applyPromoCode()" style="background: #a47551; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">ใช้โค้ด</button>
            </div>
            <p id="promoMsg" style="font-size: 0.8rem; margin-top: 5px; color: ${msgColor};">${msgText}</p>
        </div>
    `;
    
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.insertAdjacentHTML("beforebegin", promoHTML);
    } else {
        orderSummary.insertAdjacentHTML("beforeend", promoHTML);
    }
}

function updateLuckyDrawUI() {
    const promoDescEl = document.querySelector("div[style*='โปรโมชั่น'] p, .promo-box p") || 
                        Array.from(document.querySelectorAll("p")).find(p => p.textContent.includes("ซื้อครบ 300 บาท") || p.textContent.includes("สุ่มส่วนลด"));
    
    if (promoDescEl) {
        if (hasSpunLucky) {
            promoDescEl.innerHTML = `<span style="color: #5a8264; font-weight: bold;">🎉 สุ่มส่วนลดสำเร็จ! ได้รับส่วนลด ${luckyDiscountAmount} บาท</span>`;
        } else {
            promoDescEl.innerHTML = `ซื้อครบ 300 บาท รับส่วนลด 10% หรือกดสุ่มส่วนลดพิเศษเพิ่มได้ที่ปุ่มด้านบน!`;
        }
    }
}

function applyPromoCode() {
    const input = document.getElementById("promoInput");
    const msg = document.getElementById("promoMsg");
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (code === "SSRU69017") {
        appliedPromoCode = "SSRU69017";
        promoDiscountAmount = 20; 
        localStorage.setItem("appliedPromoCode", appliedPromoCode);
        localStorage.setItem("promoDiscountAmount", promoDiscountAmount);
        if (msg) { msg.style.color = "#5a8264"; msg.textContent = "✅ ใช้โค้ดสำเร็จ! ลด 20 บาท"; }
        showToast("ใช้โค้ดส่วนลดสำเร็จ!");
        renderCart();
    } else if (code === "") {
        appliedPromoCode = "";
        promoDiscountAmount = 0;
        localStorage.removeItem("appliedPromoCode");
        localStorage.removeItem("promoDiscountAmount");
        if (msg) { msg.style.color = "#8c7355"; msg.textContent = "ลบโค้ดส่วนลดแล้ว"; }
        renderCart();
    } else {
        showToast("❌ รหัสส่วนลดไม่ถูกต้อง");
        if (msg) { msg.style.color = "#c96868"; msg.textContent = "❌ รหัสส่วนลดไม่ถูกต้อง"; }
    }
}

function spinLuckyDraw() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < 300) {
        showToast(`❌ ยอดปัจจุบัน ฿${subtotal} | ต้องมียอดซื้อครบ 300 บาทขึ้นไป ถึงจะสุ่มส่วนลดได้ครับ!`);
        return;
    }

    if (hasSpunLucky) {
        showToast("คุณได้สุ่มโชคไปแล้วในออเดอร์นี้!");
        return;
    }
    const possibleDiscounts = [5, 10, 15, 20];
    const randomVal = possibleDiscounts[Math.floor(Math.random() * possibleDiscounts.length)];
    luckyDiscountAmount = randomVal;
    hasSpunLucky = true;
    localStorage.setItem("luckyDiscountAmount", luckyDiscountAmount);
    localStorage.setItem("hasSpunLucky", "true");
    showToast(`🎉 สุ่มได้ส่วนลด ${randomVal} บาท!`);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;

    const subtotalCheck = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalCheck < 300 && hasSpunLucky) {
        luckyDiscountAmount = 0;
        hasSpunLucky = false;
        localStorage.removeItem("luckyDiscountAmount");
        localStorage.removeItem("hasSpunLucky");
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8c7355;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">🛒 ยังไม่มีสินค้าในตะกร้าของคุณ</p>
                <a href="products.html" style="color: #a47551; font-weight: bold; text-decoration: underline;">เลือกซื้อเครื่องดื่มเลย</a>
            </div>
        `;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setVal("subtotal", "฿0"); setVal("discount", "- ฿0"); setVal("total", "฿0"); setVal("cartCount", "0 รายการ");
        
        const deleteBtn = document.getElementById("deleteSelectedBtn");
        if (deleteBtn) deleteBtn.style.display = "none";
        const selectAllBtn = document.getElementById("selectAllBtn");
        if (selectAllBtn) selectAllBtn.style.display = "block";
        selectedCartIds = [];
        localStorage.removeItem("selectedCartIds");
        
        const promoSec = document.getElementById("promoCodeSection");
        if (promoSec) promoSec.remove();

        updateLuckyDrawUI();
        return;
    }

    const selectAllBtn = document.getElementById("selectAllBtn");
    if (selectAllBtn) selectAllBtn.style.display = "block";

    injectPromoCodeUI();
    updateLuckyDrawUI();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        const product = products.find(p => p.id === item.id);
        const imageSrc = product ? product.image : "images/thai-tea.png";
        const isChecked = selectedCartIds.includes(item.id) ? "checked" : "";

        const itemHTML = `
            <div class="cart-item" style="animation: fadeIn 0.3s ease; display: flex; align-items: center; gap: 15px; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ebdccf;">
                <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${isChecked} onchange="handleCheckboxChange()">
                <div style="width: 75px; height: 75px; flex-shrink: 0;">
                    <img src="${imageSrc}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                </div>
                <div style="flex-grow: 1;">
                    <h3 style="font-size: 1rem; color: #5c3a21; margin-bottom: 2px;">${item.uniqueName || item.name}</h3>
                    <p style="font-size: 0.85rem; color: #8c7355;">ราคา ฿${item.price} / แก้ว</p>
                    <div class="quantity" style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span style="color: #5c3a21; font-weight: bold; min-width: 15px; text-align: center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <strong class="cart-price" style="font-size: 1rem; color: #5c3a21;">฿${itemTotal}</strong>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });

    const memberCheck = document.getElementById("memberCheck");
    const isMember = memberCheck ? memberCheck.checked : false;
    let memberDiscount = (subtotal >= 300 && isMember) ? subtotal * 0.10 : 0;
    let totalDiscount = memberDiscount + (appliedPromoCode ? promoDiscountAmount : 0) + luckyDiscountAmount;
    let finalTotal = Math.max(0, subtotal - Math.round(totalDiscount));

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal("subtotal", `฿${subtotal}`);
    setVal("discount", `- ฿${Math.round(totalDiscount)}`);
    setVal("total", `฿${finalTotal}`);
    setVal("cartCount", `${itemCount} รายการ`);

    const promoSection = document.getElementById("promoCodeSection");
    const totalElement = document.getElementById("total")?.closest("div[style*='display']") || document.getElementById("total")?.parentElement;
    
    if (promoSection && totalElement && promoSection.nextElementSibling !== totalElement) {
        promoSection.after(totalElement);
    }

    toggleDeleteButton();
}

function toggleSelectAll() {
    const selectAllBtn = document.getElementById("selectAllBtn");
    const checkboxes = document.querySelectorAll('.item-checkbox');
    if (checkboxes.length === 0) return;

    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });

    if (!allChecked) {
        selectAllBtn.textContent = "ยกเลิกเลือกทั้งหมด";
    } else {
        selectAllBtn.textContent = "เลือกทั้งหมด";
    }

    handleCheckboxChange();
}

function deleteSelectedItems() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const idsToDelete = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.dataset.id));

    if (idsToDelete.length === 0) {
        showToast("กรุณาเลือกรายการที่ต้องการลบ");
        return;
    }

    cart = cart.filter(item => !idsToDelete.includes(item.id));
    selectedCartIds = [];
    
    saveCart();
    localStorage.removeItem("selectedCartIds");
    renderCart();
    showToast("ลบรายการที่เลือกเรียบร้อยแล้ว");
}

function handleCheckboxChange() {
    saveSelectedState();
    toggleDeleteButton();

    const selectAllBtn = document.getElementById("selectAllBtn");
    const checkboxes = document.querySelectorAll('.item-checkbox');
    if (selectAllBtn && checkboxes.length > 0) {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        selectAllBtn.textContent = allChecked ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด";
    }
}

function toggleDeleteButton() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const deleteBtn = document.getElementById("deleteSelectedBtn");
    if (!deleteBtn) return;
    deleteBtn.style.display = Array.from(checkboxes).some(cb => cb.checked) ? "inline-block" : "none";
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
}

// อัปเดตจำนวนสินค้าที่แสดง (ระบบกรอง)
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

function checkout() {
    if (cart.length === 0) {
        showToast("กรุณาเลือกสินค้าลงตะกร้าก่อนทำการสั่งซื้อครับ");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const memberCheck = document.getElementById("memberCheck");
    let memberDiscount = (subtotal >= 300 && (memberCheck ? memberCheck.checked : false)) ? subtotal * 0.10 : 0;
    let totalDiscount = memberDiscount + (appliedPromoCode ? promoDiscountAmount : 0) + luckyDiscountAmount;
    let finalTotal = Math.max(0, subtotal - Math.round(totalDiscount));
    let orderId = "SSRU-" + Math.floor(100000 + Math.random() * 900000);
    let orderDate = new Date().toLocaleString();

    const newOrder = {
        orderId,
        date: orderDate,
        items: [...cart],
        subtotal,
        discount: Math.round(totalDiscount),
        total: finalTotal
    };
    
    // บันทึกลงประวัติ
    orderHistory.unshift(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    // เคลียร์ค่าในตะกร้าและ LocalStorage ทันทีที่กดสั่งซื้อ
    cart = [];
    selectedCartIds = [];
    appliedPromoCode = "";
    promoDiscountAmount = 0;
    luckyDiscountAmount = 0;
    hasSpunLucky = false;

    localStorage.removeItem("cart");
    localStorage.removeItem("selectedCartIds");
    localStorage.removeItem("appliedPromoCode");
    localStorage.removeItem("promoDiscountAmount");
    localStorage.removeItem("luckyDiscountAmount");
    localStorage.removeItem("hasSpunLucky");

    const promoSec = document.getElementById("promoCodeSection");
    if (promoSec) promoSec.remove();

    renderCart();
    updateCartBadge();

    // แสดงหน้าต่างใบเสร็จ
    showReceiptModal(newOrder);
    showToast("🎉 สั่งซื้อสำเร็จ ขอบคุณที่ใช้บริการครับ!");
}

function showReceiptModal(order) {
    let modalOverlay = document.getElementById("receiptModal");
    if (modalOverlay) modalOverlay.remove();

    modalOverlay = document.createElement("div");
    modalOverlay.id = "receiptModal";
    modalOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(60,40,30,0.4); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;";
    
    let itemsListHTML = order.items.map(i => `<div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; color: #5c3a21;"><span>${i.uniqueName || i.name} x${i.quantity}</span><span>฿${i.price * i.quantity}</span></div>`).join('');

    modalOverlay.innerHTML = `
        <div style="background: #fdfbf7; width: 90%; max-width: 400px; padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(80,50,30,0.15); font-family: 'Sarabun', sans-serif; border: 1px solid #ebdccf;">
            <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: #6b4423; margin-bottom: 5px;">☕ SSRU DRINK LAB</h2>
                <p style="font-size: 0.85rem; color: #8c7355;">ใบเสร็จรับเงินดิจิทัล (E-Receipt)</p>
                <hr style="border: none; border-top: 1px dashed #ebdccf; margin: 10px 0;">
            </div>
            <div style="margin-bottom: 15px; font-size: 0.85rem; color: #5c3a21;">
                <p><strong>เลขที่คำสั่งซื้อ:</strong> ${order.orderId}</p>
                <p><strong>วันที่:</strong> ${order.date}</p>
            </div>
            <div style="max-height: 150px; overflow-y: auto; margin-bottom: 15px; border-bottom: 1px solid #ebdccf; padding-bottom: 10px;">
                ${itemsListHTML}
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 20px; color: #5c3a21;">
                <div style="display: flex; justify-content: space-between;"><span>ยอดรวมสินค้า</span><span>฿${order.subtotal}</span></div>
                <div style="display: flex; justify-content: space-between; color: #c96868;"><span>ส่วนลดทั้งหมด</span><span>- ฿${order.discount}</span></div>
                <hr style="border: none; border-top: 1px solid #ebdccf; margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: bold; color: #6b4423;"><span>ยอดสุทธิ</span><span>฿${order.total}</span></div>
            </div>
            <button onclick="closeReceiptModal()" style="width: 100%; background: #a47551; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer;">ปิดหน้าต่าง</button>
        </div>
    `;
    document.body.appendChild(modalOverlay);
}

function closeReceiptModal() {
    const modal = document.getElementById("receiptModal");
    if (modal) modal.remove();
}

function showOrderHistoryModal() {
    let existingModal = document.getElementById("historyModal");
    if (existingModal) existingModal.remove();

    let historyHTML = "";
    if (orderHistory.length === 0) {
        historyHTML = `<p style="text-align: center; color: #8c7355; padding: 20px;">ยังไม่มีประวัติการสั่งซื้อ</p>`;
    } else {
        historyHTML = orderHistory.map((order, idx) => `
            <div style="background: #f7f3ed; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #ebdccf;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                    <strong style="color: #6b4423;">${order.orderId}</strong>
                    <span style="color: #8c7355;">${order.date}</span>
                </div>
                <p style="font-size: 0.85rem; color: #5c3a21; margin-bottom: 8px;">จำนวน ${order.items.length} รายการ | ยอดชำระ: <b>฿${order.total}</b></p>
                <button onclick="showReceiptModal(orderHistory[${idx}])" style="background: #6b4423; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.8rem; cursor: pointer;">📄 ดูบิลย้อนหลัง</button>
            </div>
        `).join('');
    }

    const modal = document.createElement("div");
    modal.id = "historyModal";
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(60,40,30,0.4); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;";

    modal.innerHTML = `
        <div style="background: #fdfbf7; width: 90%; max-width: 420px; padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(80,50,30,0.15); font-family: 'Sarabun', sans-serif; border: 1px solid #ebdccf;">
            <h3 style="color: #6b4423; margin-bottom: 15px;">📜 ประวัติการสั่งซื้อทั้งหมด</h3>
            <div style="max-height: 250px; overflow-y: auto; margin-bottom: 15px;">
                ${historyHTML}
            </div>
            <button onclick="document.getElementById('historyModal').remove()" style="width: 100%; background: #a47551; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">ปิดหน้าต่าง</button>
        </div>
    `;
    document.body.appendChild(modal);
}

document.addEventListener("DOMContentLoaded", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    selectedCartIds = JSON.parse(localStorage.getItem("selectedCartIds")) || [];
    appliedPromoCode = localStorage.getItem("appliedPromoCode") || "";
    promoDiscountAmount = parseFloat(localStorage.getItem("promoDiscountAmount")) || 0;
    luckyDiscountAmount = parseFloat(localStorage.getItem("luckyDiscountAmount")) || 0;
    hasSpunLucky = localStorage.getItem("hasSpunLucky") === "true";
    orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

    renderCart();
    updateCartBadge();

    const selectAllBtn = document.getElementById("selectAllBtn");
    if (selectAllBtn) {
        selectAllBtn.onclick = toggleSelectAll;
    }

    const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
    if (deleteSelectedBtn) {
        deleteSelectedBtn.onclick = deleteSelectedItems;
    }

    const memberCheck = document.getElementById("memberCheck");
    if (memberCheck) {
        memberCheck.addEventListener("change", renderCart);
    }

    // ปุ่มเซต Intersection & แสดงทั้งหมด
    const topIntersectionBtn = document.getElementById("intersectionBtn");
    if (topIntersectionBtn) topIntersectionBtn.addEventListener("click", applySetIntersection);

    const bottomIntersectionBtn = document.getElementById("setIntersectionBtn");
    if (bottomIntersectionBtn) {
        bottomIntersectionBtn.addEventListener("click", () => {
            document.querySelector(".product-section")?.scrollIntoView({ behavior: "smooth" });
            applySetIntersection();
        });
    }

    const showAllBtn = document.getElementById("showAll");
    if (showAllBtn) showAllBtn.addEventListener("click", showAllProducts);

    // ระบบค้นหาด้วยข้อความ (Search Input)
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

    // ระบบกรองหมวดหมู่สินค้า (Category Filter Buttons)
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

    const luckyBtn = document.querySelector(".lucky-btn") || document.getElementById("luckyBtn");
    if (luckyBtn) {
        luckyBtn.addEventListener("click", spinLuckyDraw);
    } else {
        document.querySelectorAll("button").forEach(btn => {
            if (btn.textContent.includes("สุ่มลุ้นโชค")) {
                btn.onclick = spinLuckyDraw;
            }
        });
    }

    document.querySelectorAll(".shop-card button, .product-card button, .add-to-cart-btn").forEach((btn, index) => {
        const card = btn.closest(".shop-card") || btn.closest(".product-card");
        if (card) {
            btn.onclick = (e) => {
                e.preventDefault();
                let pId = btn.dataset.id ? parseInt(btn.dataset.id) : (index + 1);
                openCustomizeModal(pId);
            };
        }
    });

    if (!document.getElementById("historyBtn") && document.querySelector(".cart-container")) {
        const historyBtn = document.createElement("button");
        historyBtn.id = "historyBtn";
        historyBtn.innerHTML = "📜 ประวัติบิล";
        historyBtn.style.cssText = "background: #6b4423; color: white; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-family: 'Sarabun', sans-serif; font-size: 0.9rem; margin-bottom: 15px;";
        historyBtn.onclick = showOrderHistoryModal;
        
        const cartContainer = document.querySelector(".cart-container");
        if (cartContainer) cartContainer.prepend(historyBtn);
    }

    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
});

const customStyle = document.createElement("style");
customStyle.innerHTML = `
    .custom-toast {
        position: fixed; bottom: 30px; right: 30px; background: #5c3a21; color: #fdfbf7;
        padding: 12px 24px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        font-family: 'Sarabun', sans-serif; font-size: 0.95rem; z-index: 9999;
        opacity: 0; transform: translateY(20px); transition: all 0.3s ease; border-left: 5px solid #a47551;
    }
    .custom-toast.show { opacity: 1; transform: translateY(0); }
    
    .item-checkbox {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border: 2px solid #a47551;
        border-radius: 50%;
        outline: none;
        cursor: pointer;
        background-color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }
    .item-checkbox:checked {
        background-color: #a47551;
        border-color: #a47551;
    }
    .item-checkbox:checked::after {
        content: "✓";
        color: white;
        font-size: 11px;
        font-weight: bold;
    }

    #deleteSelectedBtn {
        background-color: #d9534f !important;
        color: white !important;
        border: none !important;
        padding: 6px 14px !important;
        border-radius: 8px !important;
        font-size: 0.85rem !important;
        font-weight: bold !important;
        cursor: pointer !important;
        transition: background 0.2s ease !important;
    }
    #deleteSelectedBtn:hover {
        background-color: #c9302c !important;
    }

    .cart-item .quantity button {
        cursor: pointer;
        border: none;
        border-radius: 6px;
        width: 26px;
        height: 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        font-weight: bold;
        background: #f4ecdf;
        color: #5c3a21;
        transition: all 0.2s ease;
    }

    .cart-item .quantity button:hover {
        background: #8c6241 !important;
        color: #fff !important;
        transform: scale(1.08);
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(customStyle);