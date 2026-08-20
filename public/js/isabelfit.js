document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('[data-toggle-menu]');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
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
