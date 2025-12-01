// ===========================
// TOGGLE LANGUAGE MENU
// ===========================
function toggleLangMenu() {
  document.getElementById('lang-menu')?.classList.toggle('show');
}
window.addEventListener('click', function(e) {
  if (!e.target.closest('.language-dropdown')) {
    document.getElementById('lang-menu')?.classList.remove('show');
  }
});

// ===========================
// TOGGLE HAMBURGER MENU
// ===========================
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// ===========================
// THEME SWITCHER & LOGO HANDLER
// ===========================
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const body = document.body;
// Get references to the logo images
const desktopLogo = document.getElementById('desktop-logo');
const hamburgerLogo = document.getElementById('hamburger-logo'); // Reference the new mobile logo ID

function toggleTheme() {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  updateThemeIcon(isDarkMode);
  updateLogo(isDarkMode); // Update logo when theme changes
}

function updateThemeIcon(isDarkMode) {
  const newIcon = isDarkMode ? 'assets/sun.png' : 'assets/moon.png';
  if (themeToggle) themeToggle.src = newIcon;
  if (themeToggleMobile) themeToggleMobile.src = newIcon;
  const globeIcon = document.getElementById('globe-icon');
  if (globeIcon) {
    globeIcon.src = isDarkMode ? 'assets/globe_white.png' : 'assets/globe_black.png';
  }
  // Update the indicator color immediately after theme change
  updateIndicatorColor();
}

// Function to update the logo based on the theme
function updateLogo(isDarkMode) {
  const logoSrc = isDarkMode ? 'assets/logo_white.png' : 'assets/logo_black.png';
  // Update desktop logo
  if (desktopLogo) {
    desktopLogo.src = logoSrc;
  }
  // Update hamburger logo
  if (hamburgerLogo) {
    hamburgerLogo.src = logoSrc;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);

  if (isDarkMode) {
    body.classList.add('dark-mode');
    updateThemeIcon(true);
    updateLogo(true); // Set initial logo for dark mode
  } else {
    body.classList.remove('dark-mode');
    updateThemeIcon(false);
    updateLogo(false); // Set initial logo for light mode
  }

  // Apply language translations after DOM content is loaded
  const savedLang = localStorage.getItem("language") || "en";
  applyLanguage(savedLang);

  // Reveal elements initially (in case the page loads scrolled)
  revealElements();

  // Initial check for navbar scroll effect
  handleNavbarScroll();

  // Initialize Lenis smooth scrolling if the library is loaded
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      lerp: 0.070,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } else {
    console.warn("Lenis library not found. Smooth scrolling will not be active.");
  }

  // Handle the loading spinner fade-out
  handleLoadingSpinner();

  // Handle contact form submission
  handleContactForm();

  // Handle project modal and slideshow
  handleProjectModal();

  // Initialize active section indicator
  initActiveSectionIndicator();
});

// ===========================
// ACTIVE SECTION INDICATOR
// ===========================
let activeSectionIndicator = null;

