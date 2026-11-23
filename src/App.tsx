import { CSSProperties, FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type Page =
  | "inicio"
  | "nosotros"
  | "academia"
  | "homeschooling"
  | "espacio"
  | "artistas"
  | "blog"
  | "contacto"
  | "agenda"
  | "taller"
  | "modulo"
  | "solicitud"
  | "recibida"
  | "admin";

const groups = [
  { id: "martes", day: "Martes", ages: "6 a 10 años", status: "Inscripciones abiertas" },
  { id: "miercoles", day: "Miércoles", ages: "11 a 13 años", status: "Programación por confirmar" },
  { id: "viernes", day: "Viernes", ages: "14 a 17 años", status: "Programación por confirmar" },
];

const classes = [
  { date: "07 OCT", title: "Mirar: forma y textura", note: "Exploración y bitácora visual" },
  { date: "14 OCT", title: "Componer: color y ritmo", note: "Collage y teoría del color" },
  { date: "21 OCT", title: "Construir: volumen", note: "Ensamble con materiales mixtos" },
  { date: "28 OCT", title: "Compartir: obra y relato", note: "Cierre y muestra de procesos" },
];

const Icon = ({
  name,
  size = 20,
}: {
  name: "arrow" | "menu" | "close" | "calendar" | "check" | "pin" | "search" | "user" | "plus";
  size?: number;
}) => {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1-5 4-7 8-7s7 2 8 7" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

const Badge = ({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "yellow" | "dark" | "coral";
}) => <span className={`badge badge-${tone}`}>{children}</span>;

const Button = ({
  children,
  onClick,
  kind = "primary",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: "primary" | "outline" | "text" | "light";
  type?: "button" | "submit";
  disabled?: boolean;
}) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`button button-${kind}`}>
    {children}
    {kind !== "text" && <Icon name="arrow" />}
  </button>
);

const Img = ({
  src,
  alt,
  className = "",
  eager = false,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`image-wrap ${className}${onClick ? " can-expand" : ""}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); }
    }}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} width="1280" height="960" />
    <span className="demo-label">Imagen provisional</span>
    {onClick && <span className="expand-label">Ampliar +</span>}
  </div>
);

function Header({ go, page }: { go: (p: Page) => void; page: Page }) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [preview, setPreview] = useState("/images/materiales-provisional.png");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const links: [string, Page][] = [
    ["Inicio", "inicio"],
    ["Nosotros", "nosotros"],
    ["Academia", "academia"],
    ["Espacio", "espacio"],
    ["Artistas", "artistas"],
    ["Blog", "blog"],
    ["Contacto", "contacto"],
  ];
  const navigate = (p: Page) => {
    go(p);
    setOpen(false);
  };
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    menu?.showModal();
    menu?.querySelector<HTMLButtonElement>(".menu-close")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      menu?.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);
  const imageFor = (p: Page) =>
    p === "academia"
      ? "/images/materiales-provisional.png"
      : p === "espacio"
        ? "/images/espacio-provisional.png"
        : p === "artistas"
          ? "/images/exposicion-provisional.png"
          : preview;
  return (
    <header className={`site-header editorial-header ${compact ? "compact" : ""}`}>
      <button className="brand" onClick={() => navigate("inicio")} aria-label="Ir al inicio">
        <span>EL</span>
        <strong>BOMBILLO</strong>
      </button>
      <span className="header-inscription">Casa de arte · Chapinero, Bogotá</span>
      <div className="header-actions">
        <button
          className={page === "agenda" ? "agenda-link active" : "agenda-link"}
          onClick={() => navigate("agenda")}
        >
          Agenda <Icon name="arrow" size={16} />
        </button>
        <button
          ref={triggerRef}
          className={`explore-trigger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="editorial-menu"
          aria-haspopup="dialog"
        >
          Explorar <span aria-hidden="true" />
        </button>
      </div>
      {open && (
        <dialog
          id="editorial-menu"
          className="editorial-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          onCancel={() => setOpen(false)}
        >
          <div className="menu-topbar"><button className="menu-home" onClick={() => navigate("inicio")}>EL BOMBILLO <span>CASA DE ARTE</span></button><button className="menu-close" onClick={() => setOpen(false)} autoFocus aria-label="Cerrar menú">Cerrar <Icon name="close" /></button></div>
          <div className="menu-links">
            <span className="kicker">Explora El Bombillo</span>
            <nav aria-label="Navegación principal">
              {links.map(([label, p], i) => (
                <button
                  style={{ "--i": i } as CSSProperties}
                  className={page === p ? "current" : ""}
                  aria-current={page === p ? "page" : undefined}
                  onMouseEnter={() => setPreview(imageFor(p))}
                  onFocus={() => setPreview(imageFor(p))}
                  onClick={() => navigate(p)}
                  key={p}
                >
                  <small>0{i + 1}</small>
                  <span>{label}</span>
                  {page === p && <i>Estás aquí</i>}
                  <Icon name="arrow" />
                </button>
              ))}
            </nav>
            <div className="menu-meta">
              <button onClick={() => navigate("admin")}>Acceso del equipo</button>
              <span>Casa de arte · Chapinero</span>
            </div>
          </div>
          <div className="menu-visual">
            <Img key={preview} src={preview} alt="Referencia visual provisional de la sección" eager />
            <div>
              <span>Encuentra tu próximo taller</span>
              <button onClick={() => navigate("agenda")}>
                Ver módulos <Icon name="arrow" />
              </button>
            </div>
          </div>
        </dialog>
      )}
    </header>
  );
}

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer>
      <div className="footer-lead">
        <span className="kicker light">Chapinero · Bogotá</span>
        <h2>
          El arte ocurre
          <br />
          <em>cuando nos encontramos.</em>
        </h2>
      </div>
      <div className="footer-grid">
        <div>
          <strong>EL BOMBILLO</strong>
          <p>Espacio cultural, academia y comunidad artística.</p>
        </div>
        <div>
          <span className="footer-title">Explora</span>
          {(["academia", "espacio", "artistas", "agenda"] as Page[]).map((p) => (
            <button key={p} onClick={() => go(p)}>
              {p === "agenda" ? "Agenda" : p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <span className="footer-title">Hablemos</span>
          <button onClick={() => go("contacto")}>Contacto</button>
          <button onClick={() => go("contacto")}>WhatsApp</button>
          <p>Datos de contacto por verificar.</p>
        </div>
        <div>
          <span className="footer-title">Equipo</span>
          <button onClick={() => go("admin")}>Acceso administrativo</button>
          <p>© 2026 El Bombillo</p>
        </div>
      </div>
    </footer>
  );
}

const SectionTitle = ({
  eyebrow,
  children,
  intro,
}: {
  eyebrow: string;
  children: ReactNode;
  intro?: string;
}) => (
  <div className="section-title reveal">
    <span className="kicker">{eyebrow}</span>
    <h2>{children}</h2>
    {intro && <p>{intro}</p>}
  </div>
);

function RevealSystem({ page }: { page: Page }) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-group"));
    document.documentElement.classList.add("reveal-ready");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -30px 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    const mutations = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches(".reveal, .reveal-group")) observer.observe(node);
      node.querySelectorAll(".reveal, .reveal-group").forEach(child => observer.observe(child));
    })));
    mutations.observe(document.getElementById("page-content")!, { childList: true, subtree: true });
    return () => {observer.disconnect();mutations.disconnect();document.documentElement.classList.remove("reveal-ready")};
  }, [page]);
  return null;
}

