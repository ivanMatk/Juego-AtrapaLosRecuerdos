/* ===========================================================
   ATRAPÁ LOS RECUERDOS · Capitán Sarmiento, provincia de Buenos Aires
   Juego de reflejos: tocá los lugares del pueblo, esquivá lo que no es de acá.
   =========================================================== */

const TOTAL_TIME = 60;      // segundos de la partida
const START_LIVES = 3;      // vidas
const GOLD_BONUS_TIME = 3;  // segundos extra al atrapar un objeto dorado

/* ---------- Dibujos de respaldo (ilustraciones simbólicas en SVG) ----------
   Si no hay una foto en la carpeta "imagenes", el juego usa estos dibujos. */
const wrapIcon = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><clipPath id="c"><circle cx="50" cy="50" r="44"/></clipPath></defs>` +
  `<circle cx="50" cy="50" r="47" fill="#f6ecd6" stroke="#5E1220" stroke-width="6"/><g clip-path="url(#c)">${inner}</g></svg>`;

/* ===========================================================
   LUGARES DEL PUEBLO (hay que tocarlos)
   Para cada uno:  id        → nombre de la foto: imagenes/<id>.jpg (o .png, .jpeg, .webp)
                   name      → título
                   tagline   → frase corta
                   story     → historia que se muestra en grande
                   source    → fuentes consultadas
   =========================================================== */
const GOOD = [
  {
    id: "museo", name: "El Museo Histórico",
    tagline: "Fotos, mapas y objetos que cuentan cómo era el pueblo.",
    story: "El Museo y Archivo Histórico Municipal guarda la memoria de Capitán Sarmiento: fotografías, mapas, diarios y documentos que muestran cómo nació y creció el pueblo. También conserva elementos del ferrocarril y objetos de oficios tradicionales, como radios, vitrolas y cámaras fotográficas, y tiene una sala dedicada a la Bandera Bonaerense. Funciona en el edificio de la antigua estación, que se habilitó en 1882 y dejó de funcionar como estación en 1992. Fue restaurado y reinaugurado en octubre de 2005 como Museo Centro Cultural y Casa de la Cultura.",
    source: "Instituto Cultural de la Provincia de Buenos Aires (ficha del museo); elDiarioAR; El Cronista; Hispanopedia.",
    svg: `<rect x="22" y="38" width="56" height="36" rx="7" fill="#4a4f58"/><rect x="34" y="30" width="18" height="10" rx="3" fill="#4a4f58"/><rect x="60" y="32" width="12" height="7" rx="2" fill="#c9c9c9"/><rect x="22" y="48" width="56" height="8" fill="#8b6b43" opacity=".9"/><circle cx="50" cy="56" r="15" fill="#c9c9c9"/><circle cx="50" cy="56" r="11" fill="#4a1220"/><circle cx="46" cy="52" r="3.5" fill="#6fb1e0" opacity=".8"/><circle cx="29" cy="45" r="2.4" fill="#f0c978"/>`
  },
  {
    id: "plaza", name: "La Plaza San Martín",
    tagline: "El gran espacio verde del pueblo, a tres cuadras de la estación.",
    story: "La plaza San Martín está a tres cuadras de la estación, entre las avenidas Roque Sáenz Peña y Bartolomé Mitre. Es el espacio público más importante de la ciudad y el lugar de encuentro de los vecinos. Su construcción comenzó en la primera mitad del siglo XX.",
    source: "“Capitán Sarmiento: Reflexiones y datos para una estrategia de desarrollo” (UNLP).",
    svg: `<rect x="0" y="76" width="100" height="24" fill="#7fae66"/><circle cx="22" cy="44" r="16" fill="#3f8a4f"/><rect x="19" y="52" width="6" height="26" fill="#6b4a2a"/><circle cx="80" cy="48" r="13" fill="#4aa05c"/><rect x="77.5" y="54" width="5" height="24" fill="#6b4a2a"/><rect x="38" y="72" width="24" height="6" fill="#cfc7b4"/><rect x="41" y="60" width="18" height="13" fill="#e2dccb"/><path d="M44 60L45.5 42Q50 37 54.5 42L56 60Z" fill="#b9a37c"/><circle cx="50" cy="35" r="5.5" fill="#b9a37c"/><path d="M12 78H34M66 78H90" stroke="#8b6b43" stroke-width="3"/>`
  },
  {
    id: "balneario", name: "El Balneario",
    tagline: "Lago, piletas y camping para pasar el día.",
    story: "El Balneario Municipal está a unos 5 km del centro, sobre la Ruta 8. Es un parque natural a orillas de un lago, con piletas de agua fría y caliente, camping con cabañas y actividades como kayak, tirolesa y pesca. Es uno de los paseos preferidos de vecinos y visitantes.",
    source: "El Cronista; Hispanopedia, Partido de Capitán Sarmiento.",
    svg: `<path d="M18 46Q50 12 82 46Z" fill="#e0ad4e"/><path d="M50 46Q34 24 26 36 38 46 50 46Z" fill="#c0504d"/><path d="M50 46Q66 24 74 36 62 46 50 46Z" fill="#c0504d"/><rect x="48.5" y="30" width="3" height="46" fill="#8b6b43"/><path d="M14 72Q22 66 30 72T46 72T62 72T78 72T90 72V90H14Z" fill="#6fb1e0"/><path d="M14 80Q22 75 30 80T46 80T62 80T78 80" stroke="#cfe9f5" stroke-width="2" fill="none"/>`
  },
  {
    id: "hospital", name: "El Hospital",
    tagline: "Nació en 1915 como la Casa de los Enfermos San Carlos.",
    story: "La historia del hospital empezó el 23 de marzo de 1915, cuando se fundó la Casa de los Enfermos San Carlos. En 1923 ya funcionaba como Hospital San Carlos, aunque en un local que no era propio, y hacia fines de la década de 1930 se inauguró su nuevo edificio. Ese edificio fue fundado por la Conferencia de Señoras de la Sociedad San Vicente de Paul y en 2012, por la Ley 14.416, pasó de forma definitiva al municipio. Hoy el hospital se llama San Carlos de Borromeo.",
    source: "“Capitán Sarmiento: Reflexiones y datos para una estrategia de desarrollo” (UNLP); Cámara de Diputados de la Provincia de Buenos Aires (proyecto de declaración por el aniversario de la ciudad).",
    svg: `<rect x="40" y="16" width="20" height="22" rx="3" fill="#fffdf4" stroke="#d4c6a7" stroke-width="1.5"/><rect x="47" y="20" width="6" height="14" fill="#c0504d"/><rect x="43" y="24" width="14" height="6" fill="#c0504d"/><rect x="20" y="40" width="60" height="38" fill="#fffdf4" stroke="#d4c6a7" stroke-width="1.5"/><rect x="20" y="38" width="60" height="6" fill="#c0504d"/><g fill="#6fb1e0"><rect x="26" y="50" width="10" height="9" rx="1"/><rect x="64" y="50" width="10" height="9" rx="1"/><rect x="26" y="64" width="10" height="9" rx="1"/><rect x="64" y="64" width="10" height="9" rx="1"/></g><rect x="43" y="56" width="14" height="22" fill="#6fb1e0"/><path d="M50 56V78" stroke="#fffdf4" stroke-width="1.5"/>`
  },
  {
    id: "bandera", name: "La Bandera Bonaerense",
    tagline: "Cinco alumnos del pueblo diseñaron la bandera de la provincia.",
    story: "El 12 de agosto de 1997 se hizo el escrutinio final del concurso escolar “Buscando la bandera bonaerense”, en el que votaron casi dos millones de jóvenes y sus familias. Ganó el diseño de cinco alumnos de las escuelas de educación media N.º 1 “Mateo Jelicich” y N.º 2 “Domingo Faustino Sarmiento”, de Capitán Sarmiento. La jura de lealtad se hizo el 28 de septiembre de 1997 en Luján y la ciudad fue declarada “Cuna de la Bandera Bonaerense”. Después la Ley 11.997 adoptó esa bandera y la Ley 14.290 dispuso levantar en el pueblo un monumento en su honor.",
    source: "Gobierno de la Provincia de Buenos Aires; Sistema de Información Normativa (Ley 11.997, Ley 14.290, Decreto 2979/1997); Cámara de Diputados bonaerense; Hispanopedia.",
    svg: `<rect x="28" y="20" width="4" height="62" rx="2" fill="#8b6b43"/><circle cx="30" cy="19" r="3.5" fill="#e0b455"/><path d="M32 24Q46 18 58 24T84 24V56Q72 62 58 56T32 56Z" fill="#fffdf4" stroke="#d4c6a7" stroke-width="1.5"/><path d="M32 24Q46 18 58 24T84 24V35Q72 41 58 35T32 35Z" fill="#6fb1e0"/><path d="M32 45Q46 39 58 45T84 45V56Q72 62 58 56T32 56Z" fill="#6fb1e0"/><circle cx="58" cy="40" r="5.5" fill="#f0b93a"/>`
  },
  {
    id: "palacio", name: "El Palacio de La Elisa",
    tagline: "Una de las estancias históricas del pueblo.",
    story: "La estancia La Elisa es una de las estancias históricas del partido de Capitán Sarmiento y figura entre sus establecimientos más destacados. Su casco principal es conocido como “el palacio”. En 2018 abrió sus puertas para recibir un almuerzo de la peregrinación latinoamericana de enfermos al Santuario de Luján.",
    source: "Historia local de Capitán Sarmiento (capitansarmiento.wordpress.com); Orden de Malta Argentina (nota de septiembre de 2018).",
    svg: `<rect x="0" y="78" width="100" height="22" fill="#7fae66"/><rect x="18" y="48" width="64" height="30" fill="#efe5cf" stroke="#d4c6a7" stroke-width="1.5"/><path d="M13 48L29 34H71L87 48Z" fill="#5d6b7a"/><rect x="40" y="26" width="20" height="24" fill="#efe5cf" stroke="#d4c6a7" stroke-width="1.5"/><path d="M36 27L50 14 64 27Z" fill="#5d6b7a"/><rect x="49" y="7" width="2" height="9" fill="#4d392b"/><path d="M46 42V36Q50 31 54 36V42Z" fill="#35485a"/><g fill="#35485a"><rect x="24" y="55" width="7" height="12" rx="3"/><rect x="34" y="55" width="7" height="12" rx="3"/><rect x="59" y="55" width="7" height="12" rx="3"/><rect x="69" y="55" width="7" height="12" rx="3"/></g><rect x="44" y="60" width="12" height="18" rx="5" fill="#664b36"/><g fill="#3f8a4f"><circle cx="8" cy="72" r="9"/><circle cx="93" cy="72" r="9"/></g>`
  },
  {
    id: "cine", name: "El Cine Ítalo Argentino",
    tagline: "La sala de la Sociedad Italiana de Socorros Mutuos.",
    story: "El 20 de septiembre de 1889, Pedro Diale y quince compatriotas fundaron la Sociedad Italiana de Socorros Mutuos “Roma Intangibile”, la mutual más antigua del pueblo, para ayudarse entre sí y aliviar la nostalgia de su tierra. En 1924 empezaron a reunir fondos para construir un gran teatro, y el 3 de abril de 1929 se inauguró el Cine Teatro Ítalo Argentino. Su nombre se eligió por aclamación en la asamblea de inauguración y une las dos tierras de sus socios. Tiene 500 butacas y durante décadas fue el corazón de la vida cultural del pueblo, con cine, teatro y bailes. Más de 135 años después, sigue abierto a toda la comunidad.",
    source: "Historia y fotografía: sitio oficial del Cine Teatro Ítalo Argentino (cineitalocapitansarmiento.com).",
    svg: `<rect x="0" y="78" width="100" height="22" fill="#8a7a62"/><rect x="20" y="44" width="60" height="34" fill="#c98c5b"/><rect x="14" y="38" width="72" height="9" fill="#8c3b3b"/><rect x="24" y="22" width="52" height="16" rx="3" fill="#4a1220"/><g fill="#f0c978"><circle cx="30" cy="30" r="1.8"/><circle cx="38" cy="30" r="1.8"/><circle cx="46" cy="30" r="1.8"/><circle cx="54" cy="30" r="1.8"/><circle cx="62" cy="30" r="1.8"/><circle cx="70" cy="30" r="1.8"/></g><rect x="26" y="52" width="12" height="16" fill="#f4f1e6"/><rect x="62" y="52" width="12" height="16" fill="#f4f1e6"/><rect x="43" y="56" width="14" height="22" fill="#4d392b"/><rect x="28" y="54" width="8" height="12" fill="#6fb1e0"/><rect x="64" y="54" width="8" height="12" fill="#c0504d"/><rect x="26" y="10" width="2" height="14" fill="#8b6b43"/><rect x="28" y="10" width="4" height="8" fill="#2e8b57"/><rect x="32" y="10" width="4" height="8" fill="#fff"/><rect x="36" y="10" width="4" height="8" fill="#c0504d"/><rect x="72" y="10" width="2" height="14" fill="#8b6b43"/><rect x="74" y="10" width="12" height="3" fill="#6fb1e0"/><rect x="74" y="13" width="12" height="3" fill="#fffdf4"/><rect x="74" y="16" width="12" height="3" fill="#6fb1e0"/>`
  },
  {
    id: "municipalidad", name: "La Municipalidad",
    tagline: "El gobierno del pueblo, frente a la capilla del Pilar.",
    story: "Antes de ser municipio, Capitán Sarmiento tuvo una delegación municipal. En 1898 se designó al primer delegado, Froilán Rodríguez, que ocupó el cargo hasta 1915: trazó el plano del pueblo, hizo la primera plaza frente a la iglesia San Carlos Borromeo e instaló el primer alumbrado a gas. El primer local municipal funcionó en “La Franco Argentina”, sobre la avenida Cincuentenario. En 1961 el pueblo se convirtió en partido autónomo, con tierras que antes pertenecían a Bartolomé Mitre (hoy Arrecifes), y pasó a tener su propio gobierno. Hoy el Palacio Municipal está frente a la capilla Nuestra Señora del Pilar, inaugurada en 1900.",
    source: "“Capitán Sarmiento: Reflexiones y datos para una estrategia de desarrollo” (UNLP); Cámara de Diputados bonaerense; Hispanopedia; Argentina Turismo; El Cronista.",
    svg: `<rect x="0" y="80" width="100" height="20" fill="#8d7e66"/><rect x="16" y="54" width="68" height="26" fill="#d9c9a6" stroke="#b9a37c" stroke-width="1.5"/><rect x="16" y="50" width="68" height="6" fill="#a77f55"/><path d="M32 50L50 38 68 50Z" fill="#efe5cf" stroke="#b9a37c" stroke-width="1.5"/><g fill="#efe5cf" stroke="#b9a37c" stroke-width="1"><rect x="35" y="55" width="4" height="25"/><rect x="43" y="55" width="4" height="25"/><rect x="53" y="55" width="4" height="25"/><rect x="61" y="55" width="4" height="25"/></g><rect x="40" y="22" width="20" height="18" fill="#d9c9a6" stroke="#b9a37c" stroke-width="1.5"/><circle cx="50" cy="31" r="5.5" fill="#fff" stroke="#4d392b" stroke-width="1.5"/><path d="M50 31V27M50 31L53 33" stroke="#4d392b" stroke-width="1.3"/><path d="M38 23L50 14 62 23Z" fill="#8c5d3c"/><rect x="49.3" y="3" width="1.5" height="12" fill="#8b6b43"/><rect x="50.8" y="3" width="12" height="3" fill="#6fb1e0"/><rect x="50.8" y="6" width="12" height="3" fill="#fffdf4"/><rect x="50.8" y="9" width="12" height="3" fill="#6fb1e0"/><g fill="#35485a"><rect x="20" y="62" width="7" height="12" rx="3"/><rect x="73" y="62" width="7" height="12" rx="3"/></g>`
  }
];

/* Cosas que NO son del pueblo (hay que esquivarlas). */
const BAD = [
  { id: "cohete", name: "Cohete",
    svg: `<path d="M50 14Q66 30 64 56H36Q34 30 50 14Z" fill="#f4f1e6" stroke="#c9c2b0" stroke-width="2"/><path d="M50 14Q58 22 61 32H39Q42 22 50 14Z" fill="#c0504d"/><circle cx="50" cy="42" r="6" fill="#6fb1e0" stroke="#4a6a85" stroke-width="2"/><path d="M36 50L26 66 36 62Z" fill="#c0504d"/><path d="M64 50L74 66 64 62Z" fill="#c0504d"/><path d="M42 56Q50 80 58 56Z" fill="#f0b93a"/><path d="M46 56Q50 70 54 56Z" fill="#e8663a"/>` },
  { id: "pinguino", name: "Pingüino",
    svg: `<ellipse cx="50" cy="52" rx="20" ry="28" fill="#20262e"/><ellipse cx="50" cy="58" rx="13" ry="20" fill="#f4f1e6"/><circle cx="43" cy="36" r="3" fill="#fff"/><circle cx="57" cy="36" r="3" fill="#fff"/><circle cx="43" cy="36" r="1.4" fill="#000"/><circle cx="57" cy="36" r="1.4" fill="#000"/><path d="M45 42L55 42 50 49Z" fill="#f0a030"/><path d="M30 48Q22 58 26 68Q32 60 33 52Z" fill="#20262e"/><path d="M70 48Q78 58 74 68Q68 60 67 52Z" fill="#20262e"/><ellipse cx="42" cy="80" rx="8" ry="3.5" fill="#f0a030"/><ellipse cx="58" cy="80" rx="8" ry="3.5" fill="#f0a030"/>` },
  { id: "submarino", name: "Submarino",
    svg: `<ellipse cx="50" cy="58" rx="34" ry="15" fill="#f0c43a" stroke="#b8901d" stroke-width="2"/><rect x="44" y="34" width="14" height="16" rx="4" fill="#f0c43a" stroke="#b8901d" stroke-width="2"/><rect x="52" y="24" width="4" height="12" fill="#b8901d"/><rect x="52" y="24" width="14" height="5" rx="2" fill="#b8901d"/><circle cx="36" cy="58" r="4.5" fill="#6fb1e0" stroke="#7a5f10" stroke-width="1.5"/><circle cx="50" cy="58" r="4.5" fill="#6fb1e0" stroke="#7a5f10" stroke-width="1.5"/><circle cx="64" cy="58" r="4.5" fill="#6fb1e0" stroke="#7a5f10" stroke-width="1.5"/><path d="M16 52L8 46 8 70 16 64Z" fill="#b8901d"/><path d="M12 80Q22 74 32 80T52 80T72 80T92 80" stroke="#6fb1e0" stroke-width="3" fill="none"/>` },
  { id: "piramide", name: "Pirámide",
    svg: `<path d="M50 24L84 72H16Z" fill="#e0b46a"/><path d="M50 24L84 72H58Z" fill="#c4954a"/><path d="M28 56H72M36 44H64" stroke="#b0823d" stroke-width="2" opacity=".6"/><circle cx="76" cy="26" r="8" fill="#f5dca3"/><path d="M10 76Q30 70 50 76T90 76V90H10Z" fill="#e8c88c"/>` },
  { id: "palmera", name: "Palmera",
    svg: `<path d="M50 78Q46 56 52 34" stroke="#8b6b43" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M52 34Q36 22 22 32Q38 28 52 34Z" fill="#3f8a4f"/><path d="M52 34Q68 22 82 32Q66 28 52 34Z" fill="#3f8a4f"/><path d="M52 34Q44 16 30 14Q44 20 52 34Z" fill="#4aa05c"/><path d="M52 34Q60 16 74 14Q60 20 52 34Z" fill="#4aa05c"/><path d="M52 34Q52 18 52 12Q56 22 52 34Z" fill="#3f8a4f"/><circle cx="49" cy="38" r="3.5" fill="#6b4a2a"/><circle cx="56" cy="38" r="3.5" fill="#6b4a2a"/><path d="M24 78Q50 66 76 78V90H24Z" fill="#e8c88c"/>` },
  { id: "ovni", name: "OVNI",
    svg: `<path d="M36 46Q50 22 64 46Z" fill="#9bd8e8" stroke="#6fb1e0" stroke-width="2"/><ellipse cx="50" cy="52" rx="32" ry="10" fill="#8a94a3" stroke="#5f6a79" stroke-width="2"/><circle cx="32" cy="52" r="2.8" fill="#f0c43a"/><circle cx="50" cy="55" r="2.8" fill="#f0c43a"/><circle cx="68" cy="52" r="2.8" fill="#f0c43a"/><path d="M40 62L32 80M60 62L68 80M50 63V80" stroke="#f0c43a" stroke-width="3" opacity=".5" stroke-linecap="round"/>` },
  { id: "obelisco", name: "Obelisco", near: true, where: "El Obelisco está en la Ciudad de Buenos Aires.",
    svg: `<rect x="14" y="84" width="72" height="8" fill="#9aa3b0"/><path d="M43 82L46 26H54L57 82Z" fill="#e6e1d3"/><path d="M50 26H54L57 82H50Z" fill="#cfc9b8"/><path d="M46 26L50 10 54 26Z" fill="#d8d2c0"/><rect x="38" y="80" width="24" height="5" fill="#bdb6a3"/><rect x="48.5" y="40" width="3" height="5" fill="#8d94a3"/><rect x="48.5" y="54" width="3" height="5" fill="#8d94a3"/>` },
  { id: "casarosada", name: "Casa Rosada", near: true, where: "La Casa Rosada está en la Ciudad de Buenos Aires.",
    svg: `<rect x="10" y="80" width="80" height="14" fill="#9aa3b0"/><rect x="14" y="48" width="72" height="32" fill="#f2b8c6"/><rect x="12" y="44" width="76" height="6" fill="#d98aa0"/><rect x="38" y="36" width="24" height="44" fill="#f6c9d4"/><path d="M36 38L50 26 64 38Z" fill="#e6a0b2"/><g fill="#fffdf4"><rect x="19" y="56" width="8" height="12" rx="3"/><rect x="31" y="56" width="5" height="12" rx="2"/><rect x="64" y="56" width="5" height="12" rx="2"/><rect x="73" y="56" width="8" height="12" rx="3"/><rect x="44" y="56" width="12" height="24" rx="5"/></g><rect x="49.3" y="14" width="1.5" height="14" fill="#8b6b43"/><path d="M50.8 14H60V22H50.8Z" fill="#6fb1e0"/>` },
  { id: "cataratas", name: "Cataratas", near: true, where: "Las Cataratas del Iguazú están en Misiones.",
    svg: `<path d="M8 36H92V50Q70 44 50 50T8 50Z" fill="#4f8a55"/><g fill="#f4fbff"><rect x="14" y="46" width="14" height="34" rx="3"/><rect x="34" y="46" width="16" height="38" rx="3"/><rect x="56" y="46" width="14" height="34" rx="3"/><rect x="76" y="46" width="12" height="30" rx="3"/></g><path d="M8 78Q30 70 50 78T92 78V94H8Z" fill="#6fb1e0"/><g fill="#fff" opacity=".75"><circle cx="24" cy="78" r="9"/><circle cx="46" cy="82" r="11"/><circle cx="68" cy="78" r="9"/></g>` },
  { id: "glaciar", name: "Glaciar", near: true, where: "El Glaciar Perito Moreno está en Santa Cruz.",
    svg: `<path d="M8 78L22 42 34 56 50 26 64 50 76 36 92 78Z" fill="#e3f4fb"/><path d="M50 26L64 50 76 36 92 78H58Z" fill="#a9d6ea"/><path d="M22 42L34 56 28 78H8Z" fill="#c4e6f4"/><path d="M8 78H92V94H8Z" fill="#3f8ab3"/><path d="M14 84Q30 80 46 84T80 84" stroke="#9fd0e6" stroke-width="2" fill="none"/>` },
  { id: "eiffel", name: "Torre Eiffel", near: true, where: "La Torre Eiffel está en París, Francia.",
    svg: `<path d="M50 10L56 44 66 86H58L50 56 42 86H34L44 44Z" fill="#7a6a58"/><path d="M44 44H56M41 60H59" stroke="#5d4f40" stroke-width="3"/><path d="M40 86Q50 62 60 86" stroke="#7a6a58" stroke-width="3" fill="none"/><rect x="47" y="6" width="6" height="6" fill="#7a6a58"/>` }

];

