document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 2. Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = localStorage.getItem('portfolioLang') || 'es';

    const translatableElements = document.querySelectorAll('[data-es][data-en]');

    const updateLanguage = (lang) => {
        translatableElements.forEach(el => {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                if (el.placeholder) {
                    el.placeholder = el.getAttribute(`data-${lang}`);
                }
            } else {
                // If element has icon inside, preserve it by changing only text nodes, or we just do simple replacement.
                // For this structure, text is mostly direct content.
                if (el.querySelector('i')) {
                    // It has an icon, preserve inner HTML logic if needed, but our HTML setup isolates text in spans usually.
                    // Let's just update textContent if no icon, or specific span if provided.
                    el.innerHTML = el.innerHTML.replace(el.textContent.trim(), el.getAttribute(`data-${lang}`));
                } else {
                    el.textContent = el.getAttribute(`data-${lang}`);
                }
            }
        });
        
        langText.textContent = lang === 'es' ? 'EN' : 'ES'; // Show the option to switch to
        document.documentElement.lang = lang;
        localStorage.setItem('portfolioLang', lang);
    };

    // Fix for icons: Since our HTML has spans with data-es for elements with icons (like buttons), textContent is safe for those spans.
    const safeUpdateLanguage = (lang) => {
        translatableElements.forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });
        langText.textContent = lang === 'es' ? 'EN' : 'ES';
        document.documentElement.lang = lang;
        localStorage.setItem('portfolioLang', lang);
    };

    safeUpdateLanguage(currentLang);

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        safeUpdateLanguage(currentLang);
    });

    // 3. Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start effect after a small delay
        setTimeout(typeWriter, 500);
    }

    // 4. Intersection Observer for Fade-in Animations
    const fadeElements = document.querySelectorAll('.fade-in-section');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // 5. Contact Form Handler (FormSubmit AJAX)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = currentLang === 'es'
                    ? '<span>Enviando mensaje...</span> <i class="bi bi-hourglass-split"></i>'
                    : '<span>Sending message...</span> <i class="bi bi-hourglass-split"></i>';
            }
            
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            try {
                const response = await fetch('https://formsubmit.co/ajax/pvfduni@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: `[Contacto Portafolio] ${subject}`,
                        message: message,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    formStatus.textContent = currentLang === 'es'
                        ? '¡Mensaje enviado con éxito! Te responderé pronto.'
                        : 'Message sent successfully! I will reply soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Error al enviar');
                }
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                formStatus.textContent = currentLang === 'es'
                    ? 'Hubo un error al enviar el mensaje. Puedes escribir directamente a pvfduni@gmail.com.'
                    : 'Error sending message. You can write directly to pvfduni@gmail.com.';
                formStatus.className = 'form-status error';
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = currentLang === 'es'
                        ? '<span data-es="Enviar Mensaje" data-en="Send Message">Enviar Mensaje</span> <i class="bi bi-send"></i>'
                        : '<span data-es="Enviar Mensaje" data-en="Send Message">Send Message</span> <i class="bi bi-send"></i>';
                }

                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 6000);
            }
        });
    }

    // 6. CV Modal Logic
    const cvModal = document.getElementById('cv-modal');
    const openCvBtn = document.getElementById('open-cv-modal');
    const closeCvBtn = document.getElementById('close-cv-modal');

    if (cvModal && openCvBtn && closeCvBtn) {
        // Open modal
        openCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cvModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close modal (x button)
        closeCvBtn.addEventListener('click', () => {
            cvModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close modal clicking outside
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

});
