        document.addEventListener('DOMContentLoaded', function() {
            // Navbar scroll effect
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Theme Toggle
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('i');
            
            // Check for saved theme preference or use system preference
            const savedTheme = localStorage.getItem('theme') || 
                (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
            updateThemeIcon(savedTheme);
            
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-bs-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-bs-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                
                // Add animation effect
                themeToggle.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    themeToggle.style.transform = 'rotate(0deg)';
                }, 500);
            });
            
            function updateThemeIcon(theme) {
                if (theme === 'dark') {
                    themeIcon.classList.remove('bi-moon-stars');
                    themeIcon.classList.add('bi-sun');
                } else {
                    themeIcon.classList.remove('bi-sun');
                    themeIcon.classList.add('bi-moon-stars');
                }
            }
            
            // Service Status
            function updateServiceStatus() {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                
                // Service hours: 7:00 PM (19:00) to 5:30 AM (5:30)
                const isServiceAvailable = (currentHour >= 19 || currentHour < 5) || (currentHour === 5 && currentMinute < 30);
                
                const statusElement = document.getElementById('serviceStatus');
                const statusMobile = document.getElementById('service-status-mobile');
                const statusFooter = document.getElementById('service-status-footer');
                
                if (isServiceAvailable) {
                    statusElement.className = 'status-indicator available';
                    statusElement.innerHTML = '<i class="bi bi-check-circle-fill me-3"></i>¡SERVICIO DISPONIBLE AHORA! - Nuestros conductores están listos para llevarte a casa seguro (7:00 PM - 5:30 AM)';
                    
                    if (statusMobile) {
                        statusMobile.className = 'text-success bg-success bg-opacity-10 px-3 py-2 rounded fw-bold';
                        statusMobile.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Disponible';
                    }
                    
                    if (statusFooter) {
                        statusFooter.innerHTML = '<div class="text-success fw-bold"><i class="bi bi-check-circle-fill me-2"></i>SERVICIO DISPONIBLE EN ESTOS MOMENTOS!</div><div class="mt-2">¡Llama o envía WhatsApp para solicitar tu viaje!</div>';
                    }
                    
                    // Calculate next closing time
                    let nextClose = new Date();
                    if (currentHour < 5 || (currentHour === 5 && currentMinute < 30)) {
                        // If before 5:30 AM, closing is today at 5:30 AM
                        nextClose.setHours(5, 30, 0, 0);
                    } else {
                        // Otherwise, closing is tomorrow at 5:30 AM
                        nextClose.setDate(nextClose.getDate() + 1);
                        nextClose.setHours(5, 30, 0, 0);
                    }
                    
                    document.getElementById('nextClose').textContent = formatTime(nextClose);
                    document.getElementById('nextService').textContent = "Servicio disponible ahora";
                } else {
                    statusElement.className = 'status-indicator unavailable';
                    statusElement.innerHTML = '<i class="bi bi-x-circle-fill me-3"></i>SERVICIO NO DISPONIBLE - Nuestro horario es de 7:00 PM a 5:30 AM. ¡Vuelve pronto!';
                    
                    if (statusMobile) {
                        statusMobile.className = 'text-danger bg-danger bg-opacity-10 px-3 py-2 rounded fw-bold';
                        statusMobile.innerHTML = '<i class="bi bi-x-circle-fill me-1"></i> No disponible';
                    }
                    
                    if (statusFooter) {
                        statusFooter.innerHTML = '<div class="text-danger fw-bold"><i class="bi bi-x-circle-fill me-2"></i>Servicio no disponible</div><div class="mt-2">Horario: 7:00 PM - 5:30 AM</div>';
                    }
                    
                    // Calculate next opening time (today at 7:00 PM if before 7 PM, otherwise tomorrow at 7:00 PM)
                    let nextOpen = new Date();
                    if (currentHour < 19) {
                        nextOpen.setHours(19, 0, 0, 0);
                    } else {
                        nextOpen.setDate(nextOpen.getDate() + 1);
                        nextOpen.setHours(19, 0, 0, 0);
                    }
                    
                    document.getElementById('nextService').textContent = formatTime(nextOpen);
                    
                    // Next closing will be after next opening
                    let nextClose = new Date(nextOpen);
                    nextClose.setDate(nextClose.getDate() + 1);
                    nextClose.setHours(5, 30, 0, 0);
                    document.getElementById('nextClose').textContent = formatTime(nextClose);
                }
            }
            
            function formatTime(date) {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;
                const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                return `${formattedHours}:${formattedMinutes} ${ampm}`;
            }
            
            // Update service status immediately and every minute
            updateServiceStatus();
            setInterval(updateServiceStatus, 60000);
            
            // Form validation
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Simple validation
                    const name = document.getElementById('name').value.trim();
                    const phone = document.getElementById('phone').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const subject = document.getElementById('subject').value;
                    const message = document.getElementById('message').value.trim();
                    const terms = document.getElementById('terms').checked;
                    
                    if (!name || !phone || !email || !subject || !message || !terms) {
                        showAlert('Por favor, completa todos los campos del formulario y acepta los términos.', 'danger');
                        return;
                    }
                    
                    if (!validateEmail(email)) {
                        showAlert('Por favor, ingresa un email válido.', 'danger');
                        return;
                    }
                    
                    // Show success message
                    showAlert('¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos lo antes posible.', 'success');
                    contactForm.reset();
                });
            }
            
            function showAlert(message, type) {
                // Create alert element
                const alertDiv = document.createElement('div');
                alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
                alertDiv.role = 'alert';
                alertDiv.innerHTML = `
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                // Insert after form
                const form = document.getElementById('contactForm');
                form.parentNode.insertBefore(alertDiv, form.nextSibling);
                
                // Auto-dismiss after 5 seconds
                setTimeout(() => {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }, 5000);
            }
            
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href !== '#' && href !== '#inicio') {
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            const navbarHeight = document.querySelector('.navbar').offsetHeight;
                            window.scrollTo({
                                top: targetElement.offsetTop - navbarHeight - 20,
                                behavior: 'smooth'
                            });
                            
                            // Close mobile menu if open
                            const navbarCollapse = document.querySelector('.navbar-collapse');
                            if (navbarCollapse.classList.contains('show')) {
                                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                                bsCollapse.hide();
                            }
                        }
                    }
                });
            });
        });