const toUri = (def) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(wrapIcon(def.svg));
[...GOOD, ...BAD].forEach(def => { def.uri = toUri(def); def.img = new Image(); def.photo = null; });
const imagesReady = Promise.all([...GOOD, ...BAD].map(def => new Promise(res => {
  def.img.onload = def.img.onerror = res; def.img.src = def.uri;
})));

/* Busca la foto de cada lugar en imagenes/<id>.<extensión>. Si no existe, queda el dibujo.
   Para algunos lugares hay además fotos de respaldo en internet (se usan solo si no hay foto propia en la carpeta). */
const PHOTO_EXT = ["jfif", "jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "JFIF", "jfifa"];
/* Nombres de archivo que se buscan para cada lugar (en la carpeta imagenes). Si no hay lista, se usa el id. */
const PHOTO_NAMES = {
  museo: ["museo"], plaza: ["sbnMartin", "sanMartin", "plaza"], balneario: ["balneario"], hospital: ["hospital"],
  bandera: ["bonaerense", "bandera"], palacio: ["elisa", "palacio"], cine: ["cine"], municipalidad: ["municipalidad"]
};
const photoNames = (def) => PHOTO_NAMES[def.id] || [def.id];
const CINE_WEB = "https://www.cineitalocapitansarmiento.com/";
const PHOTO_REMOTE = { cine: [CINE_WEB + "assets/exterior1.jpg", CINE_WEB + "assets/fachada.jpg", CINE_WEB + "documentos/fachada_antigua.jpg"] };
function findPhoto(def) {
  return new Promise(resolve => {
    const urls = photoNames(def).flatMap(n => PHOTO_EXT.map(e => `imagenes/${n}.${e}`)).concat(PHOTO_REMOTE[def.id] || []);
    let i = 0;
    const next = () => {
      if (i >= urls.length) return resolve(null);
      const url = urls[i++], im = new Image();
      im.onload = () => { def.photo = url; def.photoImg = im; def.token = null; resolve(url); };
      im.onerror = next;
      im.src = url;
    };
    next();
  });
}
/* Ficha redonda con la foto del lugar (recortada al centro), igual que los dibujos pero con la imagen real. */
function tokenFor(def) {
  if (!def.photoImg || !def.photoImg.naturalWidth) return def.img;
  if (!def.token) {
    const S = 256, c = document.createElement("canvas"); c.width = c.height = S; const x = c.getContext("2d");
    x.fillStyle = "#F6ECD6"; x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 4, 0, 7); x.fill();
    x.save(); x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 11, 0, 7); x.clip();
    const im = def.photoImg, side = S - 22, sc = Math.max(side / im.naturalWidth, side / im.naturalHeight), dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    x.drawImage(im, (S - dw) / 2, (S - dh) / 2, dw, dh); x.restore();
    x.lineWidth = 10; x.strokeStyle = "#5E1220"; x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 6, 0, 7); x.stroke();
    def.token = c;
  }
  return def.token;
}
const photosReady = Promise.all(GOOD.map(findPhoto));
/* Fondo de la pantalla de inicio: imagenes/sarmiento.jfif (o .jpg, .png...). Si no existe, se ve el fondo del juego. */
let startBg = null;
const startBgReady = new Promise(resolve => {
  const urls = ["sarmiento", "Sarmiento"].flatMap(n => PHOTO_EXT.map(e => `imagenes/${n}.${e}`));
  let i = 0;
  const next = () => {
    if (i >= urls.length) return resolve(null);
    const im = new Image();
    im.onload = () => { startBg = im; resolve(im); };
    im.onerror = next;
    im.src = urls[i++];
  };
  next();
});
function drawCover(im) {
  const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight), dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
  ctx.drawImage(im, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

/* ---------- Utilidades ---------- */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const stage = $("stage"), canvas = $("canvas"), ctx = canvas.getContext("2d");
let W = 0, H = 0, GY = 0, dpr = 1;
let bgDay = null, bgDusk = null;

/* ---------- Estado del juego ---------- */
let state = "idle"; // idle | countdown | play | story | over
let player = "Invitado";
let items = [], particles = [], floaters = [], clouds = [];
let score = 0, lives = START_LIVES, timeLeft = TOTAL_TIME, elapsed = 0;
let combo = 0, bestCombo = 0, caughtCount = 0, spawnTimer = 0, badStreak = 0, lastTick = 99;
let shake = 0, flash = 0, flashColor = "255,90,90";
let collected = new Set();
let train = { x: -999, active: false, wait: 7 };
let toastTimer = null, lastFrame = 0, storyFromAlbum = false;

/* ===========================================================
   AUDIO: efectos de sonido + música de fondo (se genera con código,
   no hace falta ningún archivo de audio)
   =========================================================== */
let musicOn = true, sfxOn = true;
const MUSIC_VOL = 1.7, MUSIC_LOW = .55, SFX_VOL = 3.2;   // volúmenes (antes casi no se escuchaba)
let ac = null, master = null, musicGain = null, sfxGain = null, noiseBuf = null;
let musicTimer = null, musicPlaying = false, mStep = 0, nextNote = 0;

function ensureAudio() {
  if (ac) { if (ac.state === "suspended") ac.resume(); return true; }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ac = new AC(); master = ac.createGain(); master.gain.value = 1;
    const lim = ac.createDynamicsCompressor();            // limitador: permite subir el volumen sin que distorsione
    lim.threshold.value = -10; lim.knee.value = 12; lim.ratio.value = 8; lim.attack.value = .003; lim.release.value = .2;
    master.connect(lim); lim.connect(ac.destination);
    musicGain = ac.createGain(); musicGain.gain.value = MUSIC_VOL; musicGain.connect(master);
    sfxGain = ac.createGain(); sfxGain.gain.value = SFX_VOL; sfxGain.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * .5, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  } catch (_) { return false; }
}
const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function tone(freq, dur = .1, type = "sine", vol = .07, slideTo = null, delay = 0) {
  if (!sfxOn || !ensureAudio()) return;
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + dur + .02);
}
const sfx = {
  click() { tone(520, .1, "triangle", .08); },
  good(c) { tone(520 + Math.min(c, 12) * 40, .12, "triangle", .08); tone(780 + Math.min(c, 12) * 50, .1, "sine", .04, null, .05); },
  gold() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, .16, "triangle", .06, null, i * .07)); },
  combo() { tone(660, .09, "square", .04); tone(990, .14, "square", .04, null, .08); },
  bad() { tone(200, .35, "sawtooth", .08, 60); tone(120, .3, "square", .05, 50, .05); },
  miss() { tone(300, .12, "sine", .03, 200); },
  story() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .2, "triangle", .07, null, i * .08)); },
  tick() { tone(1200, .05, "square", .03); },
  beep(n) { tone(440 + (3 - n) * 110, .14, "triangle", .08); },
  go() { tone(880, .25, "triangle", .09); tone(1320, .25, "triangle", .06, null, .08); },
  end(win) { (win ? [523, 659, 784, 1047, 784, 1047, 1319] : [392, 349, 311, 262]).forEach((f, i) => tone(f, .22, "triangle", .07, null, i * .14)); }
};

