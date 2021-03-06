"use strict";

(function () {

/* global chrome */

/* Font elements */

const generics = [
  document.getElementById("serif"),
  document.getElementById("sans-serif"),
  document.getElementById("monospace")
];

const fonts = [
  document.getElementById("serif-fonts"),
  document.getElementById("sans-serif-fonts"),
  document.getElementById("monospace-fonts")
];

const fontCheckboxes = document.getElementsByName("font");
const currentFontName = document.getElementById("current-font-name");


/* Mode elements */

const modeCheckboxes = document.getElementsByName("mode");


/* Helpers */

function setCurrentFontNameText(fontName) {
  currentFontName.innerText = fontName;
}

function checkCheckboxById(id) {
  document.getElementById(id).checked = true;
}

function displayGeneric(id) {
  generics.forEach(generic => {
    const decoration = generic.id === id ? "underline" : "";
    generic.style.textDecoration = decoration;
  });

  fonts.forEach(font => {
    const display = (font.id === id + '-fonts') ? "block" : "none";
    font.style.display = display;
  });
}


/* Events */

generics.forEach(generic => {
  generic.addEventListener("click", function () {
    displayGeneric(this.id);
  });
});

fontCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("click", function () {
    const font = {
      id: this.id,
      name: this.value,
      genericFamily: this.dataset.generic,
      fontFamily: [this.value, this.dataset.generic].join(',')
    };

    chrome.storage.local.set({ font: font });
    setCurrentFontNameText(font.name);
  });
});

modeCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("click", function () {
    const mode = this.id;
    document.body.id = mode;
    chrome.storage.local.set({ mode: mode });
  });
});


/* Storage */

chrome.storage.local.get(["font", "mode"], result => {
  // 1 FONT
  const currentFont = result.font; // see background.js
  const currentGeneric = currentFont.genericFamily;

  // Display the name of the current font
  setCurrentFontNameText(currentFont.name);

  // Check the current font
  checkCheckboxById(currentFont.id);

  // Underline the generic and display its fonts
  displayGeneric(currentGeneric);


  // 2 MODE
  checkCheckboxById(result.mode);
  document.body.id = result.mode;
});

})(); // IIFE
