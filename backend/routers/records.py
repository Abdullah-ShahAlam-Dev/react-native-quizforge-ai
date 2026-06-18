from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter(prefix="/records", tags=["Records"])


def _to_response(record: models.QuizRecord) -> dict:
    return {
        "id": record.id,
        "courseTitle": record.course_title,
        "courseIcon": record.course_icon,
        "difficulty": record.difficulty,
        "score": record.score,
        "total": record.total,
        "date": record.date,
    }


@router.post("/", response_model=schemas.RecordOut)
def create_record(
    payload: schemas.RecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    record = models.QuizRecord(
        user_id=current_user.id,
        course_title=payload.courseTitle,
        course_icon=payload.courseIcon,
        difficulty=payload.difficulty,
        score=payload.score,
        total=payload.total,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return _to_response(record)


@router.get("/", response_model=List[schemas.RecordOut])
def get_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    records = (
        db.query(models.QuizRecord)
        .filter(models.QuizRecord.user_id == current_user.id)
        .order_by(models.QuizRecord.date.desc())
        .all()
    )
    return [_to_response(r) for r in records]