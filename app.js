const CONFIG = window.APP_CONFIG || {};

const steps = [
  { key: 'name', label: 'Name', prompt: 'Hey. I’m Minnal Murali. I help people find their next safe step. What should I call you?', placeholder: 'Your name' },
  { key: 'age', label: 'Age', prompt: 'Good to meet you. How old are you?', placeholder: 'Your age' },
  { key: 'location', label: 'Location', prompt: 'Where are you right now?', placeholder: 'Your city or location' },
  { key: 'email', label: 'Email', prompt: 'Where can the team reach you?', placeholder: 'you@example.com', type: 'email' },
  { key: 'request', label: 'Your message', prompt: 'So… tell me. How can I help?', placeholder: 'Tell Minnal what is going on…' }
];

const state = { index: 0, answers: {} };
const messages = document.querySelector('#chatMessages');
const form = document.querySelector('#chatForm');
const input = document.querySelector('#chatInput');
const progress = document.querySelector('#chatProgress');
const restart = document.querySelector('#restartChat');

function addMessage(text, who = 'hero') {
  const bubble = document.createElement('div');
  bubble.className = `message ${who === 'user' ? 'user' : ''}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function addTypingThen(text, delay = 420) {
  const typing = document.createElement('div');
  typing.className = 'message typing';
  typing.textContent = 'Minnal is typing…';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
  window.setTimeout(() => { typing.remove(); addMessage(text); }, delay);
}

function updateInput() {
  const step = steps[state.index];
  input.placeholder = step ? step.placeholder : 'Your message…';
  input.type = step?.type || 'text';
  input.value = '';
  input.focus();
  progress.textContent = `${String(Math.min(state.index + 1, steps.length)).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
}

function resetChat() {
  state.index = 0;
  state.answers = {};
  messages.innerHTML = '';
  addMessage(steps[0].prompt);
  updateInput();
}

function valid(step, value) {
  if (!value.trim()) return 'Give me a little more so I can help.';
  if (step.key === 'email' && !/^\S+@\S+\.\S+$/.test(value.trim())) return 'That email looks incomplete. Try it once more?';
  if (step.key === 'age' && (Number.isNaN(Number(value)) || Number(value) < 1 || Number(value) > 120)) return 'Give me your age as a number, please.';
  return '';
}

async function submitRequest() {
  const payload = {
    _subject: 'Someone Needs Your Help!',
    recipient: CONFIG.notificationEmail || '',
    name: state.answers.name,
    age: state.answers.age,
    location: state.answers.location,
    email: state.answers.email,
    request: state.answers.request,
    submittedAt: new Date().toISOString()
  };

  if (!CONFIG.formEndpoint || CONFIG.formEndpoint.includes('REPLACE_WITH_FORM_ID')) {
    addTypingThen('Your signal is ready. Add your Formspree endpoint in config.js to send this request by email.');
    return;
  }

  try {
    const body = new URLSearchParams(payload);
    const response = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body
    });
    if (!response.ok) {
      let detail = '';
      try {
        const result = await response.json();
        detail = result?.errors?.[0]?.message || '';
      } catch (_) {}
      throw new Error(detail || `Submission failed (${response.status})`);
    }
    addTypingThen('Signal received. I’ve sent the details to the team. Someone will follow up with your next step.');
  } catch (error) {
    console.error('Formspree submission error:', error);
    addTypingThen('I couldn’t send the signal yet. Please confirm the Formspree endpoint in config.js and try again.');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const step = steps[state.index];
  const value = input.value.trim();
  const error = valid(step, value);
  if (error) { addTypingThen(error, 250); return; }
  state.answers[step.key] = value;
  addMessage(value, 'user');
  state.index += 1;
  if (state.index < steps.length) {
    addTypingThen(steps[state.index].prompt);
    updateInput();
  } else {
    input.disabled = true;
    form.querySelector('button').disabled = true;
    progress.textContent = 'DONE';
    await submitRequest();
  }
});

restart.addEventListener('click', resetChat);
resetChat();
