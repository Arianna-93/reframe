/* =========================================================
   RE:FRAME
   LÓGICA DE INTERACCIÓN Y GESTIÓN DE ESTADOS
   ========================================================= */


/* =========================================================
   01. GESTIÓN DE NAVEGACIÓN ENTRE VISTAS
   ========================================================= */

const vistasAplicacion = [
  ...document.querySelectorAll(
    "[data-panel-vista]"
  )
];

const controlesCambioVista = [
  ...document.querySelectorAll(
    "[data-destino-vista]"
  )
];

const enlacesNavegacion = [
  ...document.querySelectorAll(
    ".enlace-navegacion[data-destino-vista]"
  )
];


function normalizarVista(value) {

  const allowedViews = [
    "inicio",
    "conversacion",
    "palabras"
  ];

  return allowedViews.includes(value)
    ? value
    : "inicio";
}


function obtenerVistaDesdeHash() {

  const hash =
    window.location.hash.replace(
      "#",
      ""
    );

  return normalizarVista(hash);
}


function mostrarVista(
  viewName,
  updateHash = true
) {

  const target =
    normalizarVista(viewName);


  vistasAplicacion.forEach((view) => {

    const isTarget =
      view.dataset.panelVista === target;

    view.hidden =
      !isTarget;

    view.classList.toggle(
      "estado-activo",
      isTarget
    );

  });


  enlacesNavegacion.forEach((link) => {

    const isActive =
      link.dataset.destinoVista === target;

    link.classList.toggle(
      "estado-activo",
      isActive
    );


    if (isActive) {

      link.setAttribute(
        "aria-current",
        "page"
      );

    } else {

      link.removeAttribute(
        "aria-current"
      );

    }

  });


  document.body.dataset.currentView =
    target;


  if (updateHash) {

    const nextHash =
      `#${target}`;


    if (
      window.location.hash !== nextHash
    ) {

      history.pushState(
        {
          view: target
        },
        "",
        nextHash
      );

    }

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (target === "inicio") {

    requestAnimationFrame(
      ajustarLienzoRed
    );

    iniciarRedVisual();

  }

}


controlesCambioVista.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      mostrarVista(
        button.dataset.destinoVista
      );

    }
  );

});


window.addEventListener(
  "popstate",
  () => {

    mostrarVista(
      obtenerVistaDesdeHash(),
      false
    );

  }
);


window.addEventListener(
  "hashchange",
  () => {

    mostrarVista(
      obtenerVistaDesdeHash(),
      false
    );

  }
);


/* =========================================================
   02. GESTIÓN DINÁMICA DE LA CABECERA
   ========================================================= */

const cabeceraSitio =
  document.getElementById(
    "cabeceraSitio"
  );


function actualizarEstadoCabecera() {

  if (!cabeceraSitio) {
    return;
  }


  cabeceraSitio.classList.toggle(
    "estado-desplazado",
    window.scrollY > 12
  );

}


window.addEventListener(
  "scroll",
  actualizarEstadoCabecera,
  {
    passive: true
  }
);


actualizarEstadoCabecera();


/* =========================================================
   03. MODELO DE DATOS: BIBLIOTECA DE MENSAJES
   ========================================================= */

const bibliotecaMensajes = {


  /* =======================================================
     PALABRAS PARA MÍ
     ======================================================= */

  personal: {

    label:
      "PARA MÍ",

    messages: [

      "Hoy no tienes que resolver toda tu vida. Solo llegar al siguiente momento.",

      "Puedes atravesar este momento sin tener todas las respuestas.",

      "No tienes que convertir lo que sientes en una explicación perfecta para pedir compañía.",

      "Haz pequeño el siguiente paso. Un mensaje, una llamada, una puerta que puedas abrir.",

      "Lo que estás sintiendo merece atención, no silencio.",

      "Si ahora todo pesa demasiado, busca a una persona real y deja que este momento sea compartido."

    ]

  },


  /* =======================================================
     INICIAR UNA CONVERSACIÓN
     ======================================================= */

  inicio: {

    label:
      "PARA INICIAR",

    messages: [

      "He notado que últimamente pareces estar cargando con mucho. ¿Cómo estás de verdad?",

      "No sé si tengo las palabras correctas, pero me importa saber cómo estás.",

      "No tienes que decirme que estás bien si no lo estás. ¿Quieres hablar?",

      "Quería preguntarte algo sin presión. ¿Cómo lo estás llevando estos días?",

      "He pensado en ti últimamente. Si necesitas hablar, puedo escucharte.",

      "Si hablar cara a cara cuesta, podemos empezar con un mensaje."

    ]

  },


  /* =======================================================
     ACOMPAÑAR
     ======================================================= */

  acompanamiento: {

    label:
      "PARA ACOMPAÑAR",

    messages: [

      "No tienes que contarme todo. Solo quería que supieras que estoy aquí.",

      "¿Quieres que te escuche o prefieres que simplemente me quede contigo un rato?",

      "No voy a intentar arreglarlo en dos frases. Puedes hablar a tu ritmo.",

      "Gracias por contármelo. Quiero escucharte y tomar en serio lo que estás sintiendo.",

      "Puedo ayudarte a buscar apoyo. No tenemos que resolverlo todo ahora.",

      "No hace falta que encuentres las palabras perfectas. Puedes empezar por lo que más pesa hoy."

    ]

  }

};


