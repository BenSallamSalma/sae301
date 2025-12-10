import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

// Gestion dynamique et responsive
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const nav = document.querySelector('nav');
    
    // Fonction pour détecter la taille d'écran
    function isMobile() {
        return window.innerWidth <= 480;
    }
    
    function isTablet() {
        return window.innerWidth > 480 && window.innerWidth <= 768;
    }
    
    // Fonction pour positionner le menu dynamiquement
    function positionMenu() {
        if (!dropdownToggle || !dropdownMenu) return;
        
        const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        
        if (isMobile()) {
            // Sur mobile, le menu est en position relative (géré par CSS)
            dropdownMenu.classList.toggle('show', isExpanded);
            return;
        }
        
        if (isExpanded) {
            const toggleRect = dropdownToggle.getBoundingClientRect();
            const menuWidth = dropdownMenu.offsetWidth || 200;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculer la position
            let top = toggleRect.bottom + 8;
            let right = viewportWidth - toggleRect.right;
            let left = 'auto';
            
            // Vérifier si le menu sort en bas de l'écran
            const menuHeight = dropdownMenu.offsetHeight || 150;
            if (top + menuHeight > viewportHeight) {
                top = toggleRect.top - menuHeight - 8;
            }
            
            // Vérifier si le menu sort à droite
            if (right + menuWidth > viewportWidth) {
                right = 'auto';
                left = viewportWidth - toggleRect.left;
            }
            
            // Appliquer les styles
            dropdownMenu.style.top = top + 'px';
            dropdownMenu.style.right = typeof right === 'number' ? right + 'px' : right;
            dropdownMenu.style.left = left;
            dropdownMenu.style.position = 'fixed';
        }
    }
    
    // Gestion du menu déroulant
    if (dropdownToggle && dropdown && dropdownMenu) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Positionner le menu
            setTimeout(() => positionMenu(), 10);
        });

        // Repositionner au redimensionnement avec debounce
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
                    positionMenu();
                }
            }, 150);
        });

        // Repositionner au scroll avec debounce
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (isMobile()) return; // Pas besoin sur mobile
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
                    positionMenu();
                }
            }, 50);
        }, true);

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownToggle.setAttribute('aria-expanded', 'false');
                if (isMobile()) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
    }
    
    // Gestion responsive du nav
    if (nav) {
        // Observer les changements de taille pour ajuster dynamiquement
        const resizeObserver = new ResizeObserver(() => {
            // Ajustements dynamiques si nécessaire
        });
        
        resizeObserver.observe(nav);
    }
    
    // Améliorer les performances avec Intersection Observer pour les animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observer les éléments du footer pour animations
        document.querySelectorAll('footer [class^="footer-part-"]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
});