/* Música: 8 compases en bucle (do - sol - la menor - fa), alegre y con ritmo.
   Se acelera con el paso del tiempo y en los últimos segundos. */
const CHORD_ROOT = [48, 43, 45, 41];                        // bajo (Do, Sol, La, Fa)
const BASS_PAT = [0, null, 12, null, 7, null, 12, null];    // intervalos sobre la raíz
const MEL_A = [[76, 79, 76, 72, 76, 79, 84, 79], [74, 79, 74, 71, 74, 79, 83, 79], [76, 81, 76, 72, 76, 81, 84, 81], [77, 81, 77, 72, 77, 81, 84, 81]];
const MEL_B = [[84, null, 79, null, 76, 79, 84, null], [83, null, 79, null, 74, 79, 83, null], [81, null, 76, null, 72, 76, 81, null], [77, 81, 84, 81, 77, 81, 84, 89]];

function mNote(t, midi, dur, type, vol) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = midiHz(midi);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + dur + .02);
}
function mNoise(t, dur, vol, freq, kind) {
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuf; f.type = kind; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(musicGain); s.start(t); s.stop(t + dur + .02);
}
function mKick(t) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(45, t + .12);
  g.gain.setValueAtTime(.16, t); g.gain.exponentialRampToValueAtTime(.0001, t + .16);
  o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + .2);
}
function musicStep(s, t, sd) {
  const bar = Math.floor(s / 8) % 4, i = s % 8, sectionB = s >= 32;
  const b = BASS_PAT[i];
  if (b !== null) mNote(t, CHORD_ROOT[bar] + b, sd * .9, "square", .05);
  const m = (sectionB ? MEL_B : MEL_A)[bar][i];
  if (m !== null) mNote(t, m, sd * (sectionB ? 1.3 : .8), sectionB ? "triangle" : "square", sectionB ? .07 : .03);
  if (i % 4 === 0) mKick(t);
  if (i === 2 || i === 6) mNoise(t, .09, .08, 1800, "bandpass");
  mNoise(t, .035, i % 2 ? .05 : .025, 7000, "highpass");
}
function tempo() {
  const prog = clamp(elapsed / TOTAL_TIME, 0, 1);
  return 126 + 22 * prog + (state === "play" && timeLeft <= 10 ? 14 : 0);
}
function musicTick() {
  if (!ac || !musicPlaying) return;
  while (nextNote < ac.currentTime + .3) {
    const sd = 60 / tempo() / 2;
    musicStep(mStep, nextNote, sd); nextNote += sd; mStep = (mStep + 1) % 64;
  }
}
function startMusic() {
  if (!musicOn || !ensureAudio()) return;
  musicGain.gain.cancelScheduledValues(ac.currentTime); musicGain.gain.value = MUSIC_VOL;
  if (musicPlaying) return;
  musicPlaying = true; mStep = 0; nextNote = ac.currentTime + .08;
  musicTimer = setInterval(musicTick, 80);
}
function stopMusic() { musicPlaying = false; clearInterval(musicTimer); }
function duckMusic(low) { if (ac && musicGain) musicGain.gain.setTargetAtTime(low ? MUSIC_LOW : MUSIC_VOL, ac.currentTime, .08); }
/* Respaldo para iPhone/iPad: el modo silencio apaga el WebAudio; con un audio "mudo" en bucle el sonido pasa a la categoría de reproducción. */
let silentEl = null;
function unlockAudio() {
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (_) {}
  try {
    if (!silentEl) {
      const n = 8000, b = new Uint8Array(44 + n), v = new DataView(b.buffer), s = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
      s(0, "RIFF"); v.setUint32(4, 36 + n, true); s(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); s(36, "data"); v.setUint32(40, n, true);
      b.fill(128, 44);
      silentEl = new Audio(URL.createObjectURL(new Blob([b], { type: "audio/wav" }))); silentEl.loop = true;
    }
    silentEl.play().catch(() => {});
  } catch (_) {}
  if (ensureAudio() && ac.state === "suspended") ac.resume();
}
["pointerdown", "touchend", "keydown", "click"].forEach(ev => document.addEventListener(ev, unlockAudio, { passive: true }));
/* Si el navegador sigue bloqueando el sonido, se avisa en pantalla. */
function checkAudioBlocked() {
  setTimeout(() => {
    if ((musicOn || sfxOn) && (!ac || ac.state !== "running") && (state === "play" || state === "countdown"))
      showToast("Sonido", "Tu navegador bloqueó el sonido. Tocá la pantalla una vez para activarlo.", false);
  }, 900);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state === "play") { pauseGame(); return; }   // si cambiás de pestaña, el juego se pausa solo
  if (!ac) return; if (document.hidden) ac.suspend(); else if (state !== "paused") ac.resume();
});

