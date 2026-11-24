"use strict";

const questionValues = [
  ["economics", "related", "other"],
  ["tgu", "external", "other"],
  ["yes", "maybe", "no"],
  ["yes", "maybe", "no"],
];

let currentLanguage = "de";

const quiz = document.querySelector("#quiz");
const quizQuestion = document.querySelector("#quiz-question");
const quizOptions = document.querySelector("#quiz-options");
const quizProgress = document.querySelector("#quiz-progress");
const quizSteps = [...document.querySelectorAll(".steps i")];
const quizNext = document.querySelector("#quiz-next");
const quizBack = document.querySelector("#quiz-back");
const quizValidation = document.querySelector("#quiz-validation");
const result = document.querySelector("#quiz-result");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");
const resultNote = document.querySelector("#result-note");

const answers = Array(questionValues.length).fill("");
let questionIndex = 0;

function showQuestion(moveFocus = true) {
  const copy = quizCopy[currentLanguage];
  const [title, labels] = copy.questions[questionIndex];
  quizQuestion.textContent = title;
  quizProgress.textContent = copy.progress(questionIndex + 1, questionValues.length);
  quizOptions.replaceChildren();

  for (const [index, value] of questionValues[questionIndex].entries()) {
    const option = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = value;
    radio.checked = answers[questionIndex] === value;
    option.append(radio, document.createTextNode(labels[index]));
    quizOptions.append(option);
  }

  quizSteps.forEach((step, index) => {
    step.classList.toggle("current", index === questionIndex);
    step.classList.toggle("complete", index < questionIndex);
  });
  quizBack.hidden = questionIndex === 0;
  quizNext.textContent = questionIndex === questionValues.length - 1 ? copy.results : copy.next;
  result.hidden = true;
  quiz.hidden = false;

  if (moveFocus) {
    quizValidation.hidden = true;
    quizQuestion.focus();
  }
}

function showResult(moveFocus = true) {
  const copy = quizCopy[currentLanguage];
  const [field, institution, methods, teamwork] = answers;
  const needsClarification = field === "other" || institution !== "tgu";
  const notes = [];

  if (field === "other") {
    notes.push(copy.field);
  }
  if (institution === "external") {
    notes.push(copy.external);
  } else if (institution === "other") {
    notes.push(copy.notStudying);
  }

  if (methods === "yes" && teamwork === "yes") {
    resultTitle.textContent = needsClarification ? copy.clarifyTitle : copy.fitTitle;
    resultSummary.textContent = copy.fitSummary;
  } else if (teamwork === "no" || methods === "no") {
    resultTitle.textContent = copy.considerTitle;
    resultSummary.textContent = copy.considerSummary;
  } else {
    resultTitle.textContent = copy.exploreTitle;
    resultSummary.textContent = copy.exploreSummary;
  }

  resultNote.textContent = notes.join(" ");
  resultNote.hidden = notes.length === 0;
  quiz.hidden = true;
  result.hidden = false;
  if (moveFocus) resultTitle.focus();
}

quizOptions.addEventListener("change", (event) => {
  answers[questionIndex] = event.target.value;
  quizValidation.hidden = true;
});

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!answers[questionIndex]) {
    quizValidation.hidden = false;
    quizOptions.querySelector("input").focus();
    return;
  }

  if (questionIndex === questionValues.length - 1) {
    showResult();
    return;
  }

  questionIndex += 1;
  showQuestion();
});

quizBack.addEventListener("click", () => {
  questionIndex -= 1;
  showQuestion();
});

document.querySelector("#quiz-restart").addEventListener("click", () => {
  answers.fill("");
  questionIndex = 0;
  showQuestion();
});

const draftForm = document.querySelector("#draft-form");
const draftLanguage = document.querySelector("#draft-language");
const nameField = document.querySelector("#draft-name");
const studiesField = document.querySelector("#draft-studies");
const motivationField = document.querySelector("#draft-motivation");
const topicField = document.querySelector("#draft-topic");
const preview = document.querySelector("#draft-preview");
const copyButton = document.querySelector("#draft-copy");
const downloadButton = document.querySelector("#draft-download");
const draftFeedback = document.querySelector("#draft-feedback");

