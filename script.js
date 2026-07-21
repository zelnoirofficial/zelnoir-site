:root {
    --bg-color: #0c0c0c;
    --card-bg: #141414;
    --accent-color: #d4af37; /* Luxury Gold */
    --text-main: #f5f5f5;
    --text-muted: #a0a0a0;
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
}

body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
    line-height: 1.6;
}

h1, h2, h3, .logo {
    font-family: 'Cormorant Garamond', serif;
}

.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
}

/* Header */
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(12, 12, 12, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    padding: 15px 0;
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 26px;
    font-weight: 700;
    color: var(--accent-color);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    line-height: 1.1;
}

.logo span {
    font-size: 11px;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 2px;
    color: var(--text-muted);
}

nav ul {
    display: flex;
    list-style: none;
    gap: 30px;
}

nav ul li a {
    text-decoration: none;
    color: var(--text-main);
    font-size: 15px;
    font-weight: 400;
    transition: var(--transition);
}

nav ul li a:hover {
    color: var(--accent-color);
}

.icons {
    display: flex;
    gap: 20px;
    font-size: 18px;
    cursor: pointer;
}

.icons i:hover {
    color: var(--accent-color);
}

.menu-toggle {
    display: none;
    font-size: 22px;
    cursor: pointer;
}

/* Hero Section */
.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
    padding: 0 20px;
}

.hero-content h1 {
    font-size: 52px;
    margin-bottom: 15px;
    color: var(--text-main);
}

.hero-content p {
    font-size: 18px;
    color: var(--text-muted);
    margin-bottom: 30px;
}

.btn, .product-btn {
    display: inline-block;
    padding: 12px 30px;
    background-color: var(--accent-color);
    color: #000;
    font-weight: 600;
    text-decoration: none;
    border-radius: 4px;
    transition: var(--transition);
    border: 1px solid var(--accent-color);
}

.btn:hover, .product-btn:hover {
    background-color: transparent;
    color: var(--accent-color);
}

/* Products Section */
#products {
    padding: 100px 0;
}

#products h2, #about h2, #story h2 {
    text-align: center;
    font-size: 40px;
    margin-bottom: 50px;
    color: var(--accent-color);
}

.products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.product-card {
    background-color: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: var(--transition);
}

.product-card:hover {
    transform: translateY(-8px);
    border-color: rgba(212, 175, 55, 0.4);
}

.product-card img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 15px;
}

.product-card h3 {
    font-size: 22px;
    margin-bottom: 8px;
}

.product-card p {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 12px;
}

.product-card span {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-color);
    margin-bottom: 15px;
}

.product-btn {
    padding: 8px 20px;
    font-size: 14px;
}

/* About Section */
#about {
    padding: 80px 0;
    background: #0f0f0f;
}

.about-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
}

.about-card {
    background: var(--card-bg);
    padding: 40px 30px;
    text-align: center;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.about-card i {
    font-size: 32px;
    color: var(--accent-color);
    margin-bottom: 20px;
}

.about-card h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.about-card p {
    color: var(--text-muted);
    font-size: 14px;
}

/* Story Section */
#story {
    padding: 100px 0;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

#story p {
    font-size: 18px;
    color: var(--text-muted);
}

/* Footer */
footer {
    background: #050505;
    padding: 60px 0 30px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

footer h2 {
    color: var(--accent-color);
    font-size: 28px;
    margin-bottom: 5px;
}

footer p {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 10px;
}

.social {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.social a {
    color: var(--text-main);
    font-size: 20px;
    transition: var(--transition);
}

.social a:hover {
    color: var(--accent-color);
}

/* Responsive Mobile View */
@media (max-width: 768px) {
    nav {
        position: absolute;
        top: 100%;
        left: -100%;
        width: 100%;
        background: #111;
        box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        transition: 0.3s ease;
    }

    nav.active {
        left: 0;
    }

    nav ul {
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        gap: 20px;
    }

    .menu-toggle {
        display: block;
    }

    .hero-content h1 {
        font-size: 36px;
    }
}
