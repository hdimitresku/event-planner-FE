from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from typing import List, Dict, Any
import uuid

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data for venues
with open(os.path.join(os.path.dirname(__file__), "venues.json"), "r") as f:
    venues = json.load(f)

@app.get("/api/venues")
async def get_venues():
    return venues

@app.get("/api/venues/{venue_id}")
async def get_venue(venue_id: str):
    for venue in venues:
        if venue["id"] == venue_id:
            return venue
    raise HTTPException(status_code=404, detail="Venue not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
