import re

from rwl import target
from rwl.cli import main


def test_render_is_a_single_page_pdf():
    pdf = target.render()
    assert pdf.startswith(b"%PDF-1.4")
    assert pdf.rstrip().endswith(b"%%EOF")
    assert pdf.count(b"/Type /Page ") == 1


def test_xref_offsets_point_at_objects():
    pdf = target.render()
    xref_at = int(re.search(rb"startxref\n(\d+)", pdf).group(1))
    table = pdf[xref_at:].split(b"\n")
    offsets = [int(row.split()[0]) for row in table[3:8]]
    for number, offset in enumerate(offsets, start=1):
        assert pdf[offset:].startswith(f"{number} 0 obj".encode())


def test_page_is_a4():
    width, height = re.search(rb"/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]", target.render()).groups()
    assert abs(float(width) - 595.28) < 0.1
    assert abs(float(height) - 841.89) < 0.1


def test_checker_has_fifty_black_squares():
    fills = re.findall(rb"re f\n", target.render())
    assert len(fills) == target.CHECKER_SQUARES**2 // 2


def test_cli_writes_the_sheet(tmp_path):
    out = tmp_path / "sheet.pdf"
    assert main(["target", "--out", str(out)]) == 0
    assert out.read_bytes() == target.render()
