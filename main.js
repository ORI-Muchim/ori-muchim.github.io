document.addEventListener('DOMContentLoaded', function() {
    // Staggered animation for sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.classList.add(`delay-${(index % 3) + 1}`);
    });

    // Initialize AOS (Animate on Scroll)
    function initializeAOS() {
        // Check if AOS is available (if script was loaded)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project filtering functionality
    const setupProjectFilters = () => {
        const filterContainer = document.querySelector('.filter-container');
        if (!filterContainer) return;

        const projects = document.querySelectorAll('.project-card');
        const tags = new Set();

        // Collect all unique tags
        projects.forEach(project => {
            const projectTags = project.querySelectorAll('.tag');
            projectTags.forEach(tag => {
                tags.add(tag.textContent.trim());
            });
        });

        // Create filter buttons
        const allButton = document.createElement('button');
        allButton.textContent = 'All';
        allButton.classList.add('filter-btn', 'active');
        filterContainer.appendChild(allButton);

        tags.forEach(tag => {
            const button = document.createElement('button');
            button.textContent = tag;
            button.classList.add('filter-btn');
            filterContainer.appendChild(button);
        });

        // Add filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to current button
                button.classList.add('active');

                const filter = button.textContent;

                projects.forEach(project => {
                    if (filter === 'All') {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                        return;
                    }

                    const projectTags = Array.from(project.querySelectorAll('.tag'))
                        .map(tag => tag.textContent.trim());

                    if (projectTags.includes(filter)) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    };

    // Check for optional project filtering container
    if (document.querySelector('.filter-container')) {
        setupProjectFilters();
    }

    // Scroll to top button
    const createScrollTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.classList.add('scroll-top-btn');
        button.style.display = 'none';
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    createScrollTopButton();

    // Image modal functionality
    const setupImageModal = () => {
        const images = document.querySelectorAll('.profile-image img, .project-img');
        
        // Create modal elements
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        
        const modalContent = document.createElement('img');
        modalContent.classList.add('modal-content');
        
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close-modal');
        closeBtn.innerHTML = '&times;';
        
        modal.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add click event to images
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalContent.src = img.src;
            });
        });
        
        // Close modal when clicking on the close button or outside the modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    // Check if there are images to be clickable
    if (document.querySelector('.profile-image img, .project-img')) {
        setupImageModal();
    }

    // Add dark mode toggle if needed
    const setupDarkModeToggle = () => {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '🌙';
        themeToggle.classList.add('theme-toggle');
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            
            // Save preference
            localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
        });

        // Check for saved preference
        if (localStorage.getItem('dark-mode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        }
    };

    // Setup dark mode toggle (optional)
    // setupDarkModeToggle();

    // Dynamic year for copyright
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Lazy load images
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };

    // Run lazy loading if there are any lazy images
    if (document.querySelector('img[data-src]')) {
        lazyLoadImages();
    }

    // Load AOS library dynamically (optional)
    const loadAOSLibrary = () => {
        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet';
        aosCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css';
        document.head.appendChild(aosCSS);

        const aosScript = document.createElement('script');
        aosScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js';
        aosScript.onload = initializeAOS;
        document.body.appendChild(aosScript);
    };

    // Uncomment to enable AOS animations
    // loadAOSLibrary();
});
