/**
 * ==============================================================================
 * Google Tag (gtag.js) & Custom Event Tracking
 * Property: Dr. Lekhram Gurjar - M.R. Homeopathic Research Hospital
 * Website: https://drlekhramgurjar.com/
 * ==============================================================================
 */

// Replace with your real Measurement ID & Conversion ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 
const GOOGLE_ADS_ID     = 'AW-XXXXXXXXX';

/* --------------------------------------------------------------------------
   1. Google Tag Initialization
   -------------------------------------------------------------------------- */
(function() {
  // Inject Google Tag Library Script Async
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  gtag('js', new Date());

  // GA4 Configuration
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      'dimension1': 'doctor_name',
      'dimension2': 'hospital_name'
    }
  });

  // Google Ads Configuration (Optional)
  if (GOOGLE_ADS_ID && GOOGLE_ADS_ID !== 'AW-XXXXXXXXX') {
    gtag('config', GOOGLE_ADS_ID);
  }

  // Global Context Parameters
  gtag('set', {
    'doctor_name': 'Dr. Lekhram Gurjar',
    'hospital_name': 'M.R. Homeopathic Research Hospital'
  });
})();

/* --------------------------------------------------------------------------
   2. DOM Event Listeners & Interaction Tracking
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {

  // --- Track In-Clinic Appointment Modal Views ---
  const bookingBtns = document.querySelectorAll('button[onclick*="openBookingModal"]');
  bookingBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      gtag('event', 'initiate_appointment_booking', {
        event_category: 'Engagement',
        event_label: this.innerText.trim() || 'Schedule In-Clinic Visit',
        consultation_fee: 200,
        currency: 'INR'
      });
    });
  });

  // --- Track WhatsApp Direct Inquiries ---
  const whatsappBtns = document.querySelectorAll('button[onclick*="triggerWhatsAppInquiry"]');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      gtag('event', 'contact_whatsapp_reception', {
        event_category: 'Lead',
        event_label: 'WhatsApp Reception Inquiry',
        value: 200,
        currency: 'INR'
      });
    });
  });

  // --- Track Appointment Form Submission (Lead Conversion) ---
  const bookingForm = document.querySelector('#booking-modal form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function() {
      const concernInput = document.getElementById('patient-concern');
      const selectedConcern = concernInput ? concernInput.value : 'General';

      gtag('event', 'generate_lead', {
        event_category: 'Conversion',
        event_label: selectedConcern,
        health_specialty: selectedConcern,
        value: 200,
        currency: 'INR'
      });
    });
  }

  // --- Track Video Player Engagement (Intro Video) ---
  const videoElement = document.getElementById('dr-intro-video');
  if (videoElement) {
    let videoProgressTracked = { '25': false, '50': false, '75': false };

    videoElement.addEventListener('play', function() {
      gtag('event', 'video_start', {
        event_category: 'Video',
        video_title: 'Dr. Lekhram Gurjar Clinical Introduction',
        video_current_time: Math.round(videoElement.currentTime),
        video_duration: Math.round(videoElement.duration || 0)
      });
    });

    videoElement.addEventListener('pause', function() {
      if (!videoElement.ended) {
        gtag('event', 'video_pause', {
          event_category: 'Video',
          video_title: 'Dr. Lekhram Gurjar Clinical Introduction',
          video_current_time: Math.round(videoElement.currentTime)
        });
      }
    });

    videoElement.addEventListener('timeupdate', function() {
      if (!videoElement.duration) return;
      const percent = Math.round((videoElement.currentTime / videoElement.duration) * 100);

      [25, 50, 75].forEach(marker => {
        if (percent >= marker && !videoProgressTracked[marker]) {
          videoProgressTracked[marker] = true;
          gtag('event', 'video_progress', {
            event_category: 'Video',
            video_title: 'Dr. Lekhram Gurjar Clinical Introduction',
            video_percent: marker
          });
        }
      });
    });

    videoElement.addEventListener('ended', function() {
      gtag('event', 'video_complete', {
        event_category: 'Video',
        video_title: 'Dr. Lekhram Gurjar Clinical Introduction'
      });
    });
  }

  // --- Track Instagram Profile & Individual Reels Clicks ---
  const instagramLinks = document.querySelectorAll('a[href*="instagram.com/drlekhramgurjar"]');
  instagramLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      let reelId = 'profile_visit';

      if (href.includes('/reel/DfkMByACwJ-')) {
        reelId = 'DfkMByACwJ-';
      } else if (href.includes('/reel/DfeURDViOG8')) {
        reelId = 'DfeURDViOG8';
      } else if (href.includes('/reel/DfPMeMvTOgS')) {
        reelId = 'DfPMeMvTOgS';
      }

      gtag('event', 'instagram_reel_click', {
        event_category: 'Social Engagement',
        event_label: reelId,
        destination_url: href
      });
    });
  });

  // --- Track Clinical Area Intent Buttons ---
  const serviceCards = document.querySelectorAll('#clinical-areas .clinical-card, #clinical-areas [class*="rounded-3xl"]');
  serviceCards.forEach(card => {
    const heading = card.querySelector('h3');
    const button = card.querySelector('button');
    if (heading && button) {
      button.addEventListener('click', function() {
        gtag('event', 'select_clinical_specialization', {
          event_category: 'Clinical Areas',
          specialty_name: heading.innerText.trim()
        });
      });
    }
  });

  // --- Track Admin Panel Login Attempts ---
  const adminLoginBtn = document.querySelector('#admin-login-view button');
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', function() {
      gtag('event', 'admin_login_attempt', {
        event_category: 'Admin Security',
        event_label: 'Control Desk Login'
      });
    });
  }

});