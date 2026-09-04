# arquivo de configuração 
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    
    DB_HOST: str = os.getenv("DB_HOST", "10.20.30.3")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_USER: str = os.getenv("DB_USER", "nas_user")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "changeme")
    DB_NAME: str = os.getenv("DB_NAME", "nas_db")

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

   
    STORAGE_PATH: str = os.getenv("STORAGE_PATH", "/mnt/storage")

    # vai ter autenticação ?
    # JWT_SECRET: str = os.getenv()
    # JWT_ALGORITHM: str = os.getenv()
    # JWT_EXPIRATION_MINUTES: int = 

    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://10.20.30.1")

    APP_HOST: str = os.getenv("APP_HOST", "10.20.30.2")
    APP_PORT: int = int(os.getenv("APP_PORT", "8000"))


settings = Settings()
