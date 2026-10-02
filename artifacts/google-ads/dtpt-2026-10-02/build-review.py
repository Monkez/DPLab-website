import json
import os
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent
KIT = json.loads((ROOT / "campaign.json").read_text(encoding="utf-8"))
FONT_DIR = Path(os.environ.get("DTPT_AD_FONT_DIR", Path(os.environ.get("SystemRoot", "C:/Windows")) / "Fonts"))
pdfmetrics.registerFont(TTFont("DTPT", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("DTPT-Bold", str(FONT_DIR / "arialbd.ttf")))
PAGE_W, PAGE_H = A4
MARGIN = 36
WIDTH = PAGE_W - MARGIN * 2
INK = colors.HexColor("#232934")
MUTED = colors.HexColor("#66717e")
BLUE = colors.HexColor("#0753b5")
RED = colors.HexColor("#e62036")
LINE = colors.HexColor("#dce2e8")
OUTPUT = ROOT / "dtpt-ads-review.pdf"
PDF = canvas.Canvas(str(OUTPUT), pagesize=A4)
PDF.setTitle("DTPT Techs - Bộ quảng cáo xem thử")
PDF.setAuthor("DTPT Techs")


def paragraph(text, x, top, width, size=10, color=INK, bold=False, leading=None):
    style = ParagraphStyle("DTPT", fontName="DTPT-Bold" if bold else "DTPT", fontSize=size,
                           leading=leading or size * 1.45, textColor=color, spaceAfter=0)
    item = Paragraph(escape(text), style)
    _, height = item.wrap(width, PAGE_H)
    assert top - height >= 24, f"Text outside page: {text}"
    item.drawOn(PDF, x, top - height)
    return top - height


def image(filename, x, y, width, height):
    PDF.drawImage(str(ROOT / filename), x, y, width, height, preserveAspectRatio=True,
                  anchor="c", mask="auto")


def header(page, title):
    image("images/dtpt-techs-logo-original.png", MARGIN, PAGE_H - 74, 164, 44)
    paragraph("BẢN XEM THỬ - CHƯA ĐĂNG", PAGE_W - MARGIN - 182, PAGE_H - 39, 182, 9, RED, True)
    PDF.setStrokeColor(LINE)
    PDF.line(MARGIN, PAGE_H - 85, PAGE_W - MARGIN, PAGE_H - 85)
    paragraph(title, MARGIN, PAGE_H - 108, WIDTH, 23, INK, True)
    PDF.line(MARGIN, 44, PAGE_W - MARGIN, 44)
    paragraph("DTPT Techs | 02/10/2026", MARGIN, 40, 230, 8, MUTED)
    paragraph(f"{page} / 3", PAGE_W - MARGIN - 40, 40, 40, 8, MUTED)


header(1, "Thiết bị đo lường & tự động hóa")
paragraph("Google Search · Toàn Việt Nam · 30.000 VND/ngày · Tư vấn và báo giá", MARGIN, 699, WIDTH, 10, MUTED)
paragraph("BANNER THƯƠNG HIỆU NGANG", MARGIN, 662, WIDTH, 9, BLUE, True)
image("images/banner-landscape-ai.png", MARGIN, 372, WIDTH, WIDTH / (1732 / 908))
paragraph("BANNER VUÔNG", MARGIN, 348, 235, 9, BLUE, True)
image("images/banner-square-ai.png", MARGIN, 88, 235, 235)
x = MARGIN + 258
y = paragraph("Cấu hình & tài liệu", x, 345, WIDTH - 258, 14, INK, True)
for line in ["Ngân sách: 30.000 VND/ngày", "Khu vực: Toàn Việt Nam", "Ngôn ngữ: Tiếng Việt", "2 nhóm quảng cáo Search", "30 tiêu đề, 8 mô tả", "4 sitelink và thông tin liên hệ", "Website: dtpt.shop"]:
    y = paragraph(line, x, y - 13, WIDTH - 258, 10)
y = paragraph("Banner dựng AI dành cho duyệt ý tưởng. Không dùng banner có chữ/logo làm ảnh Search.", x, y - 19, WIDTH - 258, 9, MUTED)
PDF.showPage()


def search_ad(group, top):
    y = paragraph(group["name"], MARGIN, top, WIDTH, 12, BLUE, True) - 10
    height = 196
    bottom = y - height
    PDF.setStrokeColor(LINE)
    PDF.setFillColor(colors.white)
    PDF.roundRect(MARGIN, bottom, WIDTH, height, 6, stroke=1, fill=1)
    x = MARGIN + 15
    text_width = WIDTH - 126
    cursor = paragraph("Được tài trợ", x, y - 14, text_width, 9, INK, True)
    cursor = paragraph("DTPT Techs", x, cursor - 7, text_width, 10, INK, True)
    cursor = paragraph("dtpt.shop > " + " > ".join(group["display_paths"]), x, cursor - 2, text_width, 8, MUTED)
    headline = " | ".join(group["headlines"][i] for i in group["preview_headlines"])
    cursor = paragraph(headline, x, cursor - 10, text_width, 14, BLUE)
    PDF.linkURL(group["final_url"], (x, cursor, x + text_width, cursor + 36), relative=0)
    descriptions = " ".join(group["descriptions"][i] for i in group["preview_descriptions"])
    cursor = paragraph(descriptions, x, cursor - 7, text_width, 9)
    cursor = paragraph("Tư vấn cấu hình · Báo giá theo yêu cầu · Hỗ trợ kỹ thuật", x, cursor - 8, text_width, 8, MUTED)
    image(group["preview_image"], PAGE_W - MARGIN - 95, y - 137, 80, 82)
    assert cursor > bottom + 13, f"Search ad overflow: {group['name']}"
    return bottom


header(2, "Mẫu quảng cáo Search")
paragraph("Mẫu ghép minh họa. Ảnh trong mẫu là ảnh catalogue gốc.", MARGIN, 699, WIDTH, 10, MUTED)
bottom = search_ad(KIT["ad_groups"][0], 658)
bottom = search_ad(KIT["ad_groups"][1], bottom - 28)
y = paragraph("Liên hệ tư vấn & báo giá", MARGIN, bottom - 25, WIDTH, 12, INK, True)
y = paragraph("0903 463 185 · dtpttechs@gmail.com · dtpt.shop", MARGIN, y - 8, WIDTH, 10, BLUE)
y = paragraph("Google quyết định cách hiển thị thực tế. Nội dung và hình ảnh chưa tải lên tài khoản quảng cáo. Adspirer hiện hết hạn mức gọi công cụ.", MARGIN, y - 16, WIDTH, 9, MUTED)
PDF.showPage()

header(3, "Toàn bộ tiêu đề & mô tả")
column_w = (WIDTH - 28) / 2
for index, group in enumerate(KIT["ad_groups"]):
    x = MARGIN + index * (column_w + 28)
    y = paragraph(group["name"], x, 699, column_w, 13, BLUE, True)
    y = paragraph("15 TIÊU ĐỀ", x, y - 12, column_w, 8, MUTED, True)
    for number, text in enumerate(group["headlines"], 1):
        y = paragraph(f"{number:02}. {text}", x, y - 6, column_w, 9)
    y = paragraph("4 MÔ TẢ", x, y - 18, column_w, 8, MUTED, True)
    for number, text in enumerate(group["descriptions"], 1):
        y = paragraph(f"{number}. {text}", x, y - 8, column_w, 9)
    assert y > 125, "Copy column exceeds usable area"

paragraph("Kiểm tra: tiêu đề tối đa 30 ký tự; mô tả tối đa 80 ký tự theo schema Adspirer. Các từ khóa mới là đề xuất, chưa có số liệu Keyword Planner.", MARGIN, 117, WIDTH, 8, MUTED)
paragraph("Nguồn: dtpt.shop và Google Ads Help. Ảnh dựng AI trong bộ tài liệu chỉ dùng để duyệt ý tưởng; chữ nhỏ và chi tiết phần cứng có thể khác ảnh gốc.", MARGIN, 86, WIDTH, 8, MUTED)
PDF.linkURL("https://dtpt.shop/", (MARGIN, 55, MARGIN + WIDTH / 2, 82), relative=0)
PDF.linkURL("https://support.google.com/google-ads/answer/7684791?hl=en", (MARGIN + WIDTH / 2, 55, PAGE_W - MARGIN, 82), relative=0)
PDF.save()
print(f"Created {OUTPUT.name}, 3 pages")