function initActiveSectionIndicator() {
  const navLinks = document.querySelectorAll('#desktop-nav .nav-links a');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length === 0 || sections.length === 0) {
    console.warn("No navigation links or sections found for active indicator.");
    return;
  }

  // Create the indicator element
  activeSectionIndicator = document.createElement('div');
  activeSectionIndicator.id = 'nav-indicator';
  activeSectionIndicator.style.position = 'absolute';
  activeSectionIndicator.style.bottom = '0'; // Position at the bottom of the link
  activeSectionIndicator.style.height = '2px'; // Thickness of the line
  activeSectionIndicator.style.width = '0'; // Initial width is 0
  // Set initial color based on current theme
  updateIndicatorColor(); // Call the new function to set the color
  activeSectionIndicator.style.transition = 'all 0.3s ease'; // Smooth transition
  activeSectionIndicator.style.zIndex = '1'; // Ensure it's above other elements if needed
  activeSectionIndicator.style.pointerEvents = 'none'; // Ignore mouse events

  // Append it to the first link's container (or a parent container)
  // A more robust way is to wrap the links in a container if possible, but for now:
  // We'll add it to the first link's parent (nav-links container) and position it absolutely
  const navContainer = document.querySelector('#desktop-nav .nav-links');
  if (navContainer) {
    navContainer.style.position = 'relative'; // Ensure parent has relative positioning
    navContainer.appendChild(activeSectionIndicator);
  } else {
    console.error("Navigation container for indicator not found.");
    return;
  }

  // Function to update indicator position
  function updateIndicator(targetLink) {
    if (!targetLink || !activeSectionIndicator) return;

    const linkRect = targetLink.getBoundingClientRect();
    const containerRect = navContainer.getBoundingClientRect();

    // Calculate position relative to the container
    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    activeSectionIndicator.style.left = `${left}px`;
    activeSectionIndicator.style.width = `${width}px`;
  }

  // Initial update based on scroll position
  updateIndicatorForScroll();

  // Listen for scroll events to update the indicator
  window.addEventListener('scroll', updateIndicatorForScroll);

  // Listen for hash changes (e.g., clicking nav links)
  window.addEventListener('hashchange', updateIndicatorForScroll);

  // Function called on scroll and hashchange
  function updateIndicatorForScroll() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // Offset to account for fixed navbar height
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    // Find the corresponding link and update indicator
    navLinks.forEach(link => {
      link.classList.remove('active-section-link'); // Remove active class from all
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-section-link');
        updateIndicator(link);
      }
    });

    // If no section matches (e.g., at very top), hide the indicator or reset
    if (!current) {
        activeSectionIndicator.style.width = '0';
        navLinks.forEach(link => link.classList.remove('active-section-link'));
    }
  }

  // Also update indicator when clicking a nav link (before smooth scroll)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1); // Remove '#'
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        updateIndicator(link);
        // The scroll listener will handle updates during/after the smooth scroll
      }
    });
  });
}

// New helper function to update the indicator's color based on theme
function updateIndicatorColor() {
  if (!activeSectionIndicator) return;

  // Determine color based on current theme state
  const isDarkMode = body.classList.contains('dark-mode');
  // Use a theme-appropriate color. You can use CSS variables if defined.
  // For example, using --btn-hover-bg-color or a specific indicator color variable.
  // Here, we'll derive it from the link color or use a consistent theme color.
  // This logic should match how you determine the link color in your CSS for active states.
  // For now, let's use a common approach: use the default link color or a theme accent.
  // You might want to define specific colors in your CSS variables and read them here.
  // Example using a potential CSS variable (ensure it's defined in :root and .dark-mode):
  // activeSectionIndicator.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--active-indicator-color');
  // Or, derive from the link color directly:
  const linkElements = document.querySelectorAll('#desktop-nav .nav-links a');
  if (linkElements.length > 0) {
    // Get the color of the first link as a base, this will reflect the current theme
    const currentLinkColor = getComputedStyle(linkElements[0]).color;
    // You could also define specific colors for light/dark modes here if needed,
    // but deriving from the link color is often sufficient and consistent.
    // For example, you might want the indicator to match the hover color or active link color.
    // For simplicity and consistency, using the current link color or a theme variable is good.
    // Let's use a consistent color derived from the theme, for example, the button hover color:
    // Check your CSS variables for the appropriate color to use.
    // If your CSS variables for text/link color are --nav-link-color, you can use that.
    // In your CSS, --nav-link-color changes with the theme.
    // Read the current value of --nav-link-color:
    const currentThemeLinkColor = getComputedStyle(body).getPropertyValue('--nav-link-color').trim();
    // Use the theme's link color for the indicator
    activeSectionIndicator.style.backgroundColor = currentThemeLinkColor;
  } else {
    // Fallback color if links are not found
    activeSectionIndicator.style.backgroundColor = isDarkMode ? '#fff' : '#000';
  }
}


