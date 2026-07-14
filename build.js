/**
 * build.js — Viconik
 * Lee content/blog/*.md (editados desde /interno/admin/) y genera:
 *   - interno/blog/<slug>/index.html   (un HTML por artículo)
 *   - interno/blog/index.html          (índice con filtros)
 *   - actualiza el módulo "Desde el blog" en interno/index.html
 *
 * Se ejecuta automáticamente en cada deploy (ver netlify.toml → build.command)
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");
const yaml = require("js-yaml");

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, "content/blog");
const OUT_DIR = path.join(ROOT, "interno/blog");
const LANDING_FILE = path.join(ROOT, "interno/index.html");
const DESTACADOS_FILE = path.join(ROOT, "content/landing/blog_destacados.yml");

// ─────────────────────────────────────────────────────────
// Diseño — idéntico al usado en la generación original
// ─────────────────────────────────────────────────────────
const SVG_DARK = '<svg aria-hidden="true" fill="none" viewBox="0 0 653 357" xmlns="http://www.w3.org/2000/svg"><path d="M503.37,181.6c51.02,14.35,67.89,50.72,94.59,92.55l34.52,54.08c.52.82.79,3.25.49,3.98-.37.92-2.41,2.28-3.49,2.28l-76.04.06c-36.28.03-54.62-23.27-71.39-51.6l-27.19-45.94c-8.99-15.18-18.17-29.32-28.1-43.79-5.27-6.59-12.09-11.42-20.93-12.04-18.07-1.26-35.83-1.5-54.55-.53,24.41,17.78,48.77,35.93,66.97,58.09,15.85,19.49,25.39,42.82,26.43,68.15.33,7.97.19,15.03.12,23.13-.02,1.94-2.75,4.56-4.94,4.57h-100.28c-2.48.01-4.96-1.85-4.96-4.76l.1-311.63c0-3.59,2.33-5.22,5.36-5.22h99.9c2.35,0,5.16,1.44,5.18,3.9.83,78.89-30.23,107.77-93.62,148.53,26.05,1.3,58.65.81,81.71-10.85,14.22-6.8,24.58-17.5,31.59-31.6,11.18-22.47,32.19-64.83,46.24-83.83,12.53-16.95,31.65-26.07,52.94-26.11l64.04-.12c1.97,0,5.57,2.42,4.41,4.47-10.87,19.18-22.26,37.01-35.1,54.93-37.95,52.96-93.26,84.89-157.07,95.92l-14.65,3.6,42.96,3.67c11.81,1.01,23.32,2.89,34.76,6.1Z" fill="#111010"/><path d="M320.36,13.05c2.89,0,4.5,2.7,3.65,4.97l-29.03,77.94-55.57,150.35-30.75,84.03c-.79,2.15-3.42,4.05-5.57,4.05h-61.17c-1.73,0-4.42-1.77-5.02-3.43l-33.54-92.38-42.94-116.02L21.48,18.78c-.33-.89-.23-3,.05-3.71.35-.88,2.38-2.09,3.54-2.09l105.93-.03c2.36,0,4.93,1.36,5.58,3.66l17.7,62.33,48.48,166.17c3.29,11.28,6.55,21.17,10.6,32.28l27.15-73.9,15.96-43.14c-27.66-26.33-51.64-48.01-53.92-88-1.09-19.11,2.14-37.57,9.27-55.33.89-2.22,3.79-4.05,6.2-4.04l102.35.07Z" fill="#111010"/></svg>';
const SVG_LIGHT = SVG_DARK.replace(/fill="#111010"/g, 'fill="#EDEBE7"');

const BASE_CSS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{--k:#111010;--w:#EDEBE7;--g:#8a8780;--l:#C8C5BF;--b:#E5E3DE;--brd:rgba(17,16,16,.1);--mono:'DM Mono',monospace;--bebas:'Bebas Neue',sans-serif;--serif:'Playfair Display',serif;--sans:'DM Sans',sans-serif;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{background:var(--w);color:var(--k);font-family:var(--sans);line-height:1.65;overflow-x:hidden;font-size:17px;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}button{font-family:inherit;cursor:pointer}
nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:.9rem 3.5rem;background:rgba(237,235,231,.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--brd);transition:box-shadow .3s}
nav.scrolled{box-shadow:0 2px 28px rgba(17,16,16,.07)}
.nav-logo{display:flex;align-items:center;gap:.65rem}.nav-logo svg{height:22px;width:auto;display:block}
.nav-logo-text{font-family:var(--serif);font-size:1.15rem;letter-spacing:.01em;color:var(--k)}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-links a{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--g);position:relative;transition:color .2s}
.nav-links a::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1.5px;background:var(--k);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,0,.15,1)}
.nav-links a:hover{color:var(--k)}.nav-links a:hover::after{transform:scaleX(1)}
.nav-cta{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;background:var(--k);color:var(--w);padding:.55rem 1.4rem;border:1.5px solid var(--k);transition:all .2s}
.nav-cta:hover{background:transparent;color:var(--k)}
.nav-toggle{display:none;flex-direction:column;gap:5px;width:28px;height:22px;background:none;border:none;padding:0;margin-left:.75rem}
.nav-toggle span{display:block;width:100%;height:2px;background:var(--k);transition:transform .25s,opacity .25s}
.nav-toggle.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}.nav-toggle.open span:nth-child(2){opacity:0}.nav-toggle.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
footer{background:var(--k);color:var(--w);padding:3rem 3.5rem 2rem}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-top{display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:2rem;padding-bottom:2rem;border-bottom:1px solid rgba(237,235,231,.1)}
.footer-brand-col{display:flex;flex-direction:column;gap:.6rem}
.footer-logo{display:flex;align-items:center;gap:.55rem}.footer-logo svg{height:20px;width:auto}
.footer-wordmark{font-family:var(--serif);font-size:1rem;color:var(--w)}
.footer-descriptor{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(237,235,231,.3)}
.footer-email{font-family:var(--mono);font-size:11px;color:rgba(237,235,231,.4);transition:color .2s}.footer-email:hover{color:var(--w)}
.footer-nav{display:flex;gap:3rem;flex-wrap:wrap}
.footer-nav-col{display:flex;flex-direction:column;gap:.5rem}
.footer-nav-label{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(237,235,231,.25);margin-bottom:.25rem}
.footer-nav-col a{font-size:13px;font-weight:300;color:rgba(237,235,231,.45);transition:color .2s}.footer-nav-col a:hover{color:var(--w)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;flex-wrap:wrap;gap:1rem}
.footer-legal{font-family:var(--mono);font-size:10px;color:rgba(237,235,231,.2);letter-spacing:.04em}
.footer-tagline-bottom{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(237,235,231,.15)}
@media(max-width:900px){nav{padding:.8rem 1.5rem}.nav-links{display:none}.nav-links.open{display:flex;flex-direction:column;position:fixed;top:57px;left:0;right:0;background:rgba(237,235,231,.98);padding:1.5rem;gap:1.25rem;border-bottom:1px solid var(--brd)}.nav-toggle{display:flex}footer{padding:2.5rem 1.5rem 1.5rem}.footer-top{flex-direction:column}.footer-nav{gap:2rem}}
</style>`;

const POST_CSS = `<style>
.breadcrumb{padding:6rem 3.5rem 0;font-size:13px;color:var(--g);font-family:var(--mono);letter-spacing:.04em}
.breadcrumb a{color:var(--g);transition:color .2s}.breadcrumb a:hover{color:var(--k)}.breadcrumb .sep{margin:0 .6rem;opacity:.4}
.post-wrap{max-width:740px;margin:0 auto;padding:3rem 3.5rem 6rem}
.post-pubblico{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:.25rem .75rem;margin-bottom:1rem}
.pubblico-cliente{background:rgba(17,16,16,.06);color:var(--k);border:1.5px solid rgba(17,16,16,.15)}
.pubblico-sector{background:rgba(100,80,180,.07);color:#5040a0;border:1.5px solid rgba(100,80,180,.2)}
.pubblico-ambos{background:rgba(20,120,80,.07);color:#206050;border:1.5px solid rgba(20,120,80,.2)}
.post-meta{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
.post-cat{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;background:var(--b);padding:.3rem .8rem;color:var(--g)}
.post-time{font-family:var(--mono);font-size:11px;color:var(--l)}.post-date{font-family:var(--mono);font-size:11px;color:var(--l)}
.post-title{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);line-height:1.15;letter-spacing:.01em;margin-bottom:1.5rem;color:var(--k)}
.post-deck{font-size:1.15rem;font-weight:300;color:var(--g);line-height:1.75;margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid var(--brd)}
.post-body h2{font-family:var(--serif);font-size:1.55rem;font-weight:700;margin:2.5rem 0 1rem;line-height:1.25;color:var(--k)}
.post-body h3{font-family:var(--sans);font-size:1.1rem;font-weight:500;margin:2rem 0 .75rem;color:var(--k)}
.post-body p{margin-bottom:1.3rem;font-weight:300;line-height:1.8;color:#2a2826}
.post-body ul,.post-body ol{margin:1rem 0 1.5rem 1.25rem;display:flex;flex-direction:column;gap:.5rem}
.post-body li{font-weight:300;line-height:1.75;color:#2a2826}
.post-body strong{font-weight:500;color:var(--k)}
.post-body blockquote{border-left:3px solid var(--k);padding:.75rem 1.5rem;margin:2rem 0;background:var(--b)}
.post-body blockquote p{color:var(--g);font-style:italic;margin:0}
.post-body hr{border:none;border-top:1px solid var(--brd);margin:2.5rem 0}
.post-body code{font-family:var(--mono);font-size:.85em;background:var(--b);padding:.15em .4em}
.post-body pre{background:var(--b);padding:1rem;overflow-x:auto;margin:1rem 0}
.post-body pre code{background:none;padding:0}
.callout{background:var(--b);border-left:3px solid var(--k);padding:1.25rem 1.5rem;margin:2rem 0}
.callout-label{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:.5rem}
.callout p{margin:0;font-size:15px;color:var(--k);font-weight:300;line-height:1.7}
.faq-section{margin-top:3rem;padding-top:2.5rem;border-top:1px solid var(--brd)}
.faq-section h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--g);margin-bottom:1.5rem}
.faq-item{border-bottom:1px solid var(--brd);padding:.9rem 0}.faq-item:first-of-type{border-top:1px solid var(--brd)}
.faq-q-text{font-family:var(--sans);font-size:15px;font-weight:500;color:var(--k);margin-bottom:.5rem}
.faq-a-text{font-size:14px;font-weight:300;color:var(--g);line-height:1.7}
.post-cta{background:var(--k);color:var(--w);padding:2.5rem;margin:3rem 0;text-align:center}
.post-cta p{font-size:1rem;font-weight:300;color:rgba(237,235,231,.7);margin-bottom:1.25rem}
.post-cta strong{color:var(--w);font-weight:500}
.post-cta .btn{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:.75rem 1.75rem;background:var(--w);color:var(--k);display:inline-block;transition:opacity .2s}
.post-cta .btn:hover{opacity:.85}
.post-back{margin-top:2rem;font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--g)}
.post-back a{color:var(--g);transition:color .2s}.post-back a:hover{color:var(--k)}
.related{margin-top:4rem;padding-top:2.5rem;border-top:1px solid var(--brd)}
.related-label{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--g);margin-bottom:1.5rem}
.related-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
.related-card{padding:1.5rem;border:1px solid var(--brd);transition:border-color .2s}.related-card:hover{border-color:var(--k)}
.related-cat{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--g);margin-bottom:.5rem}
.related-title{font-family:var(--serif);font-size:1.05rem;line-height:1.3;color:var(--k)}
@media(max-width:900px){.post-wrap{padding:2rem 1.5rem 5rem}.breadcrumb{padding:5rem 1.5rem 0}.related-grid{grid-template-columns:1fr}}
</style>`;

const INDEX_CSS = `<style>
.blog-hero{padding:8rem 3.5rem 3rem;max-width:1100px;margin:0 auto}
.blog-hero-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--g);display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem}
.blog-hero-eyebrow::before{content:'';width:24px;height:1px;background:var(--l)}
.blog-hero h1{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4rem);line-height:1.1;letter-spacing:.01em;margin-bottom:1rem;color:var(--k)}
.blog-hero p{font-size:1.1rem;font-weight:300;color:var(--g);line-height:1.75;max-width:580px}
.filters-wrap{padding:0 3.5rem 2rem;max-width:1100px;margin:0 auto}
.filters-group{margin-bottom:.75rem}
.filters-label{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--l);margin-bottom:.6rem;display:block}
.filters{display:flex;flex-wrap:wrap;gap:.5rem}
.filter-btn{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:.45rem 1rem;background:transparent;border:1.5px solid var(--brd);color:var(--g);cursor:pointer;transition:all .2s}
.filter-btn:hover{border-color:var(--k);color:var(--k)}
.filter-btn.active{background:var(--k);color:var(--w);border-color:var(--k)}
.blog-counter{padding:0 3.5rem .75rem;max-width:1100px;margin:0 auto;font-family:var(--mono);font-size:11px;color:var(--l);letter-spacing:.06em}
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem;padding:0 3.5rem 5rem;max-width:1100px;margin:0 auto}
.blog-card{display:flex;flex-direction:column;padding:1.75rem;border:1px solid var(--brd);transition:all .25s;background:transparent;position:relative}
.blog-card:hover{border-color:var(--k);box-shadow:0 6px 24px rgba(17,16,16,.07);transform:translateY(-2px)}
.blog-card.hidden{display:none}
.card-top{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
.card-cat{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--g);background:var(--b);padding:.25rem .65rem}
.card-pub{font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:.2rem .55rem;border-radius:2px}
.pub-cliente{background:rgba(17,16,16,.06);color:var(--k);border:1px solid rgba(17,16,16,.12)}
.pub-sector{background:rgba(100,80,180,.07);color:#5040a0;border:1px solid rgba(100,80,180,.18)}
.pub-ambos{background:rgba(20,120,80,.07);color:#206050;border:1px solid rgba(20,120,80,.18)}
.card-title{font-family:var(--serif);font-size:1.25rem;line-height:1.3;color:var(--k);margin-bottom:.75rem;flex-grow:1}
.card-excerpt{font-size:.9rem;font-weight:300;color:var(--g);line-height:1.65;margin-bottom:1.25rem;flex-grow:2}
.card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:1rem;border-top:1px solid var(--brd)}
.card-time{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--l)}
.card-arrow{font-family:var(--mono);font-size:.85rem;color:var(--l);transition:transform .2s,color .2s}
.blog-card:hover .card-arrow{transform:translateX(4px);color:var(--k)}
.blog-empty{display:none;padding:4rem 3.5rem;text-align:center;max-width:1100px;margin:0 auto}
.blog-empty.visible{display:block}
.blog-empty p{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--l)}
@media(max-width:900px){.blog-hero,.filters-wrap,.blog-counter,.blog-grid,.blog-empty{padding-left:1.5rem;padding-right:1.5rem}.blog-hero{padding-top:6rem}.blog-grid{grid-template-columns:1fr}}
</style>`;

const JS = `<script>
window.addEventListener('scroll',()=>{document.getElementById('mainnav').classList.toggle('scrolled',window.scrollY>20)},{passive:true});
document.querySelectorAll('.nav-toggle').forEach(btn=>{btn.addEventListener('click',()=>{const l=document.querySelector('.nav-links');const o=btn.classList.toggle('open');l.classList.toggle('open');btn.setAttribute('aria-expanded',o);});});
</script>`;

function NAV() {
  return `<nav id="mainnav">
<a class="nav-logo" href="/interno/">${SVG_DARK}<span class="nav-logo-text">Viconik</span></a>
<ul class="nav-links"><li><a href="/interno/#servicios">Servicios</a></li><li><a href="/interno/#metodologia">Metodología</a></li><li><a href="/interno/#proceso">Proceso</a></li><li><a href="/interno/blog/">Blog</a></li><li><a href="/interno/casos/">Casos</a></li><li><a href="/interno/cursos/">Formación</a></li></ul>
<a class="nav-cta" href="/interno/contacto/">Contactar</a>
<button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
</nav>`;
}

function FOOTER() {
  return `<footer><div class="footer-inner">
<div class="footer-top">
<div class="footer-brand-col">
<a class="footer-logo" href="/interno/">${SVG_LIGHT}<span class="footer-wordmark">Viconik</span></a>
<span class="footer-descriptor">Consultoría de Comunicación Audiovisual</span>
<a class="footer-email" href="mailto:hola@viconik.com">hola@viconik.com</a>
</div>
<div class="footer-nav">
<div class="footer-nav-col"><span class="footer-nav-label">Servicios</span><a href="/interno/#servicios">Auditoría de comunicación</a><a href="/interno/#servicios">Diagnóstico rápido</a><a href="/interno/#servicios">Consultoría técnica</a><a href="/interno/cursos/">Formación</a></div>
<div class="footer-nav-col"><span class="footer-nav-label">Contenido</span><a href="/interno/blog/">Blog</a><a href="/interno/casos/">Casos</a><a href="/interno/cursos/">Cursos</a></div>
<div class="footer-nav-col"><span class="footer-nav-label">Contacto</span><a href="/interno/contacto/">Formulario</a><a href="mailto:hola@viconik.com">hola@viconik.com</a></div>
</div></div>
<div class="footer-bottom">
<span class="footer-legal">© Viconik 2026 · Todos los derechos reservados · <a href="/interno/privacidad/" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Privacidad</a> · <a href="/interno/aviso-legal/" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Aviso legal</a></span>
<span class="footer-tagline-bottom">Auditoría · Estrategia · Formación</span>
</div></div></footer>`;
}

const PILAR_LABELS = {
  auditoria: "Auditoría y diagnóstico",
  tecnica: "Técnica audiovisual",
  estrategia: "Estrategia y ROI",
  produccion: "Producción y operativa",
  criterio: "Criterio Viconik",
};
const PUBLICO_LABELS = {
  cliente: "Para directores de marketing",
  sector: "Para equipos técnicos",
  ambos: "Ambos públicos",
};
const PUB_CLASS = { cliente: "pubblico-cliente", sector: "pubblico-sector", ambos: "pubblico-ambos" };
const PUB_CARD_CLASS = { cliente: "pub-cliente", sector: "pub-sector", ambos: "pub-ambos" };

// ─────────────────────────────────────────────────────────
// Markdown → HTML, con soporte de callout ("> **// Label**\n> texto")
// ─────────────────────────────────────────────────────────
marked.setOptions({ mangle: false, headerIds: false });

