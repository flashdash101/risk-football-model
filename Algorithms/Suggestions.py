import numpy as np
import pandas as pd
import shap
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split

class StrategySuggester:
    def __init__(self, model, data):
        self.model = model
        self.features = [
            'Wage to Revenue Ratio', 'Transfer Efficiency', 'Rank', 'Points', 
            'Goal Difference', 'European Competition', 
            'Rank Change', 'Points Change', 'Transfer Net Spend Ratio',
            'Win Percentage', 'Revenue per Win', 'Revenue per Point',
            'Wage per Point', 'Points per Player', 'Revenue per Player', 'Transfer Expenditure (£m)'
        ]
        self.data = data
        self.target = 'Risk Score'
        self.X = self.data[self.features]
        self.y = self.data[self.target]
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=0.2, random_state=42)
        
        self.feature_scaler = StandardScaler()
        self.X_train_scaled = self.feature_scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.feature_scaler.transform(self.X_test)
        
        self.risk_scaler = MinMaxScaler()
        self.risk_scaler.fit(self.y_train.values.reshape(-1, 1))

    def preprocess_data(self, club_data):
        missing_features = set(self.features) - set(club_data.columns)
        for feature in missing_features:
            club_data[feature] = 0  # Or some other appropriate default value
        
        return self.feature_scaler.transform(club_data[self.features].values.reshape(1, -1))
        #Reshape and scale the features to be between 1 and -1

    
    def generate_suggestions(self, club_data):
        club_data_scaled = self.preprocess_data(club_data)
        risk_score = self.model.predict(club_data_scaled)[0]
        
        scaled_risk_score = self.risk_scaler.transform([[risk_score]])[0][0] * 100
        
        explainer = shap.TreeExplainer(self.model)
        shap_values = explainer.shap_values(club_data_scaled)
        feature_importance = pd.DataFrame({
            'feature': self.features,
            'importance': np.abs(shap_values[0]),
            'value': shap_values[0]
        }).sort_values('importance', ascending=False)
        
        top_factors = feature_importance.head(5)['feature'].tolist()
        
        strategies = self._get_risk_level_strategy(scaled_risk_score)
        strategies.extend(self._get_factor_specific_strategies(top_factors, scaled_risk_score, feature_importance))
        
        return strategies, scaled_risk_score

    def _get_risk_level_strategy(self, risk_score):
        if risk_score > 70:
            return [f"High Risk (Score: {risk_score:.2f}). Urgent action required on key factors."]
        elif risk_score > 50:
            return [f"Medium Risk (Score: {risk_score:.2f}). Close monitoring and targeted improvements needed."]
        elif risk_score > 20:
            return [f"Low Risk (Score: {risk_score:.2f}). Maintain current strategy with minor optimizations."]
        else:
            return [f"Very Low Risk (Score: {risk_score:.2f}). Excellent position. Focus on sustaining performance and exploring growth opportunities."]

    def _get_factor_specific_strategies(self, top_factors, risk_score, feature_importance):
        strategies = []
        for factor in top_factors:
            importance = feature_importance[feature_importance['feature'] == factor]['importance'].values[0]
            shap_value = feature_importance[feature_importance['feature'] == factor]['value'].values[0]
            
            if risk_score > 70:
                strategies.append(self._high_risk_strategy(factor, importance, shap_value))
            elif risk_score > 50:
                strategies.append(self._medium_risk_strategy(factor, importance, shap_value))
            elif risk_score > 20:
                strategies.append(self._low_risk_strategy(factor, importance, shap_value))
            else:
                strategies.append(self._very_low_risk_strategy(factor, importance, shap_value))
        return strategies

    def _high_risk_strategy(self, factor, importance, shap_value):
        strategies = {
            'Wage to Revenue Ratio': "Urgently reduce wage bill by 15% or increase revenue streams by 20%",
            'Transfer Efficiency': "Significantly improve scouting network and focus on selling players at peak value. Aim for 30% increase in transfer profits",
            'Revenue per Player': "Substantially increase commercial activities and optimize squad size. Target 25% increase in revenue per player",
            'Points Change': "Invest heavily in performance analytics and coaching staff to improve on-field results. Aim for 10-point improvement next season",
            'Rank': "Prioritize short-term performance boost to climb league table. Target moving up at least 3 positions",
            'Win Percentage': "Implement major tactical overhaul and squad improvements. Aim for at least 15% increase in win percentage",
            'Points per Player': "Focus on significant performance improvement or strategic squad reduction. Aim to increase points gained by at least 5 per player"
        }
        return strategies.get(factor, f"Address {factor} urgently with a target of {abs(int(shap_value * 100))}% improvement to mitigate high risk")

    def _medium_risk_strategy(self, factor, importance, shap_value):
        strategies = {
            'Points Change': "Invest in performance analytics to improve on-field results. Aim for at least a 5-point improvement",
            'Wage per Point': "Implement performance-based wage structure. Target 10% reduction in wage per point",
            'Transfer Net Spend Ratio': "Balance transfer activity with focus on youth development. Aim to reduce net spend by 20%",
            'Revenue per Point': "Optimize matchday and commercial revenues. Target 15% increase in revenue per point",
            'Win Percentage': "Focus on tactical improvements and player development. Aim for 10% increase in win percentage",
            'Rank': "Implement strategies to climb league table. Target moving up at least 2 positions"
        }
        return strategies.get(factor, f"Improve {factor} by approximately {abs(int(shap_value * 75))}% to reduce risk level")

    def _low_risk_strategy(self, factor, importance, shap_value):
        strategies = {
            'Wage to Revenue Ratio': "Fine-tune wage structure or explore new revenue streams. Aim for 5% improvement",
            'Transfer Efficiency': "Optimize scouting and transfer strategies. Target 10% increase in efficiency",
            'Revenue per Player': "Explore innovative commercial opportunities. Aim for 8% increase in revenue per player",
            'Points Change': "Implement minor tactical adjustments. Target 2-3 point improvement",
            'Rank': "Maintain current league position with an eye on moving up 1 spot",
            'Win Percentage': "Focus on incremental improvements in team performance. Aim for 5% increase in win percentage",
            'Points per Player': "Slight optimization of squad performance. Target 2-point increase per player"
        }
        return strategies.get(factor, f"Fine-tune {factor} with a target of {abs(int(shap_value * 50))}% improvement for continued stability")

    def _very_low_risk_strategy(self, factor, importance, shap_value):
        strategies = {
            'Wage to Revenue Ratio': "Maintain current balance. Consider reinvesting in squad or facilities if opportunity arises",
            'Transfer Efficiency': "Sustain excellent transfer strategy. Explore opportunities for knowledge sharing within the club",
            'Revenue per Player': "Maintain high revenue per player. Explore innovative sponsorship or marketing campaigns",
            'Points Change': "Sustain excellent performance. Focus on squad depth and youth development for long-term success",
            'Rank': "Excellent league position. Focus on maintaining performance and planning for future seasons",
            'Win Percentage': "Outstanding win rate. Emphasize consistency and prepare for potential challenges next season",
            'Points per Player': "Excellent points per player ratio. Focus on maintaining squad harmony and gradual improvements"
        }
        return strategies.get(factor, f"Maintain excellent performance in {factor}. Explore minor optimizations if beneficial")