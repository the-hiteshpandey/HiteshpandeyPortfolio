
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const body = document.body;
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  body.classList.toggle('menu-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  body.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', toggleMenu);

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

function setActiveLink() {
  let current = 'home';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 160;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  [...navLinks, ...mobileLinks].forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  setActiveLink();
  backToTop.classList.toggle('show', window.scrollY > 500);
});

setActiveLink();

const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const chart = entry.target;
    if (chart.dataset.animated === 'true') return;
    chart.dataset.animated = 'true';

    const percentElement = chart.querySelector('.percent');
    const target = Number(chart.dataset.percent);
    let count = 0;

    const interval = setInterval(() => {
      count++;
      percentElement.innerText = `${count}%`;
      const deg = count * 3.6;
      chart.style.background = `conic-gradient(#00eaff ${deg}deg, #1c1c1c 0deg)`;

      if (count >= target) clearInterval(interval);
    }, 18);
  });
}, { threshold: 0.45 });

document.querySelectorAll('.chart').forEach((chart) => chartObserver.observe(chart));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const target = Number(el.dataset.count);
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 30));

    const timer = setInterval(() => {
      value += step;
      if (value >= target) {
        value = target;
        clearInterval(timer);
      }
      el.textContent = `${value}+`;
    }, 35);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((item) => statObserver.observe(item));

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  if (!input || !error) return;
  input.classList.add('invalid');
  error.textContent = message;
}

function clearError(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  if (!input || !error) return;
  input.classList.remove('invalid');
  error.textContent = '';
}

['name', 'email', 'subject', 'message'].forEach((id) => {
  const field = document.getElementById(id);
  field?.addEventListener('input', () => clearError(id));
});

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;
  formStatus.textContent = '';

  if (!name) {
    setError('name', 'Please enter your name.');
    isValid = false;
  }
  if (!email) {
    setError('email', 'Please enter your email.');
    isValid = false;
  } else if (!validateEmail(email)) {
    setError('email', 'Please enter a valid email address.');
    isValid = false;
  }
  if (!subject) {
    setError('subject', 'Please enter a subject.');
    isValid = false;
  }
  if (!message) {
    setError('message', 'Please enter your message.');
    isValid = false;
  } else if (message.length < 10) {
    setError('message', 'Message should be at least 10 characters.');
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = 'Please fix the highlighted fields.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.remove('success');
  submitBtn.classList.add('loading');
  formStatus.textContent = 'Submitting your message...';

  await new Promise((resolve) => setTimeout(resolve, 200));

  submitBtn.classList.remove('loading');
  submitBtn.classList.add('success');
  formStatus.textContent = '✔ Your message is submitted successfully.';

  contactForm.reset();

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove('success');
    formStatus.textContent = '';
  }, 1800);
});
