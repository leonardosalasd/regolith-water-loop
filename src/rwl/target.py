"""Printable target sheet for the photometric rig.

Writes a single A4 page with the checker target and the white reference card
at true size, plus a 100 mm scale bar to confirm the printer did not rescale it.
The PDF is written by hand so the package needs no PDF dependency.
"""

from __future__ import annotations

from pathlib import Path

PT_PER_MM = 72 / 25.4
A4_MM = (210.0, 297.0)

CHECKER_MM = 100.0
CHECKER_SQUARES = 10
WHITE_MM = 80.0
CUT_MARGIN_MM = 4.0


def _escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _pt(mm: float) -> str:
    return f"{mm * PT_PER_MM:.3f}"


def _content() -> bytes:
    ops: list[str] = ["0.5 w", "0 g"]

    def rect(x: float, y: float, w: float, h: float, fill: bool = True) -> None:
        ops.append(f"{_pt(x)} {_pt(y)} {_pt(w)} {_pt(h)} re {'f' if fill else 'S'}")

    def line(x1: float, y1: float, x2: float, y2: float) -> None:
        ops.append(f"{_pt(x1)} {_pt(y1)} m {_pt(x2)} {_pt(y2)} l S")

    def text(x: float, y: float, size: int, s: str) -> None:
        ops.append(f"BT /F1 {size} Tf {_pt(x)} {_pt(y)} Td ({_escape(s)}) Tj ET")

    text(20, 282, 13, "Regolith Water Loop  -  RWL-002 target sheet")
    text(20, 275, 9, "Print at 100% / actual size. Check the 100 mm bar with a ruler before cutting.")

    cx, cy = 55.0, 160.0
    square = CHECKER_MM / CHECKER_SQUARES
    for i in range(CHECKER_SQUARES):
        for j in range(CHECKER_SQUARES):
            if (i + j) % 2 == 0:
                rect(cx + i * square, cy + j * square, square, square)

    wx, wy = 65.0, 50.0
    ops.append("0.55 G [2 2] 0 d")
    checker_cut = CHECKER_MM + 2 * CUT_MARGIN_MM
    white_cut = WHITE_MM + 2 * CUT_MARGIN_MM
    rect(cx - CUT_MARGIN_MM, cy - CUT_MARGIN_MM, checker_cut, checker_cut, fill=False)
    rect(wx - CUT_MARGIN_MM, wy - CUT_MARGIN_MM, white_cut, white_cut, fill=False)
    ops.append("[] 0 d 0 G 0 g")

    text(cx, cy - 10, 9, "TARGET CARD  -  100 x 100 mm  -  cut on the dashed line")
    text(wx, wy + WHITE_MM + 8, 9, "WHITE CARD  -  80 x 80 mm  -  keep unmarked")

    line(55, 25, 155, 25)
    for k in range(11):
        tick = 3.0 if k in (0, 5, 10) else 1.5
        line(55 + 10 * k, 25, 55 + 10 * k, 25 + tick)
    text(54, 18, 8, "0")
    text(101, 18, 8, "50 mm")
    text(148, 18, 8, "100 mm")
    text(20, 24, 8, "scale")

    return "\n".join(ops).encode()


def render() -> bytes:
    width, height = (d * PT_PER_MM for d in A4_MM)
    content = _content()
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {width:.2f} {height:.2f}] "
            "/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
        ).encode(),
        b"<< /Length %d >>\nstream\n" % len(content) + content + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for number, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{number} 0 obj\n".encode() + body + b"\nendobj\n"

    xref = len(out)
    out += f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode()
    for offset in offsets:
        out += f"{offset:010d} 00000 n \n".encode()
    out += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    return bytes(out)


def write(path: str | Path) -> Path:
    path = Path(path)
    path.write_bytes(render())
    return path