function GalleryLightbox({ src, alt, close }: { src: string; alt: string; close: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const box = lightboxRef.current;
    box?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      box?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [close]);
  return (
    <dialog
      ref={lightboxRef}
      onCancel={close}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Imagen ampliada"
      onClick={close}
    >
      <button ref={closeRef} onClick={close} aria-label="Cerrar imagen">
        <Icon name="close" />
      </button>
      <img src={src} alt={alt} width="1280" height="960" onClick={(e) => e.stopPropagation()} />
      <span>Imagen de referencia provisional</span>
    </dialog>
  );
}

function Home({ go }: { go: (p: Page) => void }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--px",
      `${((e.clientX - rect.left) / rect.width - 0.5) * 12}px`,
    );
    e.currentTarget.style.setProperty(
      "--py",
      `${((e.clientY - rect.top) / rect.height - 0.5) * 12}px`,
    );
  };
  return (
    <>
      <main>
        <section className="hero poster-hero" ref={heroRef} onPointerMove={onPointerMove} onPointerLeave={() => { heroRef.current?.style.setProperty("--px", "0px"); heroRef.current?.style.setProperty("--py", "0px"); }}>
          <span className="hero-location">
            Chapinero
            <br />
            Bogotá
          </span>
          <h1 className="hero-title" aria-label="Aquí las ideas toman forma">
            <span className="title-mask">
              <i>Aquí las ideas</i>
            </span>
            <span className="title-mask accent-line">
              <i>toman forma</i>
            </span>
          </h1>
          <div className="hero-main-image">
            <Img
              src="/images/proceso-provisional.png"
              alt="Manos trabajando con pintura y collage sobre una mesa"
              eager
            />
          </div>
          <div className="hero-small-image">
            <Img
              src="/images/materiales-provisional.png"
              alt="Materiales de dibujo y pintura sobre una mesa"
              eager
            />
          </div>
          <svg className="hero-trace" aria-hidden="true" viewBox="0 0 420 160">
            <path d="M8 130 C95 8 180 155 268 64 C315 16 352 35 411 8" />
          </svg>
          <div className="hero-intro">
            <span className="kicker">Casa de arte</span>
            <p>Un lugar para aprender, crear y encontrarnos alrededor del arte.</p>
            <div className="actions">
              <Button onClick={() => go("academia")}>Explorar talleres</Button>
              <Button kind="outline" onClick={() => go("agenda")}>
                Ver agenda
              </Button>
            </div>
          </div>
        </section>

        <section className="three-worlds">
          <SectionTitle
            eyebrow="Tres maneras de entrar"
            intro="Una casa para la práctica artística y el encuentro."
          >
            Elige tu <em>punto de partida.</em>
          </SectionTitle>
          <div className="editorial-stripes reveal-group">
            {[
              [
                "01",
                "Academia",
                "Talleres y programas para explorar el arte a cualquier edad.",
                "/images/materiales-provisional.png",
                "academia",
              ],
              [
                "02",
                "Espacio",
                "Exposiciones, encuentros, talleres y coworking creativo.",
                "/images/espacio-provisional.png",
                "espacio",
              ],
              [
                "03",
                "Artistas",
                "Procesos, obras y conversaciones de una comunidad en creación.",
                "/images/exposicion-provisional.png",
                "artistas",
              ],
            ].map((row) => (
              <button onClick={() => go(row[4] as Page)} key={row[0]}>
                <span>{row[0]}</span>
                <h3>{row[1]}</h3>
                <p>{row[2]}</p>
                <Img src={row[3]} alt={`Referencia provisional para ${row[1]}`} />
                <i>
                  Conocer <Icon name="arrow" />
                </i>
              </button>
            ))}
          </div>
        </section>

        <section className="upcoming">
          <div className="upcoming-head">
            <SectionTitle eyebrow="Agenda" intro="Fechas ilustrativas para explorar el prototipo.">
              Próximas <em>actividades</em>
            </SectionTitle>
            <Button kind="outline" onClick={() => go("agenda")}>
              Ver agenda completa
            </Button>
          </div>
          <div className="demo-strip">
            Datos de demostración · La programación debe confirmarse antes de publicar
          </div>
          <div className="culture-board reveal-group">
            {classes.slice(0, 3).map((item, i) => (
              <button
                className="event-row"
                onClick={() => go(i === 0 ? "modulo" : "agenda")}
                key={item.date}
              >
                <span className="event-date">
                  <b>{item.date.split(" ")[0]}</b>
                  {item.date.split(" ")[1]}
                  <small>2025</small>
                </span>
                <span className="event-type">{i === 2 ? "Encuentro" : "Homeschooling"}</span>
                <span className="event-name">
                  {item.title}
                  <small>
                    {i === 2
                      ? "Actividad cultural · Hora por confirmar"
                      : "Grupo martes · 6 a 10 años · 10:00 a 11:30"}
                  </small>
                </span>
                <Badge tone={i === 1 ? "yellow" : "blue"}>
                  {i === 1 ? "Próximamente" : "Inscripciones abiertas"}
                </Badge>
                <span className="event-action">
                  Ver detalle <Icon name="arrow" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="homeschool-feature">
          <div>
            <span className="kicker">Programa de arte · Homeschooling</span>
            <h2>
              Aprender arte es también aprender a <em>mirar.</em>
            </h2>
            <p>
              Un programa de cuatro módulos para niñas, niños y jóvenes. Cada módulo reúne cuatro
              clases, materiales y un proceso completo.
            </p>
            <div className="home-program-facts">
              <span>
                <b>$250.000</b>COP por módulo
              </span>
              <span>
                <b>Incluidos</b>Materiales
              </span>
              <span>
                <b>3 grupos</b>6 a 17 años
              </span>
            </div>
            <div className="actions">
              <Button onClick={() => go("homeschooling")}>Conocer el programa</Button>
              <Button kind="text" onClick={() => go("agenda")}>
                Ir a la agenda <Icon name="arrow" />
              </Button>
            </div>
          </div>
          <div className="module-orbit reveal-group">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <span>0{n}</span>
                <strong>Módulo {n}</strong>
                <small>4 clases</small>
              </div>
            ))}
            <svg aria-hidden="true" viewBox="0 0 500 300">
              <path d="M15 156 C120 16 207 282 309 107 C358 23 411 66 485 128" />
            </svg>
          </div>
        </section>

        <section className="process-gallery">
          <SectionTitle eyebrow="Dentro del taller">
            Procesos, materiales <em>y preguntas.</em>
          </SectionTitle>
          <div className="gallery-grid gallery-v2 reveal-group">
            <Img
              src="/images/proceso-provisional.png"
              alt="Proceso creativo con pinturas"
              onClick={() =>
                setLightbox({
                  src: "/images/proceso-provisional.png",
                  alt: "Proceso creativo con pinturas",
                })
              }
            />
            <Img
              src="/images/materiales-provisional.png"
              alt="Materiales de taller"
              onClick={() =>
                setLightbox({
                  src: "/images/materiales-provisional.png",
                  alt: "Materiales de taller",
                })
              }
            />
            <Img
              src="/images/exposicion-provisional.png"
              alt="Montaje de exposición"
              onClick={() =>
                setLightbox({
                  src: "/images/exposicion-provisional.png",
                  alt: "Montaje de exposición",
                })
              }
            />
            <blockquote>
              “Aquí importa tanto la obra como el camino para llegar a ella.”
              <small>Principio editorial del proyecto · no es un testimonio</small>
            </blockquote>
          </div>
        </section>

        <section className="location">
          <div>
            <span className="kicker">Visítanos</span>
            <h2>
              Nos encontramos en <em>Chapinero.</em>
            </h2>
            <p>
              La dirección exacta, horarios de atención y canales del negocio deben verificarse
              antes de publicar.
            </p>
            <Button kind="outline" onClick={() => go("contacto")}>
              Cómo llegar y contactar
            </Button>
          </div>
          <div className="map-placeholder">
            <Icon name="pin" size={34} />
            <span>
              Chapinero
              <br />
              <small>Bogotá, Colombia</small>
            </span>
          </div>
        </section>
        <section className="closing-poster reveal">
          <Img
            src="/images/exposicion-provisional.png"
            alt="Personas visitando una exposición de arte"
          />
          <div>
            <span className="kicker light">Una casa de arte viva</span>
            <h2>
              Ven con una idea.
              <br />
              <em>Sal con nuevas preguntas.</em>
            </h2>
            <div className="actions">
              <Button kind="light" onClick={() => go("academia")}>
                Explorar talleres
              </Button>
              <Button kind="text" onClick={() => go("contacto")}>
                Hablar con nosotros <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      {lightbox && (
        <GalleryLightbox src={lightbox.src} alt={lightbox.alt} close={() => setLightbox(null)} />
      )}
      <Footer go={go} />
    </>
  );
}

