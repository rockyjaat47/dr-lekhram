/* ==========================================================================
   Dr. Lekhram Gurjar | M.R. Homeopathic Research Hospital - Full Website JS
   --------------------------------------------------------------------------
   PART 1: Booking modal, WhatsApp inquiry/appointment, intro-video controls
   PART 2: Embedded-video loader (only runs if the page contains the embedded
           video data element #dr-intro-video-data; otherwise it does nothing,
           so you can safely keep it when the video is a normal file/URL).

   Usage: <script src="script.js" defer></script>  (before </body> is fine too)
   ========================================================================== */

/* ===================== PART 1: SITE INTERACTIONS ===================== */
const CLINIC_WHATSAPP_NUMBER = "919261666622";

function openBookingModal(concern = "") {
  const modal = document.getElementById("booking-modal");
  const select = document.getElementById("clinical-concern");
  const dateInput = document.getElementById("preferred-date");

  if (concern && select) {
    const match = Array.from(select.options).find(opt => opt.value === concern);
    if (match) select.value = concern;
  }

  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;
    dateInput.min = todayStr;
    if (!dateInput.value) {
      dateInput.value = todayStr;
    }
  }

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }
}

function closeBookingModal() {
  const modal = document.getElementById("booking-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }
}

function openWhatsAppUrl(url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function triggerWhatsAppInquiry() {
  const text = encodeURIComponent(
    "Hello, I would like to inquire about an in-clinic appointment with Dr. Lekhram Gurjar (BHMS) at M.R. Homeopathic Research Hospital, Sanganer, Jaipur."
  );
  openWhatsAppUrl(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${text}`);
}

function submitBookingForm(event) {
  event.preventDefault();
  const name = document.getElementById("patient-name")?.value.trim() || "";
  const phone = document.getElementById("patient-phone")?.value.trim() || "";
  const date = document.getElementById("preferred-date")?.value || "";
  const concern = document.getElementById("clinical-concern")?.value || "";
  const notes = document.getElementById("patient-notes")?.value.trim() || "";

  const message = [
    "Appointment Request - M.R. Homeopathic Research Hospital",
    `Patient Name: ${name}`,
    `Phone: ${phone}`,
    `Preferred Date: ${date}`,
    `Area: ${concern}`,
    notes ? `Notes: ${notes}` : null
  ].filter(Boolean).join("\n");

  openWhatsAppUrl(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
  closeBookingModal();
}

function toggleIntroVideoPlay() {
  const video = document.getElementById("dr-intro-video");
  const overlayBtn = document.getElementById("intro-play-overlay-btn");
  if (!video) return;

  if (video.paused || video.ended) {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        if (overlayBtn) overlayBtn.classList.remove("opacity-0", "pointer-events-none");
      });
    }
    if (overlayBtn) overlayBtn.classList.add("opacity-0", "pointer-events-none");
  } else {
    video.pause();
    if (overlayBtn) overlayBtn.classList.remove("opacity-0", "pointer-events-none");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("dr-intro-video");
  const overlayBtn = document.getElementById("intro-play-overlay-btn");
  if (video && overlayBtn) {
    video.addEventListener("play", () => overlayBtn.classList.add("opacity-0", "pointer-events-none"));
    video.addEventListener("pause", () => overlayBtn.classList.remove("opacity-0", "pointer-events-none"));
    video.addEventListener("ended", () => overlayBtn.classList.remove("opacity-0", "pointer-events-none"));
  }
});

document.getElementById("booking-modal")?.addEventListener("click", (e) => {
  if (e.target.id === "booking-modal") closeBookingModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBookingModal();
});

/* ===================== PART 2: EMBEDDED VIDEO LOADER ===================== */
(function () {
  var ready = false, wantPlay = false;
  function btn() { return document.getElementById("intro-play-overlay-btn"); }
  function load() {
    var holder = document.getElementById("dr-intro-video-data");
    var video = document.getElementById("dr-intro-video");
    if (!holder || !video) return;
    fetch("data:video/mp4;base64," + holder.textContent.trim())
      .then(function (r) { return r.blob(); })
      .then(function (blob) {
        video.src = URL.createObjectURL(new Blob([blob], { type: "video/mp4" }));
        video.load();
        holder.remove();
        ready = true;
        if (btn()) btn().classList.remove("animate-pulse");
        if (wantPlay) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      })
      .catch(function () {});
  }
  // If the person taps play before the video data has finished decoding, remember it and play as soon as ready
  document.addEventListener("click", function (e) {
    if (ready) return;
    var b = btn();
    if (b && (e.target === b || b.contains(e.target))) { wantPlay = true; b.classList.add("animate-pulse"); }
  }, true);
  if (document.readyState === "complete") load(); else window.addEventListener("load", load);
})();
