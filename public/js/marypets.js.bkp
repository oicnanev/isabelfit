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

      submitButton.disabled = true;
      submitButton.textContent = 'A enviar...';
      formMessage.textContent = '';
      formMessage.classList.remove('visible', 'success', 'error');

      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
          })
        });

        const result = await response.json().catch(() => ({ message: 'Erro ao enviar mensagem' }));

        formMessage.textContent = response.ok ? 'Mensagem enviada com sucesso!' : (result.error || 'Erro ao enviar mensagem');
        formMessage.classList.add(response.ok ? 'success' : 'error', 'visible');

        if (response.ok) {
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
