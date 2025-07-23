document.addEventListener('DOMContentLoaded', () => {
    // TOC Navigation
    const tocLinks = document.querySelectorAll('.toc-nav a');
    const sections = document.querySelectorAll('.about-main > div[id]');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = document.querySelector(`.toc-nav a[href="#${id}"]`);

            if (entry.isIntersecting) {
                tocLinks.forEach(link => link.classList.remove('active'));
                if (tocLink) {
                    tocLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    tocLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.dataset.filter; // 'all', 'data-viz', 'ml', etc.

            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' '); // Get all categories for the card

                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.position = 'static'; // Make it visible again
                    card.style.pointerEvents = 'auto'; // Make it interactive again
                } else {
                    card.classList.add('hidden');
                    card.style.position = 'absolute'; // Hide without collapsing layout
                    card.style.pointerEvents = 'none'; // Make it non-interactive
                }
            });
        });
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Cursor Glow Effect
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // Visitor Counter
    const visitorCountSpan = document.getElementById('visitor-count');
    let count = localStorage.getItem('visitorCount');

    if (count === null) {
        count = 1;
    } else {
        count = parseInt(count, 10) + 1;
    }

    localStorage.setItem('visitorCount', count);
    if (visitorCountSpan) {
        visitorCountSpan.textContent = count;
    }

    // Form submission handling
    const form = document.querySelector('.contact-form');
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.createElement('p');
        try {
            const data = new FormData(event.target);
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Thanks for your submission!";
                form.parentNode.insertBefore(status, form.nextSibling);
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form";
                    }
                    form.parentNode.insertBefore(status, form.nextSibling);
                });
            }
        } catch (error) {
            status.innerHTML = "Oops! There was a problem submitting your form";
            form.parentNode.insertBefore(status, form.nextSibling);
        }
    }
    form.addEventListener("submit", handleSubmit);
});
