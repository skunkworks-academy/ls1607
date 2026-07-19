# ============================================================
#  Keysmith setup — writes all app files, installs Flask, runs
#  Usage:  put this file in scripts\raydio, then run:
#          powershell -ExecutionPolicy Bypass -File .\setup-keysmith.ps1
# ============================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

New-Item -ItemType Directory -Force -Path "templates" | Out-Null
New-Item -ItemType Directory -Force -Path "static"    | Out-Null
$content_app_py = @'
"""
Keysmith — password generator web app (Flask backend).

All randomness comes from Python's `secrets` module (CSPRNG).
Run locally:
    python app.py
Then open http://127.0.0.1:5000
"""

import math
import secrets

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# ---------------------------------------------------------------- character sets
LOWER = "abcdefghijklmnopqrstuvwxyz"
UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
DIGIT = "0123456789"
SYMBOL = "!@#$%^&*()-_=+[]{};:,.?/"
AMBIGUOUS = set("Il1O0o")

WORDS = (
    "acorn amber anchor annex apple arrow atlas autumn badge bagel bamboo banner "
    "barrel basket beacon bell birch bison blanket blossom border bottle boulder "
    "branch brass breeze brick bridge bronze brook bucket bugle butter cabin cable "
    "cactus camera candle canoe canvas canyon carbon cargo carpet castle cedar "
    "cellar chalk cherry chisel cider cinder circle citrus clover cobalt comet "
    "compass copper coral cotton crater cricket crystal current dagger daisy delta "
    "denim desert diesel dome drift eagle easel echo elbow ember engine falcon "
    "fabric feather fern fiddle flint forest fossil fountain fox galaxy garden "
    "garlic gazebo geyser ginger glacier goblet granite grape gravel grove hammer "
    "harbor harvest hazel helmet hickory hollow honey horizon iceberg indigo ingot "
    "iris island ivory jacket jasper jigsaw jungle juniper kettle kiln knoll lagoon "
    "lantern lapel lava lemon lever lilac linen lobster locket lumber lunar magnet "
    "mango mantle maple marble marsh meadow mesa meteor mint mirror morsel mosaic "
    "moss mural nectar nickel north nutmeg oasis ocean olive onyx opal orbit "
    "orchard otter oxide paddle pallet panther parcel pebble pecan pepper pigment "
    "pillar pine pistachio planet plum pocket polar poplar prairie prism pulley "
    "quarry quartz quill raft rattan raven reef ridge ripple river rocket rustic "
    "saddle saffron salmon sandal sapphire satchel scarlet schooner sesame shadow "
    "shale shore silver sketch slate sonar spark spruce squall stone summit "
    "sunflower tandem tangelo tapestry teal thicket thistle timber topaz torch "
    "trellis trout tulip tundra turbine umber valley velvet violet wagon walnut "
    "waterfall willow winch yarn zephyr zinc"
).split()


# ---------------------------------------------------------------- helpers
def strip_ambiguous(chars: str) -> str:
    return "".join(c for c in chars if c not in AMBIGUOUS)


def crack_time(bits: float) -> str:
    """Average time for an offline attack at 10 billion guesses/second."""
    seconds = (2 ** max(bits - 1, 0)) / 1e10
    if seconds < 1:
        return "under a second"
    steps = [
        (60, "second"), (60, "minute"), (24, "hour"),
        (365, "day"), (1000, "year"), (1000, "thousand years"),
        (1000, "million years"), (1000, "billion years"),
    ]
    value, name = seconds, "second"
    for divisor, unit in steps:
        name = unit
        if value < divisor:
            break
        value /= divisor
    if name == "billion years" and value >= 1000:
        return "longer than the universe has existed"
    rounded = round(value) if value >= 100 else round(value, 1)
    plural = "s" if rounded != 1 and "years" not in name else ""
    return f"about {rounded:,} {name}{plural}"


def strength(bits: float) -> dict:
    if bits < 30:
        return {"label": "Weak", "tone": "#E06A5A", "pct": 20}
    if bits < 45:
        return {"label": "Fair", "tone": "#E0A45A", "pct": 40}
    if bits < 60:
        return {"label": "Good", "tone": "#E3B45F", "pct": 62}
    if bits < 85:
        return {"label": "Strong", "tone": "#8FC98A", "pct": 82}
    return {"label": "Excellent", "tone": "#6FD3A7", "pct": 100}


