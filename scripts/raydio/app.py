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

