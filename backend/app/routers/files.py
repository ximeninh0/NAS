from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.file import File as FileModel
from app.models.user import User
from app.schemas.file import FileOut
from app.services.auth_service import get_current_user
from app.services.storage_service import delete_file, get_file_path, save_file

router = APIRouter(tags=["files"])


@router.get("/", response_model=List[FileOut])
def list_files(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(FileModel).filter(FileModel.owner_id == current_user.id).all()


@router.post("/upload", response_model=FileOut, status_code=201)
def upload_file(
    upload: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    relative_path, size = save_file(current_user.id, upload)

    file_record = FileModel(
        filename=upload.filename,
        storage_path=relative_path,
        size_bytes=size,
        owner_id=current_user.id,
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)
    return file_record


@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_record = (
        db.query(FileModel)
        .filter(FileModel.id == file_id, FileModel.owner_id == current_user.id)
        .first()
    )
    if not file_record:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    path = get_file_path(file_record.storage_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Arquivo ausente no storage")

    return FileResponse(path=path, filename=file_record.filename)


@router.delete("/{file_id}", status_code=204)
def remove_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_record = (
        db.query(FileModel)
        .filter(FileModel.id == file_id, FileModel.owner_id == current_user.id)
        .first()
    )
    if not file_record:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    delete_file(file_record.storage_path)
    db.delete(file_record)
    db.commit()
