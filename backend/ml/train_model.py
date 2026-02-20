import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

def generate_data(n_samples=1000):
    np.random.seed(42)
    acres = np.random.uniform(1, 50, n_samples)
    distance_km = np.random.uniform(5, 100, n_samples)
    labour_count = np.ceil(acres * np.random.uniform(2, 5, n_samples)).astype(int)
    fuel_price = np.random.uniform(90, 110, n_samples)
    
    # Cost formula simulation:
    # Base cost + (acres * 500) + (labour * 400) + (distance * fuel_price * 0.5)
    total_cost = 1000 + (acres * 550) + (labour_count * 450) + (distance_km * fuel_price * 0.6)
    # Add some noise
    total_cost += np.random.normal(0, 500, n_samples)
    
    df = pd.DataFrame({
        'acres': acres,
        'distance_km': distance_km,
        'labour_count': labour_count,
        'fuel_price': fuel_price,
        'total_cost': total_cost
    })
    return df

def train_model():
    print("Generating synthetic data...")
    df = generate_data()
    
    X = df[['acres', 'distance_km', 'labour_count', 'fuel_price']]
    y = df['total_cost']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    print(f"Model trained. Mean Absolute Error: {mae:.2f}")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'cost_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    # Feature importance
    importances = model.feature_importances_
    for name, importance in zip(X.columns, importances):
        print(f"Feature: {name}, Importance: {importance:.4f}")

if __name__ == "__main__":
    train_model()
