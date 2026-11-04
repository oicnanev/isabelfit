document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('[data-toggle-menu]');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    const setMenuOpen = (open) => {
      mobileMenu.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    menuToggle.addEventListener('click', () => {
      setMenuOpen(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');

      formData.append('access_key', 'e9d4d3f5-f4e0-46c0-a8dd-bbc452f95a1a');

      submitButton.disabled = true;
      submitButton.textContent = 'A enviar...';
      formMessage.textContent = '';
      formMessage.classList.remove('visible', 'success', 'error');

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json().catch(() => ({ message: 'Erro ao enviar mensagem' }));

        const success = response.ok && result.success !== false;

        formMessage.textContent = success ? 'Mensagem enviada com sucesso!' : (result.message || 'Erro ao enviar mensagem');
        formMessage.classList.add(success ? 'success' : 'error', 'visible');

        if (success) {
          form.reset();
        }
      } catch (error) {
        formMessage.textContent = 'Erro ao enviar mensagem';
        formMessage.classList.add('error', 'visible');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar mensagem';
      }
    });
  }
});
