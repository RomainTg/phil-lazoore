/* =========================================================
   Site de Philippe Lazoore — scripts
   1. Signal « JavaScript actif » pour le CSS → dans le <head>
      de chaque page (petit script en ligne, voir la note)
   2. Menu burger
   3. Apparition en fondu au défilement
   4. Vidéo YouTube chargée au clic
   ========================================================= */

// 1. Note : la classe .js est ajoutée sur <html> par un mini-script
// placé dans le <head>, AVANT l'affichage de la page. Si on le faisait
// ici (fichier chargé avec defer), les éléments .reveal apparaîtraient
// une fraction de seconde puis disparaîtraient : un « flash ».
// Sans cette classe, rien n'est caché : si le JS ne charge pas,
// le contenu reste toujours lisible.

/* ---------- 2. Menu burger ---------- */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuToggle && mainNav) {
  const openMenu = () => {
    mainNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu");
  };

  const closeMenu = () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Touche Échap : on ferme le menu et on rend le focus au bouton
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Un clic sur un lien du menu le referme (utile pour les ancres #)
  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });
}

/* ---------- 3. Apparition en fondu au défilement ---------- */
// IntersectionObserver prévient quand un élément entre dans l'écran,
// sans écouter l'événement scroll en continu (meilleur pour les performances).
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // L'animation ne se joue qu'une fois : on arrête d'observer
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // 15 % de l'élément visible suffit
      rootMargin: "0px 0px -40px 0px", // déclenche un peu avant le bas
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  // Navigateur trop ancien : on affiche tout directement
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

/* ---------- 4. Vidéo YouTube chargée au clic ---------- */
// Tant qu'on ne clique pas, on affiche seulement une miniature :
// la page charge plus vite et YouTube ne dépose rien avant le clic.
document.querySelectorAll(".video-facade").forEach((button) => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.videoId;
    const iframe = document.createElement("iframe");

    iframe.className = "video-frame";
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    iframe.title = button.dataset.videoTitle || "Vidéo YouTube";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    button.replaceWith(iframe);
    iframe.focus();
  });
});
