from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, courses, quiz, records

# Creates the `users` and `quiz_records` tables automatically on startup —
# the DATABASE itself must already exist in SQL Server (see setup steps below)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="QuizForge AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(quiz.router)
app.include_router(records.router)


@app.get("/")
def root():
    return {"message": "QuizForge AI backend is running "}