/* =========================================================
   04. UTILIDADES TRANSVERSALES
   ========================================================= */

function formatearNumeroDosDigitos(number) {

  return String(number).padStart(
    2,
    "0"
  );

}


function obtenerIndiceAleatorioDistinto(
  currentIndex,
  length
) {

  if (length <= 1) {
    return 0;
  }


  let nextIndex =
    currentIndex;


  while (
    nextIndex === currentIndex
  ) {

    nextIndex =
      Math.floor(
        Math.random() * length
      );

  }


  return nextIndex;

}


function mostrarRetroalimentacionTemporal(
  element,
  text
) {

  if (!element) {
    return;
  }


  element.textContent =
    text;


  clearTimeout(
    element._feedbackTimer
  );


  element._feedbackTimer =
    setTimeout(
      () => {

        element.textContent =
          "";

      },
      2200
    );

}


/* =========================================================
   05. SERVICIO DE COPIA AL PORTAPAPELES
   ========================================================= */

async function copiarTexto(text) {

  if (
    navigator.clipboard
    && navigator.clipboard.writeText
  ) {

    try {

      await navigator.clipboard.writeText(
        text
      );

      return;

    } catch {

      /* Continúa con el sistema alternativo */

    }

  }


  const textarea =
    document.createElement(
      "textarea"
    );


  textarea.value =
    text;


  textarea.setAttribute(
    "readonly",
    ""
  );


  textarea.style.position =
    "fixed";

  textarea.style.opacity =
    "0";

  textarea.style.pointerEvents =
    "none";


  document.body.appendChild(
    textarea
  );


  textarea.select();


  document.execCommand(
    "copy"
  );


  textarea.remove();

}


/* =========================================================
   06. SERVICIO DE COMPARTICIÓN DE CONTENIDO
   ========================================================= */

async function compartirTexto(
  text,
  feedbackElement
) {

  const data = {

    title:
      "RE:FRAME",

    text:
      `${text}\n\nRE:FRAME · Change the Narrative`

  };


  if (navigator.share) {

    try {

      await navigator.share(
        data
      );


      mostrarRetroalimentacionTemporal(
        feedbackElement,
        "Gracias por compartir."
      );


      return;

    } catch (error) {

      if (
        error.name === "AbortError"
      ) {

        return;

      }

    }

  }


  try {

    await copiarTexto(text);


    mostrarRetroalimentacionTemporal(
      feedbackElement,
      "Frase copiada."
    );

  } catch {

    mostrarRetroalimentacionTemporal(
      feedbackElement,
      "No se pudo copiar."
    );

  }

}


/* =========================================================
   07. SERVICIO DE EXPORTACIÓN DE FRASES COMO TARJETA VISUAL
   ========================================================= */

function dividirTextoEnLineas(
  context,
  text,
  maxWidth
) {

  const words =
    text.trim().split(/\s+/);

  const lines = [];

  let currentLine = "";


  words.forEach(
    (word) => {

      const candidate =
        currentLine
          ? `${currentLine} ${word}`
          : word;


      if (
        context.measureText(candidate).width <= maxWidth
        || !currentLine
      ) {

        currentLine =
          candidate;

      } else {

        lines.push(
          currentLine
        );

        currentLine =
          word;

      }

    }
  );


  if (currentLine) {
    lines.push(currentLine);
  }


  return lines;

}


function dibujarMotivoLuz(
  context,
  x,
  y
) {

  context.save();


  /* Llama, símbolo de luz y continuidad */
  context.beginPath();
  context.moveTo(x, y - 44);
  context.bezierCurveTo(
    x + 22,
    y - 21,
    x + 13,
    y + 3,
    x,
    y + 10
  );
  context.bezierCurveTo(
    x - 14,
    y + 1,
    x - 20,
    y - 18,
    x,
    y - 44
  );
  context.closePath();
  context.fillStyle = "#F5A623";
  context.fill();


  /* Vela minimalista en turquesa */
  context.fillStyle = "#24D6D1";
  context.fillRect(
    x - 12,
    y + 13,
    24,
    48
  );


  context.strokeStyle =
    "rgba(247,250,252,0.4)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(
    x,
    y + 70,
    48,
    Math.PI * 0.1,
    Math.PI * 0.9
  );
  context.stroke();


  context.restore();

}


