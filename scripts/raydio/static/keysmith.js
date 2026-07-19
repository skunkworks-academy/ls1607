/* Keysmith frontend — talks to the Flask /api/generate endpoint. */

(() => {
  const state = {
    mode: "password",
    length: 18,
    lower: true,
    upper: true,
    digit: true,
    symbol: true,
    ambiguous: false,
    words: 4,
    separator: "-",
    capitalize: true,
    addNumber: false,
    pin: 6,
  };

  let current = { text: "", bits: 0 };
  const history = [];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGITS = "0123456789";
  const classify = (c) => {
    if (LOWER.includes(c)) return "lo";
    if (UPPER.includes(c)) return "up";
    if (DIGITS.includes(c)) return "di";
    return "sy";
  };

  /* ---------------- rendering ---------------- */
  function renderResult(data) {
    current = data;
    const display = $("#display");
    display.innerHTML = "";

    if (!data.text) {
      const span = document.createElement("span");
      span.className = "empty";
      span.textContent = "Turn on at least one character set to generate.";
      display.appendChild(span);
      $("#meter").classList.add("hidden");
      return;
    }
    $("#meter").classList.remove("hidden");

    const compact = data.text.length > 26 || state.mode === "passphrase";
    [...data.text].forEach((c, i) => {
      const span = document.createElement("span");
      span.className = `ch ${classify(c)}${compact ? " compact" : ""}`;
      span.style.animationDelay = `${Math.min(i * 18, 500)}ms`;
      span.textContent = c === " " ? "\u00A0" : c;
      display.appendChild(span);
    });

    $("#meter-fill").style.width = `${data.strength.pct}%`;
    $("#meter-fill").style.background = data.strength.tone;
    $("#strength-label").textContent = data.strength.label;
    $("#strength-label").style.color = data.strength.tone;
    $("#entropy-label").textContent = `${Math.round(data.bits)} bits of entropy`;
    $("#crack-label").textContent = data.crack_time;
  }

  function renderHistory() {
    const card = $("#hist-card");
    const list = $("#hist-list");
    const past = history.slice(1);
    if (past.length === 0) {
      card.classList.add("hidden");
      return;
    }
    card.classList.remove("hidden");
    list.innerHTML = "";
    past.forEach((h) => {
      const row = document.createElement("div");
      row.className = "hist-item";

      const text = document.createElement("span");
      text.className = "hist-text";
      text.textContent = h.text;

      const bits = document.createElement("span");
      bits.className = "hist-bits";
      bits.textContent = `${Math.round(h.bits)} bits`;

      const btn = document.createElement("button");
      btn.className = "hist-copy";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => copyText(h.text, btn));

      row.append(text, bits, btn);
      list.appendChild(row);
    });
  }

  /* ---------------- clipboard ---------------- */
  async function copyText(text, btn) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const original = btn.textContent;
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = original), 1600);
  }

  /* ---------------- API ---------------- */
  async function generate() {
    const payload = { mode: state.mode };
    if (state.mode === "password") {
      Object.assign(payload, {
        length: state.length,
        lower: state.lower,
        upper: state.upper,
        digit: state.digit,
        symbol: state.symbol,
        ambiguous: state.ambiguous,
      });
      if (!state.lower && !state.upper && !state.digit && !state.symbol) {
        renderResult({ text: "", bits: 0 });
        return;
      }
    } else if (state.mode === "passphrase") {
      Object.assign(payload, {
        words: state.words,
        separator: state.separator,
        capitalize: state.capitalize,
        addNumber: state.addNumber,
      });
    } else {
      payload.length = state.pin;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      renderResult(data);
      if (data.text && !history.some((h) => h.text === data.text)) {
        history.unshift({ text: data.text, bits: data.bits });
        if (history.length > 7) history.pop();
      }
      renderHistory();
    } catch {
      renderResult({ text: "", bits: 0 });
      $("#display").innerHTML =
        '<span class="empty">Could not reach the server — is app.py running?</span>';
    }
  }

  /* ---------------- wiring ---------------- */
  $$(".mode").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      $$(".mode").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", on);
      });
      $$(".panel").forEach((p) => p.classList.add("hidden"));
      $(`#panel-${state.mode}`).classList.remove("hidden");
      $("#output-title").textContent =
        state.mode === "pin" ? "Your PIN" : `Your ${state.mode}`;
      $("#legend").classList.toggle("hidden", state.mode !== "password");
      generate();
    })
  );

  $$(".toggle").forEach((btn) =>
    btn.addEventListener("click", () => {
      const flag = btn.dataset.flag;
      state[flag] = !state[flag];
      btn.classList.toggle("on", state[flag]);
      btn.setAttribute("aria-pressed", state[flag]);
      generate();
    })
  );

  $$(".sep").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.separator = btn.dataset.sep;
      $$(".sep").forEach((b) => b.classList.toggle("on", b === btn));
      generate();
    })
  );

  const bindSlider = (id, key, labelId) => {
    const input = $(`#${id}`);
    input.addEventListener("input", () => {
      state[key] = +input.value;
      $(`#${labelId}`).textContent = input.value;
      generate();
    });
  };
  bindSlider("length", "length", "length-value");
  bindSlider("words", "words", "words-value");
  bindSlider("pin", "pin", "pin-value");

  $("#copy-btn").addEventListener("click", (e) => copyText(current.text, e.target));
  $("#regen-btn").addEventListener("click", generate);

  generate();
})();

