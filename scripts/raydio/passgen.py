#!/usr/bin/env python3
"""
passgen.py — a password & passphrase generator.

Key security concept: this uses Python's `secrets` module, NOT `random`.
`random` is a Mersenne Twister PRNG — fast, but predictable if an attacker
observes enough output. `secrets` pulls from the OS's cryptographically
secure random source (CSPRNG), which is what you must use for anything
security-related.

Usage examples:
    python passgen.py                        # 20-char password, all classes
    python passgen.py -l 32                  # 32 chars
    python passgen.py --no-symbols           # letters + digits only
    python passgen.py -n 5                   # generate 5 passwords
    python passgen.py --passphrase           # diceware-style passphrase
    python passgen.py --passphrase -w 7      # 7-word passphrase
    python passgen.py --passphrase --wordlist eff_large_wordlist.txt
"""

import argparse
import math
import secrets
import string
import sys

# Characters that are easy to confuse when reading a password aloud
# or typing it from a screen (l vs 1, O vs 0, etc.)
AMBIGUOUS = set("l1IO0o|`'\"")

# Small built-in wordlist used as a fallback for passphrase mode.
# For real use, download the EFF large wordlist (7,776 words) and pass
# it with --wordlist. More words = more entropy per word.
FALLBACK_WORDS = """
acorn amber anchor anvil apple arrow aspen atlas badge bagel bamboo banjo
barrel basket beacon berry birch bison blaze bloom bolt bonfire boulder
breeze brick bridge bronze brook cabin cactus camera candle canyon canvas
cargo carrot castle cedar chalk cherry chisel cider cliff clover cobalt
comet compass copper coral cotton crater crayon cricket crystal cypress
daisy dawn delta denim desert dew diesel dolphin drift dune eagle ember
engine fable falcon feather fern flint forest fossil fox galaxy garnet
gazebo geyser ginger glacier glade granite grape gravel grove hammock
harbor hazel heron hickory horizon iceberg indigo iris island ivory jade
jasper jigsaw juniper kayak kettle lagoon lantern lava lemon lily linen
lotus lumber magnet mango maple marble meadow mesa meteor mint mosaic
moss moth mountain mural nectar nickel north nutmeg oak oasis obsidian
ocean olive onyx opal orbit orchid otter oyster palm panda paprika
parchment pearl pebble pecan pelican pepper pine pistachio planet plum
polar pond poppy prairie prism pumpkin quartz quill rain raven reef
ridge river robin rocket rustic saffron sage salmon sandal sapphire
satchel sequoia shadow shale silver sketch slate snow solar sparrow
spice spruce squall stone storm summit sundial tangelo teak tempest
thistle thunder tidal timber topaz trellis tulip tundra turquoise umber
valley velvet violet walnut wander wave willow winter wren zephyr zinc
""".split()


def build_charset(use_lower, use_upper, use_digits, use_symbols, exclude_ambiguous):
    """Assemble the character pool and the per-class pools."""
    classes = []
    if use_lower:
        classes.append(string.ascii_lowercase)
    if use_upper:
        classes.append(string.ascii_uppercase)
    if use_digits:
        classes.append(string.digits)
    if use_symbols:
        classes.append("!@#$%^&*()-_=+[]{};:,.<>?/~")

    if exclude_ambiguous:
        classes = ["".join(c for c in cls if c not in AMBIGUOUS) for cls in classes]

    classes = [cls for cls in classes if cls]  # drop any emptied classes
    if not classes:
        sys.exit("Error: you disabled every character class. Nothing to build from!")
    return classes


def generate_password(length, classes):
    """
    Generate a password guaranteeing at least one char from each enabled class,
    with the remainder drawn from the full pool, then securely shuffled.
    """
    if length < len(classes):
        sys.exit(f"Error: length {length} is too short for {len(classes)} required character classes.")

    pool = "".join(classes)
    # One guaranteed character per class:
    chars = [secrets.choice(cls) for cls in classes]
    # Fill the rest from the combined pool:
    chars += [secrets.choice(pool) for _ in range(length - len(classes))]
    # Fisher-Yates shuffle driven by the CSPRNG (random.shuffle would be predictable):
    for i in range(len(chars) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        chars[i], chars[j] = chars[j], chars[i]
    return "".join(chars), len(pool)


def generate_passphrase(word_count, words, separator):
    chosen = [secrets.choice(words) for _ in range(word_count)]
    return separator.join(chosen), len(words)


def entropy_bits(pool_size, num_choices):
    """
    Entropy = log2(pool_size ^ num_choices) = num_choices * log2(pool_size).
    This measures how many guesses an attacker needs on average (2^bits / 2).
    """
    return num_choices * math.log2(pool_size)


def strength_label(bits):
    if bits < 45:
        return "WEAK — fine for throwaway accounts only"
    if bits < 60:
        return "OK — acceptable for low-value accounts"
    if bits < 80:
        return "STRONG — good for most purposes"
    return "EXCELLENT — resistant to serious offline attacks"


def load_wordlist(path):
    """Load a wordlist file. Handles EFF diceware format (12345\tword) and plain lists."""
    words = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.split()
            if not parts:
                continue
            words.append(parts[-1].strip().lower())  # last column handles diceware format
    if len(words) < 100:
        sys.exit(f"Error: wordlist only has {len(words)} words — too small to be safe.")
    return words


def main():
    p = argparse.ArgumentParser(description="Secure password & passphrase generator")
    p.add_argument("-l", "--length", type=int, default=20, help="password length (default 20)")
    p.add_argument("-n", "--count", type=int, default=1, help="how many to generate (default 1)")
    p.add_argument("--no-lower", action="store_true", help="exclude lowercase letters")
    p.add_argument("--no-upper", action="store_true", help="exclude uppercase letters")
    p.add_argument("--no-digits", action="store_true", help="exclude digits")
    p.add_argument("--no-symbols", action="store_true", help="exclude symbols")
    p.add_argument("--allow-ambiguous", action="store_true",
                   help="allow easily-confused characters like l, 1, O, 0")
    p.add_argument("--passphrase", action="store_true", help="generate a word-based passphrase instead")
    p.add_argument("-w", "--words", type=int, default=6, help="words in passphrase (default 6)")
    p.add_argument("--separator", default="-", help="passphrase separator (default '-')")
    p.add_argument("--wordlist", help="path to a wordlist file (e.g. EFF large wordlist)")
    args = p.parse_args()

    for _ in range(args.count):
        if args.passphrase:
            words = load_wordlist(args.wordlist) if args.wordlist else FALLBACK_WORDS
            result, pool = generate_passphrase(args.words, words, args.separator)
            bits = entropy_bits(pool, args.words)
        else:
            classes = build_charset(
                not args.no_lower, not args.no_upper,
                not args.no_digits, not args.no_symbols,
                not args.allow_ambiguous,
            )
            result, pool = generate_password(args.length, classes)
            bits = entropy_bits(pool, args.length)

        print(result)
        print(f"  └─ entropy ≈ {bits:.1f} bits ({strength_label(bits)})", file=sys.stderr)


if __name__ == "__main__":
    main()
