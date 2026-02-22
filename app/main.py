import asyncio
import sys

from fastapi.middleware.cors import CORSMiddleware

if sys.platform.startswith('win'):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from app.routes.webhook import router as webhook_router
from dotenv import load_dotenv
import os

from app.routes.auth import router as auth_router



load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(webhook_router)
app.include_router(auth_router)

@app.get('/')
def home():
    return {"message": "Welcome to Social Saver Bot"}