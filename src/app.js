"use strict";

require("concise.css/dist/concise.css");

const _ = require("lodash");

function Color(name, regex) {
  this.name = name;

  /**
   * Only match at word boundaries so we don't have Fred turn the screen red
   **/
  this.regex = regex || new RegExp(`\\b${name}\\b`);
}

/**
 * @const
 *
 * The list of colors we can change the background to. User input is checked
 * against this list.
 **/
const COLORS = [
  "red",
  "green",
  "blue",
  "orange",
  "purple",
  "yellow",
  "pink",
  "salmon",
  "moccasin",
  "black",
  "chocolate",
  "peru",
  "tomato",
  "chartreuse",
  "aqua",
  "fuchsia",
  "honeydew",
].map(color => new Color(color));

/**
 * Change the body background color to the specified string.
 *
 * @param {string} color - color we are changing to
 * @return {void}
 **/
function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
};

/**
 * Given a speech recognition event, return the text of its most recent result.
 *
 * @param {SpeechRecognitionEvent} e - speech event from browser API
 * @return {string} - transcript of what was most recently said
 **/
function getMostRecentResult(e) {
  const results = e.results;

  const innerResults = results.item(results.length - 1),
    transcript = innerResults.item(innerResults.length - 1).transcript;

  return transcript.toLowerCase();
};

/**
 * Given a Speech Event, parse it and see if the text
 * entered looks like it contains a color word. If it
 * does, set the background to that color.
 *
 * @param {SpeechRecognitionEvent} e - browser speech event
 * @return {void}
 **/
function processInput(e) {
  const result = getMostRecentResult(e);

  const match = _.find(COLORS, color => color.regex.test(result));

  if (match) {
    changeBackgroundColor(match.name);
    return changeOutput(`${match.name}: Aye aye!`);
  }

  changeOutput("Huh?", result);
};

/**
 * Sets up a speech recognizer to:
 *
 * - call processInput above when we have a result
 * - call this function when finished (thus looping)
 *
 * As pointed out http://stackoverflow.com/a/25414548 using continuous leads to
 * a lot of lag. Restarting in onend is the best way around this.
 *
 * @return {SpeechRecognition} an active and listening SpeechRecognition object
 **/
function startRecognizing() {
  const recognition = new webkitSpeechRecognition();

  recognition.continuous = false;

  recognition.onresult = processInput;
  recognition.onend = startRecognizing;
  recognition.onerror = function(err) {
    console.error(err);
    changeOutput("Whoops", "Something went wrong");
  };

  recognition.start();

  return recognition;
};

function changeOutput(text, subtext) {
  const header = document.getElementById("header");
  header.textContent = text;

  const explanation = document.getElementById("explanation");
  explanation.textContent = subtext;
};

function setupOutput() {
  const header = document.createElement("h1");
  header.id = "header";
  header.textContent = "Say a color name";

  const explanation = document.createElement("blockquote");
  explanation.id = "explanation";

  document.body.appendChild(header);
  document.body.appendChild(explanation);
};

document.addEventListener("DOMContentLoaded", function() {
  setupOutput();
  startRecognizing();
});