/* ---------- Fondo del pueblo (se dibuja una vez por tamaño) ---------- */
function paintScene(c, w, h, p) {
  const s = clamp(h / 520, .55, 1.4);
  const g = c.createLinearGradient(0, 0, 0, GY);
  g.addColorStop(0, p.top); g.addColorStop(1, p.bottom);
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  const sx = w * .8, sy = h * p.sunY, sr = Math.min(w, h) * p.sunR;
  const sg = c.createRadialGradient(sx, sy, sr * .2, sx, sy, sr * 3.2);
  sg.addColorStop(0, p.glow); sg.addColorStop(1, "rgba(255,200,120,0)");
  c.fillStyle = sg; c.fillRect(0, 0, w, h);
  c.fillStyle = p.sun; c.beginPath(); c.arc(sx, sy, sr, 0, 7); c.fill();
  c.fillStyle = p.hill1; c.beginPath(); c.moveTo(0, GY);
  for (let x = 0; x <= w; x += 20) c.lineTo(x, GY - h * .17 - Math.sin(x / w * 6.3 + 1) * h * .035 - Math.sin(x / w * 15) * h * .01);
  c.lineTo(w, GY); c.fill();
  c.fillStyle = p.hill2; c.beginPath(); c.moveTo(0, GY);
  for (let x = 0; x <= w; x += 20) c.lineTo(x, GY - h * .085 - Math.sin(x / w * 5 + 3) * h * .028);
  c.lineTo(w, GY); c.fill();
  const house = (x, bw, bh, roof) => {
    c.fillStyle = p.building; c.fillRect(x, GY - bh, bw, bh);
    c.beginPath(); c.moveTo(x - 4 * s, GY - bh); c.lineTo(x + bw / 2, GY - bh - roof); c.lineTo(x + bw + 4 * s, GY - bh); c.fill();
    c.fillStyle = p.window;
    c.fillRect(x + bw * .2, GY - bh * .7, bw * .2, bh * .25); c.fillRect(x + bw * .6, GY - bh * .7, bw * .2, bh * .25);
  };
  const tree = (x, r) => { c.fillStyle = p.tree; c.beginPath(); c.arc(x, GY - r * 1.7, r, 0, 7); c.fill(); c.fillRect(x - r * .12, GY - r * 1.7, r * .24, r * 1.7); };
  const sx0 = w * .08, sw = 120 * s, sh = 38 * s;
  c.fillStyle = p.building; c.fillRect(sx0, GY - sh, sw, sh);
  c.beginPath(); c.moveTo(sx0 - 8 * s, GY - sh); c.lineTo(sx0 + sw / 2, GY - sh - 22 * s); c.lineTo(sx0 + sw + 8 * s, GY - sh); c.fill();
  c.fillRect(sx0 + sw / 2 - 9 * s, GY - sh - 36 * s, 18 * s, 18 * s);
  c.fillStyle = p.window; c.beginPath(); c.arc(sx0 + sw / 2, GY - sh - 27 * s, 5.5 * s, 0, 7); c.fill();
  for (let i = 0; i < 4; i++) c.fillRect(sx0 + 12 * s + i * 27 * s, GY - sh * .72, 12 * s, 16 * s);
  house(w * .30, 54 * s, 34 * s, 20 * s); tree(w * .25, 17 * s);
  house(w * .38, 44 * s, 44 * s, 18 * s);
  const cx = w * .52, cw = 52 * s, ch = 40 * s, tw = 22 * s, th = 70 * s;
  c.fillStyle = p.building; c.fillRect(cx, GY - ch, cw, ch);
  c.beginPath(); c.moveTo(cx - 4 * s, GY - ch); c.lineTo(cx + cw / 2, GY - ch - 18 * s); c.lineTo(cx + cw + 4 * s, GY - ch); c.fill();
  c.fillRect(cx + cw / 2 - tw / 2, GY - th, tw, th - ch + 4);
  c.beginPath(); c.moveTo(cx + cw / 2 - tw / 2 - 2 * s, GY - th); c.lineTo(cx + cw / 2, GY - th - 26 * s); c.lineTo(cx + cw / 2 + tw / 2 + 2 * s, GY - th); c.fill();
  c.fillRect(cx + cw / 2 - 1.2 * s, GY - th - 40 * s, 2.4 * s, 16 * s); c.fillRect(cx + cw / 2 - 5 * s, GY - th - 35 * s, 10 * s, 2.4 * s);
  c.fillStyle = p.window; c.beginPath(); c.arc(cx + cw / 2, GY - th * .78, 4 * s, 0, 7); c.fill();
  tree(w * .64, 20 * s);
  house(w * .70, 58 * s, 36 * s, 22 * s); house(w * .80, 46 * s, 30 * s, 16 * s); tree(w * .93, 18 * s);
  c.fillStyle = p.grass; c.fillRect(0, GY, w, 7 * s);
  c.fillStyle = p.ground; c.fillRect(0, GY + 7 * s, w, h - GY);
  const ry = GY + (h - GY) * .62;
  c.fillStyle = p.sleeper;
  for (let x = 4; x < w; x += 22) c.fillRect(x, ry - 3, 10, 9);
  c.fillStyle = p.rail; c.fillRect(0, ry, w, 2.5); c.fillRect(0, ry + 5, w, 2.5);
}
function buildBackground() {
  const mk = (p) => { const o = document.createElement("canvas"); o.width = W * dpr; o.height = H * dpr; const c = o.getContext("2d"); c.scale(dpr, dpr); paintScene(c, W, H, p); return o; };
  bgDay = mk({ top: "#0B63C6", bottom: "#8EC5F5", sunY: .2, sunR: .06, sun: "#F2B01E", glow: "rgba(242,176,30,.35)", hill1: "#E8C27A", hill2: "#D4A04A", building: "#8C1D2F", window: "#F2B01E", tree: "#1F7A4D", grass: "#2E9E6B", ground: "#D9B27C", sleeper: "#5E1220", rail: "#FFF6E3" });
  bgDusk = mk({ top: "#5E1220", bottom: "#F2874A", sunY: .72, sunR: .085, sun: "#FFD166", glow: "rgba(255,150,60,.5)", hill1: "#B8404F", hill2: "#8C1D2F", building: "#3B0A14", window: "#FFD166", tree: "#14472F", grass: "#237A52", ground: "#7A3B3B", sleeper: "#2A0A10", rail: "#E8D3AB" });
}
function resize() {
  const r = stage.getBoundingClientRect();
  W = Math.max(280, r.width); H = Math.max(240, r.height); GY = H * .9;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildBackground();
  clouds = Array.from({ length: 5 }, () => ({ x: rand(0, W), y: rand(H * .06, H * .4), s: rand(.7, 1.4), v: rand(6, 16) }));
  items.forEach(it => { it.x = clamp(it.x, it.size / 2, W - it.size / 2); });
}
new ResizeObserver(resize).observe(stage);