function renderBody(md) {
  let html = marked.parse(md || "");
  // Detecta blockquotes que en realidad son "callouts" (empiezan con **// Label**)
  html = html.replace(
    /<blockquote>\s*<p><strong>(\/\/[^<]*)<\/strong>\s*([\s\S]*?)<\/p>\s*<\/blockquote>/g,
    (_, label, rest) => {
      const cleanRest = rest.replace(/^\s*<br\s*\/?>\s*/, "").trim();
      return `<div class="callout"><div class="callout-label">${label.trim()}</div><p>${cleanRest}</p></div>`;
    }
  );
  return html;
}

function esc(s) {
  return (s || "").replace(/"/g, "&quot;");
}

// ─────────────────────────────────────────────────────────
// Plantilla de un post
// ─────────────────────────────────────────────────────────
function buildPostHTML(p, bodyHtml, bySlug) {
  const catLabel = PILAR_LABELS[p.pilar] || p.pilar;
  const pubLabel = PUBLICO_LABELS[p.publico] || "";
  const pubClass = PUB_CLASS[p.publico] || "pubblico-cliente";

  const faqs = p.faqs || [];
  let faqSchema = "";
  let faqHtml = "";
  if (faqs.length) {
    const items = faqs
      .map(
        (f) =>
          `{"@type":"Question","name":${JSON.stringify(f.pregunta)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(
            f.respuesta
          )}}}`
      )
      .join(",");
    faqSchema = `,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${items}]}`;
    faqHtml = `<div class="faq-section"><h2>// Preguntas frecuentes</h2>${faqs
      .map(
        (f) =>
          `<div class="faq-item"><div class="faq-q-text">${esc(f.pregunta)}</div><div class="faq-a-text">${esc(
            f.respuesta
          )}</div></div>`
      )
      .join("\n")}</div>`;
  }

  const related = (p.related || []).map((r) => bySlug[r.post]).filter(Boolean);
  let relatedHtml = "";
  if (related.length) {
    const cards = related
      .map(
        (r) =>
          `<a class="related-card" href="/interno/blog/${r.slug}/"><div class="related-cat">${
            PILAR_LABELS[r.pilar] || ""
          }</div><div class="related-title">${esc(r.title)}</div></a>`
      )
      .join("\n");
    relatedHtml = `<div class="related"><div class="related-label">// También te puede interesar</div><div class="related-grid">${cards}</div></div>`;
  }

  const schema = `<script type="application/ld+json">[{"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(
    p.title
  )},"description":${JSON.stringify(p.meta_desc)},"author":{"@type":"Person","name":"Alejandro Donaire","url":"https://viconik.com/sobre/"},"publisher":{"@type":"Organization","name":"Viconik","url":"https://viconik.com/"},"mainEntityOfPage":{"@type":"WebPage","@id":"https://viconik.com/interno/blog/${
    p.slug
  }"},"datePublished":"${p.fecha}","dateModified":"${p.fecha}","articleSection":${JSON.stringify(
    catLabel
  )},"inLanguage":"es-ES"}${faqSchema}]</script>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.meta_title)}</title>
<meta name="description" content="${esc(p.meta_desc)}">
<link rel="canonical" href="https://viconik.com/interno/blog/${p.slug}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="article"><meta property="og:site_name" content="Viconik">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.meta_desc)}">
<meta property="og:url" content="https://viconik.com/interno/blog/${p.slug}">
<meta property="og:locale" content="es_ES"><meta property="og:image" content="https://viconik.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
${schema}
${BASE_CSS}
${POST_CSS}
</head>
<body>
${NAV()}
<div class="breadcrumb"><a href="/interno/">Inicio</a><span class="sep">/</span><a href="/interno/blog/">Blog</a><span class="sep">/</span><span>${catLabel}</span></div>
<article class="post-wrap" itemscope itemtype="https://schema.org/Article">
<div class="post-meta"><span class="post-cat">${catLabel}</span><span class="post-time">${esc(
    p.lectura
  )}</span><span class="post-date">· ${formatFechaEs(p.fecha)}</span></div>
<span class="post-pubblico ${pubClass}">// ${pubLabel}</span>
<h1 class="post-title" itemprop="headline">${esc(p.title)}</h1>
<p class="post-deck">${esc(p.deck)}</p>
<div class="post-body" itemprop="articleBody">${bodyHtml}</div>
${faqHtml}
<div class="post-cta">
<p><strong>${esc(p.cta_q)}</strong></p>
<p>Una primera conversación de 30 minutos es suficiente para saber si tiene sentido.</p>
<a class="btn" href="/interno/contacto/">${esc(p.cta_btn)} →</a>
</div>
${relatedHtml}
<div class="post-back"><a href="/interno/blog/">← Volver al blog</a></div>
</article>
${FOOTER()}
${JS}
</body></html>`;
}

function formatFechaEs(iso) {
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const [y, m, d] = (iso || "2026-01-01").split("-").map(Number);
  return `${d} de ${meses[m - 1]}, ${y}`;
}

// ─────────────────────────────────────────────────────────
// Índice del blog
// ─────────────────────────────────────────────────────────
function buildBlogIndex(posts) {
  const sorted = [...posts].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  const cards = sorted
    .map((p) => {
      const catLabel = PILAR_LABELS[p.pilar] || p.pilar;
      const pubLabel = PUBLICO_LABELS[p.publico] || "";
      const pubClass = PUB_CARD_CLASS[p.publico] || "pub-cliente";
      return `<a class="blog-card" href="/interno/blog/${p.slug}/" data-pilar="${p.pilar}" data-publico="${p.publico}">
  <div class="card-top">
    <span class="card-cat">${catLabel}</span>
    <span class="card-pub ${pubClass}">${pubLabel}</span>
  </div>
  <h3 class="card-title">${esc(p.title)}</h3>
  <p class="card-excerpt">${esc(p.excerpt || p.deck)}</p>
  <div class="card-footer">
    <span class="card-time">${esc(p.lectura)}</span>
    <span class="card-arrow">→</span>
  </div>
</a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog — Auditoría y estrategia audiovisual corporativa | Viconik</title>
<meta name="description" content="Artículos sobre auditoría audiovisual, técnica de vídeo, estrategia de contenido y criterio de producción corporativa.">
<link rel="canonical" href="https://viconik.com/interno/blog/">
<meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website"><meta property="og:site_name" content="Viconik">
<meta property="og:title" content="Blog — Viconik">
<meta property="og:url" content="https://viconik.com/interno/blog/">
<meta property="og:locale" content="es_ES"><meta property="og:image" content="https://viconik.com/og-image.png">
${BASE_CSS}
${INDEX_CSS}
</head>
<body>
${NAV()}
<div class="blog-hero">
  <div class="blog-hero-eyebrow">// Blog</div>
  <h1>Criterio aplicado a la comunicación audiovisual corporativa</h1>
  <p>${sorted.length} artículos sobre auditoría, técnica, estrategia y producción. Escritos desde el trabajo real, no desde la teoría.</p>
</div>
<div class="filters-wrap">
  <div class="filters-group">
    <span class="filters-label">// Por pilar</span>
    <div class="filters">
      <button class="filter-btn active" data-filter="pilar" data-value="all">Todos</button>
      <button class="filter-btn" data-filter="pilar" data-value="auditoria">Auditoría y diagnóstico</button>
      <button class="filter-btn" data-filter="pilar" data-value="tecnica">Técnica audiovisual</button>
      <button class="filter-btn" data-filter="pilar" data-value="estrategia">Estrategia y ROI</button>
      <button class="filter-btn" data-filter="pilar" data-value="produccion">Producción y operativa</button>
      <button class="filter-btn" data-filter="pilar" data-value="criterio">Criterio Viconik</button>
    </div>
  </div>
  <div class="filters-group">
    <span class="filters-label">// Por público</span>
    <div class="filters">
      <button class="filter-btn active" data-filter="publico" data-value="all">Todos</button>
      <button class="filter-btn" data-filter="publico" data-value="cliente">Directores de marketing</button>
      <button class="filter-btn" data-filter="publico" data-value="sector">Equipos técnicos</button>
      <button class="filter-btn" data-filter="publico" data-value="ambos">Ambos públicos</button>
    </div>
  </div>
</div>
<div class="blog-counter" id="blog-counter">${sorted.length} artículos</div>
<div class="blog-grid" id="blog-grid">
${cards}
</div>
<div class="blog-empty" id="blog-empty"><p>No hay artículos con estos filtros.</p></div>
${FOOTER()}
<script>
window.addEventListener('scroll',()=>{document.getElementById('mainnav').classList.toggle('scrolled',window.scrollY>20)},{passive:true});
document.querySelectorAll('.nav-toggle').forEach(btn=>{btn.addEventListener('click',()=>{const l=document.querySelector('.nav-links');const o=btn.classList.toggle('open');l.classList.toggle('open');btn.setAttribute('aria-expanded',o);});});
const state = { pilar: 'all', publico: 'all' };
const cardsEls = document.querySelectorAll('.blog-card');
const counter = document.getElementById('blog-counter');
const empty = document.getElementById('blog-empty');
function applyFilters() {
  let visible = 0;
  cardsEls.forEach(card => {
    const pilarOk = state.pilar === 'all' || card.dataset.pilar === state.pilar;
    const publicoOk = state.publico === 'all' || card.dataset.publico === state.publico || card.dataset.publico === 'ambos';
    const show = pilarOk && publicoOk;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  const total = cardsEls.length;
  counter.textContent = visible === total ? \`\${total} artículos\` : \`\${visible} de \${total} artículos\`;
  empty.classList.toggle('visible', visible === 0);
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter, value = btn.dataset.value;
    state[filter] = value;
    document.querySelectorAll(\`[data-filter="\${filter}"]\`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});
</script>
</body></html>`;
}

// ─────────────────────────────────────────────────────────
// Módulo "Desde el blog" en la portada
// ─────────────────────────────────────────────────────────
function updateLandingPreview(destPosts) {
  if (!fs.existsSync(LANDING_FILE)) {
    console.warn("⚠ No se encontró interno/index.html — se omite actualización del módulo de portada.");
    return;
  }
  let html = fs.readFileSync(LANDING_FILE, "utf8");

  const cards = destPosts
    .map((p) => {
      const catLabel = PILAR_LABELS[p.pilar] || p.pilar;
      return `<a class="blog-prev-card" href="/interno/blog/${p.slug}/" style="display:flex;flex-direction:column;padding:1.75rem;border:1px solid var(--brd);transition:border-color .2s;text-decoration:none;background:transparent">
<span style="font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--g);background:var(--b);padding:.25rem .65rem;margin-bottom:1rem;align-self:flex-start">${catLabel}</span>
<h3 style="font-family:var(--serif);font-size:1.15rem;line-height:1.3;color:var(--k);margin-bottom:.75rem;flex-grow:1">${esc(
        p.title
      )}</h3>
<span style="font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--l);margin-top:auto">${esc(
        p.lectura
      )} → </span>
</a>`;
    })
    .join("\n");

  const block = `<div class="blog-preview reveal" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-bottom:2.5rem">\n${cards}\n</div>`;

  const START = "<!-- BLOG_PREVIEW_START -->";
  const END = "<!-- BLOG_PREVIEW_END -->";
  if (html.includes(START) && html.includes(END)) {
    const before = html.split(START)[0];
    const after = html.split(END)[1];
    html = `${before}${START}\n${block}\n${END}${after}`;
    fs.writeFileSync(LANDING_FILE, html);
    console.log("✓ Módulo 'Desde el blog' actualizado en la portada");
  } else {
    console.warn(
      "⚠ No se encontraron los marcadores BLOG_PREVIEW_START/END en interno/index.html — el módulo de portada no se actualiza automáticamente. Añádelos manualmente una vez alrededor de la sección 'Desde el blog'."
    );
  }
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error("No existe content/blog — nada que construir.");
    process.exit(0);
  }
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
    const { data, content } = matter(raw);
    return { ...data, bodyMd: content };
  });

  const bySlug = {};
  posts.forEach((p) => (bySlug[p.slug] = p));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  posts.forEach((p) => {
    const bodyHtml = renderBody(p.bodyMd);
    const html = buildPostHTML(p, bodyHtml, bySlug);
    const dir = path.join(OUT_DIR, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  });

  const indexHtml = buildBlogIndex(posts);
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml);

  if (fs.existsSync(DESTACADOS_FILE)) {
    try {
      const destYaml = yaml.load(fs.readFileSync(DESTACADOS_FILE, "utf8"));
      const destPosts = (destYaml.destacados || []).map((d) => bySlug[d.post]).filter(Boolean);
      if (destPosts.length) updateLandingPreview(destPosts);
    } catch (e) {
      console.warn("⚠ No se pudo procesar blog_destacados.yml:", e.message);
    }
  }

  console.log(`✓ Build completado: ${posts.length} artículos generados en interno/blog/`);
}

main();