// ===========================
// TRANSLATIONS
// ===========================
const translations = {
  en: {
    intro_p1: "Hello, I'm",
    intro_title: "Youssef Fakhi",
    intro_p2: "Full Stack Developer",
    about_title: "About Me",
    about_p1: "Get To Know More",
    exp_title: "Skills",
    exp_p1: "Explore My",
    projects_title: "Projects",
    projects_p1: "Browse My Recent",
    contact_title: "Contact Me",
    contact_p1: "Get in Touch",
    footer_en: "Copyright © 2025 Youssef Fakhi. All Rights Reserved.",
    about_en: "About",
    about_fa: "About",
    about_fa_m: "About",
    experience_fa: "Skills",
    projects_fa: "Projects",
    contact_fa: "Contact",
    button1_fa: "Resume",
    button2_fa: "Contact Me",
    experience_fa_m: "Skills",
    projects_fa_m: "Projects",
    contact_fa_m: "Contact",
    experience_fa1: "Experience",
    experience_fa2: "5+ months<br>Full Stack Development",
    education: "Education",
    education2: "Bac+2 in IT<br>Digital development – Full-stack web option",
    about_title1: "My expertise spans both front-end and back-end development. On the front end, I work with HTML, CSS, JavaScript, and React.js to create fast, responsive, and intuitive user interfaces. On the back end, I build solid server-side functionality using Node.js, Express, and databases like MongoDB. I enjoy designing complete solutions from UI/UX flow to API structure with a strong focus on performance and reliability.\n\nI approach each project with a practical and user-centered mindset: understanding needs, improving experience, and delivering results that are visually appealing, technically strong, and scalable.\n\nMy goal is to grow as a specialized full-stack developer and contribute to impactful projects, whether in professional companies or collaborative environments. If you’re interested in working together or discussing a project, feel free to reach out.",
    experience_fa_sub: "Frontend",
    experience_fa_sub1: "Backend",
    view_fa: "View",
    about_fa_a: "About",
    project_1: "Modern E-commerce Template",
    project_2: "Cafe Menu App",
    project_3: "JavaScript Calculator",
    // Testimonials Translations
    testimonials_fa: "Testimonials",
    testimonials_fa_m: "Testimonials",
    testimonials_en: "Testimonials",
    testimonials_p1: "What People Say",
    testimonials_title: "Testimonials",
    testimonial_text_1: "Youssef is an exceptional developer. His attention to detail and problem-solving skills were crucial to the success of our project. Highly recommended!",
    testimonial_author_1: "- Client",
    testimonial_text_2: "Working with Youssef was a pleasure. He delivered high-quality code on time and was a great team player.",
    testimonial_author_2: "- Colleague",
    testimonial_text_3: "His technical expertise and dedication are impressive. Youssef consistently produces excellent results.",
    testimonial_author_3: "- Manager",
  },
  fr: { // French Translations
    intro_p1: "Bonjour, je suis",
    intro_title: "Youssef Fakhi",
    intro_p2: "Développeur Full Stack",
    about_title: "À propos de moi",
    about_p1: "En savoir plus",
    exp_title: "Compétences",
    exp_p1: "Découvrez mes",
    projects_title: "Projets",
    projects_p1: "Parcourir mes récents",
    contact_title: "Contactez-moi",
    contact_p1: "Entrer en contact",
    footer_en: "Copyright © 2025 Youssef Fakhi. Tous droits réservés.",
    about_en: "À propos",
    about_fa: "À propos",
    about_fa_m: "À propos",
    experience_fa: "Compétences",
    projects_fa: "Projets",
    contact_fa: "Contact",
    button1_fa: "CV",
    button2_fa: "Contactez-moi",
    experience_fa_m: "Compétences",
    projects_fa_m: "Projets",
    contact_fa_m: "Contact",
    experience_fa1: "Expérience",
    experience_fa2: "5+ mois<br>Développement Full Stack",
    education: "Éducation",
    education2: `Bac+2 en Informatique<br>Développement numérique – Option web full-stack`,
    about_title1: "Mon expertise s'étend au développement front-end et back-end. Côté front-end, je travaille avec HTML, CSS, JavaScript et React.js pour créer des interfaces utilisateur rapides, réactives et intuitives. Côté back-end, je construis des fonctionnalités serveur solides en utilisant Node.js, Express et des bases de données comme MongoDB. J'aime concevoir des solutions complètes, de l'UX/UI au schéma de l'API, avec un fort accent sur les performances et la fiabilité.\n\nJ'aborde chaque projet avec un esprit pratique et centré sur l'utilisateur : comprendre les besoins, améliorer l'expérience et livrer des résultats visuellement attrayants, techniquement solides et évolutifs.\n\nMon objectif est de me perfectionner en tant que développeur full-stack spécialisé et de contribuer à des projets impactants, que ce soit dans des entreprises professionnelles ou des environnements collaboratifs. Si vous souhaitez travailler ensemble ou discuter d'un projet, n'hésitez pas à me contacter.",
    experience_fa_sub: "Frontend",
    experience_fa_sub1: "Backend",
    view_fa: "Voir",
    about_fa_a: "À propos",
    project_1: "Modèle E-commerce Moderne",
    project_2: "Application Menu de Café",
    project_3: "Calculatrice JavaScript",
    // Testimonials Translations
    testimonials_fa: "Témoignages",
    testimonials_fa_m: "Témoignages",
    testimonials_en: "Témoignages",
    testimonials_p1: "Ce que disent les gens",
    testimonials_title: "Témoignages",
    testimonial_text_1: "Youssef est un développeur exceptionnel. Son attention aux détails et ses compétences en résolution de problèmes ont été cruciales pour le succès de notre projet. Fortement recommandé !",
    testimonial_author_1: "- Client",
    testimonial_text_2: "Travailler avec Youssef a été un plaisir. Il a livré un code de haute qualité à temps et a été un excellent membre d'équipe.",
    testimonial_author_2: "- Colleague",
    testimonial_text_3: "Son expertise technique et son dévouement sont impressionnants. Youssef produit constamment des résultats excellents.",
    testimonial_author_3: "- Manager",
  }
};

