/**
 * Script interactivo para perfil de Cristiano Ronaldo
 * Desarrollado con JavaScript vanilla puro
 * Accesibilidad WCAG 2.2 AA y soporte responsivo completo
 */

// Datos de la línea de tiempo (Hitos de carrera)
const milestones = {
  2003: {
    title: "El salto a Old Trafford",
    description: "Con 18 años llegó al Manchester United. Allí convirtió su velocidad y talento en una mentalidad competitiva de élite.",
  },
  2009: {
    title: "Una nueva era en Madrid",
    description: "Su llegada al Real Madrid abrió una etapa de récords, noches europeas memorables y una rivalidad deportiva histórica.",
  },
  2018: {
    title: "El desafío italiano",
    description: "En la Juventus aceptó un nuevo reto: competir en la Serie A y demostrar su adaptación en una de las grandes ligas.",
  },
  2023: {
    title: "Un capítulo global",
    description: "Su etapa en Al-Nassr representa la expansión de su legado y de la conversación mundial alrededor del fútbol.",
  },
};

// Elementos del DOM
const buttons = document.querySelectorAll(".timeline-button");
const year = document.querySelector("#detail-year");
const title = document.querySelector("#detail-title");
const description = document.querySelector("#detail-description");
const detailPanel = document.querySelector("#timeline-detail");
const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector("#main-menu");
const menuLabel = menuToggle?.querySelector(".menu-label");

/**
 * Control del estado del menú responsive (hamburguesa)
 * @param {boolean} isOpen
 */
function setMenuState(isOpen) {
  if (!menuToggle || !mainMenu) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");

  if (menuLabel) {
    menuLabel.textContent = isOpen ? "Cerrar menú" : "Abrir menú";
  }

  mainMenu.classList.toggle("is-open", isOpen);

  if (window.innerWidth <= 768) {
    mainMenu.setAttribute("aria-hidden", String(!isOpen));
  } else {
    mainMenu.removeAttribute("aria-hidden");
  }
}

// Inicializar atributo aria-hidden según el ancho de pantalla
if (window.innerWidth <= 768 && mainMenu) {
  mainMenu.setAttribute("aria-hidden", "true");
}

// Evento de apertura/cierre del menú
menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  const nextState = !isOpen;
  setMenuState(nextState);

  if (nextState) {
    mainMenu?.querySelector("a")?.focus();
  }
});

// Cierre al seleccionar un enlace y retorno accesible de foco al botón
mainMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      setMenuState(false);
      menuToggle?.focus({ preventScroll: true });
    }
  });
});

// Cierre mediante tecla Escape y retorno del foco
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenuState(false);
    menuToggle.focus();
  }
});

// Atrapado accesible de foco en el menú móvil cuando está abierto
mainMenu?.addEventListener("keydown", (event) => {
  if (window.innerWidth > 768 || menuToggle?.getAttribute("aria-expanded") !== "true") return;

  const links = Array.from(mainMenu.querySelectorAll("a"));
  const firstLink = links[0];
  const lastLink = links[links.length - 1];

  if (event.key === "Tab") {
    if (event.shiftKey && document.activeElement === firstLink) {
      event.preventDefault();
      menuToggle.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuToggle.focus();
    }
  }
});

menuToggle?.addEventListener("keydown", (event) => {
  if (window.innerWidth > 768 || menuToggle?.getAttribute("aria-expanded") !== "true") return;

  if (event.key === "Tab" && event.shiftKey) {
    const links = Array.from(mainMenu.querySelectorAll("a"));
    const lastLink = links[links.length - 1];
    if (lastLink) {
      event.preventDefault();
      lastLink.focus();
    }
  }
});

// Cierre al hacer clic fuera del menú
document.addEventListener("click", (event) => {
  if (
    menuToggle?.getAttribute("aria-expanded") === "true" &&
    !mainMenu?.contains(event.target) &&
    !menuToggle?.contains(event.target)
  ) {
    setMenuState(false);
  }
});

// Reset y limpieza al cambiar a pantalla de escritorio
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    if (menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
    mainMenu?.removeAttribute("aria-hidden");
  } else if (!mainMenu?.classList.contains("is-open")) {
    mainMenu?.setAttribute("aria-hidden", "true");
  }
});

/**
 * Actualiza el panel de hitos de la trayectoria
 * @param {string|number} selectedYear
 */
function showMilestone(selectedYear) {
  const milestone = milestones[selectedYear];
  if (!milestone) return;

  if (detailPanel) {
    detailPanel.classList.add("is-switching");
  }

  if (year) year.textContent = selectedYear;
  if (title) title.textContent = milestone.title;
  if (description) description.textContent = milestone.description;

  buttons.forEach((button) => {
    const isSelected = button.dataset.year === String(selectedYear);
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (detailPanel) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        detailPanel.classList.remove("is-switching");
      }, 100);
    });
  }
}

// Inicialización de la línea de tiempo y soporte de teclado accesible (flechas Arriba/Abajo)
const buttonsArray = Array.from(buttons);

buttonsArray.forEach((button, index) => {
  button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");

  button.addEventListener("click", () => showMilestone(button.dataset.year));

  button.addEventListener("keydown", (event) => {
    let targetIndex = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      targetIndex = (index + 1) % buttonsArray.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      targetIndex = (index - 1 + buttonsArray.length) % buttonsArray.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      targetIndex = buttonsArray.length - 1;
    }

    if (targetIndex !== -1) {
      const targetBtn = buttonsArray[targetIndex];
      targetBtn.focus();
      showMilestone(targetBtn.dataset.year);
    }
  });
});

// Manejo resiliente de estados de carga/error para imágenes remotas
document.querySelectorAll("img").forEach((img) => {
  if (img.complete && img.naturalWidth === 0) {
    const frame = img.closest(".hero-image-frame, .gallery-img-container");
    frame?.classList.add("img-load-error");
  } else {
    img.addEventListener("error", () => {
      const frame = img.closest(".hero-image-frame, .gallery-img-container");
      frame?.classList.add("img-load-error");
    });
  }
});
