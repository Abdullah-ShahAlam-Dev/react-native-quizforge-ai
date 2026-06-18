from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# ── Auth ──
class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserOut


# ── Quiz Generation ──
class QuizGenerateRequest(BaseModel):
    topic: str
    difficulty: str
    numQuestions: int


class QuestionOut(BaseModel):
    id: str
    question: str
    options: List[str]
    answer: int


class QuizGenerateResponse(BaseModel):
    questions: List[QuestionOut]
    source: str


# ── Quiz Records ──
class RecordCreate(BaseModel):
    courseTitle: str
    courseIcon: Optional[str] = None
    difficulty: str
    score: int
    total: int


class RecordOut(BaseModel):
    id: int
    courseTitle: str
    courseIcon: Optional[str]
    difficulty: str
    score: int
    total: int
    date: datetime