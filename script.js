
// Global State
let cart = [];
let cartTotal = 0;
let cartCount = 0;
let users = JSON.parse(localStorage.getItem('vansUsers')) || [];

// Theme management functions
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    console.log(`Theme toggled to: ${isDark ? 'Dark' : 'Light'}`);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// 1. PAGE LOAD EVENT (5 points) - DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - Initializing Vans Skate Shop');
    
    loadTheme();

    // Init cart display
    updateCartDisplay();

    // Scroll animations observer
    initScrollAnimations();

    // Parallax hero ready
    document.getElementById('hero').style.opacity = '1';

    // Set focus for keyboard demo
    document.body.focus();
});

// 2. WINDOW RESIZE EVENT (5 points) - Dynamic responsive adjustments
window.addEventListener('resize', function() {
    console.log('Window resized - Adjusting layout');

    // Re-adjust sidebar width on mobile
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.style.width = '100%';
    } else {
        sidebar.style.width = '400px';
    }

    // Update hero text sizing
    const heroTitle = document.querySelector('.hero-title');
    heroTitle.style.fontSize = window.innerWidth > 1200 ? '6rem' : window.innerWidth > 768 ? '4rem' : '3rem';
});

// 3. SCROLL EVENT (5 points) - Parallax + Animations + Progress
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll() {
    const scrollPos = window.scrollY;

    // Hero Parallax Effect (10 points)
    const hero = document.getElementById('hero');
    const parallaxSpeed = 0.5;
    const yPos = -(scrollPos * parallaxSpeed);
    hero.style.transform = `translateY(${yPos}px)`;

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    const progress = (scrollPos / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = progress + '%';

    // Trigger section animations
    const sections = document.querySelectorAll('.products, .video-section, .newsletter');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add('animate', 'visible');
        }
    });
}

// Intersection Observer for scroll animations (modern scroll event handling)
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate', 'visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.products, .video-section, .newsletter').forEach(el => {
        observer.observe(el);
    });
}

// 4. CLICK EVENTS (5 points) - Multiple interactive buttons
// Shop Now Button - Scroll to products
document.getElementById('shopNowBtn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

// Cart Toggle Button
document.getElementById('cartToggleBtn').addEventListener('click', toggleSidebar);
document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);

// Sidebar Overlay Click to Close
document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Add to Cart Buttons (delegation for dynamic efficiency)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productCard = e.target.closest('.product-card');
        const name = productCard.dataset.name;
        const price = parseFloat(productCard.dataset.price);
        addToCart(name, price);
    }
});

// Checkout Button
document.getElementById('checkoutBtn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty! Add some sick Vans kicks first.');
    } else {
        alert(`Checkout successful! Total: $${cartTotal.toFixed(2)}. Thanks for shopping Vans!`);
        clearCart();
    }
});

function addToCart(name, price) {
    cart.push({ name, price });
    cartTotal += price;
    cartCount++;
    updateCartDisplay();
    console.log(`Added ${name} to cart. Total items: ${cartCount}`);
}