/* ---------- Elementos del juego ---------- */
const itemSize = () => clamp(Math.min(W * .2, H * .16), 56, 96);

function spawn() {
  const prog = clamp(elapsed / TOTAL_TIME, 0, 1);
  let good = Math.random() > (.27 + .11 * prog);
  if (!good && badStreak >= 2) good = true;
  badStreak = good ? 0 : badStreak + 1;
  let def;
  if (good) {
    const missing = GOOD.filter(d => !collected.has(d.id));   // se prefieren los que faltan descubrir
    def = missing.length && Math.random() < .6 ? pick(missing) : pick(GOOD);
  } else {
    const nearPool = BAD.filter(d => d.near), silly = BAD.filter(d => !d.near);   // más “parecidos” a medida que avanza la partida
    def = Math.random() < .2 + .5 * prog ? pick(nearPool) : pick(silly);
  }
  const size = itemSize();
  items.push({
    def, good, size, x: rand(size / 2 + 6, W - size / 2 - 6), y: -size / 2,
    vy: H * (.15 + .11 * prog) * rand(.85, 1.2), rot: rand(-.35, .35), vr: rand(-1.2, 1.2),
    sway: rand(0, 6.28), amp: rand(0, size * .25), golden: good && Math.random() < .08, age: 0
  });
}
function burst(x, y, colors, n = 14, power = 220) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, 6.28), sp = rand(power * .3, power);
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: rand(.45, .9), max: .9, r: rand(2.5, 5.5), c: pick(colors) });
  }
}
function floater(x, y, text, color, size = 24) { floaters.push({ x, y, text, color, size, life: 1.1 }); }
const mult = () => combo >= 10 ? 3 : combo >= 5 ? 2 : 1;

