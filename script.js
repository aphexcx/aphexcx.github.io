/*
 * Main JavaScript file for Afik Cohen's personal website.
 *
 * This script currently adds smooth scrolling for in‑page navigation. It can
 * easily be extended in the future to support additional interactive
 * behaviours such as theming or dynamic content loading.
 */

// Enable smooth scrolling when clicking on hero buttons
document.addEventListener('DOMContentLoaded', () => {
    // Attach smooth scrolling to any internal anchor links in nav or CTA buttons
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            // Ignore external links and placeholders
            if (targetId.length > 1) {
                event.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});