async function descargarFraseComoImagen(
  text,
  contextLabel,
  feedbackElement
) {

  try {

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }


    const canvas =
      document.createElement("canvas");

    const width = 720;
    const height = 900;

    canvas.width = width;
    canvas.height = height;


    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas no disponible");
    }


    /* Fondo azul marino RE:FRAME */
    context.fillStyle = "#061B2C";
    context.fillRect(0, 0, width, height);


    /* Halo visual sutil */
    const gradient =
      context.createRadialGradient(
        130,
        100,
        20,
        130,
        100,
        500
      );

    gradient.addColorStop(
      0,
      "rgba(36,214,209,0.18)"
    );

    gradient.addColorStop(
      1,
      "rgba(36,214,209,0)"
    );

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);


    /* Marco */
    context.strokeStyle =
      "rgba(247,250,252,0.18)";
    context.lineWidth = 1.5;
    context.strokeRect(
      38,
      38,
      width - 76,
      height - 76
    );


    /* Identidad */
    context.fillStyle = "#24D6D1";
    context.font =
      '700 20px "Space Grotesk", Inter, sans-serif';
    context.letterSpacing = "2px";
    context.fillText(
      "RE:FRAME",
      70,
      92
    );


    context.fillStyle = "#A9BAC7";
    context.font =
      '700 12px Inter, sans-serif';
    context.fillText(
      contextLabel,
      70,
      133
    );


    context.fillStyle = "#F5A623";
    context.font =
      '700 11px Inter, sans-serif';
    context.fillText(
      "10.09 · WORLD SUICIDE PREVENTION DAY",
      70,
      161
    );


    dibujarMotivoLuz(
      context,
      width - 108,
      118
    );


    /* Frase */
    context.fillStyle = "#F7FAFC";
    context.font =
      '600 46px "Space Grotesk", Inter, sans-serif';

    const maxTextWidth =
      width - 140;

    const lines =
      dividirTextoEnLineas(
        context,
        text,
        maxTextWidth
      );

    const lineHeight = 58;
    const maxLines = 8;
    const visibleLines =
      lines.slice(0, maxLines);

    const textBlockHeight =
      visibleLines.length * lineHeight;

    const textStartY =
      Math.max(
        270,
        460 - textBlockHeight / 2
      );


    visibleLines.forEach(
      (line, index) => {

        context.fillText(
          line,
          70,
          textStartY + index * lineHeight
        );

      }
    );


    /* Firma editorial */
    context.strokeStyle =
      "rgba(36,214,209,0.35)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(70, 742);
    context.lineTo(width - 70, 742);
    context.stroke();


    context.fillStyle = "#A9BAC7";
    context.font =
      '500 14px Inter, sans-serif';
    context.fillText(
      "Change the narrative. One conversation at a time.",
      70,
      785
    );


    context.fillStyle = "#F7FAFC";
    context.font =
      '600 13px Inter, sans-serif';
    context.fillText(
      "Si necesitas apoyo en España: 024 · Emergencias: 112",
      70,
      823
    );


    const blob =
      await new Promise(
        (resolve) => {

          canvas.toBlob(
            resolve,
            "image/png",
            0.92
          );

        }
      );


    if (!blob) {
      throw new Error("No se pudo generar la imagen");
    }


    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      `reframe-frase-${Date.now()}.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);


    mostrarRetroalimentacionTemporal(
      feedbackElement,
      "Imagen descargada."
    );

  } catch {

    mostrarRetroalimentacionTemporal(
      feedbackElement,
      "No se pudo generar la imagen."
    );

  }

}


/* =========================================================
   08. GESTIÓN DEL CONTEXTO CONVERSACIONAL
   ========================================================= */

const moduloSeleccionContexto =
  document.getElementById(
    "moduloSeleccionContexto"
  );


const panelConversacion =
  document.getElementById(
    "panelGeneradorConversacion"
  );


const tarjetasContextoConversacion = [
  ...document.querySelectorAll(
    "[data-tipo-conversacion]"
  )
];


const textoConversacion =
  document.getElementById(
    "textoMensajeConversacion"
  );


const etiquetaConversacion =
  document.getElementById(
    "etiquetaMensajeConversacion"
  );


const contadorConversacion =
  document.getElementById(
    "contadorMensajeConversacion"
  );


const botonSiguienteConversacion =
  document.getElementById(
    "botonSiguienteMensajeConversacion"
  );


const botonCopiarConversacion =
  document.getElementById(
    "botonCopiarMensajeConversacion"
  );


const botonCompartirConversacion =
  document.getElementById(
    "botonCompartirMensajeConversacion"
  );


const botonDescargarConversacion =
  document.getElementById(
    "botonDescargarMensajeConversacion"
  );


const retroalimentacionConversacion =
  document.getElementById(
    "retroalimentacionMensajeConversacion"
  );


const admiteInteraccionHover =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );


const indicesConversacion = {

  inicio:
    0,

  acompanamiento:
    0

};


let tipoConversacionMostrado =
  "inicio";


let tipoConversacionFijado =
  null;


let temporizadorCierrePanel =
  null;


/* =========================================================
   RENDERIZACIÓN DEL MENSAJE
   ========================================================= */

function renderizarMensajeConversacion(
  type = tipoConversacionMostrado
) {

  const collection =
    bibliotecaMensajes[type];


  if (
    !collection
    || !textoConversacion
    || !etiquetaConversacion
    || !contadorConversacion
  ) {

    return;

  }


  tipoConversacionMostrado =
    type;


  const index =
    indicesConversacion[type];


  etiquetaConversacion.textContent =
    collection.label;


  contadorConversacion.textContent =
    `${formatearNumeroDosDigitos(index + 1)} / ${formatearNumeroDosDigitos(collection.messages.length)}`;


  textoConversacion.textContent =
    collection.messages[index];


  textoConversacion.classList.remove(
    "estado-transicion"
  );


  void textoConversacion.offsetWidth;


  textoConversacion.classList.add(
    "estado-transicion"
  );

}


/* =========================================================
   GESTIÓN DEL ESTADO VISUAL DE LAS TARJETAS
   ========================================================= */

function actualizarEstadoTarjetasContexto(
  previewType = null
) {

  tarjetasContextoConversacion.forEach(
    (card) => {

      const type =
        card.dataset.tipoConversacion;


      const isLocked =
        type === tipoConversacionFijado;


      const isPreview =
        type === previewType
        && !isLocked;


      card.classList.toggle(
        "estado-activo",
        isLocked
      );


      card.classList.toggle(
        "estado-previsualizacion",
        isPreview
      );


      card.setAttribute(
        "aria-pressed",
        String(isLocked)
      );

    }
  );

}


/* =========================================================
   DESPLAZAMIENTO AUTOMÁTICO AL PANEL EN MÓVIL
   ========================================================= */

function desplazarAlPanelConversacion() {

  if (
    !panelConversacion
    || !window.matchMedia(
      "(max-width: 900px)"
    ).matches
  ) {

    return;

  }


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          const alturaCabecera =
            cabeceraSitio?.offsetHeight || 0;


          const posicionPanel =
            panelConversacion
              .getBoundingClientRect()
              .top
            + window.scrollY
            - alturaCabecera
            - 16;


          const reducirMovimiento =
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;


          window.scrollTo({
            top: Math.max(
              0,
              posicionPanel
            ),
            behavior:
              reducirMovimiento
                ? "auto"
                : "smooth"
          });

        }
      );

    }
  );

}


/* =========================================================
   APERTURA DEL PANEL GENERADOR
   ========================================================= */

function abrirPanelConversacion(
  type,
  lock = false
) {

  if (
    !bibliotecaMensajes[type]
    || !panelConversacion
  ) {

    return;

  }


  clearTimeout(
    temporizadorCierrePanel
  );


  tipoConversacionMostrado =
    type;


  if (lock) {

    tipoConversacionFijado =
      type;

  }


  renderizarMensajeConversacion(
    type
  );


  actualizarEstadoTarjetasContexto(
    lock
      ? null
      : type
  );


  panelConversacion.hidden =
    false;


  panelConversacion.setAttribute(
    "aria-hidden",
    "false"
  );


  requestAnimationFrame(
    () => {

      panelConversacion.classList.add(
        "estado-abierto"
      );

    }
  );

}


/* =========================================================
   CIERRE DEL PANEL GENERADOR
   ========================================================= */

function cerrarPanelConversacion() {

  if (
    !panelConversacion
    || tipoConversacionFijado
  ) {

    return;

  }


  panelConversacion.classList.remove(
    "estado-abierto"
  );


  panelConversacion.setAttribute(
    "aria-hidden",
    "true"
  );


  actualizarEstadoTarjetasContexto();


  clearTimeout(
    temporizadorCierrePanel
  );


  temporizadorCierrePanel =
    setTimeout(
      () => {

        if (
          !tipoConversacionFijado
        ) {

          panelConversacion.hidden =
            true;

        }

      },
      330
    );

}


/* =========================================================
   RESTAURACIÓN DEL ESTADO DE SELECCIÓN
   ========================================================= */

function restaurarSeleccionConversacion() {

  if (tipoConversacionFijado) {

    abrirPanelConversacion(
      tipoConversacionFijado,
      true
    );

  } else {

    cerrarPanelConversacion();

  }

}


/* =========================================================
   INTERACCIONES DE PUNTERO Y SELECCIÓN
   ========================================================= */

tarjetasContextoConversacion.forEach(
  (card) => {

    const type =
      card.dataset.tipoConversacion;


    /* PREVISUALIZAR */

    card.addEventListener(
      "pointerenter",
      () => {

        if (!admiteInteraccionHover.matches) {
          return;
        }


        abrirPanelConversacion(
          type,
          false
        );

      }
    );


    /* ACCESIBILIDAD TECLADO */

    card.addEventListener(
      "focus",
      () => {

        abrirPanelConversacion(
          type,
          false
        );

      }
    );


    /* ALTERNAR SELECCIÓN PERSISTENTE */

    card.addEventListener(
      "click",
      () => {

        const esSeleccionActual =
          tipoConversacionFijado === type;


        if (esSeleccionActual) {

          tipoConversacionFijado =
            null;


          cerrarPanelConversacion();

          return;

        }


        abrirPanelConversacion(
          type,
          true
        );


        desplazarAlPanelConversacion();

      }
    );

  }
);


moduloSeleccionContexto?.addEventListener(
  "pointerleave",
  () => {

    if (!admiteInteraccionHover.matches) {
      return;
    }


    restaurarSeleccionConversacion();

  }
);


/* =========================================================
   CONSOLIDACIÓN DE LA SELECCIÓN ACTUAL
   ========================================================= */

function fijarSeleccionConversacion() {

  if (!tipoConversacionMostrado) {
    return;
  }


  tipoConversacionFijado =
    tipoConversacionMostrado;


  actualizarEstadoTarjetasContexto();

}


/* =========================================================
   GENERACIÓN DE UNA NUEVA PROPUESTA
   ========================================================= */

botonSiguienteConversacion?.addEventListener(
  "click",
  () => {

    fijarSeleccionConversacion();


    const type =
      tipoConversacionMostrado;


    const collection =
      bibliotecaMensajes[type];


    indicesConversacion[type] =
      obtenerIndiceAleatorioDistinto(
        indicesConversacion[type],
        collection.messages.length
      );


    renderizarMensajeConversacion(
      type
    );

  }
);


/* =========================================================
   COPIA DEL MENSAJE ACTUAL
   ========================================================= */

botonCopiarConversacion?.addEventListener(
  "click",
  async () => {

    fijarSeleccionConversacion();


    const type =
      tipoConversacionMostrado;


    const collection =
      bibliotecaMensajes[type];


    const text =
      collection.messages[
        indicesConversacion[type]
      ];


    try {

      await copiarTexto(
        text
      );


      mostrarRetroalimentacionTemporal(
        retroalimentacionConversacion,
        "Frase copiada."
      );

    } catch {

      mostrarRetroalimentacionTemporal(
        retroalimentacionConversacion,
        "No se pudo copiar."
      );

    }

  }
);


/* =========================================================
   COMPARTICIÓN DEL MENSAJE ACTUAL
   ========================================================= */

botonCompartirConversacion?.addEventListener(
  "click",
  () => {

    fijarSeleccionConversacion();


    const type =
      tipoConversacionMostrado;


    const collection =
      bibliotecaMensajes[type];


    const text =
      collection.messages[
        indicesConversacion[type]
      ];


    compartirTexto(
      text,
      retroalimentacionConversacion
    );

  }
);


/* =========================================================
   DESCARGA DEL MENSAJE ACTUAL COMO TARJETA VISUAL
   ========================================================= */

botonDescargarConversacion?.addEventListener(
  "click",
  () => {

    fijarSeleccionConversacion();


    const type =
      tipoConversacionMostrado;

    const collection =
      bibliotecaMensajes[type];

    const text =
      collection.messages[
        indicesConversacion[type]
      ];


    descargarFraseComoImagen(
      text,
      collection.label,
      retroalimentacionConversacion
    );

  }
);


/* =========================================================
   09. GESTIÓN DEL REENCUADRE DEL LENGUAJE
   ========================================================= */

const tarjetasReencuadre = [
  ...document.querySelectorAll(
    ".tarjeta-reencuadre"
  )
];


tarjetasReencuadre.forEach(
  (card) => {

    const label =
      card.querySelector(
        ".etiqueta-estado-reencuadre"
      );


    const hint =
      card.querySelector(
        ".accion-reencuadrar"
      );


    card.addEventListener(
      "click",
      () => {

        const flipped =
          card.classList.toggle(
            "estado-reencuadrado"
          );


        card.setAttribute(
          "aria-expanded",
          String(flipped)
        );


        /* CAMBIAR ETIQUETA */

        if (label) {

          label.textContent =
            flipped
              ? "PRUEBA CON"
              : "EN VEZ DE";

        }


        /* CAMBIAR INSTRUCCIÓN */

        if (hint) {

          hint.innerHTML =
            flipped

              ? 'Volver a la frase anterior <span aria-hidden="true">↩</span>'

              : 'Reencuadrar <span aria-hidden="true">↗</span>';

        }

      }
    );

  }
);


/* =========================================================
   09. GESTIÓN DEL GENERADOR DE MENSAJES PERSONALES
   ========================================================= */

const textoPalabras =
  document.getElementById(
    "textoMensajePalabras"
  );


const etiquetaPalabras =
  document.getElementById(
    "etiquetaMensajePalabras"
  );


const contadorPalabras =
  document.getElementById(
    "contadorMensajePalabras"
  );


const botonSiguientePalabras =
  document.getElementById(
    "botonSiguienteMensajePalabras"
  );


const botonCopiarPalabras =
  document.getElementById(
    "botonCopiarMensajePalabras"
  );


const botonCompartirPalabras =
  document.getElementById(
    "botonCompartirMensajePalabras"
  );


const botonDescargarPalabras =
  document.getElementById(
    "botonDescargarMensajePalabras"
  );


const retroalimentacionPalabras =
  document.getElementById(
    "retroalimentacionMensajePalabras"
  );


let indicePalabras =
  0;


function renderizarMensajePalabras() {

  const collection =
    bibliotecaMensajes.personal;


  if (
    !textoPalabras
    || !etiquetaPalabras
    || !contadorPalabras
  ) {

    return;

  }


  etiquetaPalabras.textContent =
    collection.label;


  contadorPalabras.textContent =
    `${formatearNumeroDosDigitos(indicePalabras + 1)} / ${formatearNumeroDosDigitos(collection.messages.length)}`;


  textoPalabras.textContent =
    collection.messages[
      indicePalabras
    ];


  textoPalabras.classList.remove(
    "estado-transicion"
  );


  void textoPalabras.offsetWidth;


  textoPalabras.classList.add(
    "estado-transicion"
  );

}


/* GENERACIÓN DE UNA NUEVA PROPUESTA */

botonSiguientePalabras?.addEventListener(
  "click",
  () => {

    indicePalabras =
      obtenerIndiceAleatorioDistinto(
        indicePalabras,
        bibliotecaMensajes.personal.messages.length
      );


    renderizarMensajePalabras();

  }
);


/* COPIAR */

botonCopiarPalabras?.addEventListener(
  "click",
  async () => {

    const text =
      bibliotecaMensajes.personal.messages[
        indicePalabras
      ];


    try {

      await copiarTexto(
        text
      );


      mostrarRetroalimentacionTemporal(
        retroalimentacionPalabras,
        "Frase copiada."
      );

    } catch {

      mostrarRetroalimentacionTemporal(
        retroalimentacionPalabras,
        "No se pudo copiar."
      );

    }

  }
);


/* COMPARTIR */

botonCompartirPalabras?.addEventListener(
  "click",
  () => {

    compartirTexto(
      bibliotecaMensajes.personal.messages[
        indicePalabras
      ],
      retroalimentacionPalabras
    );

  }
);


/* DESCARGAR COMO TARJETA VISUAL */

botonDescargarPalabras?.addEventListener(
  "click",
  () => {

    descargarFraseComoImagen(
      bibliotecaMensajes.personal.messages[
        indicePalabras
      ],
      bibliotecaMensajes.personal.label,
      retroalimentacionPalabras
    );

  }
);


/* =========================================================
   11. GESTIÓN DEL MURO DE MENSAJES DE APOYO
   ========================================================= */

const formularioMuroApoyo =
  document.getElementById(
    "formularioMuroApoyo"
  );


const campoMensajeApoyo =
  document.getElementById(
    "campoMensajeApoyo"
  );


const muroApoyo =
  document.getElementById(
    "muroApoyo"
  );


const contadorCaracteres =
  document.getElementById(
    "contadorCaracteres"
  );


const retroalimentacionMuro =
  document.getElementById(
    "retroalimentacionMuro"
  );


const CLAVE_ALMACENAMIENTO =
  "reframeHopeWallV5";


const notasIniciales = [

  {

    id:
      "starter-1",

    text:
      "No tienes que tenerlo todo resuelto para pedir apoyo."

  },

  {

    id:
      "starter-2",

    text:
      "Empezar a hablar también es avanzar."

  }

];


/* =========================================================
   LEER MENSAJES
   ========================================================= */

function obtenerNotasGuardadas() {

  try {

    const notes =
      JSON.parse(
        localStorage.getItem(
          CLAVE_ALMACENAMIENTO
        )
      );


    return Array.isArray(notes)
      ? notes
      : [];

  } catch {

    return [];

  }

}


/* =========================================================
   GUARDAR MENSAJES
   ========================================================= */

function guardarNotas(notes) {

  localStorage.setItem(
    CLAVE_ALMACENAMIENTO,
    JSON.stringify(notes)
  );

}


/* =========================================================
   ELIMINAR MENSAJE
   ========================================================= */

function eliminarNota(id) {

  const notes =
    obtenerNotasGuardadas().filter(
      (note) =>
        note.id !== id
    );


  guardarNotas(
    notes
  );


  renderizarMuroApoyo();


  mostrarRetroalimentacionTemporal(
    retroalimentacionMuro,
    "Mensaje eliminado."
  );

}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function crearElementoNota(
  note,
  saved = false
) {

  const article =
    document.createElement(
      "article"
    );


  article.className =
    "hope-note";


  const text =
    document.createElement(
      "p"
    );


  text.textContent =
    note.text;


  article.appendChild(
    text
  );


  const footer =
    document.createElement(
      "div"
    );


  footer.className =
    "note-footer";


  const source =
    document.createElement(
      "span"
    );


  source.textContent =
    saved
      ? "Guardado aquí"
      : "RE:FRAME";


  footer.appendChild(
    source
  );


  if (saved) {

    const deleteButton =
      document.createElement(
        "button"
      );


    deleteButton.type =
      "button";


    deleteButton.className =
      "delete-note";


    deleteButton.textContent =
      "Eliminar";


    deleteButton.setAttribute(
      "aria-label",
      "Eliminar este mensaje"
    );


    deleteButton.addEventListener(
      "click",
      () => {

        eliminarNota(
          note.id
        );

      }
    );


    footer.appendChild(
      deleteButton
    );

  }


  article.appendChild(
    footer
  );


  return article;

}


/* =========================================================
   RENDERIZAR MURO
   ========================================================= */

function renderizarMuroApoyo() {

  if (!muroApoyo) {
    return;
  }


  muroApoyo.innerHTML =
    "";


  notasIniciales.forEach(
    (note) => {

      muroApoyo.appendChild(
        crearElementoNota(
          note,
          false
        )
      );

    }
  );


  obtenerNotasGuardadas().forEach(
    (note) => {

      muroApoyo.appendChild(
        crearElementoNota(
          note,
          true
        )
      );

    }
  );

}


/* =========================================================
   CONTADOR DE CARACTERES
   ========================================================= */

campoMensajeApoyo?.addEventListener(
  "input",
  () => {

    if (contadorCaracteres) {

      contadorCaracteres.textContent =
        `${campoMensajeApoyo.value.length} / 140`;

    }

  }
);


/* =========================================================
   AÑADIR MENSAJE
   ========================================================= */

formularioMuroApoyo?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const text =
      campoMensajeApoyo.value.trim();


    if (
      text.length < 4
    ) {

      mostrarRetroalimentacionTemporal(
        retroalimentacionMuro,
        "Escribe un mensaje un poco más completo."
      );

      return;

    }


    const notes =
      obtenerNotasGuardadas();


    notes.unshift({

      id:
        `${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`,

      text:
        text

    });


    guardarNotas(
      notes.slice(
        0,
        12
      )
    );


    formularioMuroApoyo.reset();


    if (contadorCaracteres) {

      contadorCaracteres.textContent =
        "0 / 140";

    }


    renderizarMuroApoyo();


    mostrarRetroalimentacionTemporal(
      retroalimentacionMuro,
      "Mensaje guardado en este navegador."
    );

  }
);


/* =========================================================
   11. FONDO ANIMADO HOME
   ========================================================= */

const canvas =
  document.getElementById(
    "lienzoRedVisual"
  );


const reduceMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


let ctx =
  null;

let width =
  0;

let height =
  0;

let points =
  [];

let animationFrame =
  null;


const pointer = {

  x:
    null,

  y:
    null

};


/* =========================================================
   REDIMENSIONAR CANVAS
   ========================================================= */

function ajustarLienzoRed() {

  if (
    !canvas
    || !ctx
    || canvas.offsetParent === null
  ) {

    return;

  }


  const rect =
    canvas.getBoundingClientRect();


  if (
    !rect.width
    || !rect.height
  ) {

    return;

  }


  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  width =
    rect.width;

  height =
    rect.height;


  canvas.width =
    Math.floor(
      width * dpr
    );


  canvas.height =
    Math.floor(
      height * dpr
    );


  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  const count =
    Math.max(
      28,
      Math.min(
        72,
        Math.floor(
          width / 22
        )
      )
    );


  points =
    Array.from(
      {
        length: count
      },
      () => ({

        x:
          Math.random()
          * width,

        y:
          Math.random()
          * height,

        vx:
          (
            Math.random()
            - 0.5
          )
          * 0.18,

        vy:
          (
            Math.random()
            - 0.5
          )
          * 0.18,

        radius:
          Math.random()
          * 1.5
          + 0.7

      })
    );

}


/* =========================================================
   ACTUALIZAR NODOS
   ========================================================= */

function actualizarPuntosRed() {

  points.forEach(
    (point) => {

      point.x +=
        point.vx;

      point.y +=
        point.vy;


      if (
        point.x < 0
        || point.x > width
      ) {

        point.vx *=
          -1;

      }


      if (
        point.y < 0
        || point.y > height
      ) {

        point.vy *=
          -1;

      }


      if (
        pointer.x !== null
      ) {

        const dx =
          point.x
          - pointer.x;


        const dy =
          point.y
          - pointer.y;


        const distance =
          Math.hypot(
            dx,
            dy
          );


        if (
          distance < 130
          && distance > 0
        ) {

          point.x +=
            (
              dx
              / distance
            )
            * 0.16;


          point.y +=
            (
              dy
              / distance
            )
            * 0.16;

        }

      }

    }
  );

}


/* =========================================================
   DIBUJAR RED
   ========================================================= */

function dibujarRedVisual() {

  if (!ctx) {
    return;
  }


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  for (
    let i = 0;
    i < points.length;
    i += 1
  ) {

    for (
      let j = i + 1;
      j < points.length;
      j += 1
    ) {

      const a =
        points[i];

      const b =
        points[j];


      const distance =
        Math.hypot(
          a.x - b.x,
          a.y - b.y
        );


      if (
        distance < 155
      ) {

        const alpha =
          0.16
          * (
            1
            - distance / 155
          );


        ctx.beginPath();


        ctx.moveTo(
          a.x,
          a.y
        );


        ctx.lineTo(
          b.x,
          b.y
        );


        ctx.strokeStyle =
          `rgba(36, 214, 209, ${alpha})`;


        ctx.lineWidth =
          1;


        ctx.stroke();

      }

    }

  }


  points.forEach(
    (point, index) => {

      ctx.beginPath();


      ctx.arc(
        point.x,
        point.y,
        point.radius,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        index % 5 === 0

          ? "rgba(36, 214, 209, 0.78)"

          : "rgba(247, 250, 252, 0.5)";


      ctx.fill();

    }
  );

}


/* =========================================================
   ANIMACIÓN
   ========================================================= */

function animarRedVisual() {

  if (
    !canvas
    || canvas.offsetParent === null
  ) {

    animationFrame =
      null;

    return;

  }


  actualizarPuntosRed();

  dibujarRedVisual();


  animationFrame =
    requestAnimationFrame(
      animarRedVisual
    );

}


/* =========================================================
   INICIAR RED
   ========================================================= */

function iniciarRedVisual() {

  if (
    !canvas
    || reduceMotion
  ) {

    return;

  }


  if (!ctx) {

    ctx =
      canvas.getContext(
        "2d"
      );

  }


  ajustarLienzoRed();


  if (!animationFrame) {

    animationFrame =
      requestAnimationFrame(
        animarRedVisual
      );

  }

}


/* =========================================================
   EVENTOS DEL CANVAS
   ========================================================= */

if (
  canvas
  && !reduceMotion
) {

  ctx =
    canvas.getContext(
      "2d"
    );


  window.addEventListener(
    "resize",
    ajustarLienzoRed
  );


  canvas.parentElement
    ?.addEventListener(
      "pointermove",
      (event) => {

        const rect =
          canvas.getBoundingClientRect();


        pointer.x =
          event.clientX
          - rect.left;


        pointer.y =
          event.clientY
          - rect.top;

      }
    );


  canvas.parentElement
    ?.addEventListener(
      "pointerleave",
      () => {

        pointer.x =
          null;

        pointer.y =
          null;

      }
    );

}


/* =========================================================
   12. INICIALIZACIÓN
   ========================================================= */

renderizarMensajeConversacion(
  "inicio"
);

renderizarMensajePalabras();

renderizarMuroApoyo();

mostrarVista(
  obtenerVistaDesdeHash(),
  false
);

iniciarRedVisual();