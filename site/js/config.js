/*
  Irina Dinga · site config
  ------------------------------------------------------------
  Everything the owner may want to change lives here.

  PRICES: set `price` to a string per service, e.g. "desde 120 €".
  While it is null the site shows "Precio tras consulta" / "Price after consultation".
  DURATION: set `duration` to a string, e.g. "2-3 h". Null hides it.

  BOOKING: requests are sent as a ready WhatsApp message to `whatsapp`.
  To plug in a real calendar later, replace `SITE_BOOKING.submit()` in main.js.
*/
window.SITE_CONFIG = {
  name: "Irina Dinga",
  whatsapp: "34623920999",
  phoneDisplay: "+34 623 920 999",
  instagram: "https://www.instagram.com/irinadistylist/",
  threads: "https://www.threads.net/@irinadistylist",
  tiktok: "https://www.tiktok.com/@irinadistylist",
  googleReviews: "https://www.google.com/maps/search/?api=1&query=Irina+Dinga+Hairstylist+Valencia",
  maps: "https://www.google.com/maps/search/?api=1&query=C.+de+Puerto+Rico+51+46004+Valencia",
  rating: "5,0",
  reviewsCount: 197,
  address: { street: "C/ Puerto Rico, 51", area: "L'Eixample · Ruzafa", city: "46004 València" },

  /* Opening hours. Day index: 0 = Sunday ... 6 = Saturday. Times are booking start slots. */
  hours: {
    1: { open: "10:00", close: "20:00" },
    2: { open: "10:00", close: "20:00" },
    3: { open: "10:00", close: "20:00" },
    4: { open: "10:00", close: "20:00" },
    5: { open: "10:00", close: "20:00" },
    6: { open: "09:00", close: "14:00" },
    0: null
  },
  slotStepMinutes: 30,
  lastSlotBeforeCloseMinutes: 90,   // last bookable start = close - this
  bookingDaysAhead: 28,
  minNoticeHours: 3,

  /* Services. `price` and `duration` are null until the owner fills them in. */
  services: [
    { id: "balayage",   group: "color",  price: null, duration: null, cover: true },
    { id: "blonde",     group: "color",  price: null, duration: null, cover: true },
    { id: "bronde",     group: "color",  price: null, duration: null },
    { id: "grey",       group: "color",  price: null, duration: null },
    { id: "correction", group: "color",  price: null, duration: null },
    { id: "gloss",      group: "color",  price: null, duration: null },
    { id: "cut",        group: "style",  price: null, duration: null, cover: true },
    { id: "styling",    group: "style",  price: null, duration: null, cover: true },
    { id: "updo",       group: "bridal", price: null, duration: null },
    { id: "bridal",     group: "bridal", price: null, duration: null, cover: true },
    { id: "treatment",  group: "care",   price: null, duration: null },
    { id: "consult",    group: "care",   price: null, duration: null, cover: true }
  ]
};