let previewLanguage = draftLanguage.value;
let draftMessage = "";

function updateDraftExamples() {
  const template = draftTemplates[draftLanguage.value];
  studiesField.placeholder = template.studyExample;
  motivationField.placeholder = template.motivationExample;
  topicField.placeholder = template.topicExample;
  for (const field of [studiesField, motivationField, topicField]) {
    field.lang = draftLanguage.value;
  }
}

draftLanguage.addEventListener("change", updateDraftExamples);

function syncDraftActions(message = draftMessage) {
  draftMessage = message;
  const isEmpty = !preview.value.trim();
  copyButton.disabled = isEmpty;
  downloadButton.disabled = isEmpty;
  preview.lang = isEmpty ? currentLanguage : previewLanguage;
  draftFeedback.textContent = draftMessages[currentLanguage][message] ?? "";
}

for (const field of [nameField, motivationField]) {
  field.addEventListener("input", () => field.setCustomValidity(""));
}

draftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameField.value.trim();
  const motivation = motivationField.value.trim();
  const messages = draftMessages[currentLanguage];
  nameField.setCustomValidity(name ? "" : messages.nameRequired);
  motivationField.setCustomValidity(motivation ? "" : messages.motivationRequired);
  if (!draftForm.reportValidity()) return;

  const studies = studiesField.value.trim();
  const topic = topicField.value.trim();
  previewLanguage = draftLanguage.value;
  const template = draftTemplates[previewLanguage];
  const paragraphs = [template.subject, template.greeting, template.intro];

  if (studies) paragraphs.push(`${template.studyPrefix}: ${studies}`);
  paragraphs.push(motivation);
  if (topic) paragraphs.push(`${template.topicPrefix}: ${topic}`);
  const signOff = previewLanguage === "en" ? `${template.signOff},` : template.signOff;
  paragraphs.push(`${signOff}\n${name}`);

  preview.value = paragraphs.join("\n\n");
  syncDraftActions("created");
  preview.focus();
  preview.setSelectionRange(0, 0);
});

preview.addEventListener("input", () => syncDraftActions(""));

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preview.value);
    syncDraftActions("copied");
  } catch {
    preview.focus();
    preview.select();
    syncDraftActions("selectToCopy");
  }
});

downloadButton.addEventListener("click", () => {
  const file = new Blob([preview.value], {type: "text/plain;charset=utf-8"});
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = draftTemplates[previewLanguage].filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  syncDraftActions("downloaded");
});

const languageSwitch = document.querySelector("#language-switch");
const languageButtons = [...languageSwitch.querySelectorAll("button")];
const pageCopy = [...document.querySelectorAll("[data-copy]")].map((element) => {
  const {copy: key, attribute} = element.dataset;
  const german = attribute ? element.getAttribute(attribute) : element.textContent;
  return {element, attribute, german, english: englishPageCopy[key]};
});

function readLanguage() {
  return new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "de";
}

function showLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;

  for (const {element, attribute, german, english} of pageCopy) {
    const text = language === "en" ? english : german;
    if (attribute) element.setAttribute(attribute, text);
    else element.textContent = text;
  }

  for (const button of languageButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  }

  if (result.hidden) showQuestion(false);
  else showResult(false);

  syncDraftActions();
}

for (const button of languageButtons) {
  button.addEventListener("click", () => {
    const language = button.dataset.language;
    if (language === currentLanguage) return;

    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.pushState(null, "", url);
    showLanguage(language);
  });
}

window.addEventListener("popstate", () => {
  const language = readLanguage();
  if (language !== currentLanguage) showLanguage(language);
});

updateDraftExamples();
showLanguage(readLanguage());
languageSwitch.hidden = false;
draftForm.hidden = false;