function showToast(title, text, bad) {
  const t = $("factToast");
  t.className = "fact-toast show" + (bad ? " bad" : "");
  t.innerHTML = "";
  const b = document.createElement("b"); b.textContent = title.toUpperCase();
  t.append(b, document.createTextNode(text));
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Ventana de historia (imagen grande + relato) ---------- */
function openStory(def, fromAlbum) {
  storyFromAlbum = fromAlbum;
  const box = $("storyImgBox"), img = $("storyImg");
  img.onerror = null;
  if (def.photo) { img.src = def.photo; box.classList.remove("placeholder"); }
  else { img.src = def.uri; box.classList.add("placeholder"); box.dataset.file = `Imagen pendiente: imagenes/${photoNames(def)[0]}.jfif`; }
  img.alt = def.name;
  $("storyKicker").textContent = fromAlbum ? "✦ RECUERDO DE TU ÁLBUM" : "✦ ¡NUEVO RECUERDO DESBLOQUEADO!";
  $("storyName").textContent = def.name;
  $("storyText").textContent = def.story;
  $("storySource").textContent = def.source;
  $("storyContinue").firstChild.textContent = fromAlbum ? "Cerrar " : "¡Seguir jugando! ";
  $("storyOverlay").classList.remove("hidden");
  $("storyOverlay").querySelector(".story-card").scrollTop = 0;
  $("storyContinue").focus({ preventScroll: true });
  duckMusic(true); sfx.story();
}
function closeStory() {
  if ($("storyOverlay").classList.contains("hidden")) return;
  $("storyOverlay").classList.add("hidden");
  sfx.click(); duckMusic(false);
  if (!storyFromAlbum && state === "story") {
    state = "play";
    if (lives <= 0 || timeLeft <= 0) endGame();
  }
}

/* ---------- Interacción ---------- */
function onPointer(e) {
  if (state !== "play") return;
  e.preventDefault();
  const r = canvas.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (Math.hypot(px - it.x, py - it.y) <= it.size * .62) { hit(it, i); return; }
  }
}
canvas.addEventListener("pointerdown", onPointer);

function hit(it, index) {
  items.splice(index, 1);
  if (it.good) {
    const before = mult();
    combo++; bestCombo = Math.max(bestCombo, combo); caughtCount++;
    const m = mult(), pts = (it.golden ? 30 : 10) * m;
    score += pts;
    burst(it.x, it.y, ["#F2B01E", "#FFF6E3", "#3C8DDE", "#B8404F"], it.golden ? 26 : 14);
    floater(it.x, it.y - it.size * .4, "+" + pts, "#F2B01E", 26);
    if (it.golden) { timeLeft = Math.min(TOTAL_TIME, timeLeft + GOLD_BONUS_TIME); floater(it.x, it.y + 10, "+" + GOLD_BONUS_TIME + " s", "#7FE0B0", 20); sfx.gold(); }
    else sfx.good(combo);
    if (m > before) { sfx.combo(); floater(W / 2, H * .3, "¡COMBO ×" + m + "!", "#F2B01E", 30); }
    if (!collected.has(it.def.id)) {
      collected.add(it.def.id);                 // ¡recuerdo nuevo! se frena el juego y se muestra la historia
      state = "story"; updateHud(); openStory(it.def, false); return;
    }
    showToast(it.def.name, it.def.tagline, false);
  } else {
    lives--; combo = 0; shake = .45; flash = .45; flashColor = "255,90,90";
    burst(it.x, it.y, ["#ff7b7b", "#9aa5b4", "#4a5568"], 12, 200);
    floater(it.x, it.y - it.size * .4, "¡No es de acá!", "#D6283F", 20);
    sfx.bad();
    showToast(it.def.name, (it.def.where ? it.def.where + " " : "") + "¡Eso no es de Capitán Sarmiento! Perdés una vida.", true);
    if (navigator.vibrate) { try { navigator.vibrate(60); } catch (_) {} }
  }
  updateHud();
  if (lives <= 0) endGame();
}

/* ---------- HUD ---------- */
let hudCache = {};
function setText(id, v) { if (hudCache[id] !== v) { hudCache[id] = v; $(id).textContent = v; } }
function updateHud() {
  setText("score", String(score));
  setText("memCount", collected.size + "/" + GOOD.length);
  setText("timeText", Math.ceil(timeLeft) + "s");
  $("timeBar").style.width = clamp(timeLeft / TOTAL_TIME, 0, 1) * 100 + "%";
  $("timeBar").classList.toggle("low", timeLeft <= 10);
  const left = Math.max(0, lives), gone = START_LIVES - left;
  const hearts = "♥".repeat(left) + (gone > 0 ? `<span class="lost">${"♥".repeat(gone)}</span>` : "");
  if (hudCache.lives !== hearts) { hudCache.lives = hearts; $("lives").innerHTML = hearts; }
  const m = mult(), cb = $("comboBadge");
  if (m > 1) { const txt = "COMBO ×" + m; if (cb.textContent !== txt || cb.classList.contains("hidden")) { cb.textContent = txt; cb.classList.remove("hidden"); } }
  else cb.classList.add("hidden");
}

/* ---------- Ciclo principal ---------- */
function update(dt) {
  if (state === "paused") return;
  clouds.forEach(c => { c.x += c.v * dt; if (c.x > W + 80) c.x = -80; });
  if (!train.active) { train.wait -= dt; if (train.wait <= 0) { train.active = true; train.x = -330; } }
  else { train.x += Math.max(110, W * .16) * dt; if (train.x > W + 20) { train.active = false; train.wait = rand(10, 16); } }

  if (state === "play") {
    elapsed += dt; timeLeft -= dt; spawnTimer -= dt;
    if (spawnTimer <= 0) { spawn(); const prog = clamp(elapsed / TOTAL_TIME, 0, 1); spawnTimer = (1.3 - .5 * prog) * rand(.8, 1.15); }
    const sec = Math.ceil(timeLeft);
    if (sec <= 5 && sec > 0 && sec !== lastTick) { lastTick = sec; sfx.tick(); }
    if (timeLeft <= 0) { timeLeft = 0; updateHud(); endGame(); return; }
    updateHud();
  }
  if (state !== "story") {          // con la ventana de historia abierta, las cosas quedan quietas
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i]; it.age += dt; it.y += it.vy * dt; it.rot += it.vr * dt * .5; it.x += Math.sin(it.age * 2 + it.sway) * it.amp * dt;
      it.x = clamp(it.x, it.size / 2, W - it.size / 2);
      if (it.y - it.size / 2 > GY - it.size * .35) {
        items.splice(i, 1);
        if (state === "play" && it.good && combo > 0) { combo = 0; floater(it.x, GY - 30, "¡Se escapó!", "#FFF6E3", 16); sfx.miss(); updateHud(); }
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.life -= dt; p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.life <= 0) particles.splice(i, 1); }
  for (let i = floaters.length - 1; i >= 0; i--) { const f = floaters[i]; f.life -= dt; f.y -= 46 * dt; if (f.life <= 0) floaters.splice(i, 1); }
  shake = Math.max(0, shake - dt); flash = Math.max(0, flash - dt);
}

