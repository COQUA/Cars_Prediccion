from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np


model = joblib.load('../train/used_car_model.pkl')

MODEL_R2_SCORE = 0.88

app = FastAPI()

class CarData(BaseModel):
    make_year: int
    mileage_kmpl: float
    engine_cc: float
    fuel_type: str
    transmission: str
    owner_count: int
    insurance_valid: bool

@app.post("/predict")
def predict(car: CarData):
    car_age = 2025 - car.make_year

    fuel_type_diesel = 1 if car.fuel_type.lower() == "diesel" else 0
    fuel_type_electric = 1 if car.fuel_type.lower() == "electric" else 0
    transmission_manual = 1 if car.transmission.lower() == "manual" else 0

    X = np.array([[
        car_age,
        car.mileage_kmpl,
        car.engine_cc,
        car.owner_count,
        int(car.insurance_valid),
        fuel_type_diesel,
        fuel_type_electric,
        transmission_manual
    ]])

    pred = model.predict(X)[0]

    return {"predicted_price_usd": pred}

@app.get("/model_info")
def model_info():
    return {
        "model": "LinearRegression",
        "r2_score": MODEL_R2_SCORE,
        "description": "Modelo de regresión lineal para predicción de precio de autos usados."
    }