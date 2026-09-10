# Auditoría de accesibilidad, UX y diseño responsive

## Resumen ejecutivo

Auditoría no destructiva de `index.html`, `styles.css` y `script.js` frente a WCAG(Web content accesibility guidelines) 2.2 AA, UX y comportamiento responsive.

La base es sólida: existe una estructura semántica clara, un único `h1`, jerarquía continua de `h2`/`h3`, nombres accesibles para la navegación, textos alternativos no vacíos, controles nativos de teclado, foco visible, enlaces funcionales y una adaptación responsive comprobada sin overflow horizontal en 320 px, 390 px, 768 px y 1280 px.

Se identifican dos hallazgos de prioridad media verificables:

1. El color de los textos `.eyebrow` sobre el fondo claro no alcanza 4.5:1.
2. El indicador de foco declarado puede no alcanzar 3:1 sobre el fondo claro y los enlaces de navegación son objetivos táctiles menores de 24 px de alto.

No se detectaron hallazgos críticos ni altos en la revisión estática y funcional realizada. OpenCode fue invocado en modo auditor, pero el proveedor configurado rechazó la ejecución por cuota agotada; por eso este informe se basa en inspección de código y pruebas reproducibles realizadas localmente.

## Hallazgos críticos

No se encontraron hallazgos críticos justificados por el código revisado.

## Hallazgos altos

No se encontraron hallazgos altos justificados por el código revisado.

## Hallazgos medios

### M-01 — Contraste insuficiente en textos `.eyebrow`

- **Criterio relacionado:** WCAG 1.4.3 Contrast (Minimum), nivel AA.
- **Evidencia:** [styles.css](./styles.css), regla `.eyebrow`:
  `color: #b07617` sobre el fondo claro `#f5f7f8`.
- **Medición:** contraste aproximado de **3.59:1**. El texto tiene un tamaño inferior a 18 pt y requiere al menos 4.5:1.
- **Alcance:** los textos “Fútbol · Portugal · Número 7”, “Capítulo a capítulo”, “El lenguaje de los datos”, “El juego en imágenes” y “Para seguir investigando” cuando aparecen sobre fondos claros. La variante `.section-dark .eyebrow` usa `#e7b75b` sobre `#101c2d` y sí supera el mínimo.
- **Recomendación:** oscurecer el color claro, por ejemplo usando un tono que alcance al menos 4.5:1, y comprobarlo con un analizador de contraste. Mantener la variante dorada oscura sobre el fondo navy si se conserva su contraste actual.

### M-02 — Foco y objetivos táctiles de la navegación

- **Criterios relacionados:** WCAG 2.4.7 Focus Visible, WCAG 2.4.11 Focus Appearance y WCAG 2.5.8 Target Size (Minimum), nivel AA.
- **Evidencia de foco:** [styles.css](./styles.css), regla `:focus-visible` declara `outline: 3px solid #d68b00`. Sobre `#f5f7f8` el contraste aproximado del color del foco es **2.59:1**, inferior al 3:1 recomendado para el indicador no textual. La regla sí hace el foco visible y el navegador lo mostró en la navegación por teclado.
- **Evidencia de objetivos:** [styles.css](./styles.css), `.main-nav a` no define padding ni una altura mínima. Con `font-size: .92rem` y `line-height: 1.6`, la altura calculada es aproximadamente 23.5 px, menor que 24 px. El enlace del pie usa `.footer-content` con `font-size: .9rem` y queda en una situación equivalente.
- **Recomendación:** usar un color de foco con contraste mínimo 3:1 respecto de los fondos donde aparece, o añadir un segundo tratamiento visual que mantenga ese contraste. Añadir `min-height: 2.75rem` y padding vertical/horizontal suficiente a los enlaces interactivos de navegación y pie, verificando que no provoque overflow en 320 px. Los botones de la línea de tiempo ya tienen un área amplia.

## Hallazgos bajos

### B-01 — Enlaces internos bajo un encabezado sticky

- **Evidencia:** [styles.css](./styles.css), `.site-header { position: sticky; top: 0; }`; [index.html](./index.html), navegación mediante fragmentos como `#trayectoria` y `#estadisticas`.
- **Riesgo UX:** al activar un enlace interno, el encabezado sticky puede cubrir parcialmente el inicio de la sección o su encabezado en algunos navegadores.
- **Recomendación:** añadir `scroll-margin-top` a las secciones con destino, usando una medida que contemple la altura del encabezado en escritorio y móvil. Repetir la prueba con teclado y desplazamiento.

