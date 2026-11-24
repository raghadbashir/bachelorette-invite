/* ==========================================================================
   INVITATION CONTENT — edit everything here. No other file needs changing.
   ========================================================================== */
window.INVITE = {
  bride: {
    name: "Bride's Name",          // written in gold script
    monogram: "B"                   // single letter on the wax seal
  },

  /* Date shown in the film. Keep `day` as two digits ("07"). */
  date: {
    weekday: "Weekday",
    day: "00",
    month: "Month",
    year: "2026",
    display: "00 Month 2026"        // used on the final card
  },

  time: "0:00 PM – 0:00 PM",
  venue: "Venue Name",
  address: "Street Address, City",
  mapLink: "https://maps.google.com/?q=Venue+Name",   // paste a Google/Apple Maps link

  dressCode: {
    note: "Dress code note goes here",
    swatches: [
      { label: "Cheetah", type: "cheetah" },
      { label: "Black",   type: "color", color: "#0b0908" },
      { label: "Ivory",   type: "color", color: "#f3ead9" },
      { label: "Gold",    type: "gold" }
    ]
  },

  rsvp: {
    whatsappNumber: "000000000000", // international format, digits only (e.g. 9665XXXXXXXX)
    message: "Hi! I'd love to come to the bachelorette 🤍"
  },

  /* Media — paths are relative to the site root */
  babyPhoto: "assets/baby.jpg",     // leave "" (or remove the file) to show the elegant placeholder
  music: "assets/music.mp3",        // optional; silently skipped if the file is missing

  /* Used for the live countdown and "Add to calendar". Include your timezone offset. */
  event: {
    start: "2026-12-31T19:00:00+03:00",
    end:   "2026-12-31T23:00:00+03:00",
    title: "Bride's Name — Bachelorette",
    description: "Bachelorette celebration"
  },

  /* Every other word that appears on screen */
  text: {
    tapKicker: "A little film for you",
    tapToOpen: "Tap to open",
    tapHint: "Tap right to skip ahead · left to go back · hold to pause",
    invited: "You're invited",
    invitedSub: "to the bachelorette of",
    nameKicker: "The Bachelorette",
    nameSub: "Bride-to-be",
    photoCaption: "Then",
    photoSub: "Little her, all grown up",
    photoPlaceholder: "Photo coming soon",
    dateKicker: "Save the date",
    placeKicker: "Join us",
    placeTitle: "Time & Place",
    timeLabel: "Time",
    venueLabel: "Venue",
    addressLabel: "Address",
    dressKicker: "Please wear",
    dressTitle: "Dress Code",
    finalKicker: "The Bachelorette",
    finalInvite: "Join us in celebrating",
    countdownLabels: ["Days", "Hours", "Mins", "Secs"],
    countdownDone: "Today's the day",
    calendar: "Add to calendar",
    calendarGoogle: "Google Calendar",
    calendarApple: "Apple / Outlook (.ics)",
    map: "Open map",
    rsvp: "RSVP on WhatsApp",
    replay: "Replay",
    skip: "Skip"
  }
};
