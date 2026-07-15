import os
# pyrefly: ignore [missing-import]
import google.generativeai as genai
from dotenv import load_dotenv
import markdown
from config import REPORT_DIR

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-3.5-flash"
)


def analyze(prompt):

    response = model.generate_content(prompt)

    report = response.text

    # Define paths
    report_md_path = REPORT_DIR / "ai_report.md"
    report_html_path = REPORT_DIR / "ai_report.html"

    # Write Markdown report
    with open(report_md_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"Report saved to {report_md_path}")

    # Write HTML report
    html_content = markdown.markdown(report)
    with open(report_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Report saved to {report_html_path}")

