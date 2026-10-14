from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="JP & Company API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = [
    {
        "id": "garden-net",
        "title_en": "Garden Shade Net",
        "title_hi": "गार्डन नेट",
        "category": "Gardening & Agro",
        "image": "/images/garden-net.jpg",
        "description": "High-density UV stabilized agro shade net for gardens, nursery protection, terrace shade, and outdoor sitting areas.",
        "features": ["UV Protected (50%-90% shading)", "Tear Resistant & Durable", "Weatherproof & Breathable"],
        "price_per_unit": "₹12 / sq.ft",
        "popular_sizes": ["10x10 ft", "10x20 ft", "15x30 ft", "Custom Roll"]
    },
    {
        "id": "ac-parda",
        "title_en": "AC PVC Strip Curtain",
        "title_hi": "ए.सी. पर्दा",
        "category": "Commercial & Home",
        "image": "/images/ac-parda.jpg",
        "description": "Transparent PVC insulating strip curtains designed to prevent AC cooling loss, block dust, smoke, and maintain indoor temperature.",
        "features": ["Crystal clear visibility", "Reduces electricity bills", "Effective dust & insect barrier"],
        "price_per_unit": "₹180 / strip",
        "popular_sizes": ["7x3 ft Door", "8x4 ft Door", "Custom Industrial Size"]
    },
    {
        "id": "macchar-dani",
        "title_en": "Mosquito Bed Net",
        "title_hi": "मच्छरदानी",
        "category": "Household",
        "image": "/images/macchar-dani.jpg",
        "description": "Breathable fine-mesh mosquito netting suitable for single, double, and king-size beds. Available in hanging and foldable styles.",
        "features": ["Dense anti-mosquito micro-mesh", "Easy ceiling suspension hooks", "Washable & durable fabric"],
        "price_per_unit": "₹450 / pc",
        "popular_sizes": ["Single Bed (3x6 ft)", "Double Bed (6x6 ft)", "King Size (6.5x7 ft)"]
    },
    {
        "id": "plastic-tirpal",
        "title_en": "Multipurpose Plastic Tarpaulin",
        "title_hi": "प्लास्टिक तिरपाल",
        "category": "Waterproof Tarpaulins",
        "image": "/images/plastic-tirpal.jpg",
        "description": "Heavy-duty waterproof polyethylene tarpaulin in yellow, blue, and black for covering grains, bricks, bike/car covers, and ground sheds.",
        "features": ["100% Waterproof & Leak-proof", "Rust-proof eyelets on all edges", "Multi-layer laminate"],
        "price_per_unit": "₹18 / sq.ft",
        "popular_sizes": ["9x12 ft", "12x18 ft", "18x24 ft", "24x30 ft"]
    },
    {
        "id": "truck-tirpal",
        "title_en": "Heavy-Duty Truck Tarpaulin",
        "title_hi": "ट्रक तिरपाल",
        "category": "Commercial Transport",
        "image": "/images/truck-tirpal.jpg",
        "description": "Industrial grade rubberized/PVC truck cover tarpaulin for long-distance transport, logistics, and rainy season cargo protection.",
        "features": ["High tensile strength 550+ GSM", "Double heat-sealed joints", "Heavy rope reinforced hem"],
        "price_per_unit": "₹35 / sq.ft",
        "popular_sizes": ["18x24 ft", "20x28 ft", "24x36 ft", "Custom Truck Body"]
    },
    {
        "id": "army-tent",
        "title_en": "Army & Relief Canvas Tent",
        "title_hi": "आर्मी टेंट",
        "category": "Tents & Shelters",
        "image": "/images/army-tent.jpg",
        "description": "All-weather heavy duty military style canvas tent with windows, ventilation, and metal frame poles. Ideal for camps, disaster relief, and sites.",
        "features": ["Heavy cotton/poly canvas", "Wind & rain resistant", "Complete with poles, pegs, and ropes"],
        "price_per_unit": "₹14,500 / tent",
        "popular_sizes": ["10x12 ft (4-6 persons)", "14x14 ft (8-10 persons)", "18x24 ft (Command/Dorm)"]
    }
]

class QuoteRequest(BaseModel):
    name: str
    phone: str
    product_id: str
    size: str
    notes: Optional[str] = None

inquiries_db = []

@app.get("/api/products")
def get_products(category: Optional[str] = None):
    if category and category != "All":
        return [p for p in PRODUCTS if p["category"] == category]
    return PRODUCTS

@app.get("/api/products/{product_id}")
def get_product_by_id(product_id: str):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/inquire")
def submit_inquiry(quote: QuoteRequest):
    inquiry_record = quote.model_dump()
    inquiries_db.append(inquiry_record)
    return {
        "status": "success",
        "message": f"Thank you {quote.name}, we will contact you on {quote.phone} soon!",
        "data": inquiry_record
    }