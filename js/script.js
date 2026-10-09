/* =========================================================
   Shadrick Solochi - ICT251 Activity 3
   Four features:
   1. Contact form validation and preview (compulsory)
   2. Gallery viewer (Previous / Next)
   3. Project search and filter
   4. Light / dark theme switch
   ========================================================= */

/* ---------- Feature 1: contact form validation and preview ---------- */

// Simple email shape: something@something.tld (no spaces, TLD of 2+ letters)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Each validator returns an error message, or "" when the value is valid.
function validateName(value) {
  const name = value.trim();
  if (name === "") return "Please enter your name. Spaces alone are not allowed.";
  if (name.length < 2) return "Your name must be at least 2 characters long.";
  if (!/\p{L}/u.test(name)) return "Your name must contain at least one letter.";
  return "";
}

function validateEmail(value) {
  const email = value.trim();
  if (email === "") return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email) || email.includes("..")) {
    return "Enter a valid email address, for example name@example.com.";
  }
  return "";
}

function validateMessage(value) {
  if (value.trim() === "") return "Please write a message. Spaces alone are not allowed.";
  return "";
}

// Show an error under a field and mark it as invalid for assistive technology.
function showFieldError(field, message) {
  const errorBox = document.getElementById(field.id + "-error");
  errorBox.textContent = message;
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");
}

// Remove the error from a field.
function clearFieldError(field) {
  const errorBox = document.getElementById(field.id + "-error");
  errorBox.textContent = "";
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
}

// Build the on-page summary. textContent is used so that anything the
// visitor typed is displayed as plain text and never run as HTML.
function showPreview(previewBox, values) {
  previewBox.textContent = "";

  const heading = document.createElement("h3");
  heading.textContent = "Preview of your validated input";

  const note = document.createElement("p");
  note.textContent =
    "Your details passed validation. This is only a local preview in your browser. No message was sent or delivered.";

  const list = document.createElement("dl");
  [
    ["Name", values.name],
    ["Email", values.email],
    ["Topic", values.topic],
    ["Message", values.message]
  ].forEach(function (pair) {
    const term = document.createElement("dt");
    term.textContent = pair[0];
    const detail = document.createElement("dd");
    detail.textContent = pair[1];
    list.append(term, detail);
  });

  previewBox.append(heading, note, list);
  previewBox.hidden = false;
}

// Wire up the form: validate on submit, give feedback, show a preview.
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const topicField = document.getElementById("topic");
  const messageField = document.getElementById("message");
  const status = document.getElementById("form-status");
  const previewBox = document.getElementById("form-preview");

  // Pair every checked field with its validator.
  const checks = [
    { field: nameField, validate: validateName },
    { field: emailField, validate: validateEmail },
    { field: messageField, validate: validateMessage }
  ];

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // keep everything local, nothing is submitted

    previewBox.hidden = true;
    status.textContent = "";

    let firstInvalid = null;
    let errorCount = 0;

    checks.forEach(function (check) {
      const message = check.validate(check.field.value);
      if (message) {
        showFieldError(check.field, message);
        errorCount += 1;
        if (!firstInvalid) firstInvalid = check.field;
      } else {
        clearFieldError(check.field);
      }
    });

    if (errorCount > 0) {
      status.textContent =
        errorCount === 1
          ? "Please fix the 1 highlighted field before previewing."
          : "Please fix the " + errorCount + " highlighted fields before previewing.";
      firstInvalid.focus();
      return;
    }

    showPreview(previewBox, {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      topic: topicField.options[topicField.selectedIndex].textContent,
      message: messageField.value.trim()
    });
  });

  // Once a field has an error, re-check it while the visitor corrects it.
  checks.forEach(function (check) {
    check.field.addEventListener("input", function () {
      if (check.field.classList.contains("invalid")) {
        const message = check.validate(check.field.value);
        if (message) showFieldError(check.field, message);
        else clearFieldError(check.field);
      }
    });
  });

  // "Clear form" also removes errors, the status line and the preview.
  form.addEventListener("reset", function () {
    checks.forEach(function (check) { clearFieldError(check.field); });
    status.textContent = "";
    previewBox.hidden = true;
    previewBox.textContent = "";
  });
}

/* ---------- Feature 2: gallery viewer ---------- */