# ---------------------------------------------------------------- generators
def make_password(length, use_lower, use_upper, use_digit, use_symbol, allow_ambiguous):
    pools = []
    if use_lower:
        pools.append(LOWER if allow_ambiguous else strip_ambiguous(LOWER))
    if use_upper:
        pools.append(UPPER if allow_ambiguous else strip_ambiguous(UPPER))
    if use_digit:
        pools.append(DIGIT if allow_ambiguous else strip_ambiguous(DIGIT))
    if use_symbol:
        pools.append(SYMBOL)
    if not pools:
        return {"text": "", "bits": 0}

    everything = "".join(pools)
    # guarantee at least one character from each selected class
    chars = [secrets.choice(pool) for pool in pools]
    while len(chars) < length:
        chars.append(secrets.choice(everything))
    chars = chars[:length]
    # Fisher–Yates shuffle with a CSPRNG
    for i in range(len(chars) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        chars[i], chars[j] = chars[j], chars[i]

    bits = length * math.log2(len(everything))
    return {"text": "".join(chars), "bits": bits}


def make_passphrase(word_count, separator, capitalize, add_number):
    words = [secrets.choice(WORDS) for _ in range(word_count)]
    if capitalize:
        words = [w.capitalize() for w in words]
    text = separator.join(words)
    bits = word_count * math.log2(len(WORDS))
    if add_number:
        text += separator + str(secrets.randbelow(100))
        bits += math.log2(100)
    return {"text": text, "bits": bits}


def make_pin(length):
    return {
        "text": "".join(secrets.choice(DIGIT) for _ in range(length)),
        "bits": length * math.log2(10),
    }


# ---------------------------------------------------------------- routes
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    mode = data.get("mode", "password")

    if mode == "passphrase":
        result = make_passphrase(
            word_count=max(3, min(int(data.get("words", 4)), 10)),
            separator=str(data.get("separator", "-"))[:1] or "-",
            capitalize=bool(data.get("capitalize", True)),
            add_number=bool(data.get("addNumber", False)),
        )
    elif mode == "pin":
        result = make_pin(max(4, min(int(data.get("length", 6)), 16)))
    else:
        result = make_password(
            length=max(8, min(int(data.get("length", 18)), 64)),
            use_lower=bool(data.get("lower", True)),
            use_upper=bool(data.get("upper", True)),
            use_digit=bool(data.get("digit", True)),
            use_symbol=bool(data.get("symbol", True)),
            allow_ambiguous=bool(data.get("ambiguous", False)),
        )

    bits = result["bits"]
    return jsonify(
        {
            "text": result["text"],
            "bits": round(bits, 1),
            "strength": strength(bits),
            "crack_time": crack_time(bits),
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

'@
Set-Content -Path 'app.py' -Value $content_app_py -Encoding UTF8
Write-Host ('  wrote app.py') -ForegroundColor Green

$content_requirements_txt = @'
flask>=3.0

'@
Set-Content -Path 'requirements.txt' -Value $content_requirements_txt -Encoding UTF8
Write-Host ('  wrote requirements.txt') -ForegroundColor Green

$content_templates_index_html = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keysmith — Password Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ url_for('static', filename='keysmith.css') }}">
</head>
<body>
  <div class="shell">
    <header class="head">
      <div class="brand">Key<em>smith</em></div>
      <div class="sub">randomness from Python's <code>secrets</code> engine — generated on your machine</div>
    </header>

    <div class="modes" role="tablist" aria-label="Generator mode">
      <button class="mode on" data-mode="password" role="tab" aria-selected="true">Password</button>
      <button class="mode" data-mode="passphrase" role="tab" aria-selected="false">Passphrase</button>
      <button class="mode" data-mode="pin" role="tab" aria-selected="false">PIN</button>
    </div>

    <div class="grid">
      <!-- ================= controls ================= -->
      <section class="card">
        <h2>Settings</h2>

        <div class="panel" id="panel-password">
          <div class="field">
            <div class="label"><span>Length</span><b id="length-value">18</b></div>
            <input type="range" id="length" class="range" min="8" max="64" value="18" aria-label="Password length">
          </div>
          <button class="toggle on" data-flag="lower" aria-pressed="true">
            <span class="pip"></span><span><span class="t-label">Lowercase letters</span><span class="t-hint">a–z</span></span>
          </button>
          <button class="toggle on" data-flag="upper" aria-pressed="true">
            <span class="pip"></span><span><span class="t-label">Uppercase letters</span><span class="t-hint">A–Z</span></span>
          </button>
          <button class="toggle on" data-flag="digit" aria-pressed="true">
            <span class="pip"></span><span><span class="t-label">Digits</span><span class="t-hint">0–9</span></span>
          </button>
          <button class="toggle on" data-flag="symbol" aria-pressed="true">
            <span class="pip"></span><span><span class="t-label">Symbols</span><span class="t-hint">!@#$%^&amp;*…</span></span>
          </button>
          <button class="toggle" data-flag="ambiguous" aria-pressed="false">
            <span class="pip"></span><span><span class="t-label">Allow look-alikes</span><span class="t-hint">I, l, 1, O, 0 — turn off if you'll ever type it by hand</span></span>
          </button>
        </div>

        <div class="panel hidden" id="panel-passphrase">
          <div class="field">
            <div class="label"><span>Words</span><b id="words-value">4</b></div>
            <input type="range" id="words" class="range" min="3" max="10" value="4" aria-label="Number of words">
          </div>
          <div class="field">
            <div class="label"><span>Separator</span></div>
            <div class="seps">
              <button class="sep on" data-sep="-">-</button>
              <button class="sep" data-sep=".">.</button>
              <button class="sep" data-sep="_">_</button>
              <button class="sep" data-sep=" ">space</button>
            </div>
          </div>
          <button class="toggle on" data-flag="capitalize" aria-pressed="true">
            <span class="pip"></span><span><span class="t-label">Capitalize each word</span><span class="t-hint">Maple-River → satisfies uppercase rules</span></span>
          </button>
          <button class="toggle" data-flag="addNumber" aria-pressed="false">
            <span class="pip"></span><span><span class="t-label">Append a number</span><span class="t-hint">For sites that require a digit</span></span>
          </button>
        </div>

        <div class="panel hidden" id="panel-pin">
          <div class="field">
            <div class="label"><span>Digits</span><b id="pin-value">6</b></div>
            <input type="range" id="pin" class="range" min="4" max="16" value="6" aria-label="PIN length">
          </div>
        </div>
      </section>

      <!-- ================= output ================= -->
      <section class="output">
        <div class="card">
          <h2 id="output-title">Your password</h2>

          <div class="display" id="display" aria-live="polite"></div>

          <div class="legend" id="legend">
            <span><span class="dot" style="background:var(--lo)"></span>lowercase</span>
            <span><span class="dot" style="background:var(--up)"></span>uppercase</span>
            <span><span class="dot" style="background:var(--di)"></span>digit</span>
            <span><span class="dot" style="background:var(--sy)"></span>symbol</span>
          </div>

          <div class="meter" id="meter">
            <div class="meter-bar"><div class="meter-fill" id="meter-fill"></div></div>
            <div class="meter-row">
              <span id="strength-label"></span>
              <span id="entropy-label"></span>
            </div>
            <div class="crack">A fast offline attack would need <b id="crack-label"></b> to guess it.</div>
          </div>

          <div class="actions">
            <button class="btn primary" id="copy-btn">Copy</button>
            <button class="btn" id="regen-btn">Generate again</button>
          </div>
        </div>

        <div class="card hist hidden" id="hist-card">
          <h2>Earlier this session</h2>
          <div id="hist-list"></div>
          <div class="note">History lives only in this tab and disappears when you close it.</div>
        </div>
      </section>
    </div>
  </div>

  <script src="{{ url_for('static', filename='keysmith.js') }}"></script>
</body>
</html>

'@
Set-Content -Path 'templates\index.html' -Value $content_templates_index_html -Encoding UTF8
Write-Host ('  wrote templates/index.html') -ForegroundColor Green

$content_static_keysmith_css = @'
/* Keysmith — vault-and-brass theme */

:root {
  --ink: #131928;
  --panel: #1B2334;
  --panel2: #212B41;
  --line: #2E3A55;
  --text: #E8ECF4;
  --muted: #8B96AD;
  --brass: #E3B45F;
  --brass-deep: #B98F3D;
  --lo: #DCE3F0;
  --up: #E3B45F;
  --di: #7CC7E8;
  --sy: #EF8A6B;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background: var(--ink);
  background-image: radial-gradient(circle at 15% -10%, #1C2740 0%, transparent 55%);
  color: var(--text);
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  padding: 28px 20px 48px;
}

.shell { max-width: 900px; margin: 0 auto; }

/* ---------- header ---------- */
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}
.brand {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 600;
  font-size: clamp(26px, 5vw, 32px);
  letter-spacing: 0.01em;
}
.brand em { font-style: normal; color: var(--brass); }
.sub { color: var(--muted); font-size: 12px; }
.sub code { color: var(--brass); font-family: inherit; }

/* ---------- mode switch ---------- */
.modes {
  display: inline-flex;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 18px;
}
.mode {
  background: transparent;
  border: 0;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  padding: 9px 16px;
  cursor: pointer;
}
.mode + .mode { border-left: 1px solid var(--line); }
.mode.on { background: var(--panel2); color: var(--brass); }

/* ---------- layout ---------- */
.grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 18px;
}
@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr; }
  body { padding: 20px 14px 40px; }
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px;
}
.card h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
}
.hidden { display: none !important; }

