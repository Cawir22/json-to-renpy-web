document.getElementById("toggle-theme").addEventListener("click", function () {
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        themeIcon.classList.remove("bi-moon");
        themeIcon.classList.add("bi-sun");
        this.innerHTML = '<i id="theme-icon" class="bi bi-sun"></i> Jasny motyw';
    } else {
        themeIcon.classList.remove("bi-sun");
        themeIcon.classList.add("bi-moon");
        this.innerHTML = '<i id="theme-icon" class="bi bi-moon"></i> Ciemny motyw';
    }
});