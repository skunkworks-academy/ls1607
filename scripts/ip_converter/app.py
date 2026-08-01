from flask import Flask, render_template, request

app = Flask(__name__)

WEIGHTS_8 = [128, 64, 32, 16, 8, 4, 2, 1]   # for one IPv4 octet (8 bits)
WEIGHTS_4 = [8, 4, 2, 1]                    # for one hex nibble (4 bits)

FAMILY_BITS = {"decimal": 32, "ipv6": 128}  # expected bit length once expressed as binary


def clean_binary(raw: str) -> str:
    """Strip whitespace/dots/colons, keep only 0s and 1s."""
    return "".join(ch for ch in raw if ch in "01")


def chunk_breakdown(bits: str, weights: list):
    """Given a bit string the same length as `weights`, return (decimal_total, breakdown_rows)."""
    if len(bits) != len(weights):
        raise ValueError(f"Expected {len(weights)} bits, got {len(bits)}: '{bits}'")
    total = 0
    rows = []
    for weight, bit in zip(weights, bits):
        bit_val = int(bit)
        contributes = weight if bit_val else 0
        total += contributes
        rows.append({"weight": weight, "bit": bit_val, "value": contributes})
    return total, rows


# ---------- IPv4 <-> binary (32-bit) ----------

def binary_to_ipv4(bits: str):
    """128 -> nope, 32-bit binary string -> dotted IPv4. Returns (ip, chunks)."""
    if len(bits) != 32:
        raise ValueError(f"IPv4 binary must be exactly 32 bits. Got {len(bits)}.")
    chunks = []
    values = []
    for i in range(0, 32, 8):
        octet_bits = bits[i:i + 8]
        total, rows = chunk_breakdown(octet_bits, WEIGHTS_8)
        values.append(total)
        chunks.append({"label": str(total), "rows": rows, "group_end": True})
    return ".".join(str(v) for v in values), chunks


def ipv4_to_binary(raw_ip: str):
    """Dotted IPv4 -> 32-bit binary string. Returns (binary_dotted, chunks)."""
    parts = raw_ip.strip().split(".")
    if len(parts) != 4:
        raise ValueError(f"IPv4 address must have exactly 4 octets. Got {len(parts)}.")

    bit_groups = []
    chunks = []
    for part in parts:
        if not part.isdigit():
            raise ValueError(f"'{part}' is not a valid number.")
        value = int(part)
        if not 0 <= value <= 255:
            raise ValueError(f"Octet '{value}' out of range. Each octet must be 0-255.")
        bits = ""
        remaining = value
        rows = []
        for weight in WEIGHTS_8:
            bit = 1 if remaining >= weight else 0
            if bit:
                remaining -= weight
            bits += str(bit)
            rows.append({"weight": weight, "bit": bit, "value": weight if bit else 0})
        bit_groups.append(bits)
        chunks.append({"label": str(value), "rows": rows, "group_end": True})

    return ".".join(bit_groups), chunks


def raw_binary_to_ipv4_bits(raw_binary: str):
    bits = clean_binary(raw_binary)
    if len(bits) != 32:
        raise ValueError(f"Binary input must have exactly 32 bits (4 octets of 8). Got {len(bits)} bits.")
    return bits


# ---------- IPv6 <-> binary (128-bit) ----------

def ipv6_to_binary(raw_ip: str):
    """Expand an IPv6 address (with :: shorthand allowed) into a 128-bit binary string
    plus a nibble-level breakdown, and a fully expanded hex form."""
    addr = raw_ip.strip()
    if addr.count("::") > 1:
        raise ValueError("IPv6 address can only contain '::' once.")

    if "::" in addr:
        left, right = addr.split("::")
        left_groups = left.split(":") if left else []
        right_groups = right.split(":") if right else []
        missing = 8 - (len(left_groups) + len(right_groups))
        if missing < 0:
            raise ValueError("Too many groups for a valid IPv6 address.")
        groups = left_groups + ["0"] * missing + right_groups
    else:
        groups = addr.split(":")

    if len(groups) != 8:
        raise ValueError(f"IPv6 address must expand to 8 groups. Got {len(groups)}.")

    bit_groups = []
    chunks = []
    expanded_groups = []
    for group in groups:
        group = group or "0"
        if not all(c in "0123456789abcdefABCDEF" for c in group) or len(group) > 4:
            raise ValueError(f"'{group}' is not a valid IPv6 hex group.")
        value = int(group, 16)
        expanded_groups.append(f"{value:04x}")
        hex_digits = f"{value:04x}"
        for i, digit in enumerate(hex_digits):
            nibble_val = int(digit, 16)
            bits = format(nibble_val, "04b")
            total, rows = chunk_breakdown(bits, WEIGHTS_4)
            bit_groups.append(bits)
            chunks.append({"label": digit, "rows": rows, "group_end": (i == 3)})

    binary_str = "".join(bit_groups)
    expanded_hex = ":".join(expanded_groups)
    return binary_str, chunks, expanded_hex


def compress_ipv6(expanded_hex: str) -> str:
    """Take a fully expanded (8-group, zero-padded) IPv6 address and apply standard
    zero-compression + leading-zero stripping."""
    groups = expanded_hex.split(":")
    stripped = [format(int(g, 16), "x") for g in groups]

    best_start, best_len = -1, 0
    run_start, run_len = -1, 0
    for i, g in enumerate(stripped):
        if g == "0":
            if run_start == -1:
                run_start = i
            run_len += 1
        else:
            if run_len > best_len:
                best_start, best_len = run_start, run_len
            run_start, run_len = -1, 0
    if run_len > best_len:
        best_start, best_len = run_start, run_len

    if best_len < 2:
        return ":".join(stripped)

    before = stripped[:best_start]
    after = stripped[best_start + best_len:]
    return ":".join(before) + "::" + ":".join(after)


