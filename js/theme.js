// Theme toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    // Check saved theme
    const savedTheme = Storage.get(Storage.KEYS.THEME) || 'light';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '☀️'; // Sun icon for light mode toggle
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '🌙'; // Moon icon for dark mode toggle
        }
        Storage.set(Storage.KEYS.THEME, theme);
    }
});