function setLanguage(lang) {
  localStorage.setItem('language', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  // Define the mapping for all elements
  const map = {
    "intro-p1": t.intro_p1,
    "intro-title": t.intro_title,
    "intro-p2": t.intro_p2,
    "about-title": t.about_title,
    "about-p1": t.about_p1,
    "exp-title": t.exp_title,
    "exp-p1": t.exp_p1,
    "projects-title": t.projects_title,
    "projects-p1": t.projects_p1,
    "contact-title": t.contact_title,
    "contact-p1": t.contact_p1,
    "footer-en": t.footer_en,
    "about-en": t.about_en,
    "about-fa": t.about_fa,
    "about-fa-m": t.about_fa_m,
    "experience-fa": t.experience_fa,
    "projects-fa": t.projects_fa,
    "contact-fa": t.contact_fa,
    "button1-fa": t.button1_fa,
    "button2-fa": t.button2_fa,
    "experience-fa-m": t.experience_fa_m,
    "projects-fa-m": t.projects_fa_m,
    "contact-fa-m": t.contact_fa_m,
    "experience-fa1": t.experience_fa1,
    "education": t.education,
    // Testimonials Translations
    "testimonials-fa": t.testimonials_fa,
    "testimonials-fa-m": t.testimonials_fa_m,
    "testimonials-en": t.testimonials_en,
    "testimonials-p1": t.testimonials_p1,
    "testimonials-title": t.testimonials_title,
    "testimonial-text-1": t.testimonial_text_1,
    "testimonial-author-1": t.testimonial_author_1,
    "testimonial-text-2": t.testimonial_text_2,
    "testimonial-author-2": t.testimonial_author_2,
    "testimonial-text-3": t.testimonial_text_3,
    "testimonial-author-3": t.testimonial_author_3,
  };

  // Define elements that need HTML interpretation (contain <br>)
  const htmlElements = new Set(["experience-fa2", "education2"]);

  for (let id in map) {
    const el = document.getElementById(id);
    if (el) {
      if (htmlElements.has(id)) {
        // Use innerHTML for elements containing <br>
        el.innerHTML = map[id];
      } else {
        // Use textContent for plain text elements
        el.textContent = map[id];
      }
    }
  }

  // Removed RTL class toggle as French is LTR
  document.documentElement.lang = lang;
}

// ===========================
// REVEAL ON SCROLL
// ===========================
function revealElements() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;
  const elementVisible = 100;
  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealElements);

