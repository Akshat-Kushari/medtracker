from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy database (can replace with real APIs later)
products = [
    {
        "name": "whey protein",
        "results": [
            {
                "site": "Flipkart",
                "price": 1899,
                "link": "https://fkrt.it/demo",
                "title": "MuscleBlaze Whey Protein 1kg",
                "image": "https://rukminim2.flixcart.com/image/832/832/l3vxbbk0/protein-supplement/z/9/e/whey-protein-1kg-muscleblaze-original-imagewq9hz2g4kzq.jpeg"
            },
            {
                "site": "Amazon",
                "price": 1999,
                "link": "https://amzn.to/demo",
                "title": "MuscleBlaze Whey Protein 1kg",
                "image": "https://m.media-amazon.com/images/I/71WvG9h4ZOL._SL1500_.jpg"
            }
        ]
    },
    {
        "name": "multivitamin",
        "results": [
            {
                "site": "Amazon",
                "price": 499,
                "link": "#",
                "title": "HealthKart Multivitamin Daily",
                "image": "https://m.media-amazon.com/images/I/61F+gZq8bCL._SL1500_.jpg"
            },
            {
                "site": "1mg",
                "price": 450,
                "link": "#",
                "title": "Tata 1mg Multivitamin Tablets",
                "image": "https://onemg.gumlet.io/l_watermark_346,w_240,h_240,a_ignore/w_240,h_240,c_fit,q_auto,f_auto/a9d54e28d5f24e0db1e45d3d6f9b1f55.jpg"
            }
        ]
    }
]

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.get("/search")
def search(q: str):
    results = []
    for product in products:
        if q.lower() in product["name"]:
            results = product["results"]

    # Sort by price
    results = sorted(results, key=lambda x: x["price"])
    return results