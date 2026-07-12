from pathlib import Path
import os
#from dotenv import load_dotenv

#load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

PLAN_FILE = BASE_DIR / "plan.json"

CHECKOV_FILE = BASE_DIR / "reports" / "checkov_report.json"

OPA_FILE = BASE_DIR / "reports" / "opa_report.json"

REPORT_DIR = BASE_DIR / "reports"

#OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")