// ===========================
// FOOTER ANIMATION
// ===========================
window.addEventListener("load", () => {
  const footerText = document.getElementById('footer-en');
  if (footerText) {
    footerText.style.opacity = '1';
    footerText.style.transform = 'translateY(0)';
  }
});

// ===========================
// LOADING SPINNER
// ===========================
function handleLoadingSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    // Add the fade-out class after a short delay to ensure content is ready
    // Using setTimeout to ensure it happens after DOM is fully loaded and scripts run
    setTimeout(() => {
      spinner.classList.add('fade-out');
      // Optional: Remove the spinner from the DOM after the fade-out animation completes
      spinner.addEventListener('transitionend', () => {
        spinner.remove();
      });
    }, 500); // Adjust the delay (in ms) if needed, 500ms is usually sufficient
  }
}

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
function handleNavbarScroll() {
  const desktopNav = document.getElementById('desktop-nav');
  const mobileNav = document.getElementById('hamburger-nav');

  if (window.scrollY > 50) { // Adjust the 50px threshold as needed
    desktopNav?.classList.add('scrolled');
    mobileNav?.classList.add('scrolled');
  } else {
    desktopNav?.classList.remove('scrolled');
    mobileNav?.classList.remove('scrolled');
  }
}

// Add the scroll event listener
window.addEventListener('scroll', handleNavbarScroll);

