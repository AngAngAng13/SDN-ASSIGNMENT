import $ from 'jquery';

const themeController = {
  controller: document.querySelector('.theme-controller') as HTMLInputElement,

  init() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (this.controller) {
      this.controller.checked = currentTheme === 'dark';
    }
    this.listen();
  },

  listen() {
    if (!this.controller) return;
    $(this.controller).on('change', (e) => {
      const target = e.target as HTMLInputElement;
      const theme = target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  },
};

export default themeController;