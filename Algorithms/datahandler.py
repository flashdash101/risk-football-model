import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, MinMaxScaler

class DataHandler:
    def __init__(self):
        self.player_data = self.load_data('final_df.csv')
        self.model = self.load_model('football_risk_model.pkl')
        self.feature_scaler = MinMaxScaler()

    def load_data(self, filepath):
        df = pd.read_csv(filepath)
        
        # Identify numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        # Fill NA values in numeric columns with their respective means
        for col in numeric_cols:
            df[col] = df[col].fillna(df[col].mean())
        
        return df

    def load_model(self, model_path):
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        return model


    def get_clubs_data(self, club_names):
        return self.player_data[self.player_data['Club'].isin(club_names)]

    def get_all_club_names(self):
        return self.player_data['Club'].unique().tolist()

    def get_risk_category(self, risk_score):
        if risk_score <= 30:
            return "Low Risk"
        elif risk_score <= 60:
            return "Medium Risk"
        else:
            return "High Risk"

# Create an instance of DataHandler when the module is imported
data_handler = DataHandler()