// ===========================
// CONTACT FORM SUBMISSION
// ===========================
function handleContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const inquiryTypeSelect = document.getElementById('inquiry-type'); // Get the new select element

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Update button to show loading
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Prepare form data object
    const formData = new FormData(form);
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });

    // Optional: Format the inquiry type for better readability in the email
    if (object.inquiry_type) {
      const typeMap = {
        'project': 'Project Inquiry',
        'job': 'Job Opportunity',
        'general': 'General Question'
      };
      object.inquiry_type = typeMap[object.inquiry_type] || object.inquiry_type; // Use mapping or fallback to original value
    }

    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://formspree.io/f/mldveqrd', { // Ensure this URL is correct
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: json
      });

      if (response.ok) {
        // Redirect to your custom success page
        window.location.href = 'success.html';
      } else {
        // Handle error
        const errorData = await response.json();
        alert('Oops! Something went wrong. Please try again.\n\nError: ' + (errorData.error || 'Unknown'));
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please check your connection and try again.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===========================
// PROJECT MODAL & SLIDESHOW
// ===========================
const projectData = {
  1: {
    title: "Modern E-commerce Template",
    description: "A responsive and modern e-commerce front-end built with HTML, CSS, and JavaScript. Features include product cards, cart UI, and mobile-first design.",
    tech: ["HTML5", "CSS3", "JavaScript", "SASS"],
    github: "https://github.com/abolfazl-shadrouh/modern-ecommerce-template",
    demo: null, // no live demo
    images: [ // Add paths to your project screenshot images here
      "assets/project-1.png", // Example: first image is the main project image
      // Add more image paths as needed, e.g.:
      // "assets/project-1-screenshot-2.png",
      // "assets/project-1-screenshot-3.png",
    ]
  },
  2: {
    title: "Cafe Menu App",
    description: "A digital menu for cafes with category filtering and responsive layout. Built using React and styled with Material UI.",
    tech: ["React", "Material UI", "JavaScript", "CSS"],
    github: "https://github.com/abolfazl-shadrouh/cafe-menu",
    demo: "https://abolfazl-shadrouh.github.io/cafe-menu",
    images: [
      "assets/project-2.png", // Example: first image
      // Add more image paths as needed
      // "assets/project-2-screenshot-2.png",
      // "assets/project-2-screenshot-3.png",
    ]
  },
  3: {
    title: "JavaScript Calculator",
    description: "A fully functional calculator with support for basic arithmetic operations, built from scratch using vanilla JavaScript.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/abolfazl-shadrouh/Calculator",
    demo: "https://abolfazl-shadrouh.github.io/Calculator",
    images: [
      "assets/project-3.png", // Example: first image
      // Add more image paths as needed
      // "assets/project-3-screenshot-2.png",
      // "assets/project-3-screenshot-3.png",
    ]
  }
};

// Global variable to hold current slideshow images
let currentSlideImages = [];
let currentSlideIndex = 0;

function handleProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalTech = document.getElementById('modal-tech');
  const modalDemoLink = document.getElementById('modal-demo-link');
  const modalGithubLink = document.getElementById('modal-github-link');
  const closeBtn = document.querySelector('.close-btn');
  const slideImg = document.getElementById('slide-img');
  const slideshowDotsContainer = document.getElementById('slideshow-dots');

  // Function to open modal and populate data
  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalTech.innerHTML = `<strong>Technologies:</strong> ${data.tech.join(', ')}`;

    modalGithubLink.href = data.github;
    modalGithubLink.style.display = 'inline-block';

    if (data.demo) {
      modalDemoLink.href = data.demo;
      modalDemoLink.style.display = 'inline-block';
    } else {
      modalDemoLink.style.display = 'none';
    }

    // Set up slideshow
    currentSlideImages = data.images || [data.images[0] || "assets/project-1.png"]; // Fallback to a default image if no array or empty
    currentSlideIndex = 0;
    updateSlide(); // Show the first slide

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  // Function to update the slideshow image and dots
  function updateSlide() {
    if (currentSlideImages.length === 0) return;

    slideImg.src = currentSlideImages[currentSlideIndex];
    slideImg.alt = `Screenshot of ${projectData[Object.keys(projectData).find(k => projectData[k].images.includes(currentSlideImages[currentSlideIndex]))]?.title || 'Project'}`;

    // Update dots
    slideshowDotsContainer.innerHTML = '';
    currentSlideImages.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('slideshow-dot');
      if (index === currentSlideIndex) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => goToSlide(index));
      slideshowDotsContainer.appendChild(dot);
    });
  }

  // Function to change slide
  window.changeSlide = function(n) {
    currentSlideIndex += n;
    if (currentSlideIndex >= currentSlideImages.length) {
      currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
      currentSlideIndex = currentSlideImages.length - 1;
    }
    updateSlide();
  };

  // Function to go to a specific slide
  function goToSlide(index) {
    currentSlideIndex = index;
    updateSlide();
  }

  // Event delegation for project buttons
  document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const action = btn.getAttribute('data-action');

      if (action === 'view') {
        // Redirect to GitHub for 'View' action
        const githubUrl = projectData[projectId]?.github;
        if (githubUrl) {
          window.open(githubUrl, '_blank');
        }
      } else if (action === 'about') {
        // Open modal for 'About' action
        openModal(projectId);
      }
    });
  });

  // Close modal
  closeBtn.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };
}