/* ---------- controls ---------- */
.field { margin-bottom: 16px; }
.label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}
.label b { color: var(--brass); font-weight: 600; }
.range { width: 100%; accent-color: var(--brass); cursor: pointer; }

.toggle {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--text);
  font: inherit;
  font-size: 13px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
}
.toggle.on {
  border-color: var(--brass-deep);
  background: rgba(227, 180, 95, 0.07);
}
.pip {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid var(--muted);
  margin-top: 4px;
  flex: none;
}
.toggle.on .pip { background: var(--brass); border-color: var(--brass); }
.t-label { display: block; }
.t-hint { display: block; color: var(--muted); font-size: 11px; margin-top: 2px; }

.seps { display: flex; gap: 6px; }
.sep {
  flex: 1;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text);
  font: inherit;
  padding: 7px 0;
  cursor: pointer;
}
.sep.on {
  border-color: var(--brass-deep);
  color: var(--brass);
  background: rgba(227, 180, 95, 0.07);
}

/* ---------- output ---------- */
.display {
  background: var(--panel2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px 16px;
  min-height: 96px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  justify-content: center;
  overflow-wrap: anywhere;
}
.ch {
  display: inline-block;
  font-size: 24px;
  font-weight: 500;
  animation: ch-in 0.28s both;
}
.ch.compact { font-size: 17px; }
.ch.lo { color: var(--lo); }
.ch.up { color: var(--up); }
.ch.di { color: var(--di); }
.ch.sy { color: var(--sy); }
@keyframes ch-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ch { animation: none; }
}
.empty { color: var(--muted); font-size: 14px; }

