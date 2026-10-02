/* Irina Dinga · site behaviour. No dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var C = window.SITE_CONFIG;
  var T = window.SITE_CONTENT;
  var LANGS = ["es", "en", "ru"];
  var LOCALES = { es: "es-ES", en: "en-GB", ru: "ru-RU" };
  var IMG = "assets/img/";
  var lang = detectLang();

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var ui = function (key) { return (T.ui[lang] && T.ui[lang][key]) || T.ui.es[key] || ""; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  function detectLang() {
    var h = (location.hash || "").replace("#", "");
    if (LANGS.indexOf(h) > -1) return h;
    var saved = store("irina-lang");
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "es"];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().slice(0, 2);
      if (code === "ru") return "ru";
      if (code === "en") return "en";
      if (code === "es" || code === "ca" || code === "gl" || code === "eu") return "es";
    }
    return "es";
  }

  /* ---------------- i18n ---------------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    document.title = ui("metaTitle");
    var md = $('meta[name="description"]'); if (md) md.setAttribute("content", ui("metaDesc"));
    $$("[data-i18n]").forEach(function (el) { var v = ui(el.getAttribute("data-i18n")); if (v) el.textContent = v; });
    $$("[data-i18n-html]").forEach(function (el) { var v = ui(el.getAttribute("data-i18n-html")); if (v) el.innerHTML = v; });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); var v = ui(p[1]); if (v) el.setAttribute(p[0], v);
      });
    });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
  }

  function setLang(next) {
    if (LANGS.indexOf(next) < 0 || next === lang) return;
    lang = next;
    store("irina-lang", next);
    render();
  }

  function svcText(id) { return (T.services[id] && T.services[id][lang]) || T.services[id].es; }
  function svcConf(id) { for (var i = 0; i < C.services.length; i++) if (C.services[i].id === id) return C.services[i]; return null; }
  function priceOf(id) { var s = svcConf(id); return (s && s.price) || ui("priceOnConsult"); }
  function monthYear(iso) { var p = iso.split("-"); var m = T.months[lang][parseInt(p[1], 10) - 1]; return (lang === "en" ? m : m.charAt(0).toUpperCase() + m.slice(1)) + " " + p[0]; }
  function famLabel(f) { return ui({ blonde: "famBlonde", bronde: "famBronde", brunette: "famBrunette", grey: "famGrey" }[f]); }

  /* ---------------- cover chips ---------------- */
  function renderChips() {
    var box = $("#tip-chips");
    box.innerHTML = C.services.filter(function (s) { return s.cover; }).map(function (s) {
      return '<button type="button" class="chip" data-book="' + s.id + '">' + esc(svcText(s.id)[1]) + "</button>";
    }).join("");
  }

  /* ---------------- shade index ---------------- */
  var shadeFilter = "all";
  var activeShade = null;
  var plateImgs = {};

  function renderFilters() {
    var fams = ["all", "blonde", "bronde", "brunette", "grey"];
    $("#filters").innerHTML = fams.map(function (f) {
      var label = f === "all" ? ui("filterAll") : famLabel(f);
      return '<button type="button" data-filter="' + f + '" aria-pressed="' + (f === shadeFilter) + '">' + esc(label) + "</button>";
    }).join("");
  }

  function visibleShades() { return T.shades.filter(function (s) { return shadeFilter === "all" || s.fam === shadeFilter; }); }

  function renderShades() {
    var list = visibleShades();
    $("#shade-list").innerHTML = list.map(function (s) {
      return '<li><button type="button" class="shade" data-shade="' + esc(s.name) + '" aria-current="false">' +
        '<span class="shade-name">' + esc(s.name) + '</span><span class="shade-fam">' + esc(famLabel(s.fam)) + "</span></button></li>";
    }).join("");
    var keep = activeShade && list.some(function (s) { return s.name === activeShade; });
    showShade(keep ? activeShade : list[0].name, true);
  }

  function plateImg(s) {
    if (plateImgs[s.img]) return plateImgs[s.img];
    var im = new Image();
    im.decoding = "async";
    im.alt = s.name;
    im.sizes = "(max-width: 960px) 100vw, 46vw";
    im.srcset = IMG + s.img + "-sm.webp 640w, " + IMG + s.img + ".webp 1080w";
    im.src = IMG + s.img + ".webp";
    $("#plate-frame").appendChild(im);
    plateImgs[s.img] = im;
    return im;
  }

  function showShade(name, silent) {
    var s = T.shades.filter(function (x) { return x.name === name; })[0];
    if (!s) return;
    if (activeShade === name && !silent) return;
    activeShade = name;
    $$(".shade").forEach(function (b) { b.setAttribute("aria-current", String(b.getAttribute("data-shade") === name)); });
    var im = plateImg(s);
    var reveal = function () {
      Object.keys(plateImgs).forEach(function (k) { plateImgs[k].classList.toggle("is-on", plateImgs[k] === im); });
    };
    if (im.complete) reveal(); else { im.onload = reveal; }
    $("#plate-name").textContent = s.name;
    $("#plate-meta").textContent = famLabel(s.fam) + " · " + monthYear(s.date);
    $("#plate-link").href = "https://www.instagram.com/p/" + s.code + "/";
  }

  /* ---------------- before / after ---------------- */
  function renderPairs() {
    $("#ba-track").innerHTML = T.pairs.map(function (p) {
      var title = p.title[lang] || p.title.es;
      var pic = function (side) {
        var base = IMG + "ba-" + p.key + "-" + side;
        return '<figure><img src="' + base + '.webp" srcset="' + base + '-sm.webp 640w, ' + base + '.webp 1080w" sizes="(max-width: 560px) 44vw, (max-width: 960px) 42vw, 26rem" width="1080" height="1350" loading="lazy" alt="' +
          esc(title + ", " + ui(side)) + '"><figcaption>' + esc(ui(side)) + "</figcaption></figure>";
      };
      return '<article class="ba-item"><div class="ba-pair">' + pic("before") + pic("after") + '</div><div class="ba-meta"><h3 class="ba-title">' + esc(title) +
        '</h3><p class="ba-note">' + esc(p.note[lang] || p.note.es) + "</p></div></article>";
    }).join("");
    updateBaCtrl();
  }

  function baStep(dir) {
    var track = $("#ba-track");
    var item = $(".ba-item", track);
    if (!item) return;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    track.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function updateBaCtrl() {
    var t = $("#ba-track");
    $("#ba-prev").disabled = t.scrollLeft < 8;
    $("#ba-next").disabled = t.scrollLeft + t.clientWidth > t.scrollWidth - 8;
  }

  /* ---------------- services ---------------- */
  function renderServices() {
    var groups = ["color", "style", "bridal", "care"];
    $("#service-list").innerHTML = groups.map(function (g) {
      var rows = C.services.filter(function (s) { return s.group === g; }).map(function (s) {
        var t = svcText(s.id);
        return '<li class="svc"><span class="svc-name">' + esc(t[0]) + '</span><span class="svc-desc">' + esc(t[2]) + '</span><span class="svc-side"><span class="svc-price">' + esc(priceOf(s.id)) + "</span>" +
          (s.duration ? '<span class="svc-dur">' + esc(s.duration) + "</span>" : "") +
          '<button type="button" class="svc-book" data-book="' + s.id + '">' + esc(ui("bookThis")) + "</button></span></li>";
      }).join("");
      return '<div class="svc-group"><h3>' + esc(T.groups[g][lang]) + "</h3><ul>" + rows + "</ul></div>";
    }).join("");
  }

  /* ---------------- reviews ---------------- */
  var TRANSLATED = {
    es: { en: "traducida del inglés", ru: "traducida del ruso" },
    en: { es: "translated from Spanish", ru: "translated from Russian" },
    ru: { es: "перевод с испанского", en: "перевод с английского" }
  };
  function reviewHTML(r) {
    var tr = r.orig !== lang ? TRANSLATED[lang][r.orig] : "";
    return '<blockquote lang="' + lang + '"><p>' + esc(r[lang]) + '</p></blockquote><figcaption class="review-by">' + esc(r.name) + (tr ? "<span>" + esc(tr) + "</span>" : "") + "</figcaption>";
  }
  function renderReviews() {
    $("#review-feature").innerHTML = reviewHTML(T.reviews[0]);
    $("#review-cols").innerHTML = T.reviews.slice(1).map(function (r) { return '<figure class="review">' + reviewHTML(r) + "</figure>"; }).join("");
  }

  /* ---------------- timeline ---------------- */
  function renderTimeline() {
    $("#timeline").innerHTML = T.milestones.map(function (m) {
      return '<li><span class="tl-year">' + m.year + '</span><h3 class="tl-title">' + esc(m.title) + '</h3><p class="tl-text">' + esc(m[lang]) + "</p></li>";
    }).join("");
  }

  /* ---------------- booking ---------------- */
  var B = { service: null, day: null, time: null };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function toMin(hhmm) { var p = hhmm.split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function fromMin(m) { return Math.floor(m / 60) + ":" + pad(m % 60); }
  function parseIso(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function slotsFor(iso) {
    var d = parseIso(iso);
    var h = C.hours[d.getDay()];
    if (!h) return [];
    var out = [];
    var last = toMin(h.close) - C.lastSlotBeforeCloseMinutes;
    var now = new Date();
    var minStart = -1;
    if (isoDate(now) === iso) minStart = now.getHours() * 60 + now.getMinutes() + C.minNoticeHours * 60;
    for (var m = toMin(h.open); m <= last; m += C.slotStepMinutes) if (m >= minStart) out.push(fromMin(m));
    return out;
  }

  function renderServiceOpts() {
    $("#opt-service").innerHTML = C.services.map(function (s) {
      return '<label class="opt"><input type="radio" name="service" value="' + s.id + '"' + (B.service === s.id ? " checked" : "") + "><span>" + esc(svcText(s.id)[0]) + "</span></label>";
    }).join("");
  }

  function renderDays() {
    var fmtW = new Intl.DateTimeFormat(LOCALES[lang], { weekday: "short" });
    var fmtM = new Intl.DateTimeFormat(LOCALES[lang], { month: "short" });
    var html = "";
    var d = new Date(); d.setHours(12, 0, 0, 0);
    for (var i = 0; i < C.bookingDaysAhead; i++) {
      var iso = isoDate(d);
      var open = slotsFor(iso).length > 0;
      html += '<label class="day"><input type="radio" name="day" value="' + iso + '"' + (open ? "" : " disabled") + (B.day === iso ? " checked" : "") +
        ' aria-label="' + esc(longDate(iso)) + '"><span><small>' + esc(fmtW.format(d).replace(".", "")) + "</small><b>" + d.getDate() + "</b><small>" + esc(fmtM.format(d).replace(".", "")) + "</small></span></label>";
      d.setDate(d.getDate() + 1);
    }
    $("#opt-day").innerHTML = html;
  }

  function longDate(iso) {
    var s = new Intl.DateTimeFormat(LOCALES[lang], { weekday: "long", day: "numeric", month: "long" }).format(parseIso(iso));
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderTimes() {
    var box = $("#opt-time");
    if (!B.day) { box.innerHTML = '<p class="hint">' + esc(ui("pickDayFirst")) + "</p>"; return; }
    var slots = slotsFor(B.day);
    if (!slots.length) { box.innerHTML = '<p class="hint">' + esc(ui("noSlots")) + "</p>"; return; }
    if (B.time && B.time !== "flex" && slots.indexOf(B.time) < 0) B.time = null;
    box.innerHTML = slots.map(function (t) {
      return '<label class="slot"><input type="radio" name="time" value="' + t + '"' + (B.time === t ? " checked" : "") + "><span>" + t + "</span></label>";
    }).join("") + '<label class="slot slot-flex"><input type="radio" name="time" value="flex"' + (B.time === "flex" ? " checked" : "") + "><span>" + esc(ui("flexible")) + "</span></label>";
  }

  function bookingValues() {
    var first = $('input[name="first"]:checked');
    return {
      name: $("#f-name").value.trim(),
      first: first ? first.value : null,
      note: $("#f-note").value.trim()
    };
  }

  function timeLabel() { return B.time === "flex" ? ui("flexible") : B.time; }

  function renderSummary() {
    var v = bookingValues();
    var rows = [
      ["sumService", B.service ? svcText(B.service)[0] : ""],
      ["sumDay", B.day ? longDate(B.day) : ""],
      ["sumTime", B.time ? timeLabel() : ""],
      ["sumName", v.name],
      ["sumPrice", B.service ? priceOf(B.service) : ui("priceOnConsult")]
    ];
    $("#summary").innerHTML = rows.map(function (r) {
      return "<div><dt>" + esc(ui(r[0])) + '</dt><dd class="' + (r[1] ? "" : "is-empty") + '">' + esc(r[1] || ui("empty")) + "</dd></div>";
    }).join("");
    $("#send").href = waLink(composeMessage());
  }

  function composeMessage() {
    var v = bookingValues();
    var lines = [ui("waHello"), ""];
    if (B.service) lines.push("• " + ui("sumService") + ": " + svcText(B.service)[0]);
    if (B.day) lines.push("• " + ui("sumDay") + ": " + longDate(B.day));
    if (B.time) lines.push("• " + ui("sumTime") + ": " + timeLabel());
    if (v.name) lines.push("• " + ui("sumName") + ": " + v.name);
    if (v.first) lines.push("• " + ui("waFirst") + ": " + ui(v.first === "yes" ? "yes" : "no"));
    if (v.note) lines.push("• " + ui("waNote") + ": " + v.note);
    lines.push("", "(" + ui("waFrom") + ")");
    return lines.join("\n");
  }

  function waLink(text) { return "https://wa.me/" + C.whatsapp + (text ? "?text=" + encodeURIComponent(text) : ""); }

  function missing() {
    var m = [];
    if (!B.service) m.push(ui("sumService"));
    if (!B.day) m.push(ui("sumDay"));
    if (!B.time) m.push(ui("sumTime"));
    return m;
  }

  /* Hook for a real calendar later: replace the body of this function. */
  window.SITE_BOOKING = {
    submit: function (payload) { return Promise.resolve({ channel: "whatsapp", url: waLink(payload.message) }); }
  };

  function renderBooking() {
    renderServiceOpts();
    renderDays();
    renderTimes();
    renderSummary();
    var err = $("#book-err");
    if (!err.hidden) { var m = missing(); if (m.length) err.textContent = ui("errMissing") + m.join(", ").toLowerCase() + "."; else err.hidden = true; }
  }

  function preselect(id) {
    B.service = id;
    renderServiceOpts();
    renderSummary();
    var target = $("#reserva");
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    var firstDay = $('#opt-day input:not(:disabled)');
    if (firstDay && !B.day) setTimeout(function () { firstDay.focus({ preventScroll: true }); }, reduce ? 0 : 700);
  }

  /* ---------------- layout helpers ---------------- */
  function fitText() {
    var groups = [[$(".mh-line")], $$(".mh-stack [data-fit]"), [$(".foot-mast [data-fit]")]];
    groups.forEach(function (els) {
      els = els.filter(function (el) { return el && el.offsetParent !== null; });
      if (!els.length) return;
      var sizes = els.map(function (el) {
        var parent = el.parentElement;
        var cs = getComputedStyle(parent);
        var avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        el.style.display = "inline-block";
        el.style.fontSize = "100px";
        var w = el.getBoundingClientRect().width;
        el.style.display = "";
        return w ? (100 * avail) / w : 100;
      });
      var size = Math.min.apply(null, sizes) * 0.995;
      els.forEach(function (el) { el.style.fontSize = size.toFixed(2) + "px"; });
    });
  }

  function onScroll() {
    var cover = $("#portada");
    var nav = $("#nav");
    var y = window.scrollY;
    var coverEnd = cover.offsetHeight - nav.offsetHeight;
    nav.classList.toggle("is-solid", y > coverEnd - 4);
    var book = $("#reserva").getBoundingClientRect();
    var inBook = book.top < window.innerHeight * 0.85 && book.bottom > 0;
    var tip = $(".tipon").getBoundingClientRect();
    $("#mcta").classList.toggle("is-on", tip.bottom < 0 && !inBook);
  }

  function setupMenu() {
    var btn = $(".nav-menu"), menu = $("#menu"), nav = $("#nav");
    var close = function () { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.textContent = ui("navMenu"); nav.classList.remove("menu-open"); document.body.style.overflow = ""; };
    btn.addEventListener("click", function () {
      var open = menu.hidden;
      if (!open) { close(); return; }
      menu.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.textContent = ui("navClose"); nav.classList.add("menu-open"); document.body.style.overflow = "hidden";
      var first = $("a", menu); if (first) first.focus();
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { close(); btn.focus(); } });
  }

  function setupVideos() {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    $$("video").forEach(function (v) {
      if (reduce) { v.setAttribute("controls", ""); return; }
      if (!("IntersectionObserver" in window)) { v.play().catch(function () {}); return; }
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { v.preload = "auto"; var p = v.play(); if (p) p.catch(function () {}); } else v.pause();
        });
      }, { threshold: 0.25 }).observe(v);
    });
  }

  /* ---------------- events ---------------- */
  function bind() {
    document.addEventListener("click", function (e) {
      var langBtn = e.target.closest("[data-lang]");
      if (langBtn) { setLang(langBtn.getAttribute("data-lang")); return; }
      var bookBtn = e.target.closest("[data-book]");
      if (bookBtn) { preselect(bookBtn.getAttribute("data-book")); return; }
      var f = e.target.closest("[data-filter]");
      if (f) { shadeFilter = f.getAttribute("data-filter"); renderFilters(); renderShades(); return; }
      var sh = e.target.closest("[data-shade]");
      if (sh) { showShade(sh.getAttribute("data-shade")); return; }
    });

    var list = $("#shade-list");
    list.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var sh = e.target.closest("[data-shade]"); if (sh) showShade(sh.getAttribute("data-shade"));
    });
    list.addEventListener("focusin", function (e) { var sh = e.target.closest("[data-shade]"); if (sh) showShade(sh.getAttribute("data-shade")); });

    $("#ba-prev").addEventListener("click", function () { baStep(-1); });
    $("#ba-next").addEventListener("click", function () { baStep(1); });
    $("#ba-track").addEventListener("scroll", function () { window.requestAnimationFrame(updateBaCtrl); }, { passive: true });
    $("#ba-track").addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); baStep(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); baStep(-1); }
    });

    var form = $("#booking");
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "service") B.service = t.value;
      if (t.name === "day") { B.day = t.value; renderTimes(); }
      if (t.name === "time") B.time = t.value;
      renderSummary();
      var err = $("#book-err");
      if (!err.hidden && !missing().length) err.hidden = true;
    });
    form.addEventListener("input", function (e) { if (e.target.id === "f-name" || e.target.id === "f-note") renderSummary(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });

    $("#send").addEventListener("click", function (e) {
      var m = missing();
      var err = $("#book-err");
      if (m.length) {
        e.preventDefault();
        err.textContent = ui("errMissing") + m.join(", ").toLowerCase() + ".";
        err.hidden = false;
        var firstMissing = !B.service ? $("#opt-service input") : !B.day ? $("#opt-day input:not(:disabled)") : $("#opt-time input");
        if (firstMissing) firstMissing.focus();
        return;
      }
      err.hidden = true;
      this.href = waLink(composeMessage());
      var stub = $(".card-stub");
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) { stub.classList.remove("is-torn"); void stub.offsetWidth; stub.classList.add("is-torn"); }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { fitText(); onScroll(); updateBaCtrl(); }, 120); });
    window.addEventListener("hashchange", function () {
      var h = location.hash.replace("#", "");
      if (LANGS.indexOf(h) > -1) setLang(h);
    });
  }

  /* ---------------- boot ---------------- */
  function render() {
    applyStatic();
    renderChips();
    renderFilters();
    renderShades();
    renderPairs();
    renderServices();
    renderReviews();
    renderTimeline();
    renderBooking();
    var wd = $("#wa-direct"); if (wd) wd.href = waLink(ui("waHello"));
    fitText();
  }

  function links() {
    $("#google-link").href = C.googleReviews;
    $("#maps-link").href = C.maps;
    $("#tt-link").href = C.tiktok;
    $("#th-link").href = C.threads;
    $("#ig-link").href = C.instagram;
  }

  render();
  links();
  bind();
  setupMenu();
  setupVideos();
  onScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener("load", fitText);
})();
