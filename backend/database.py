from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse

# ── EDIT THESE 3 VALUES TO MATCH YOUR SQL SERVER SETUP ──
SERVER = "ABDULLAH-PC\SQLABDULLAHDEVS"              # or e.g. r"localhost\SQLEXPRESS" — check SSMS connection dialog
DATABASE = "QuizForgeDB"          # create this database first in SSMS (see setup steps below)
DRIVER = "ODBC Driver 17 for SQL Server"

# ── Windows Authentication (default — works if you log into SSMS without typing a password) ──
params = urllib.parse.quote_plus(
    f"DRIVER={{{DRIVER}}};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    f"Trusted_Connection=yes;"
)

# ── SQL Server Authentication (uncomment if you log into SSMS with a username/password) ──
# SQL_USERNAME = "your_sql_username"
# SQL_PASSWORD = "your_sql_password"
# params = urllib.parse.quote_plus(
#     f"DRIVER={{{DRIVER}}};"
#     f"SERVER={SERVER};"
#     f"DATABASE={DATABASE};"
#     f"UID={SQL_USERNAME};"
#     f"PWD={SQL_PASSWORD};"
# )

SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()