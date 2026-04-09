from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

engine = create_engine(
    "sqlite:///./hash_sal.db",
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()