function drawCloud(c) {
  ctx.save(); ctx.globalAlpha = .95; ctx.fillStyle = "#FFF6E3";
  const r = 16 * c.s; ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, 7); ctx.arc(c.x + r * 1.2, c.y - r * .4, r * 1.2, 0, 7); ctx.arc(c.x + r * 2.4, c.y, r, 0, 7); ctx.fill();
  ctx.restore();
}
function drawTrain() {
  if (!train.active) return;
  const s = clamp(H / 520, .6, 1.3), y = GY + (H - GY) * .62 - 3, x = train.x;
  const car = (cx, color) => { ctx.fillStyle = color; ctx.fillRect(cx, y - 22 * s, 56 * s, 22 * s); ctx.fillStyle = "#FFF6E3"; for (let i = 0; i < 3; i++) ctx.fillRect(cx + 6 * s + i * 17 * s, y - 17 * s, 10 * s, 8 * s); ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(cx + 12 * s, y + 1, 4 * s, 0, 7); ctx.arc(cx + 44 * s, y + 1, 4 * s, 0, 7); ctx.fill(); };
  car(x, "#0055A4"); car(x + 60 * s, "#0055A4");
  const lx = x + 120 * s;
  ctx.fillStyle = "#8C1D2F"; ctx.fillRect(lx, y - 20 * s, 40 * s, 20 * s);
  ctx.fillStyle = "#F2B01E"; ctx.fillRect(lx, y - 32 * s, 18 * s, 32 * s);
  ctx.fillStyle = "#4d392b"; ctx.fillRect(lx + 27 * s, y - 31 * s, 7 * s, 11 * s);
  ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(lx + 9 * s, y + 1, 4.5 * s, 0, 7); ctx.arc(lx + 28 * s, y + 1, 4.5 * s, 0, 7); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(lx + 31 * s, y - 40 * s, 5 * s, 0, 7); ctx.arc(lx + 38 * s, y - 49 * s, 7 * s, 0, 7); ctx.fill();
}
function drawItem(it) {
  ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
  if (it.golden) {
    const pulse = 1 + Math.sin(it.age * 6) * .06;
    const g = ctx.createRadialGradient(0, 0, it.size * .2, 0, 0, it.size * .95);
    g.addColorStop(0, "rgba(242,176,30,.8)"); g.addColorStop(1, "rgba(242,176,30,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, it.size * .95, 0, 7); ctx.fill();
    ctx.scale(pulse, pulse);
  } else { ctx.shadowColor = "rgba(59,10,20,.55)"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 4; }
  ctx.drawImage(tokenFor(it.def), -it.size / 2, -it.size / 2, it.size, it.size);
  if (it.golden) { ctx.strokeStyle = "#F2B01E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, it.size / 2 + 1, 0, 7); ctx.stroke(); }
  ctx.restore();
}
function draw() {
  ctx.save();
  if (shake > 0) ctx.translate(rand(-1, 1) * shake * 14, rand(-1, 1) * shake * 14);
  const prog = clamp(elapsed / TOTAL_TIME, 0, 1);
  if (state === "idle" && startBg && startBg.naturalWidth) drawCover(startBg);   // antes de empezar: foto de Sarmiento
  else {
    ctx.drawImage(bgDay, 0, 0, W, H);
    ctx.globalAlpha = prog; ctx.drawImage(bgDusk, 0, 0, W, H); ctx.globalAlpha = 1;
    clouds.forEach(drawCloud); drawTrain();
  }
  items.forEach(drawItem);
  particles.forEach(p => { ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); });
  ctx.globalAlpha = 1; ctx.textAlign = "center";
  floaters.forEach(f => {
    ctx.globalAlpha = clamp(f.life / .5, 0, 1);
    ctx.font = `800 ${f.size}px 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;
    const tx = clamp(f.x, 70, W - 70), tw = ctx.measureText(f.text).width, ph = f.size * .62, pw = f.size * .5;
    ctx.fillStyle = f.color; ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tx - tw / 2 - pw, f.y - f.size * .5 - ph * .45, tw + pw * 2, f.size + ph * .9, f.size * .6); else ctx.rect(tx - tw / 2 - pw, f.y - f.size * .5 - ph * .45, tw + pw * 2, f.size + ph * .9);
    ctx.fill();
    ctx.fillStyle = f.color === "#D6283F" ? "#FFFFFF" : "#3B0A14"; ctx.textBaseline = "middle"; ctx.fillText(f.text, tx, f.y); ctx.textBaseline = "alphabetic";
  });
  ctx.globalAlpha = 1;
  if (flash > 0) { ctx.fillStyle = `rgba(${flashColor},${flash * .45})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
function frame(ts) {
  const dt = Math.min(.05, (ts - lastFrame) / 1000 || 0); lastFrame = ts;
  if (W > 0 && bgDay) { update(dt); draw(); }
  requestAnimationFrame(frame);
}

/* ---------- Flujo: inicio, cuenta regresiva, fin ---------- */
function startGame() {
  player = $("playerName").value.trim() || "Invitado";
  try { localStorage.setItem("csAtrapaNombre", player === "Invitado" ? "" : player); } catch (_) {}
  sfx.click();
  items = []; particles = []; floaters = []; hudCache = {};
  score = 0; lives = START_LIVES; timeLeft = TOTAL_TIME; elapsed = 0; combo = 0; bestCombo = 0; caughtCount = 0; badStreak = 0; lastTick = 99;
  collected = new Set(); spawnTimer = .3; shake = 0; flash = 0; train = { x: -999, active: false, wait: 6 };
  $("startScreen").classList.add("hidden"); $("endScreen").classList.add("hidden"); $("storyOverlay").classList.add("hidden"); $("pauseOverlay").classList.add("hidden");
  $("hud").classList.remove("hidden"); $("comboBadge").classList.add("hidden"); $("factToast").classList.remove("show");
  updateHud();
  state = "countdown";
  stopMusic(); startMusic(); checkAudioBlocked();
  const cd = $("countdown"); cd.classList.remove("hidden");
  let n = 3;
  const step = () => {
    if (state !== "countdown") return;
    if (n > 0) { cd.innerHTML = `<span>${n}</span>`; sfx.beep(n); n--; setTimeout(step, 800); }
    else { cd.innerHTML = "<span style='font-size:.5em'>¡YA!</span>"; sfx.go(); state = "play"; setTimeout(() => cd.classList.add("hidden"), 700); }
  };
  step();
}
function endGame() {
  if (state === "over") return;
  state = "over"; $("hud").classList.add("hidden"); $("comboBadge").classList.add("hidden");
  stopMusic(); sfx.end(score >= 250);
  setTimeout(showResults, 900);
}
function showResults() {
  let records = [];
  try { records = JSON.parse(localStorage.getItem("csAtrapaRecords") || "[]"); } catch (_) {}
  const oldBest = records.reduce((m, r) => Math.max(m, r.score), 0);
  const isRecord = score > oldBest && score > 0;
  records.push({ name: player, score, date: new Date().toLocaleDateString("es-AR") });
  records.sort((a, b) => b.score - a.score); records = records.slice(0, 10);
  try { localStorage.setItem("csAtrapaRecords", JSON.stringify(records)); } catch (_) {}

  const all = collected.size === GOOD.length;
  $("endTitle").textContent = all ? "¡Álbum completo!" : score >= 400 ? "¡Memoria de oro!" : score >= 200 ? "¡Muy buen ojo, " + player + "!" : "¡Buen comienzo, " + player + "!";
  $("endMessage").textContent = all ? "Descubriste los " + GOOD.length + " recuerdos del pueblo. ¡Sos un verdadero sarmientense!" : lives <= 0 ? "Te quedaste sin vidas, pero cada partida es una oportunidad para descubrir más recuerdos." : "¡Se acabó el tiempo! Tocá los recuerdos de tu álbum para leer su historia.";
  $("finalScore").textContent = score.toLocaleString("es-AR");
  $("newRecord").textContent = isRecord ? "✦ ¡NUEVO RÉCORD DE ESTE NAVEGADOR!" : "¡Desafiate a superar tu marca!";
  $("statCaught").textContent = caughtCount; $("statCombo").textContent = bestCombo; $("statAlbum").textContent = collected.size + "/" + GOOD.length;

  const album = $("album"); album.innerHTML = "";
  GOOD.forEach(def => {
    const got = collected.has(def.id), card = document.createElement("button");
    card.type = "button"; card.className = "album-card" + (got ? "" : " locked"); card.disabled = !got;
    const th = document.createElement("div"); th.className = "album-thumb";
    const img = document.createElement("img"); img.alt = ""; img.src = def.photo || def.uri; if (!def.photo) th.classList.add("placeholder");
    th.appendChild(img);
    const box = document.createElement("div"), t = document.createElement("strong"), s = document.createElement("small");
    t.textContent = got ? def.name : "Sin descubrir"; s.textContent = got ? def.tagline : "Atrapalo en tu próxima partida.";
    box.append(t, s); card.append(th, box);
    if (got) { const more = document.createElement("span"); more.className = "album-more"; more.textContent = "Leer historia →"; box.appendChild(more); card.addEventListener("click", () => { sfx.click(); openStory(def, true); }); }
    album.appendChild(card);
  });
  const lb = $("leaderboard"); lb.innerHTML = "";
  if (!records.length) lb.innerHTML = "<li>Jugá tu primera partida para crear un récord.</li>";
  records.slice(0, 5).forEach((r, i) => {
    const li = document.createElement("li"), a = document.createElement("span"), b = document.createElement("span");
    a.textContent = `${["🥇", "🥈", "🥉", "4.", "5."][i]} ${r.name}`; b.textContent = r.score.toLocaleString("es-AR") + " pts";
    li.append(a, b); lb.appendChild(li);
  });
  $("endScreen").classList.remove("hidden"); $("endScreen").scrollTop = 0; $("endScreen").querySelector(".card").scrollTop = 0;
  state = "over";
}

/* ---------- Pausa, salir y fuentes ---------- */
function pauseGame() {
  if (state !== "play") return;
  state = "paused"; $("pauseOverlay").classList.remove("hidden");
  if (ac) ac.suspend();
  $("resumeButton").focus({ preventScroll: true });
}
function resumeGame() {
  if (state !== "paused") return;
  $("pauseOverlay").classList.add("hidden"); state = "play";
  if (ac) ac.resume(); sfx.click();
}
function quitToStart() {
  state = "idle"; stopMusic(); if (ac) ac.resume();
  items = []; particles = []; floaters = []; elapsed = 0;
  ["pauseOverlay", "hud", "comboBadge", "countdown", "storyOverlay", "endScreen"].forEach(id => $(id).classList.add("hidden"));
  $("factToast").classList.remove("show"); $("startScreen").classList.remove("hidden");
}
const GENERAL_SOURCES = [
  ["Instituto Cultural de la Provincia de Buenos Aires: ficha del Museo y Archivo Histórico Municipal", "https://php7.cultura.gba.gob.ar/patrimonioculturalNew/busqueda/detalle/103"],
  ["“Capitán Sarmiento: Reflexiones y datos para una estrategia de desarrollo” (UNLP, SEDICI)", "http://sedici.unlp.edu.ar/handle/10915/81635"],
  ["Sistema de Información Normativa de la Provincia de Buenos Aires: Ley 11.997 (Bandera Bonaerense)", "https://normas.gba.gob.ar/ar-b/ley/1997/11997/4834"],
  ["Sistema de Información Normativa de la Provincia de Buenos Aires: Ley 14.290 (monumento a la Bandera)", "https://normas.gba.gob.ar/ar-b/ley/2011/14290/11522"],
  ["Sistema de Información Normativa de la Provincia de Buenos Aires: Decreto 2979/1997 (Cuna de la Bandera)", "https://normas.gba.gob.ar/ar-b/decreto/1997/2979/68091"],
  ["Argentina Turismo: historia de Capitán Sarmiento", "https://www.argentinaturismo.com.ar/capitansarmiento/historia.php"],
  ["El Cronista: nota de turismo sobre Capitán Sarmiento", "https://www.cronista.com/clase/break/este-pueblito-cerca-de-caba-es-un-paraiso-para-una-escapada-esta-lleno-de-historia-naturaleza-y-buena-gastronomia"],
  ["Cine Teatro Ítalo Argentino: sitio oficial (historia del cine)", "https://www.cineitalocapitansarmiento.com/historia-cine/"],
  ["elDiarioAR: Capitán Sarmiento y Daireaux, paisajes y sabores bonaerenses", "https://www.eldiarioar.com/servicios/capitan-sarmiento-daireaux-paisajes-sabores-bonaerenses-descubrir_1_9658803.html"],
  ["Hispanopedia: Partido de Capitán Sarmiento", "https://es.hispanopedia.com/wiki/Partido_de_Capit%C3%A1n_Sarmiento"],
  ["Cámara de Diputados de la Provincia de Buenos Aires: proyecto de declaración por el 132.º aniversario de la ciudad", "https://intranet.hcdiputados-ba.gov.ar/proyectos/14-15D922012019-03-0819-16-32.pdf"],
  ["Historia local de Capitán Sarmiento (sitio de recopilación histórica)", "https://capitansarmiento.wordpress.com/"],
  ["Orden de Malta Argentina: almuerzo en la estancia La Elisa (2018)", "https://www.ordendemaltaargentina.org/almuerzo-en-la-historica-estancia-la-elisa-capitan-sarmiento/"]
];
function buildSources() {
  const list = $("sourcesList"); list.innerHTML = "";
  GOOD.forEach(def => {
    const row = document.createElement("div"), t = document.createElement("strong"), s = document.createElement("small");
    row.className = "src-row"; t.textContent = def.name; s.textContent = def.source; row.append(t, s); list.appendChild(row);
  });
  const ul = $("generalSources"); ul.innerHTML = "";
  GENERAL_SOURCES.forEach(([text, url]) => {
    const li = document.createElement("li"), a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = text; li.appendChild(a); ul.appendChild(li);
  });
}
function openSources() { buildSources(); $("sourcesOverlay").classList.remove("hidden"); $("sourcesOverlay").scrollTop = 0; $("sourcesOverlay").querySelector(".card").scrollTop = 0; sfx.click(); }
function closeSources() { $("sourcesOverlay").classList.add("hidden"); sfx.click(); }

/* ---------- Botones y arranque ---------- */
$("pauseButton").addEventListener("click", pauseGame);
$("resumeButton").addEventListener("click", resumeGame);
$("restartButton").addEventListener("click", startGame);
$("quitButton").addEventListener("click", quitToStart);
$("sourcesClose").addEventListener("click", closeSources);
$("sourcesOverlay").addEventListener("click", e => { if (e.target === $("sourcesOverlay")) closeSources(); });
$("startButton").addEventListener("click", startGame);
$("againButton").addEventListener("click", startGame);
$("storyContinue").addEventListener("click", closeStory);
$("storyClose").addEventListener("click", closeStory);
$("storyOverlay").addEventListener("click", e => { if (e.target === $("storyOverlay")) closeStory(); });
document.addEventListener("keydown", e => {
  const storyOpen = !$("storyOverlay").classList.contains("hidden");
  const sourcesOpen = !$("sourcesOverlay").classList.contains("hidden");
  if (e.key === "Escape" || (e.key === "Enter" && storyOpen)) {
    if (storyOpen) closeStory(); else if (sourcesOpen) closeSources();
    else if (state === "play") pauseGame(); else if (state === "paused") resumeGame();
  }
  if ((e.key === "p" || e.key === "P") && e.target.tagName !== "INPUT") { if (state === "play") pauseGame(); else if (state === "paused") resumeGame(); }
});
$("playerName").addEventListener("keydown", e => { if (e.key === "Enter") startGame(); });
$("musicToggle").addEventListener("click", () => {
  musicOn = !musicOn; $("musicToggle").classList.toggle("off", !musicOn);
  $("musicLabel").textContent = musicOn ? "Música" : "Sin música"; $("musicIcon").textContent = musicOn ? "🎵" : "🔇"; $("musicToggle").setAttribute("aria-pressed", musicOn);
  if (!musicOn) stopMusic(); else if (state === "play" || state === "countdown" || state === "story") startMusic();
});
$("sfxToggle").addEventListener("click", () => {
  sfxOn = !sfxOn; $("sfxToggle").classList.toggle("off", !sfxOn);
  $("sfxLabel").textContent = sfxOn ? "Efectos" : "Sin efectos"; $("sfxIcon").textContent = sfxOn ? "🔔" : "🔕"; $("sfxToggle").setAttribute("aria-pressed", sfxOn);
  if (sfxOn) sfx.click();
});
try { $("playerName").value = localStorage.getItem("csAtrapaNombre") || ""; } catch (_) {}
function fillSamples(id, list) {
  list.forEach(def => { const i = document.createElement("img"); i.src = def.uri; i.alt = def.name; i.title = def.name; $(id).appendChild(i); });
}
fillSamples("goodSamples", GOOD.slice(0, 5));
fillSamples("badSamples", ["cohete", "pinguino", "obelisco", "casarosada", "cataratas"].map(id => BAD.find(d => d.id === id)));
Promise.race([Promise.all([photosReady, startBgReady]), new Promise(r => setTimeout(r, 1500))]).then(() => imagesReady).then(() => { resize(); requestAnimationFrame(frame); });

// Para pruebas desde la consola (no afecta al juego)
window.__juego = { get state() { return state; }, get items() { return items; }, get score() { return score; }, get lives() { return lives; }, get combo() { return combo; }, get collected() { return collected; }, GOOD, BAD, get music() { return musicPlaying; } };