### B-02 — Imágenes remotas sin dimensiones intrínsecas declaradas

- **Evidencia:** [index.html](./index.html), las cuatro etiquetas `img` solo declaran `src` y `alt`; [styles.css](./styles.css) controla la proporción mediante `aspect-ratio`.
- **Riesgo UX/performance:** si una imagen tarda en cargar, el navegador puede reservar el espacio de forma menos estable que con `width`/`height` declarados, produciendo desplazamiento visual o una experiencia degradada si el recurso remoto no está disponible.
- **Recomendación:** declarar dimensiones proporcionales (`width` y `height`) coherentes con las proporciones usadas, conservar `object-fit`, y evaluar `loading="lazy"` para las tres imágenes de galería. Si el sitio debe funcionar sin internet, servir copias locales con licencia comprobada.

### B-03 — Semántica mejorable para la selección de etapas

- **Evidencia:** [index.html](./index.html), cuatro botones dentro de una lista usan `aria-pressed`; [script.js](./script.js), la selección es mutuamente exclusiva y actualiza un único artículo con `aria-live="polite"`.
- **Evaluación:** no se observó un error funcional: los botones son nativos, se activan con teclado y el contenido cambia correctamente. Sin embargo, `aria-pressed` modela botones con estado de pulsación, mientras que esta interfaz representa una selección única de etapas.
- **Recomendación:** para una semántica más precisa, convertir el conjunto en un patrón de pestañas (`tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`) con navegación de teclado documentada, o mantener botones y añadir una relación explícita (`aria-controls`) al panel. No es necesario añadir ARIA si se conserva la solución actual y se confirma su comportamiento con tecnologías de asistencia.

### B-04 — No existía menú hamburguesa responsive (resuelto)

- **Evidencia inicial:** [index.html](./index.html) tenía un `nav.main-nav` siempre visible sin botón de menú; [styles.css](./styles.css) solo cambiaba el espaciado en móvil; [script.js](./script.js) no tenía lógica de apertura o cierre.
- **Resultado inicial:** a 390 px no había ningún control con `aria-expanded` o `aria-controls`; la navegación permanecía expandida y se apilaba mediante `flex-wrap`.
- **Impacto inicial:** no era un incumplimiento WCAG automático, pero no cumplía el requisito UX de menú hamburguesa y consumía espacio vertical en pantallas estrechas.
- **Recomendación:** si se requiere el patrón hamburguesa, añadir un `<button type="button">` con nombre accesible (“Abrir menú”/“Cerrar menú”), `aria-expanded`, `aria-controls` y un panel de navegación que se muestre u oculte. Implementar apertura con clic y teclado, cierre al seleccionar un enlace, `Escape`, foco visible y una estrategia clara de retorno del foco. Verificar que el menú no quede oculto para lectores de pantalla cuando está cerrado y que no permita interacción con enlaces invisibles.
- **Estado actual:** resuelto. [index.html](./index.html), [styles.css](./styles.css) y [script.js](./script.js) ahora incluyen el botón, los estados ARIA, el foco y el comportamiento de apertura/cierre.

### B-05 — Primera implementación del menú aumentó innecesariamente el encabezado móvil (resuelto)

- **Evidencia:** durante la primera corrección, el botón mostraba visualmente “Abrir menú” junto al nombre de marca. En 320 px, el encabezado alcanzó aproximadamente **143 px** de alto porque el contenido se envolvía en una segunda fila.
- **Impacto:** la navegación seguía funcionando, pero la solución era menos responsive que la versión anterior y desplazaba innecesariamente el contenido principal hacia abajo.
- **Corrección aplicada:** el texto del estado se mantuvo como nombre accesible, pero se ocultó visualmente mediante una técnica de texto para lectores de pantalla; el botón conserva un ancho compacto de 48 px y la marca puede encogerse.
- **Verificación actual:** el encabezado mide aproximadamente **76 px** en 320 px y 390 px, y **72 px** en 768 px y 1280 px. No hay overflow horizontal.

## Criterios que cumplen