.legend {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 11px;
  color: var(--muted);
  margin-top: 10px;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.meter { margin-top: 16px; }
.meter-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--line);
  overflow: hidden;
}
.meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background 0.3s;
}
.meter-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 8px;
  color: var(--muted);
}
.crack { font-size: 12px; color: var(--muted); margin-top: 4px; }
.crack b { color: var(--text); font-weight: 500; }

.actions { display: flex; gap: 10px; margin-top: 16px; }
.btn {
  flex: 1;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  padding: 12px 0;
  cursor: pointer;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
}
.btn.primary { background: var(--brass); border-color: var(--brass); color: #221A08; }
.btn.primary:hover { background: #EDC378; }
.btn:hover { border-color: var(--brass-deep); }

/* ---------- history ---------- */
.hist { margin-top: 18px; }
.hist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 4px;
  border-bottom: 1px solid var(--line);
  font-size: 12.5px;
}
.hist-item:last-child { border-bottom: 0; }
.hist-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hist-bits { color: var(--muted); flex: none; font-size: 11px; }
.hist-copy {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--muted);
  font: inherit;
  font-size: 11px;
  padding: 4px 9px;
  cursor: pointer;
}
.hist-copy:hover { color: var(--brass); border-color: var(--brass-deep); }
.note { font-size: 11px; color: var(--muted); margin-top: 10px; }

/* ---------- focus ---------- */
.mode:focus-visible,
.toggle:focus-visible,
.btn:focus-visible,
.sep:focus-visible,
.hist-copy:focus-visible,
.range:focus-visible {
  outline: 2px solid var(--brass);
  outline-offset: 2px;
}

'@
Set-Content -Path 'static\keysmith.css' -Value $content_static_keysmith_css -Encoding UTF8
Write-Host ('  wrote static/keysmith.css') -ForegroundColor Green

$content_static_keysmith_js = @'
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

'@
Set-Content -Path 'static\keysmith.js' -Value $content_static_keysmith_js -Encoding UTF8
Write-Host ('  wrote static/keysmith.js') -ForegroundColor Green


# ---------- virtual environment ----------
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Cyan
    py -m venv .venv
}

Write-Host "Installing Flask..." -ForegroundColor Cyan
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt --quiet

# ---------- run ----------
Write-Host ""
Write-Host "Setup complete. Starting Keysmith at http://127.0.0.1:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C in this window to stop the server." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:5000"
& ".\.venv\Scripts\python.exe" "app.py"
