import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))

db = client["social-saver"]

# Main collection
links_collection = db["saved_links"]


def save_link(user, url, ai_result):
    """
    Save Instagram reel under a specific user
    """

    # Ensure only digits are stored (important for login matching)
    user_digits = "".join(filter(str.isdigit, user))

    data = {
        "user": user_digits,
        "url": url,
        "ai_result": ai_result,
        "created_at": datetime.utcnow()
    }

    links_collection.insert_one(data)

    print("Saved to Mongo for user:", user_digits)