// Show one photo (and its caption) at a time with Previous / Next buttons.
function initGalleryViewer() {
  const viewer = document.getElementById("gallery-viewer");
  if (!viewer) return;

  const slides = Array.from(viewer.querySelectorAll(".slide")); // array of figures
  const controls = document.getElementById("viewer-controls");
  const prevButton = document.getElementById("prev-photo");
  const nextButton = document.getElementById("next-photo");
  const status = document.getElementById("photo-status");
  let current = 0;

  // Display slide number `index`, keeping it between the first and last photo.
  function showPhoto(index) {
    const hadFocusOnPrev = document.activeElement === prevButton;
    const hadFocusOnNext = document.activeElement === nextButton;

    current = Math.min(Math.max(index, 0), slides.length - 1);
    slides.forEach(function (slide, position) {
      slide.hidden = position !== current;
    });
    status.textContent = "Photo " + (current + 1) + " of " + slides.length;

    // Disable the button that has nowhere to go (first / last photo).
    prevButton.disabled = current === 0;
    nextButton.disabled = current === slides.length - 1;

    // If the focused button was just disabled, move focus to the other one.
    if (hadFocusOnPrev && prevButton.disabled) nextButton.focus();
    if (hadFocusOnNext && nextButton.disabled) prevButton.focus();
  }

  prevButton.addEventListener("click", function () { showPhoto(current - 1); });
  nextButton.addEventListener("click", function () { showPhoto(current + 1); });

  controls.hidden = false; // buttons only appear when JavaScript is running
  showPhoto(0);
}

/* ---------- Feature 3: project search and filter ---------- */

// Filter the project cards by keyword and category; offer a reset.
function initProjectFilter() {
  const cards = Array.from(document.querySelectorAll(".project-card")); // array of cards
  const searchBox = document.getElementById("project-search");
  const categoryBox = document.getElementById("project-category");
  const resetButton = document.getElementById("project-reset");
  const count = document.getElementById("project-count");
  const emptyMessage = document.getElementById("project-empty");
  if (!cards.length || !searchBox) return;

  // Show only the cards that match both the keyword and the category.
  function applyFilters() {
    const term = searchBox.value.trim().toLowerCase();
    const category = categoryBox.value;
    let visible = 0;

    cards.forEach(function (card) {
      const matchesText = term === "" || card.textContent.toLowerCase().includes(term);
      const matchesCategory = category === "all" || card.dataset.category === category;
      const show = matchesText && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });

    count.textContent = "Showing " + visible + " of " + cards.length + " projects.";

    if (visible === 0) {
      const categoryName = categoryBox.options[categoryBox.selectedIndex].textContent;
      emptyMessage.textContent =
        term === ""
          ? "No projects found in the " + categoryName + " category. Press Reset filters to see everything."
          : "No projects match \u201C" + searchBox.value.trim() + "\u201D in " + categoryName.toLowerCase() +
            ". Try another word or press Reset filters.";
      emptyMessage.hidden = false;
    } else {
      emptyMessage.hidden = true;
    }
  }

  // Put every control back to its starting state.
  function resetFilters() {
    searchBox.value = "";
    categoryBox.value = "all";
    applyFilters();
    searchBox.focus();
  }

  searchBox.addEventListener("input", applyFilters);
  categoryBox.addEventListener("change", applyFilters);
  resetButton.addEventListener("click", resetFilters);
  applyFilters();
}

/* ---------- Feature 4: light / dark theme switch ---------- */

// Switch between the light and dark colour themes and remember the choice.
function initThemeSwitch() {
  const root = document.documentElement;
  const item = document.getElementById("theme-item");
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  // Apply a theme name ("light" or "dark") and update the button label.
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    button.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }

  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (error) {
    saved = null; // storage can be blocked; the switch still works
  }

  applyTheme(saved === "dark" ? "dark" : "light");
  item.hidden = false; // the button only appears when JavaScript is running

  button.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (error) {
      /* saving is optional, so ignore storage errors */
    }
  });
}

/* ---------- Start everything once the page is ready ---------- */
// The script is loaded with "defer", so the HTML is already parsed here.
initThemeSwitch();
initContactForm();
initProjectFilter();
initGalleryViewer();
