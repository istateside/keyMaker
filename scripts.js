'use strict';

const form = document.querySelector('form');
const rootInput = document.querySelector('input[name="root"]');
const text = document.querySelector('#progression-text');


function formOnSubmit(e) {
  if (e) {
    e.preventDefault();
  }

  if (!rootInput.value) {
    return;
  }

  const progression = new Progression(rootInput.value);
  text.innerText = progression.toString();
}

form.addEventListener('submit', formOnSubmit);

document.addEventListener("DOMContentLoaded", () => {
  const startingValue = getUrlParameter('root');

  if (startingValue) {
    rootInput.value = startingValue;
    formOnSubmit();
  }
});

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const CONVERSIONS = {
  'A#': 'Bb',
  'B#': 'C',
  'Cb': 'B',
  'C#': 'Db',
  'D#': 'Eb',
  'E#': 'F',
  'Fb': 'E',
  'F#': 'Gb',
  'G#': 'Ab',
}

const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const NOTES_WITH_FLATS = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
const ALL_NOTES = NOTES.concat(NOTES_WITH_FLATS);
const MAJOR_KEY_STEPS = [2, 2, 1, 2, 2, 2];
const MAJOR_PROGRESSION = ['', 'm', 'm', '', '', 'm', 'dim'];

function getKeyFromRoot(root) {
  const [rootNote, notesAsArray] = cleanNoteInput(root);
  const output = [rootNote];
  let noteIdx = notesAsArray.indexOf(rootNote);

  for (const step of MAJOR_KEY_STEPS) {
    noteIdx = nextNoteIdx(noteIdx, step, notesAsArray);
    output.push(notesAsArray[noteIdx]);
  }

  return output;
}

function cleanNoteInput(root) {
  let rootNote = root;
  let notesAsArray = NOTES;

  if (CONVERSIONS.hasOwnProperty(root)) {
    rootNote = CONVERSIONS[root];
  }

  if (ALL_NOTES.indexOf(root) === -1) {
    throw(`${root} is not a valid note.`);
  }

  if (rootNote.indexOf('b') === 1) {
    notesAsArray = NOTES_WITH_FLATS;
  }

  return [rootNote, notesAsArray];
}

function nextNoteIdx(currentIdx, step = 2, notes = NOTES) {
  let nextIdx;

  if (currentIdx >= 0) {
    nextIdx = (currentIdx + step) % notes.length;
  } else {
    nextIdx = notes.length - nextIdx;
  }

  return nextIdx;
}

function getProgressionFromKey(key) {
  let progression = [];
  if (!key instanceof Array) {
    throw("key must be an array");
  }

  for (let i = 0; i < key.length; i++) {
    progression.push(key[i] + MAJOR_PROGRESSION[i]);
  }

  return progression;
}

class Key {
  constructor(root) {
    this.notes = getKeyFromRoot(root);

    for (let i = 0; i < this.notes.length; i++) {
      this[i] = this.notes[i];
    }
  }

  toString() {
    return this.notes.join(" ");
  }
}

class Progression {
  constructor(root) {
    this.root = root;
    this.key = new Key(this.root);
    this.chords = getProgressionFromKey(this.key.notes);

    for (let i = 0; i < this.chords.length; i++) {
      this[i] = this.chords[i];
    }
  }

  toString() {
    return this.chords.join(" - ");
  }
}
