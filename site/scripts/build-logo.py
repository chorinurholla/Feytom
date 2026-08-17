#!/usr/bin/env python3
"""
Feytom — provisional logo suite generator.

PROVISIONAL. This mark is drafted from the written description in the Feytom
Website Taxonomy (§10.1 "Open Loadlock"): an F construction whose counter reads
as an open load hook. It is NOT the client's approved artwork. Replace the files
in src/assets/logos/ with the supplied Feytom_Loadlock_Primary_*.svg when they
arrive — no component changes are required.

Wordmark is outlined from Barlow Condensed Bold (SIL OFL 1.1) so the SVG renders
identically without a webfont.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/logos"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#102A43"
ORANGE = "#F36C21"
WHITE = "#FFFFFF"
IRON = "#20272D"

# ---------------------------------------------------------------- wordmark
font_path = ROOT / "node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2"
font = TTFont(str(font_path))
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm

TRACKING = 60  # design units of extra letterspacing — industrial, deliberate


def wordmark(text, cap_height_px=100.0):
    """Return (path_d, width_px, height_px) with y flipped into SVG space."""
    parts, x = [], 0
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[gname].draw(pen)
        d = pen.getCommands()
        if d:
            parts.append(f'<path transform="translate({x},0)" d="{d}"/>')
        x += glyphs[gname].width + TRACKING
    total = x - TRACKING
    cap = font["OS/2"].sCapHeight if hasattr(font["OS/2"], "sCapHeight") else 700
    scale = cap_height_px / cap
    inner = "".join(parts)
    # flip y (font space is y-up, SVG is y-down) and baseline at cap_height_px
    g = (
        f'<g transform="translate(0,{cap_height_px:.2f}) scale({scale:.6f},{-scale:.6f})">'
        f"{inner}</g>"
    )
    return g, total * scale, cap_height_px


# ---------------------------------------------------------------- icon
# 64x64 industrial plate, bottom-right corner clipped (§10.4 "clipped corners").
# Inside: an F whose crossbar turns down and back to form an OPEN hook —
# the gap between the hook's return and the F's mid-arm is the "open loadlock".
CLIP = 14


def icon(fg, plate, corner, plate_stroke=None):
    stroke_attr = (
        f' stroke="{plate_stroke}" stroke-width="2"' if plate_stroke else ""
    )
    return f"""  <path d="M0 0 H64 V{64 - CLIP} L{64 - CLIP} 64 H0 Z" fill="{plate}"{stroke_attr}/>
  <path d="M64 {64 - CLIP} L{64 - CLIP} 64 H64 Z" fill="{corner}"/>
  <g fill="none" stroke="{fg}" stroke-linecap="butt" stroke-linejoin="miter">
    <path d="M20 13 V51" stroke-width="9"/>
    <path d="M20 17.5 H45.5 V29" stroke-width="9"/>
    <path d="M20 33.5 H34" stroke-width="8"/>
  </g>"""


def svg(w, h, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
        f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">\n'
        f"  <title>{title}</title>\n{body}\n</svg>\n"
    )


CAP = 34  # wordmark cap height inside a 64-tall lockup
wm_g, wm_w, _ = wordmark("FEYTOM", CAP)
GAP = 18
LOCK_W = 64 + GAP + wm_w
BASE = 64


def lockup(icon_fg, plate, corner, word_fill, name, title):
    body = (
        icon(icon_fg, plate, corner)
        + f'\n  <g transform="translate({64 + GAP},{(64 - CAP) / 2 - 1:.2f})" fill="{word_fill}">'
        + wm_g
        + "</g>"
    )
    (OUT / name).write_text(svg(LOCK_W, BASE, body, title))


lockup(WHITE, NAVY, ORANGE, NAVY, "feytom-primary-full-colour.svg", "Feytom")
lockup(NAVY, WHITE, ORANGE, WHITE, "feytom-primary-reversed.svg", "Feytom")
lockup(WHITE, IRON, IRON, IRON, "feytom-primary-one-colour-dark.svg", "Feytom")

(OUT / "feytom-icon-full-colour.svg").write_text(
    svg(64, 64, icon(WHITE, NAVY, ORANGE), "Feytom")
)
(OUT / "feytom-icon-reversed.svg").write_text(
    svg(64, 64, icon(NAVY, WHITE, ORANGE), "Feytom")
)

print(f"wordmark width {wm_w:.1f}px · lockup {LOCK_W:.0f}x{BASE}")
for f in sorted(OUT.glob("*.svg")):
    print(f"  {f.name}  {f.stat().st_size} bytes")