def binary_to_ipv6(bits: str):
    """128-bit binary string -> compressed IPv6 hex, plus nibble breakdown."""
    if len(bits) != 128:
        raise ValueError(f"IPv6 binary must be exactly 128 bits. Got {len(bits)}.")
    groups = []
    chunks = []
    for g in range(8):
        group_bits = bits[g * 16:(g + 1) * 16]
        hex_group = ""
        for n in range(4):
            nibble = group_bits[n * 4:(n + 1) * 4]
            total, rows = chunk_breakdown(nibble, WEIGHTS_4)
            digit = format(total, "x")
            hex_group += digit
            chunks.append({"label": digit, "rows": rows, "group_end": (n == 3)})
        groups.append(hex_group)
    expanded_hex = ":".join(groups)
    return compress_ipv6(expanded_hex), chunks, expanded_hex


def raw_binary_to_ipv6_bits(raw_binary: str):
    bits = clean_binary(raw_binary)
    if len(bits) != 128:
        raise ValueError(f"Binary input must have exactly 128 bits (8 groups of 16) for IPv6. Got {len(bits)} bits.")
    return bits


# ---------- IPv4 <-> IPv6 (via the standard IPv4-mapped IPv6 convention) ----------

def ipv4_to_ipv6_mapped(raw_ip: str):
    """IPv4 isn't natively an IPv6 address — the standard bridge is the IPv4-mapped
    IPv6 form ::ffff:a.b.c.d. Returns (ipv6_address, note)."""
    parts = raw_ip.strip().split(".")
    if len(parts) != 4 or not all(p.isdigit() and 0 <= int(p) <= 255 for p in parts):
        raise ValueError("Enter a valid IPv4 address, e.g. 192.168.1.1")
    mapped = "::ffff:" + raw_ip.strip()
    return mapped


def ipv6_mapped_to_ipv4(raw_ip: str):
    """Extract the embedded IPv4 address from an IPv4-mapped IPv6 address (::ffff:a.b.c.d)."""
    addr = raw_ip.strip().lower()
    if not addr.startswith("::ffff:"):
        raise ValueError(
            "This only works for IPv4-mapped IPv6 addresses (form ::ffff:a.b.c.d) — "
            "a general IPv6 address has no equivalent plain IPv4 address."
        )
    ipv4_part = addr.split(":")[-1]
    parts = ipv4_part.split(".")
    if len(parts) != 4 or not all(p.isdigit() and 0 <= int(p) <= 255 for p in parts):
        raise ValueError(f"Couldn't read an IPv4 address out of '{raw_ip}'.")
    return ipv4_part


FORMAT_LABELS = {
    "binary": "Binary",
    "decimal": "IPv4 (decimal)",
    "ipv6": "IPv6 (hex)",
}


@app.route("/", methods=["GET", "POST"])
def index():
    context = {
        "input_type": "binary",
        "output_type": "decimal",
        "input_value": "",
        "result": None,
        "note": None,
        "error": None,
        "chunks": None,
        "formats": FORMAT_LABELS,
    }

    if request.method == "POST":
        input_type = request.form.get("input_type", "binary")
        output_type = request.form.get("output_type", "decimal")
        input_value = request.form.get("input_value", "").strip()

        context["input_type"] = input_type
        context["output_type"] = output_type
        context["input_value"] = input_value

        try:
            if input_type == output_type:
                raise ValueError("Input and output format can't be the same — pick different formats to convert between.")

            # --- normalize input to a bit string + family, or handle direct-hop conversions ---

            if input_type == "binary":
                cleaned = clean_binary(input_value)
                if len(cleaned) == 32:
                    if output_type == "decimal":
                        result, chunks = binary_to_ipv4(cleaned)
                    elif output_type == "ipv6":
                        ipv4_str, _ = binary_to_ipv4(cleaned)
                        result = ipv4_to_ipv6_mapped(ipv4_str)
                        context["note"] = "32-bit binary maps to IPv4, so it's shown here as an IPv4-mapped IPv6 address."
                        chunks = None
                elif len(cleaned) == 128:
                    if output_type == "ipv6":
                        result, chunks, _ = binary_to_ipv6(cleaned)
                    elif output_type == "decimal":
                        ipv6_addr, _, _ = binary_to_ipv6(cleaned)
                        result = ipv6_mapped_to_ipv4(ipv6_addr)
                else:
                    raise ValueError(
                        f"Binary input must be 32 bits (IPv4) or 128 bits (IPv6). Got {len(cleaned)} bits."
                    )

            elif input_type == "decimal":
                if output_type == "binary":
                    result, chunks = ipv4_to_binary(input_value)
                elif output_type == "ipv6":
                    result = ipv4_to_ipv6_mapped(input_value)
                    context["note"] = "IPv4 has no native IPv6 form — this is the standard IPv4-mapped IPv6 address."
                    chunks = None

            elif input_type == "ipv6":
                if output_type == "binary":
                    result, chunks, _ = ipv6_to_binary(input_value)
                elif output_type == "decimal":
                    result = ipv6_mapped_to_ipv4(input_value)

            context["result"] = result
            context["chunks"] = chunks

        except ValueError as e:
            context["error"] = str(e)

    return render_template("index.html", **context)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
