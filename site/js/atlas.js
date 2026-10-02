/* Atlas de tonos · behaviour. Shares config.js and content.js with the magazine version. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var C = window.SITE_CONFIG, T = window.SITE_CONTENT, A = window.ATLAS;
  var LANGS = ["es", "en", "ru"];
  var LOCALES = { es: "es-ES", en: "en-GB", ru: "ru-RU" };
  var IMG = "../assets/img/";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var reduce = function () { return matchMedia("(prefers-reduced-motion: reduce)").matches; };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var lang = (function () {
    var h = (location.hash || "").replace("#", "");
    if (LANGS.indexOf(h) > -1) return h;
    var s = store("irina-lang"); if (s && LANGS.indexOf(s) > -1) return s;
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "es"];
    for (var i = 0; i < list.length; i++) {
      var c = String(list[i]).toLowerCase().slice(0, 2);
      if (c === "ru" || c === "en") return c;
      if (c === "es" || c === "ca" || c === "gl" || c === "eu") return "es";
    }
    return "es";
  })();

  var ui = function (k) { return (T.ui[lang] && T.ui[lang][k]) || T.ui.es[k] || ""; };
  var au = function (k) { return (A.ui[lang] && A.ui[lang][k]) || A.ui.es[k] || ""; };
  var svcText = function (id) { return T.services[id][lang] || T.services[id].es; };
  var svcConf = function (id) { return C.services.filter(function (s) { return s.id === id; })[0]; };
  var priceOf = function (id) { var s = svcConf(id); return (s && s.price) || ui("priceOnConsult"); };
  var monthYear = function (iso) { var p = iso.split("-"); return T.months[lang][+p[1] - 1] + " " + p[0]; };

  /* ---------- colour ---------- */
  function lum(hex) {
    var c = [1, 3, 5].map(function (i) { var v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  var current = 1;
  function applyShade(i) {
    var s = A.shades[i];
    var root = document.documentElement.style;
    root.setProperty("--shade", s.light);
    root.setProperty("--shade-dark", s.dark);
    root.setProperty("--on-shade", lum(s.light) > 0.22 ? "#17181a" : "#fafaf8");
  }

  /* ---------- static text ---------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    document.title = au("metaTitle");
    $$("[data-a]").forEach(function (el) { var v = au(el.getAttribute("data-a")); if (v) el.textContent = v; });
    $$("[data-a-attr]").forEach(function (el) { el.getAttribute("data-a-attr").split(";").forEach(function (p) { p = p.split(":"); el.setAttribute(p[0], au(p[1])); }); });
    $$("[data-i18n]").forEach(function (el) { var v = ui(el.getAttribute("data-i18n")); if (v) el.textContent = v; });
    $$("[data-i18n-attr]").forEach(function (el) { el.getAttribute("data-i18n-attr").split(";").forEach(function (p) { p = p.split(":"); el.setAttribute(p[0], ui(p[1])); }); });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
  }

  /* ---------- fan ---------- */
  function buildFan() {
    var fan = $("#fan"), n = A.shades.length;
    var narrow = matchMedia("(max-width: 900px)").matches;
    var spread = narrow ? 42 : 50;
    fan.innerHTML = A.shades.map(function (s, i) {
      var a = (-spread + (2 * spread * i) / (n - 1)).toFixed(2);
      return '<button type="button" class="blade" tabindex="-1" data-i="' + i + '" style="--oa:' + a + "deg;--i:" + i + ";--c:" + s.light + ";--x:" + s.x + '%">' +
        '<span class="tress"><img src="' + IMG + s.img + '-sm.webp" alt="" loading="eager" decoding="async"></span>' +
        '<span class="tab"><b>' + s.n + "</b><span>" + esc(s.name) + "</span></span></button>";
    }).join("");
    var open = function () { fan.classList.add("is-open"); };
    if (reduce()) open(); else requestAnimationFrame(function () { setTimeout(open, 180); });
  }

  function buildNames() {
    $("#names").innerHTML = A.shades.map(function (s, i) {
      return '<button type="button" class="name-btn" role="option" aria-selected="false" data-i="' + i + '" style="--c:' + s.light + '"><i></i><b>' + s.n + "</b>" + esc(s.name) + "</button>";
    }).join("");
  }

  /* ---------- shade card ---------- */
  var photos = {};
  function showPhoto(s) {
    var box = $("#ficha-photo");
    var im = photos[s.img];
    if (!im) {
      im = new Image(); im.decoding = "async"; im.alt = s.name;
      im.sizes = "(max-width: 900px) 100vw, 46vw";
      im.srcset = IMG + s.img + "-sm.webp 640w, " + IMG + s.img + ".webp 1080w";
      im.src = IMG + s.img + ".webp";
      box.appendChild(im); photos[s.img] = im;
    }
    var on = function () { Object.keys(photos).forEach(function (k) { photos[k].classList.toggle("is-on", photos[k] === im); }); };
    if (im.complete) on(); else im.onload = on;
  }

  function select(i, opts) {
    opts = opts || {};
    current = (i + A.shades.length) % A.shades.length;
    var s = A.shades[current];
    applyShade(current);
    $$(".blade").forEach(function (b) { b.classList.toggle("is-on", +b.getAttribute("data-i") === current); });
    $$(".name-btn").forEach(function (b) { b.setAttribute("aria-selected", String(+b.getAttribute("data-i") === current)); });
    $("#ro-n").textContent = "Nº " + s.n;
    $("#ro-name").textContent = s.name;
    $("#ficha-n").textContent = s.n;
    $("#ficha-name").textContent = s.name;
    $("#ficha-fam").textContent = au("fam_" + s.fam);
    $("#sw-light-hex").textContent = s.light;
    $("#sw-dark-hex").textContent = s.dark;
    $("#ficha-date").textContent = monthYear(s.date);
    $("#ficha-link").href = "https://www.instagram.com/p/" + s.code + "/";
    showPhoto(s);
    if (opts.scrollName) {
      var nb = $('.name-btn[data-i="' + current + '"]');
      if (nb) nb.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce() ? "auto" : "smooth" });
    }
  }

  /* ---------- shifts ---------- */
  function buildShifts() {
    $("#shift-list").innerHTML = A.shifts.map(function (sh) {
      var pic = function (side) {
        var b = IMG + "ba-" + sh.key + "-" + side;
        return '<figure><img src="' + b + '-sm.webp" width="640" height="800" loading="lazy" alt="' + esc((sh.title[lang] || sh.title.es) + ", " + ui(side)) + '"><figcaption>' + esc(ui(side)) + "</figcaption></figure>";
      };
      return '<li class="shift" style="--from:' + sh.from + ";--to:" + sh.to + '">' + pic("before") +
        '<div class="shift-mid"><h3 class="shift-title">' + esc(sh.title[lang] || sh.title.es) + '</h3><div class="shift-bar" aria-hidden="true"></div><p class="shift-hex"><span>' + sh.from + "</span><span>" + sh.to + "</span></p></div>" +
        pic("after") + "</li>";
    }).join("");
  }

  /* ---------- reviews ---------- */
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.83 6.06 6.65.78-4.92 4.55 1.3 6.57L12 17.27l-5.86 3.29 1.3-6.57L2.52 9.44l6.65-.78z"/></svg>';
  function buildQuotes() {
    var pick = [0, 3, 6];
    $("#quotes").innerHTML = pick.map(function (i) {
      var r = T.reviews[i];
      return '<figure class="q"><blockquote lang="' + lang + '"><p>' + esc(r[lang]) + '</p></blockquote><figcaption><span class="q-stars" aria-label="5/5">' + STAR + STAR + STAR + STAR + STAR + "</span><b>" + esc(r.name) + "</b> · Google</figcaption></figure>";
    }).join("");
  }

  /* ---------- services ---------- */
  function buildServices() {
    $("#svc-cols").innerHTML = ["color", "style", "bridal", "care"].map(function (g) {
      return '<div class="svc-group"><h3>' + esc(T.groups[g][lang]) + "</h3><ul>" + C.services.filter(function (s) { return s.group === g; }).map(function (s) {
        var t = svcText(s.id);
        return '<li class="svc"><span class="svc-name">' + esc(t[0]) + '</span><span class="svc-price">' + esc(priceOf(s.id)) + '</span><span class="svc-desc">' + esc(t[2]) + "</span></li>";
      }).join("") + "</ul></div>";
    }).join("");
  }

  /* ---------- booking ---------- */
  var B = { shade: null, service: null, day: null, time: null };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var isoDate = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var toMin = function (h) { h = h.split(":"); return +h[0] * 60 + +h[1]; };
  var parseIso = function (iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  function slotsFor(iso) {
    var h = C.hours[parseIso(iso).getDay()]; if (!h) return [];
    var out = [], now = new Date(), min = -1;
    if (isoDate(now) === iso) min = now.getHours() * 60 + now.getMinutes() + C.minNoticeHours * 60;
    for (var m = toMin(h.open); m <= toMin(h.close) - C.lastSlotBeforeCloseMinutes; m += C.slotStepMinutes) if (m >= min) out.push(Math.floor(m / 60) + ":" + pad(m % 60));
    return out;
  }
  function longDate(iso) { var s = new Intl.DateTimeFormat(LOCALES[lang], { weekday: "long", day: "numeric", month: "long" }).format(parseIso(iso)); return s.charAt(0).toUpperCase() + s.slice(1); }

  function buildShadePick() {
    $("#opt-shade").innerHTML = A.shades.map(function (s, i) {
      return '<label class="tp"><input type="radio" name="shade" value="' + i + '"' + (B.shade === i ? " checked" : "") + ' aria-label="' + esc(s.n + " " + s.name) + '"><span><i style="--c:' + s.light + ";--x:" + s.x + "%;background-image:url(" + IMG + s.img + '-sm.webp)"></i><b>' + s.n + "</b></span></label>";
    }).join("") + '<label class="tp tp-none"><input type="radio" name="shade" value="none"' + (B.shade === "none" ? " checked" : "") + ' aria-label="' + esc(au("notSure")) + '"><span><i>?</i><b>·</b></span></label>';
  }
  function buildServiceOpts() {
    $("#opt-service").innerHTML = C.services.map(function (s) {
      return '<label class="opt"><input type="radio" name="service" value="' + s.id + '"' + (B.service === s.id ? " checked" : "") + "><span>" + esc(svcText(s.id)[0]) + "</span></label>";
    }).join("");
  }
  function buildDays() {
    var fw = new Intl.DateTimeFormat(LOCALES[lang], { weekday: "short" }), fm = new Intl.DateTimeFormat(LOCALES[lang], { month: "short" });
    var d = new Date(); d.setHours(12, 0, 0, 0); var html = "";
    for (var i = 0; i < C.bookingDaysAhead; i++) {
      var iso = isoDate(d), open = slotsFor(iso).length > 0;
      html += '<label class="day"><input type="radio" name="day" value="' + iso + '"' + (open ? "" : " disabled") + (B.day === iso ? " checked" : "") + ' aria-label="' + esc(longDate(iso)) + '"><span><small>' + esc(fw.format(d).replace(".", "")) + "</small><b>" + d.getDate() + "</b><small>" + esc(fm.format(d).replace(".", "")) + "</small></span></label>";
      d.setDate(d.getDate() + 1);
    }
    $("#opt-day").innerHTML = html;
  }
  function buildTimes() {
    var box = $("#opt-time");
    if (!B.day) { box.innerHTML = '<p class="hint">' + esc(ui("pickDayFirst")) + "</p>"; return; }
    var sl = slotsFor(B.day);
    if (!sl.length) { box.innerHTML = '<p class="hint">' + esc(ui("noSlots")) + "</p>"; return; }
    if (B.time && B.time !== "flex" && sl.indexOf(B.time) < 0) B.time = null;
    box.innerHTML = sl.map(function (t) { return '<label class="slot"><input type="radio" name="time" value="' + t + '"' + (B.time === t ? " checked" : "") + "><span>" + t + "</span></label>"; }).join("") +
      '<label class="slot slot-flex"><input type="radio" name="time" value="flex"' + (B.time === "flex" ? " checked" : "") + "><span>" + esc(ui("flexible")) + "</span></label>";
  }
  function vals() { var f = $('input[name="first"]:checked'); return { name: $("#f-name").value.trim(), first: f ? f.value : null, note: $("#f-note").value.trim() }; }
  function shadeLabel() { if (B.shade === "none") return au("notSure"); if (B.shade === null) return ""; var s = A.shades[B.shade]; return "Nº " + s.n + " " + s.name; }
  function timeLabel() { return B.time === "flex" ? ui("flexible") : B.time; }

  function renderSide() {
    var st = $("#side-tress");
    if (B.shade !== null && B.shade !== "none") {
      var s = A.shades[B.shade];
      st.innerHTML = '<span class="st-strand" style="background-image:url(' + IMG + s.img + "-sm.webp);background-position:" + s.x + '% 62%"></span><p class="st-name"><span class="st-n">Nº ' + s.n + "</span>" + esc(s.name) + "</p>";
    } else {
      st.innerHTML = '<span class="st-strand"></span><p class="st-name"><span class="st-n">' + esc(au("fShade")) + "</span>" + esc(B.shade === "none" ? au("notSure") : ui("empty")) + "</p>";
    }
    var v = vals();
    var rows = [[ui("sumService"), B.service ? svcText(B.service)[0] : ""], [ui("sumDay"), B.day ? longDate(B.day) : ""], [ui("sumTime"), B.time ? timeLabel() : ""], [ui("sumName"), v.name], [ui("sumPrice"), B.service ? priceOf(B.service) : ui("priceOnConsult")]];
    $("#summary").innerHTML = rows.map(function (r) { return "<div><dt>" + esc(r[0]) + '</dt><dd class="' + (r[1] ? "" : "is-empty") + '">' + esc(r[1] || ui("empty")) + "</dd></div>"; }).join("");
    $("#send").href = wa(message());
  }
  function message() {
    var v = vals(), L = [ui("waHello"), ""];
    if (B.shade !== null) L.push("• " + au("waShade") + ": " + (B.shade === "none" ? au("waNotSure") : shadeLabel()));
    if (B.service) L.push("• " + ui("sumService") + ": " + svcText(B.service)[0]);
    if (B.day) L.push("• " + ui("sumDay") + ": " + longDate(B.day));
    if (B.time) L.push("• " + ui("sumTime") + ": " + timeLabel());
    if (v.name) L.push("• " + ui("sumName") + ": " + v.name);
    if (v.first) L.push("• " + ui("waFirst") + ": " + ui(v.first === "yes" ? "yes" : "no"));
    if (v.note) L.push("• " + ui("waNote") + ": " + v.note);
    L.push("", "(" + ui("waFrom") + ")");
    return L.join("\n");
  }
  var wa = function (t) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(t); };
  function missing() { var m = []; if (B.shade === null) m.push(au("fShade")); if (!B.service) m.push(ui("sumService")); if (!B.day) m.push(ui("sumDay")); if (!B.time) m.push(ui("sumTime")); return m; }

  window.SITE_BOOKING = { submit: function (p) { return Promise.resolve({ channel: "whatsapp", url: wa(p.message) }); } };

  function chooseShade(i) {
    B.shade = i;
    if (i === "none") B.service = "consult"; else { B.service = A.shades[i].svc; select(i); }
    buildShadePick(); buildServiceOpts(); renderSide();
  }

  /* ---------- scroll / nav ---------- */
  function onScroll() {
    var hero = $("#atlas").getBoundingClientRect(), book = $("#reserva").getBoundingClientRect();
    $("#mcta").classList.toggle("is-on", hero.bottom < 0 && !(book.top < innerHeight * .85 && book.bottom > 0));
  }

  /* ---------- render ---------- */
  function render() {
    applyStatic();
    buildNames(); buildShifts(); buildQuotes(); buildServices();
    buildShadePick(); buildServiceOpts(); buildDays(); buildTimes(); renderSide();
    select(current);
    $("#maps-link").href = C.maps; $("#ig-link").href = C.instagram;
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var l = e.target.closest("[data-lang]");
      if (l) { var n = l.getAttribute("data-lang"); if (n !== lang) { lang = n; store("irina-lang", n); render(); } return; }
      var b = e.target.closest(".blade, .name-btn");
      if (b) { select(+b.getAttribute("data-i"), { scrollName: true }); return; }
      if (e.target.closest("#hero-cta, #ficha-cta, .mcta a")) { chooseShade(current); }
    });
    $("#fan").addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var b = e.target.closest(".blade"); if (b && +b.getAttribute("data-i") !== current) select(+b.getAttribute("data-i"), { scrollName: true });
    });
    $("#names").addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault(); select(current + (e.key === "ArrowRight" ? 1 : -1), { scrollName: true });
      var nb = $('.name-btn[data-i="' + current + '"]'); if (nb) nb.focus();
    });
    $("#prev").addEventListener("click", function () { select(current - 1, { scrollName: true }); });
    $("#next").addEventListener("click", function () { select(current + 1, { scrollName: true }); });

    var form = $("#booking");
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "shade") { chooseShade(t.value === "none" ? "none" : +t.value); }
      if (t.name === "service") B.service = t.value;
      if (t.name === "day") { B.day = t.value; buildTimes(); }
      if (t.name === "time") B.time = t.value;
      renderSide();
      if (!$("#book-err").hidden && !missing().length) $("#book-err").hidden = true;
    });
    form.addEventListener("input", function (e) { if (e.target.id === "f-name" || e.target.id === "f-note") renderSide(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#send").addEventListener("click", function (e) {
      var m = missing(), err = $("#book-err");
      if (m.length) { e.preventDefault(); err.textContent = ui("errMissing") + m.join(", ").toLowerCase() + "."; err.hidden = false; return; }
      err.hidden = true; this.href = wa(message());
    });
    addEventListener("scroll", onScroll, { passive: true });
    var rt, lastW = innerWidth; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (innerWidth === lastW) return; lastW = innerWidth; buildFan(); select(current); }, 200); });
  }

  buildFan();
  render();
  bind();
  onScroll();
})();