function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
  image?: string;
}) {
  const slug = eyebrow
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z-]/g, "");
  return (
    <section className={`page-hero interior-hero hero-${slug} ${image ? "" : "no-image"}`}>
      <div className="reveal">
        <span className="kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {image && <Img src={image} alt="Referencia visual del espacio artístico" />}
    </section>
  );
}

function About({ go }: { go: (p: Page) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="Nosotros"
        title={
          <>
            Una casa para hacer del arte una <em>práctica cotidiana.</em>
          </>
        }
        text="El Bombillo reúne formación, creación y encuentro en un mismo lugar en Chapinero."
        image="/images/espacio-provisional.png"
      />
      <section className="manifesto">
        <span className="big-number">01—03</span>
        <div>
          <h2>
            Expresión.
            <br />
            Aprendizaje.
            <br />
            <em>Encuentro.</em>
          </h2>
        </div>
        <div>
          <p>
            Entendemos el arte como una forma de mirar, preguntar y construir con otros. Diseñamos
            experiencias donde el proceso tiene tanto valor como el resultado.
          </p>
          <p>
            Este espacio está preparado para contar la historia real del proyecto y su equipo cuando
            la información esté confirmada.
          </p>
        </div>
      </section>
      <section className="pathways">
        <SectionTitle eyebrow="Conoce el proyecto">
          Una comunidad, <em>muchas entradas.</em>
        </SectionTitle>
        <div className="simple-grid">
          {[
            ["Academia", "Aprender haciendo", "academia"],
            ["Espacio", "Habitar y compartir", "espacio"],
            ["Artistas", "Crear en comunidad", "artistas"],
          ].map((x) => (
            <button onClick={() => go(x[2] as Page)} key={x[0]}>
              <span>{x[0]}</span>
              <h3>{x[1]}</h3>
              <Icon name="arrow" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Academy({ go }: { go: (p: Page) => void }) {
  const [filter, setFilter] = useState("Todos");
  const workshops = [
    {
      title: "Laboratorio de dibujo",
      audience: "Jóvenes y adultos",
      type: "Talleres",
      text: "Un espacio para explorar línea, gesto y observación.",
    },
    {
      title: "Programa de arte Homeschooling",
      audience: "6 a 17 años",
      type: "Homeschooling",
      text: "Cuatro módulos de creación, grupos por edades y materiales incluidos.",
    },
    {
      title: "Exploración de materiales",
      audience: "Público por confirmar",
      type: "Talleres",
      text: "Ejemplo de taller. Horarios y valores pendientes.",
    },
  ];
  return (
    <main>
      <PageHero
        eyebrow="Academia"
        title={
          <>
            Aprender arte es abrir <em>otras posibilidades.</em>
          </>
        }
        text="Talleres, laboratorios y programas para desarrollar una práctica propia."
        image="/images/proceso-provisional.png"
      />
      <section className="catalog">
        <div className="catalog-head">
          <SectionTitle eyebrow="Oferta formativa">
            Encuentra tu <em>taller.</em>
          </SectionTitle>
          <div className="filters" role="group" aria-label="Filtrar talleres">
            {["Todos", "Talleres", "Homeschooling"].map((f) => (
              <button
                className={filter === f ? "selected" : ""}
                onClick={() => setFilter(f)}
                key={f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="card-grid">
          {workshops
            .filter((w) => filter === "Todos" || w.type === filter)
            .map((w, i) => (
              <article className="workshop-card" key={w.title}>
                <div className={`art-card art-${i}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <Badge tone={w.type === "Homeschooling" ? "blue" : "yellow"}>{w.audience}</Badge>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                <Button kind="text" onClick={() => go(w.type === "Homeschooling" ? "homeschooling" : "taller")}>
                  Ver detalle <Icon name="arrow" />
                </Button>
              </article>
            ))}
        </div>
        <div className="empty-note">
          <strong>¿No encuentras una fecha?</strong>
          <span>La programación se publica en la agenda cuando está confirmada.</span>
          <Button kind="outline" onClick={() => go("agenda")}>
            Consultar agenda
          </Button>
        </div>
      </section>
    </main>
  );
}

function Homeschool({ go }: { go: (p: Page) => void }) {
  const [group, setGroup] = useState("martes");
  const current = groups.find((g) => g.id === group)!;
  return (
    <main>
      <PageHero
        eyebrow="Programa Homeschooling"
        title={
          <>
            Cuatro módulos para <em>mirar, hacer y compartir.</em>
          </>
        }
        text="Un recorrido artístico para niñas, niños y jóvenes, organizado por grupos de edad."
        image="/images/proceso-provisional.png"
      />
      <section className="program-picker">
        <SectionTitle eyebrow="Elige un grupo">
          Una ruta para <em>cada etapa.</em>
        </SectionTitle>
        <div className="group-tabs">
          {groups.map((g) => (
            <button
              className={group === g.id ? "active" : ""}
              onClick={() => setGroup(g.id)}
              key={g.id}
            >
              <span>{g.day}</span>
              <strong>{g.ages}</strong>
              <small>{g.status}</small>
            </button>
          ))}
        </div>
        <div className="group-result">
          <div>
            <Badge tone={group === "martes" ? "blue" : "yellow"}>{current.status}</Badge>
            <h3>
              {current.day} · {current.ages}
            </h3>
            <p>Horario fijo: 10:00 a 11:30 a. m.</p>
          </div>
          {group === "martes" ? (
            <Button onClick={() => go("agenda")}>Ver módulos del grupo</Button>
          ) : (
            <Button disabled>Programación por confirmar</Button>
          )}
        </div>
      </section>
      <section className="module-structure">
        <div>
          <span className="kicker light">Cómo funciona</span>
          <h2>
            Un programa.
            <br />
            <em>Cuatro módulos.</em>
          </h2>
          <p>Cada módulo reúne cuatro clases conectadas y se solicita como un proceso completo.</p>
        </div>
        <div className="module-stack">
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <span>0{n}</span>
              <strong>Módulo {n}</strong>
              <small>4 clases · proceso completo</small>
            </div>
          ))}
        </div>
      </section>
      <section className="practical">
        <SectionTitle eyebrow="Información práctica">
          Todo claro <em>antes de empezar.</em>
        </SectionTitle>
        <div className="fact-grid">
          <div>
            <strong>$250.000</strong>
            <span>COP por módulo</span>
          </div>
          <div>
            <strong>4 clases</strong>
            <span>por cada módulo</span>
          </div>
          <div>
            <strong>90 min</strong>
            <span>10:00–11:30 a. m.</span>
          </div>
          <div>
            <strong>Incluidos</strong>
            <span>materiales de trabajo</span>
          </div>
        </div>
        <div className="faq">
          <details open>
            <summary>
              ¿Se puede tomar una sola clase?
              <Icon name="plus" />
            </summary>
            <p>
              La solicitud corresponde al módulo completo de cuatro clases; no se reservan clases
              por separado.
            </p>
          </details>
          <details>
            <summary>
              ¿Los materiales están incluidos?
              <Icon name="plus" />
            </summary>
            <p>Sí. Los materiales del módulo están incluidos en el valor informado.</p>
          </details>
          <details>
            <summary>
              ¿Cómo se confirma el cupo?
              <Icon name="plus" />
            </summary>
            <p>
              Después de enviar la solicitud, el equipo debe confirmar el cupo. El envío no
              constituye una reserva automática.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}

function Space({ go }: { go: (p: Page) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="El espacio"
        title={
          <>
            Una casa que cambia con <em>cada idea.</em>
          </>
        }
        text="Un lugar para exposiciones, encuentros, talleres y trabajo creativo en Chapinero."
        image="/images/espacio-provisional.png"
      />
      <section className="space-uses">
        <SectionTitle eyebrow="Posibilidades">
          El espacio como <em>punto de encuentro.</em>
        </SectionTitle>
        <div className="use-grid">
          {[
            ["Exposiciones", "Montajes y conversaciones alrededor de la obra."],
            ["Encuentros", "Charlas, muestras y actividades culturales."],
            ["Talleres", "Mesas, materiales y espacio para hacer."],
            ["Coworking", "Una atmósfera tranquila para procesos creativos."],
          ].map((u, i) => (
            <div key={u[0]}>
              <span>0{i + 1}</span>
              <h3>{u[0]}</h3>
              <p>{u[1]}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rental-call">
        <div>
          <span className="kicker light">Uso del espacio</span>
          <h2>
            ¿Tienes una actividad <em>en mente?</em>
          </h2>
          <p>
            Cuéntanos sobre el formato, la fecha tentativa y las necesidades de tu proyecto. Tarifas
            y disponibilidad se confirman directamente con el equipo.
          </p>
        </div>
        <Button kind="light" onClick={() => go("contacto")}>
          Consultar disponibilidad
        </Button>
      </section>
    </main>
  );
}

function Artists({ go }: { go: (p: Page) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="Artistas"
        title={
          <>
            Crear cerca de otros <em>transforma el proceso.</em>
          </>
        }
        text="Una plataforma para conversar, hacer y compartir prácticas artísticas."
        image="/images/proceso-provisional.png"
      />
      <section className="artist-empty">
        <span className="kicker">Comunidad</span>
        <div className="abstract-work">
          <i />
          <i />
          <i />
        </div>
        <div>
          <h2>
            Perfiles y proyectos, <em>próximamente.</em>
          </h2>
          <p>
            Este espacio mostrará artistas y obras cuando exista información real y autorización
            para publicarla. No presentamos perfiles ficticios como integrantes de la comunidad.
          </p>
          <Button onClick={() => go("contacto")}>Contactar al espacio</Button>
        </div>
      </section>
    </main>
  );
}

function Blog() {
  return (
    <main>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Notas sobre arte, procesos <em>y ciudad.</em>
          </>
        }
        text="Un espacio editorial para registrar preguntas, aprendizajes y conversaciones."
      />
      <section className="blog-empty">
        <span className="empty-glyph">Aa</span>
        <h2>Estamos preparando las primeras notas.</h2>
        <p>Cuando haya publicaciones reales, aquí aparecerán organizadas por fecha y tema.</p>
        <span>Estado vacío diseñado · Sin contenido ficticio</span>
      </section>
    </main>
  );
}

function Contact({ purpose = "general" }: { purpose?: "general" | "space" }) {
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageHero
        eyebrow="Contacto"
        title={
          <>
            Hablemos de lo que quieres <em>hacer.</em>
          </>
        }
        text="Talleres, actividades, espacio o comunidad: elige el canal que prefieras."
      />
      <section className="contact-layout">
        <div className="contact-info">
          <h2>El Bombillo</h2>
          <p>
            <Icon name="pin" /> Chapinero, Bogotá
            <br />
            <small>Dirección exacta por verificar</small>
          </p>
          <p>
            <strong>WhatsApp</strong>
            <br />
            <small>Número por configurar antes de publicar</small>
          </p>
          <p>
            <strong>Correo</strong>
            <br />
            <small>Dirección por configurar antes de publicar</small>
          </p>
          <Button kind="outline" disabled>
            WhatsApp por configurar
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="form-card"
        >
          <div>
            <span className="kicker">
              {purpose === "space" ? "Consulta de espacio" : "Escríbenos"}
            </span>
            <h2>{sent ? "Mensaje preparado." : "Cuéntanos un poco."}</h2>
          </div>
          {sent ? (
            <div className="notice success">
              <Icon name="check" />
              <div>
                <strong>Simulación completada</strong>
                <p>En producción, este mensaje se enviará al canal configurado del negocio.</p>
              </div>
            </div>
          ) : (
            <>
              <label>
                Nombre completo
                <input required placeholder="Tu nombre" />
              </label>
              <label>
                Correo electrónico
                <input required type="email" placeholder="nombre@correo.com" />
              </label>
              <label>
                Motivo
                <select defaultValue={purpose === "space" ? "Espacio" : ""}>
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option>Talleres</option>
                  <option>Espacio</option>
                  <option>Artistas y comunidad</option>
                  <option>Otro</option>
                </select>
              </label>
              <label>
                Mensaje
                <textarea required placeholder="¿Cómo podemos ayudarte?" />
              </label>
              <small>Prototipo: este formulario no envía datos al negocio.</small>
              <Button type="submit">Preparar mensaje</Button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

function Agenda({ go }: { go: (p: Page) => void }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [group, setGroup] = useState("martes");
  const [expanded, setExpanded] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("all");
  return (
    <main>
      <section className="agenda-head">
        <span className="kicker">Agenda de módulos</span>
        <h1>
          Elige un proceso,
          <br />
          <em>no una hora suelta.</em>
        </h1>
        <p>Consulta las cuatro clases de cada módulo y solicita cupo para el proceso completo.</p>
        <div className="demo-strip">
          Datos de demostración · No corresponden a programación real
        </div>
      </section>
      <section className="agenda-group-switch" aria-label="Seleccionar grupo">
        {groups.map((g) => (
          <button
            className={group === g.id ? "active" : ""}
            onClick={() => setGroup(g.id)}
            key={g.id}
          >
            <span>{g.day}</span>
            <small>{g.ages}</small>
          </button>
        ))}
      </section>
      <section className="agenda-tools">
        <div className="filters">
          <select aria-label="Módulo" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
            <option value="all">Todos los módulos</option>
            <option value="one">Módulo 1</option>
          </select>
          <select aria-label="Mes">
            <option>Octubre 2025</option>
          </select>
          <span className="result-count">
            {group === "martes" ? (moduleFilter === "all" ? "2 módulos encontrados" : "1 módulo encontrado") : "Sin programación publicada"}
          </span>
        </div>
        <div className="view-toggle">
          <button className={view === "list" ? "selected" : ""} onClick={() => setView("list")}>
            Lista
          </button>
          <button
            className={view === "calendar" ? "selected" : ""}
            onClick={() => setView("calendar")}
          >
            Calendario
          </button>
        </div>
      </section>
      {group !== "martes" ? (
        <section className="empty-state reveal">
          <Icon name="calendar" size={40} />
          <h2>Programación por confirmar</h2>
          <p>Este grupo todavía no tiene módulos publicados.</p>
          <Button kind="outline" onClick={() => setGroup("martes")}>
            Ver grupo del martes
          </Button>
        </section>
      ) : view === "list" ? (
        <section className="module-list">
          <article className={`module-card ${expanded ? "expanded" : ""}`}>
            <div className="module-summary">
              <div>
                <Badge>Inscripciones abiertas</Badge>
                <span className="kicker">Módulo 1 · Grupo martes</span>
                <h2>Formas de mirar</h2>
                <p>Una exploración de color, materia, volumen y relato.</p>
                <button
                  className="expand-module"
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                >
                  {expanded ? "Ocultar las 4 clases" : "Ver las 4 clases"}{" "}
                  <span>{expanded ? "−" : "+"}</span>
                </button>
              </div>
              <div className="price">
                <strong>$250.000</strong>
                <span>COP · módulo completo</span>
                <small>Materiales incluidos</small>
              </div>
            </div>
            <div className="class-list" aria-hidden={!expanded} inert={!expanded}>
              {classes.map((c, i) => (
                <button onClick={() => go("modulo")} key={c.date}>
                  <span>{i + 1}</span>
                  <strong>{c.date}</strong>
                  <div>
                    {c.title}
                    <small>{c.note}</small>
                  </div>
                  <time>10:00–11:30</time>
                  <Icon name="arrow" />
                </button>
              ))}
            </div>
            <div className="module-actions">
              <span>4 clases · 6 a 10 años · Martes</span>
              <Button onClick={() => go("modulo")}>Ver módulo</Button>
            </div>
          </article>
          <article className="module-card muted" hidden={moduleFilter === "one"}>
            <div className="module-summary">
              <div>
                <Badge tone="yellow">Próximamente</Badge>
                <span className="kicker">Módulo 2 · Grupo martes</span>
                <h2>Imágenes que cuentan</h2>
                <p>Fechas y temas de ejemplo pendientes de confirmación.</p>
              </div>
              <div className="price">
                <strong>$250.000</strong>
                <span>COP · módulo completo</span>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <Calendar go={go} />
      )}
    </main>
  );
}

function Calendar({ go }: { go: (p: Page) => void }) {
  const days = Array.from({ length: 35 }, (_, i) => i - 1);
  return (
    <section className="calendar">
      <div className="calendar-top">
        <button
          disabled
          title="Mes único en la demostración"
          aria-label="Mes anterior no disponible"
        >
          ←
        </button>
        <h2>
          Octubre 2025 <small>Datos de demostración</small>
        </h2>
        <button
          disabled
          title="Mes único en la demostración"
          aria-label="Mes siguiente no disponible"
        >
          →
        </button>
      </div>
      <div className="week">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="days">
        {days.map((d, i) => (
          <div className={d < 1 || d > 31 ? "outside" : ""} key={i}>
            <span>{d < 1 || d > 31 ? "" : d}</span>
            {[7, 14, 21, 28].includes(d) && (
              <button
                onClick={() => go("modulo")}
                aria-label={`${d} de octubre, Formas de mirar a las 10:00`}
              >
                <b>10:00</b> Formas de mirar
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Workshop({ go }: { go: (p: Page) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="Taller · Información de ejemplo"
        title={
          <>
            Laboratorio de <em>dibujo.</em>
          </>
        }
        text="Una exploración de observación, línea y gesto. Información práctica pendiente de confirmar."
        image="/images/proceso-provisional.png"
      />
      <section className="detail-layout">
        <div>
          <h2>Sobre el taller</h2>
          <p>
            Este texto funciona como plantilla para un taller general. La descripción definitiva,
            docente, fechas, horarios y valor deben completarse con información real.
          </p>
          <h3>¿Qué exploraremos?</h3>
          <ul>
            <li>Observación y registro</li>
            <li>Línea, ritmo y composición</li>
            <li>Bitácora de proceso</li>
          </ul>
        </div>
        <aside>
          <Badge tone="yellow">Programación por confirmar</Badge>
          <dl>
            <dt>Público</dt>
            <dd>Jóvenes y adultos</dd>
            <dt>Horario</dt>
            <dd>Por confirmar</dd>
            <dt>Valor</dt>
            <dd>Por confirmar</dd>
          </dl>
          <Button onClick={() => go("contacto")}>Consultar interés</Button>
        </aside>
      </section>
    </main>
  );
}

function ModuleDetail({ go }: { go: (p: Page) => void }) {
  return (
    <main>
      <section className="module-hero">
        <div>
          <Badge>Inscripciones abiertas</Badge>
          <span className="kicker">Homeschooling · Módulo 1 · Grupo martes</span>
          <h1>
            Formas
            <br />
            <em>de mirar</em>
          </h1>
          <p>
            Una exploración de forma, color, volumen y relato para niñas y niños de 6 a 10 años.
          </p>
          <span className="demo-strip">Datos de demostración</span>
        </div>
        <div className="module-price">
          <span>Módulo completo</span>
          <strong>$250.000</strong>
          <small>COP · materiales incluidos</small>
          <Button onClick={() => go("solicitud")}>Solicitar cupo</Button>
          <Button kind="text" onClick={() => go("contacto")}>
            Consultar por WhatsApp <Icon name="arrow" />
          </Button>
        </div>
      </section>
      <section className="syllabus">
        <SectionTitle eyebrow="El recorrido">
          Cuatro clases, <em>un proceso.</em>
        </SectionTitle>
        {classes.map((c, i) => (
          <article key={c.date}>
            <span>0{i + 1}</span>
            <div>
              <small>{c.date} · 10:00 a 11:30 a. m.</small>
              <h3>{c.title}</h3>
              <p>{c.note}. Tema de demostración sujeto a confirmación.</p>
            </div>
          </article>
        ))}
      </section>
      <section className="module-facts">
        <div>
          <strong>6–10</strong>
          <span>años</span>
        </div>
        <div>
          <strong>Martes</strong>
          <span>10:00–11:30</span>
        </div>
        <div>
          <strong>4</strong>
          <span>clases</span>
        </div>
        <div>
          <strong>Sí</strong>
          <span>materiales incluidos</span>
        </div>
      </section>
    </main>
  );
}

function Request({ go }: { go: (p: Page) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const age = Number((form.elements.namedItem("age") as HTMLInputElement).value);
    if (age < 6 || age > 10) {
      setError("La edad debe estar entre 6 y 10 años para este grupo.");
      return;
    }
    setLoading(true);
    setTimeout(() => go("recibida"), 800);
  };
  return (
    <main className="request-page">
      <div className="steps">
        <span className="done">
          1 <i>Grupo</i>
        </span>
        <span className="done">
          2 <i>Módulo</i>
        </span>
        <span className="active">
          3 <i>Solicitud</i>
        </span>
        <span>
          4 <i>Resumen</i>
        </span>
      </div>
      <div className="request-layout">
        <form onSubmit={submit} className="request-form">
          <span className="kicker">Paso 3 de 4</span>
          <h1>Solicitar cupo</h1>
          <p>Completa los datos esenciales. El equipo confirmará la disponibilidad después.</p>
          <div className="two-fields">
            <label>
              Nombre del acudiente
              <input required placeholder="Nombre y apellido" />
            </label>
            <label>
              Celular
              <input required type="tel" placeholder="+57 300 000 0000" />
            </label>
          </div>
          <label>
            Correo <small>Opcional</small>
            <input type="email" placeholder="nombre@correo.com" />
          </label>
          <div className="two-fields">
            <label>
              Nombre del participante
              <input required placeholder="Nombre y apellido" />
            </label>
            <label>
              Edad
              <input name="age" required type="number" min="1" max="18" placeholder="Edad" />
              {error && <span className="field-error">{error}</span>}
            </label>
          </div>
          <label>
            Comentario <small>Opcional</small>
            <textarea placeholder="Algo que debamos saber sobre la solicitud" />
          </label>
          <label className="checkbox">
            <input required type="checkbox" />
            <span>
              Entiendo que esta es una solicitud pendiente de confirmación. El aviso de privacidad
              definitivo debe incorporarse para producción.
            </span>
          </label>
          <div className="notice">
            <span>i</span>
            <p>Prototipo: el envío es simulado y no llega al negocio.</p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando solicitud…" : "Enviar solicitud"}
          </Button>
        </form>
        <aside className="sticky-summary">
          <span className="kicker">Tu selección</span>
          <Badge>Inscripciones abiertas</Badge>
          <h2>Formas de mirar</h2>
          <p>
            Módulo 1 · Grupo martes
            <br />6 a 10 años · 10:00–11:30
          </p>
          <hr />
          <span>4 clases · Octubre 2025</span>
          <span>Materiales incluidos</span>
          <div className="total">
            <small>Total del módulo</small>
            <strong>$250.000 COP</strong>
          </div>
          <small>Fechas de demostración</small>
        </aside>
      </div>
    </main>
  );
}

function Received({ go }: { go: (p: Page) => void }) {
  return (
    <main className="received">
      <div className="success-mark">
        <Icon name="check" size={40} />
      </div>
      <span className="kicker">Solicitud simulada · EB-DEMO-024</span>
      <h1>
        Solicitud recibida.
        <br />
        <em>Tu cupo está pendiente de confirmación.</em>
      </h1>
      <p>
        En un sistema conectado, el equipo revisaría la solicitud y se comunicaría contigo para
        confirmar el cupo.
      </p>
      <div className="received-card">
        <div>
          <span>Módulo</span>
          <strong>Formas de mirar</strong>
        </div>
        <div>
          <span>Grupo</span>
          <strong>Martes · 6 a 10 años</strong>
        </div>
        <div>
          <span>Horario</span>
          <strong>10:00–11:30 a. m.</strong>
        </div>
        <div>
          <span>Valor</span>
          <strong>$250.000 COP</strong>
        </div>
      </div>
      <div className="notice">
        <span>1</span>
        <p>
          <strong>Siguiente paso</strong>
          <br />
          Espera la confirmación del equipo. Este prototipo no envió la solicitud realmente.
        </p>
      </div>
      <div className="actions">
        <Button onClick={() => go("contacto")}>Continuar por WhatsApp</Button>
        <Button kind="text" onClick={() => go("inicio")}>
          Volver al inicio <Icon name="arrow" />
        </Button>
      </div>
    </main>
  );
}

function Admin({ go }: { go: (p: Page) => void }) {
  const [tab, setTab] = useState<"resumen" | "agenda" | "solicitudes" | "config">("resumen");
  const [saved, setSaved] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [editorVersion, setEditorVersion] = useState(0);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <main className="admin-shell">
      <aside className="admin-nav">
        <button className="brand admin-brand" onClick={() => go("inicio")}>
          <span className="brand-mark">
            <i />
          </span>
          <span>
            EL
            <br />
            BOMBILLO
          </span>
        </button>
        <span className="admin-label">Panel del equipo</span>
        {(
          [
            ["resumen", "Resumen"],
            ["agenda", "Agenda"],
            ["solicitudes", "Solicitudes"],
            ["config", "Configuración"],
          ] as const
        ).map((x) => (
          <button className={tab === x[0] ? "active" : ""} onClick={() => setTab(x[0])} key={x[0]}>
            {x[1]}
            <Icon name="arrow" />
          </button>
        ))}
        <div className="admin-user">
          <Icon name="user" />
          <span>
            Perfil administrador<small>Prototipo sin autenticación real</small>
          </span>
        </div>
        <button onClick={() => go("inicio")}>Salir al sitio</button>
      </aside>
      <section className="admin-content">
        <div className="admin-top">
          <div>
            <span className="kicker">Datos de demostración</span>
            <h1>
              {tab === "resumen"
                ? "Buenos días, equipo."
                : tab === "agenda"
                  ? "Gestión de agenda"
                  : tab === "solicitudes"
                    ? "Solicitudes de cupo"
                    : "Configuración básica"}
            </h1>
          </div>
          <span className="role-chip">Administrador</span>
        </div>
        {tab === "resumen" && (
          <>
            <div className="stat-grid">
              <div>
                <span>Pendientes</span>
                <strong>08</strong>
                <small>Solicitudes por revisar</small>
              </div>
              <div>
                <span>Confirmadas</span>
                <strong>14</strong>
                <small>En módulos activos</small>
              </div>
              <div>
                <span>Próxima clase</span>
                <strong>07 oct</strong>
                <small>10:00 · Grupo martes</small>
              </div>
            </div>
            <div className="admin-panels">
              <div>
                <h2>Accesos rápidos</h2>
                <button onClick={() => setTab("agenda")}>
                  <Icon name="calendar" />
                  Editar programación
                  <Icon name="arrow" />
                </button>
                <button onClick={() => setTab("solicitudes")}>
                  <Icon name="user" />
                  Revisar pendientes
                  <Icon name="arrow" />
                </button>
              </div>
              <div>
                <h2>Actividad reciente</h2>
                <p>
                  <Badge>Solicitud pendiente</Badge> EB-DEMO-024 · Hace 12 min
                </p>
                <p>
                  <Badge tone="dark">Agenda actualizada</Badge> Módulo 1 · Ayer
                </p>
              </div>
            </div>
          </>
        )}
        {tab === "agenda" && (
          <div className="admin-editor">
            <div className="editor-list">
              <div>
                <h2>Módulos</h2>
                <button disabled title="Creación no incluida en esta demostración">
                  <Icon name="plus" /> Nuevo
                </button>
              </div>
              <button className="selected">
                <Badge>Abiertas</Badge>
                <strong>Módulo 1 · Formas de mirar</strong>
                <small>4 clases · Grupo martes</small>
              </button>
              <button disabled title="Programación todavía no editable">
                <Badge tone="yellow">Próximamente</Badge>
                <strong>Módulo 2 · Imágenes que cuentan</strong>
                <small>Sin fechas confirmadas</small>
              </button>
            </div>
            <div className="editor-form" key={editorVersion}>
              <div className="editor-title">
                <div>
                  <span className="kicker">Grupo martes · 6 a 10 años</span>
                  <h2>Editar módulo</h2>
                </div>
                <button disabled title="Opciones no incluidas en esta demostración">
                  Más opciones
                </button>
              </div>
              <div className="two-fields">
                <label>
                  Nombre del módulo
                  <input defaultValue="Formas de mirar" />
                </label>
                <label>
                  Estado
                  <select defaultValue="Abiertas">
                    <option>Abiertas</option>
                    <option>Próximamente</option>
                    <option>Cerradas</option>
                    <option>Sin cupos</option>
                  </select>
                </label>
              </div>
              <label>
                Descripción
                <textarea defaultValue="Una exploración de color, materia, volumen y relato." />
              </label>
              <div className="two-fields">
                <label>
                  Precio COP
                  <input defaultValue="250000" />
                </label>
                <label>
                  Capacidad <small>Opcional</small>
                  <input placeholder="Solo si está confirmada" />
                </label>
              </div>
              <h3>Clases del módulo</h3>
              {classes.map((c, i) => (
                <div className="admin-class" key={c.date}>
                  <span>0{i + 1}</span>
                  <input aria-label={`Tema clase ${i + 1}`} defaultValue={c.title} />
                  <input
                    aria-label={`Fecha clase ${i + 1}`}
                    defaultValue={`${7 + i * 7}/10/2025`}
                  />
                  <input aria-label={`Hora clase ${i + 1}`} defaultValue="10:00–11:30" />
                </div>
              ))}
              <div className="save-bar">
                <span>Demo visual: los cambios no se guardan al recargar.</span>
                <Button kind="outline" onClick={() => setEditorVersion((value) => value + 1)}>
                  Descartar cambios
                </Button>
                <Button onClick={save}>Guardar cambios</Button>
              </div>
            </div>
          </div>
        )}
        {tab === "solicitudes" && (
          <div className="requests-admin">
            <div className="admin-filters">
              <label>
                <Icon name="search" />
                <input placeholder="Buscar acudiente o referencia" />
              </label>
              <select>
                <option>Todos los grupos</option>
              </select>
              <select>
                <option>Todos los estados</option>
              </select>
            </div>
            <div className="request-table">
              <div className="tr th">
                <span>Referencia</span>
                <span>Acudiente / participante</span>
                <span>Módulo</span>
                <span>Estado</span>
                <span></span>
              </div>
              <div className="tr">
                <span>
                  <strong>EB-DEMO-024</strong>
                  <small>Hoy, 9:42</small>
                </span>
                <span>
                  <strong>Nombre de ejemplo</strong>
                  <small>Participante · 8 años</small>
                </span>
                <span>
                  Módulo 1<small>Grupo martes</small>
                </span>
                <span>
                  <Badge tone={confirmed ? "dark" : "yellow"}>
                    {confirmed ? "Confirmada" : "Pendiente"}
                  </Badge>
                </span>
                <span>
                  <Button kind="text" onClick={() => setConfirmed(true)}>
                    {confirmed ? "Ver detalle" : "Confirmar"} <Icon name="arrow" />
                  </Button>
                </span>
              </div>
              <div className="tr">
                <span>
                  <strong>EB-DEMO-019</strong>
                  <small>Ayer, 15:10</small>
                </span>
                <span>
                  <strong>Dato ficticio</strong>
                  <small>Participante · 10 años</small>
                </span>
                <span>
                  Módulo 1<small>Grupo martes</small>
                </span>
                <span>
                  <Badge>Confirmada</Badge>
                </span>
                <span>
                  <Button kind="text">
                    Ver detalle <Icon name="arrow" />
                  </Button>
                </span>
              </div>
            </div>
          </div>
        )}
        {tab === "config" && (
          <div className="settings-form">
            <div className="notice">
              <span>i</span>
              <p>
                Estos datos están vacíos intencionalmente. Verifica la información real antes de
                publicarla.
              </p>
            </div>
            <h2>Contacto del espacio</h2>
            <div className="two-fields">
              <label>
                WhatsApp
                <input placeholder="+57" />
              </label>
              <label>
                Correo público
                <input type="email" placeholder="hola@..." />
              </label>
            </div>
            <label>
              Dirección pública
              <input placeholder="Dirección verificada" />
            </label>
            <h2>Información del programa</h2>
            <div className="two-fields">
              <label>
                Valor por módulo
                <input defaultValue="$250.000 COP" />
              </label>
              <label>
                Horario general
                <input defaultValue="10:00 a 11:30 a. m." />
              </label>
            </div>
            <div className="save-bar">
              <span>Perfil de consulta: solo lectura · Administrador: puede editar</span>
              <Button onClick={save}>Guardar configuración</Button>
            </div>
          </div>
        )}
        {saved && (
          <div className="toast">
            <Icon name="check" />
            Vista de guardado simulada. Los cambios no se publican.
          </div>
        )}
      </section>
    </main>
  );
}

export default function App() {
  const pageFromHash = (): Page => {
    const value = window.location.hash.replace("#/", "").replace("#", "") as Page;
    return [
      "inicio",
      "nosotros",
      "academia",
      "homeschooling",
      "espacio",
      "artistas",
      "blog",
      "contacto",
      "agenda",
      "taller",
      "modulo",
      "solicitud",
      "recibida",
      "admin",
    ].includes(value)
      ? value
      : "inicio";
  };
  const [page, setPage] = useState<Page>(pageFromHash);
  const go = (p: Page) => {
    if (p !== page) window.history.pushState({ page: p }, "", `#/${p}`);
    setPage(p);
    window.scrollTo({top: 0, behavior: "instant"});
  };
  useEffect(() => {
    const onPop = () => setPage(pageFromHash());
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {window.removeEventListener("popstate", onPop);window.removeEventListener("hashchange", onPop)};
  }, []);
  useEffect(() => {
    document.title = `${page === "inicio" ? "El Bombillo" : page[0].toUpperCase() + page.slice(1)} — El Bombillo`;
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>("#page-content")?.focus({ preventScroll: true }),
    );
  }, [page]);
  const content: Record<Page, ReactNode> = {
    inicio: <Home go={go} />,
    nosotros: <About go={go} />,
    academia: <Academy go={go} />,
    homeschooling: <Homeschool go={go} />,
    espacio: <Space go={go} />,
    artistas: <Artists go={go} />,
    blog: <Blog />,
    contacto: <Contact />,
    agenda: <Agenda go={go} />,
    taller: <Workshop go={go} />,
    modulo: <ModuleDetail go={go} />,
    solicitud: <Request go={go} />,
    recibida: <Received go={go} />,
    admin: <Admin go={go} />,
  };
  if (page === "admin")
    return (
      <div id="page-content" tabIndex={-1} className="page-transition" key={page}>
        {content.admin}
      </div>
    );
  return (
    <>
      <RevealSystem page={page} />
      <Header go={go} page={page} />
      <div id="page-content" tabIndex={-1} className="page-transition" key={page}>
        {content[page]}
        {page !== "inicio" && <Footer go={go} />}
      </div>
    </>
  );
}
