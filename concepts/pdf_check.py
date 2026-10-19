import pymupdf, os
src = r"F:\MyRepository\Webpage_Athanasios\concepts\Desalermos-Website-Concepts-2026.pdf"
out = r"F:\MyRepository\Webpage_Athanasios\concepts\pdf-pages"
os.makedirs(out, exist_ok=True)
doc = pymupdf.open(src)
print("pages:", doc.page_count)
print("size pt:", doc[0].rect.width, "x", doc[0].rect.height, "(A4 landscape = 842 x 595)")
for i in range(doc.page_count):
    page = doc[i]
    pix = page.get_pixmap(dpi=110)
    pix.save(os.path.join(out, f"page-{i+1:02d}.png"))
fonts = set()
for i in range(doc.page_count):
    for f in doc[i].get_fonts():
        fonts.add(f[3])
print("fonts:", sorted(fonts)[:20])
for i in [0, 2, 7, 8, 9]:
    txt = doc[i].get_text().strip().replace("\n", " | ")[:220]
    print(f"--- page {i+1}: {txt}")
doc.close()
print("rendered pages to", out)
