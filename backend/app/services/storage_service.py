import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import settings
from typing import Tuple


def _user_dir(owner_id: int) -> Path:
    path = Path(settings.STORAGE_PATH) / str(owner_id)
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_file(owner_id: int, upload: UploadFile) -> Tuple[str, int]:
    ext = Path(upload.filename).suffix
    stored_name = f"{uuid.uuid4().hex}{ext}"
    dest = _user_dir(owner_id) / stored_name

    size = 0
    with open(dest, "wb") as buffer:
        while chunk := upload.file.read(1024 * 1024):
            buffer.write(chunk)
            size += len(chunk)

    relative_path = f"{owner_id}/{stored_name}"
    return relative_path, size


def get_file_path(storage_path: str) -> Path:
    full_path = (Path(settings.STORAGE_PATH) / storage_path).resolve()
    storage_root = Path(settings.STORAGE_PATH).resolve()

    if storage_root not in full_path.parents and full_path != storage_root:
        raise ValueError("Caminho de arquivo inválido")

    return full_path


def delete_file(storage_path: str) -> None:
    path = get_file_path(storage_path)
    if path.exists():
        os.remove(path)