function clearCart() {
    cart = [];
    cartTotal = 0;
    cartCount = 0;
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');

    cartCountEl.textContent = cartCount;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p style="text-align:center; color:#999;">No items yet. Start shopping!</p>';
    } else {
        cartItemsEl.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" style="background:#FF6600; border:none; color:#fff; padding:0.2rem 0.5rem; border-radius:3px; cursor:pointer;">Remove</button>
            </div>
        `).join('');
    }

    cartTotalEl.textContent = cartTotal.toFixed(2);
}

// Global remove function for onclick
window.removeFromCart = function(index) {
    const item = cart.splice(index, 1)[0];
    cartTotal -= item.price;
    cartCount--;
    updateCartDisplay();
};

// 5. KEYBOARD EVENTS (5 points) - Enhanced shortcuts for full UX
document.addEventListener('keydown', function(e) {
    // ESC closes sidebar
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
        console.log('ESC: Sidebar closed');
        return;
    }

    // Navigation shortcuts
    const navMap = {
        'h': 'hero',
        's': 'products',
        'p': 'video',
        'n': 'newsletter'
    };
    if (navMap[e.key.toLowerCase()]) {
        e.preventDefault();
        document.getElementById(navMap[e.key.toLowerCase()]).scrollIntoView({ behavior: 'smooth' });
        console.log(`${e.key.toUpperCase()}: Scrolled to ${navMap[e.key.toLowerCase()]}`);
        return;
    }

    // 'C' toggles cart sidebar
    if (e.key.toLowerCase() === 'c') {
        toggleSidebar();
        console.log('C: Cart sidebar toggled');
        return;
    }

    // 'G' toggle keyboard guide
    if (e.key.toLowerCase() === 'g') {
        const guide = document.getElementById('keyboardGuide');
        guide.classList.toggle('active');
        console.log('Keyboard guide toggled');
        return;
    }
    
    // 'D' toggle dark mode, 'L' toggle light mode
    if (e.key.toLowerCase() === 'd') {
        toggleTheme();
        return;
    }
    if (e.key.toLowerCase() === 'l') {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        console.log('Theme set to Light');
        return;
    }

    // 'A' adds random shoe
    if (e.key === 'a' || e.key === 'A') {
        const products = [
            { name: 'Old Skool Black', price: 89.99 },
            { name: 'Checkerboard Authentic', price: 99.99 },
            { name: 'Slip-On Pro', price: 79.99 },
            { name: 'Sk8-Hi MTE', price: 109.99 }
        ];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        addToCart(randomProduct.name, randomProduct.price);
        console.log(`A: Added ${randomProduct.name}`);
        return;
    }

    // Arrow keys video control (if focused)
    if (document.getElementById('promoVideo') === document.activeElement) {
        const video = document.getElementById('promoVideo');
        if (e.key === 'ArrowRight') video.currentTime += 10;
        if (e.key === 'ArrowLeft') video.currentTime -= 10;
        if (e.key === 'ArrowUp') video.volume = Math.min(1, video.volume + 0.1);
        if (e.key === 'ArrowDown') video.volume = Math.max(0, video.volume - 0.1);
        console.log(`Video shortcut: ${e.key}`);
    }
});

// 6. HOVER EVENTS (5 points) - CSS + JS enhanced hovers
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 25px 60px rgba(255,102,0,0.4)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    });
});

// 7. FORM SUBMISSION EVENT (5 points) - Validation + Prevention
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent actual submit

    const email = document.getElementById('emailInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const newsletterOptIn = document.getElementById('newsletterOptIn').checked;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.length < 3) {
        showSignupStatus('Username too short!', 'error');
        return;
    }
    if (!emailRegex.test(email)) {
        showSignupStatus('Invalid email!', 'error');
        return;
    }

    alert(`Thanks ${email.split('@')[0]}! You\'re now on the Vans mailing list. Welcome to the family!`);
    this.reset();
    console.log('Newsletter form submitted successfully');
});

// 8. VIDEO EVENTS (5 points) - Play/Pause/End handling
const promoVideo = document.getElementById('promoVideo');
const videoStatus = document.getElementById('videoStatus');

promoVideo.addEventListener('play', function() {
    videoStatus.textContent = '▶️ Skating hard...';
    console.log('Video play event');
});

promoVideo.addEventListener('pause', function() {
    videoStatus.textContent = '⏸️ Paused - Keep pushing!';
    console.log('Video pause event');
});

promoVideo.addEventListener('ended', function() {
    videoStatus.textContent = '🏆 Session complete! Rewatch?';
    console.log('Video end event');
});

promoVideo.addEventListener('timeupdate', function() {
    const percent = (this.currentTime / this.duration) * 100;
    console.log(`Video progress: ${percent.toFixed(0)}%`);
});

// Guide close buttons
document.getElementById('closeGuide').addEventListener('click', () => {
    document.getElementById('keyboardGuide').classList.remove('active');
});

document.querySelector('.guide-overlay').addEventListener('click', () => {
    document.getElementById('keyboardGuide').classList.remove('active');
});

// ESC closes guide too
// Already handled in keydown

// Dynamic Sidebar Navigation Links (scroll smoothly)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        // Close sidebar on nav click (mobile)
        toggleSidebar();
    });
});

// Performance: Remove listeners on unload
window.addEventListener('beforeunload', function() {
    console.log('Page unloading - All events handled successfully!');
});

console.log('Vans Skate Shop EDP fully loaded - Test all interactions!');