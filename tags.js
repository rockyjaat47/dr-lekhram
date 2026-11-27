/* ==========================================================================
   Google Tag (gtag.js) - Dr. Lekhram Gurjar | M.R. Homeopathic Research Hospital
   --------------------------------------------------------------------------
   1. Replace G-XXXXXXXXXX below with your real Google Analytics 4 Measurement ID
      (Google Analytics > Admin > Data Streams > your website > Measurement ID).
   2. Optional: add your Google Ads ID (AW-XXXXXXXXX) in GOOGLE_ADS_ID.
   3. Add this to the page, before </body>:
        <script src="google-tags.js" defer></script>
   It loads Google's official gtag.js and tracks the key actions on the site:
   page view, booking opened/submitted, WhatsApp, call, directions, Instagram,
   intro-video play/complete, and which sections visitors reach.
   ========================================================================== */
(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";   // <-- replace with your GA4 ID
  var GOOGLE_ADS_ID = "";                   // <-- optional, e.g. "AW-123456789"

  // Do nothing until a real ID is added (prevents sending data to a fake ID)
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) {
    if (window.console) console.warn("google-tags.js: add your GA4 Measurement ID to start tracking.");
    window.trackEvent = function () {};
    return;
  }

  // ---- Load Google's gtag.js ----
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: location.href,
    anonymize_ip: true
  });
  if (GOOGLE_ADS_ID) gtag("config", GOOGLE_ADS_ID);

  // ---- Helper ----
  function trackEvent(name, params) {
    try { gtag("event", name, params || {}); } catch (e) {}
  }
  window.trackEvent = trackEvent;

  // ---- Click tracking (event delegation, nothing on the page is modified) ----
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("a, button") : null;
    if (!el) return;

    var onclick = el.getAttribute("onclick") || "";
    var href = el.getAttribute("href") || "";
    var label = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);

    if (onclick.indexOf("openBookingModal") !== -1) {
      trackEvent("booking_open", { button_text: label });
    } else if (onclick.indexOf("triggerWhatsAppInquiry") !== -1 || href.indexOf("wa.me") !== -1) {
      trackEvent("whatsapp_click", { button_text: label });
    } else if (href.indexOf("tel:") === 0) {
      trackEvent("call_click", { phone: href.replace("tel:", "") });
    } else if (href.indexOf("google.com/maps") !== -1) {
      trackEvent("directions_click", { button_text: label });
    } else if (href.indexOf("instagram.com") !== -1) {
      trackEvent("instagram_click", { link_url: href });
    }
  }, true);

  // ---- Appointment form submitted (best conversion event) ----
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "booking-form") {
      var concern = document.getElementById("clinical-concern");
      trackEvent("generate_lead", {
        form_name: "appointment_request",
        clinical_area: concern ? concern.value : "",
        method: "whatsapp"
      });
    }
  }, true);

  // ---- Intro video tracking (media events don't bubble, so use capture) ----
  var videoStarted = false;
  document.addEventListener("play", function (e) {
    if (e.target && e.target.id === "dr-intro-video" && !videoStarted) {
      videoStarted = true;
      trackEvent("video_start", { video_title: "Dr. Lekhram Gurjar Introduction" });
    }
  }, true);
  document.addEventListener("ended", function (e) {
    if (e.target && e.target.id === "dr-intro-video") {
      trackEvent("video_complete", { video_title: "Dr. Lekhram Gurjar Introduction" });
    }
  }, true);

  // ---- Section views (About, Intro Video, Clinical Areas, Reviews, Reels, Location) ----
  if ("IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !seen[en.target.id]) {
          seen[en.target.id] = true;
          trackEvent("section_view", { section_id: en.target.id });
        }
      });
    }, { threshold: 0.4 });
    ["about", "intro-video-section", "clinical-areas", "reviews", "instagram-videos", "contact"]
      .forEach(function (id) {
        var node = document.getElementById(id);
        if (node) io.observe(node);
      });
  }
})();
