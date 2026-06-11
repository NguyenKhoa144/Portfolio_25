// Smooth scroll cho tất cả các anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  });
});

// Hamburger menu toggle với hiệu ứng
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  
  // Thêm hiệu ứng ripple khi click
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.width = '5px';
  ripple.style.height = '5px';
  ripple.style.background = 'rgba(59, 130, 246, 0.5)';
  ripple.style.borderRadius = '50%';
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.animation = 'ripple 0.6s ease-out';
  ripple.style.pointerEvents = 'none';
  
  hamburger.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
});

// Đóng menu khi click vào link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Scroll progress indicator
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('scrollProgress').style.width = progress + '%';
  
  // Header shadow và style khi scroll
  const header = document.getElementById('header');
  if (scrollTop > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Intersection Observer cho fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe tất cả các elements cần animation
document.querySelectorAll('.project-card, .about-content, .contact-content').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Thêm parallax effect cho hero image
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image img');
  if (heroImage && scrolled < window.innerHeight) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hiệu ứng khi submit
    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Đang gửi...';
    button.style.transform = 'scale(0.95)';
    
    // Giả lập gửi form (thay bằng API call thật)
    setTimeout(() => {
      button.textContent = '✓ Đã gửi!';
      button.style.background = 'linear-gradient(45deg, #10b981, #059669)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.transform = 'scale(1)';
        button.style.background = 'linear-gradient(45deg, #3b82f6, #8b5cf6)';
        contactForm.reset();
      }, 2000);
    }, 1500);
  });
}

// Keyboard navigation cho accessibility
document.addEventListener('keydown', (e) => {
  // ESC để đóng mobile menu
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
});

// Thêm loading animation khi trang load xong
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

console.log('🚀 Portfolio loaded successfully! Tech Glassmorphism Theme 💎');

