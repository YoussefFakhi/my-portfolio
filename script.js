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
});

// ===========================
// TRANSLATIONS
// ===========================
const translations = {
  en: {
    intro_p1: "Hello, I'm",
    intro_title: "Abolfazl Shadrouh",
    intro_p2: "Full Stack Developer",
    about_title: "About Me",
    about_p1: "Get To Know More",
    exp_title: "Experience",
    exp_p1: "Explore My",
    projects_title: "Projects",
    projects_p1: "Browse My Recent",
    contact_title: "Contact Me",
    contact_p1: "Get in Touch",
    footer_en: "Copyright © 2025 Abolfazl Shadrouh. All Rights Reserved.",
    about_en: "About",
    about_fa: "About",
    about_fa_m: "About",
    experience_fa: "Experience",
    projects_fa: "Projects",
    contact_fa: "Contact",
    button1_fa: "Resume",
    button2_fa: "Contact Info",
    experience_fa_m: "Experience",
    projects_fa_m: "Projects",
    contact_fa_m: "Contact",
    experience_fa1: "Experience",
    experience_fa2: "4+ years Full Stack Developer",
    education: "Education",
    education2: "Programming degree from Harvard University",
    about_title1: "a web developer and programmer specializing in modern, optimized website design and development. I started my journey in programming in 2022, driven by a strong passion for learning and creating engaging user experiences. My main expertise lies in front-end development using technologies such as HTML, CSS, JavaScript, and frameworks like React.js. I also have experience with back-end development, particularly with languages like PHP or Node.js and databases such as MySQL and MongoDB. In every project, I strive to prioritize user needs and deliver solutions that are not only visually appealing but also technically solid, fast, and scalable. My goal is to build websites that not only work flawlessly but also feel great to use.If you're interested in collaboration, consulting, or project inquiries, feel free to reach out.",
    experience_fa_sub: "Frontend skills",
    experience_fa_sub1: "Backend skills",
    view_fa: "View",
    about_fa_a: "About",
    project_1: "Project One",
    project_2: "Project Two",
    project_3: "Project Three",
    // Testimonials Translations
    testimonials_fa: "Testimonials",
    testimonials_fa_m: "Testimonials",
    testimonials_en: "Testimonials",
    testimonials_p1: "What People Say",
    testimonials_title: "Testimonials",
    testimonial_text_1: "Abolfazl is an exceptional developer. His attention to detail and problem-solving skills were crucial to the success of our project. Highly recommended!",
    testimonial_author_1: "- John Doe, Client",
    testimonial_text_2: "Working with Abolfazl was a pleasure. He delivered high-quality code on time and was a great team player.",
    testimonial_author_2: "- Jane Smith, Colleague",
    testimonial_text_3: "His technical expertise and dedication are impressive. Abolfazl consistently produces excellent results.",
    testimonial_author_3: "- Bob Johnson, Manager",
  },
  fa: {
    intro_p1: "سلام، اسم من",
    intro_title: "ابوالفضل شادروح",
    intro_p2: "برنامه‌نویس وبسایت",
    about_title: "درباره من",
    about_p1: "بیشتر آشنا شوید",
    exp_title: "تجربه‌ها",
    exp_p1: "تجربه‌های من",
    projects_title: "پروژه‌ها",
    projects_p1: "پروژه‌های اخیر من",
    contact_title: "ارتباط با من",
    contact_p1: "در تماس باشید",
    footer_en: "کپی رایت © 2025 تمام حقوق مادی و معنوی این وب سایت نیز متعلق به ابوالفضل شادروح می باشد",
    about_en: "درباره",
    about_fa: "درباره",
    about_fa_m: "درباره",
    experience_fa: "تجربه‌ها",
    projects_fa: "پروژه‌ها",
    contact_fa: "تماس",
    button1_fa: "رزومه",
    button2_fa: "اطلاعات تماس",
    experience_fa_m: "تجربه‌ها",
    projects_fa_m: "پروژه‌ها",
    contact_fa_m: "تماس",
    experience_fa1: "تجربه",
    experience_fa2: "بیش از 4 سال طراحی و توسعه وب",
    education: "مدارک",
    education2: "مدرک برنامه نویسی از دانشگاه هاروارد",
    about_title1: "من یک توسعه دهنده وب و برنامه نویس متخصص در طراحی و توسعه وب سایت مدرن و بهینه هستم. من کار خود را در برنامه نویسی از سال 2022 آغاز کردم و سعی کردم با اشتیاق شدید به یادگیری انواع زبان های دنیای برنامه نویسی بپردازم  و یک تجربه بسیار جذاب برای کابران ایجاد کنم. در هر پروژه، من تلاش می‌کنم نیازهای کاربر را اولویت‌بندی کنم و راه‌حل‌هایی ارائه کنم که نه تنها از نظر بصری جذاب باشند، بلکه از نظر فنی قوی، سریع و مقیاس‌پذیر باشند. هدف من ساختن وب سایت هایی است که نه تنها بی عیب و نقص کار می کنند، بلکه استفاده از آنها بسیار آسان و جذاب است. اگر به مشاوره یا درخواست پروژه علاقه مند هستید، تماس بگیرید",
    experience_fa_sub: "Frontend مهURT",
    experience_fa_sub1: "Backend مهURT",
    view_fa: "مشاهده",
    about_fa_a: "درباره",
    project_1: "پروژه اول",
    project_2: "پروژه دوم",
    project_3: "پروژه سوم",
    // Testimonials Translations (Placeholder for Persian)
    testimonials_fa: "توصیفات",
    testimonials_fa_m: "توصیفات",
    testimonials_en: "توصیفات",
    testimonials_p1: "چه می‌گویند",
    testimonials_title: "توصیفات",
    testimonial_text_1: "ابوالفضل یک توسعه‌دهنده بسیار عالی است. توجه به جزئیات و مهارت‌های حل مسئله او برای موفقیت پروژه ما بسیار حیاتی بود. بسیار توصیه می‌شود!",
    testimonial_author_1: "- جان دو، مشتری",
    testimonial_text_2: "کار کردن با ابوالفضل خیلی لذت بخش بود. او کد با کیفیت بالا را به موقع تحویل داد و یک همکار عالی بود.",
    testimonial_author_2: "- جین اسمیت، همکار",
    testimonial_text_3: "تخصص فنی و تعهد او چشمگیر است. ابوالفضل مداوم نتایج عالی تولید می‌کند.",
    testimonial_author_3: "- باب جانسون، مدیر",
  }
};

function setLanguage(lang) {
  localStorage.setItem('language', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
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
    "experience-fa2": t.experience_fa2,
    "education": t.education,
    "education2": t.education2,
    "about-title1": t.about_title1,
    "experience-fa-sub": t.experience_fa_sub,
    "experience-fa-sub1": t.experience_fa_sub1,
    "experience-en": t.experience_fa,
    "project-en": t.projects_fa,
    "contact-en": t.contact_fa,
    "project-1": t.project_1,
    "project-2": t.project_2,
    "project-3": t.project_3,
    "view-fa": t.view_fa,
    "view-fa1": t.view_fa,
    "view-fa2": t.view_fa,
    "about-fa-a": t.about_fa_a,
    "about-fa-a1": t.about_fa_a,
    "about-fa-a2": t.about_fa_a,
    // Add Testimonials mappings
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
  for (let id in map) {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  }
  document.body.classList.toggle("rtl", lang === "fa");
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

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Update button to show loading
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://formspree.io/f/mldveqrd', {
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
    demo: "https://abolfazl-shadrouh.github.io/cafe-menu", // add if you have one
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