- **Estructura semántica:** hay `header`, `nav`, `main`, `section`, `article`, `figure`, `figcaption` y `footer` con landmarks reconocibles.
- **Jerarquía de encabezados:** un `h1` seguido de encabezados `h2` por sección y un `h3` para el detalle de trayectoria; no se observaron saltos de nivel.
- **Idioma y título:** `html lang="es"` y un `<title>` descriptivo.
- **Nombres accesibles:** la navegación tiene `aria-label`; la marca tiene un nombre accesible; los botones incluyen año y club por su texto visible.
- **Textos alternativos:** las cuatro imágenes tienen `alt` descriptivo y no vacío.
- **Enlaces:** los enlaces internos apuntan a destinos existentes; los externos usan `target="_blank"` junto con `rel="noopener noreferrer"`.
- **Controles:** la línea de tiempo usa `<button type="button">`, no elementos no interactivos simulados.
- **Foco:** `:focus-visible` declara un contorno de 3 px; la prueba de tabulación mostró el contorno en los enlaces. Debe corregirse el contraste señalado en M-02.
- **ARIA y actualización dinámica:** `aria-live="polite"` comunica el panel actualizado y `aria-pressed` se sincroniza en cada cambio.
- **Responsive:** las reglas de `@media (max-width: 760px)` apilan hero, trayectoria y galería, y reducen la cuadrícula de estadísticas a dos columnas.
- **Overflow:** prueba real con viewport de 320, 390, 768 y 1280 px: `scrollWidth` no superó `clientWidth` en ninguna medida.
- **JavaScript:** `node --check Ejemplo1/script.js` pasó y no se observaron errores de consola al cargar y recargar la página.
- **Menú hamburguesa:** cumple actualmente en móvil: el botón tiene nombre accesible, `aria-expanded`, `aria-controls`, foco automático al primer enlace, cierre con `Escape`, cierre al seleccionar un enlace y retorno del foco al botón.
- **Preferencia de movimiento:** existe una regla `prefers-reduced-motion` que desactiva el desplazamiento suave y la transición de botones.
- **Contraste verificado:** texto principal y secundario sobre fondos oscuros, tarjetas y enlaces de fuentes superan los mínimos calculados; el incumplimiento queda limitado a M-01 y al indicador de foco claro de M-02.

## Pruebas que deberían repetirse después de corregir

1. Ejecutar un analizador automatizado (axe, Lighthouse o equivalente) sobre la página servida localmente.
2. Recalcular contraste de texto, enlaces y foco en cada combinación de fondo.
3. Recorrer todos los enlaces y botones únicamente con `Tab`, `Shift+Tab`, `Enter` y `Space`, verificando orden, foco y activación.
4. Con lector de pantalla, confirmar landmarks, nombres de navegación, estado del control seleccionado y anuncio del panel actualizado.
5. Probar los viewports exactos de **320 × 900**, **390 × 900**, **768 × 900** y escritorio, comprobando que no haya scroll horizontal ni objetivos superpuestos.
6. Probar zoom del navegador al 200% y reflujo equivalente a 320 CSS px.
7. Simular carga lenta y fallo de las imágenes remotas; verificar estabilidad del layout y comprensión mediante `alt`/`figcaption`.
8. Repetir `node --check Ejemplo1/script.js`, cargar la página en un servidor local y revisar la consola del navegador.

## Pruebas realizadas en esta auditoría

- Auditoría actualizada: 7 de septiembre de 2026, tras la implementación del menú hamburguesa compacto.
- Existencia: `index.html`, `styles.css` y `script.js` presentes en `Ejemplo1`.
- Sintaxis: `node --check Ejemplo1/script.js` sin errores.
- Servidor local: página servida por `python3 -m http.server`; respuesta HTTP 200.
- Responsive actual: comprobación automatizada a 320, 390, 768 y 1280 px; sin overflow horizontal. El encabezado mide aproximadamente 76 px en 320/390 y 72 px en 768/1280.
- Regresión responsive corregida: la primera implementación elevó el encabezado móvil a aproximadamente 143 px en 320 px; después del ajuste compacto quedó en aproximadamente 76 px sin overflow.
- Interacción: selección de “2009 · Real Madrid” actualizó el título y estableció `aria-pressed="true"`.
- Teclado: los elementos interactivos recibieron foco visible mediante tabulación.
- Menú actual: en móvil se comprobó estado cerrado inicial (`aria-expanded="false"`), apertura (`true`), foco en “Trayectoria”, cierre con `Escape`, retorno del foco al botón y navegación normal visible en escritorio.
- Consola: sin errores de JavaScript durante carga y recarga.
- OpenCode: ejecución solicitada en modo auditor, no destructiva; no produjo informe porque el proveedor configurado respondió “quota exceeded”.
