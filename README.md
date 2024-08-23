# Football Club Risk Assessment and Strategy Suggester

## Overview
This full-stack application provides a sophisticated risk assessment and strategy suggestion system for football clubs. By leveraging advanced machine learning techniques and in-depth financial analysis, it offers valuable insights to support strategic decision-making in football club management.

## Key Features
- Risk score prediction based on multiple financial and performance indicators
- Strategy suggestions derived from comprehensive data analysis
- Interactive user interface for club selection and strategy display
- Robust backend for efficient data processing and model predictions

## Technical Implementation
### Frontend
- Developed using React.js
- Interactive interface for club selection and strategy visualization
- Responsive design for optimal user experience across devices

### Backend
- Implemented in Python
- Utilizes FastAPI for efficient API endpoints
- Integrates advanced machine learning models for risk assessment and strategy generation

### Machine Learning Model
- Uses a Random Forest Regression model for risk score prediction
- Achieves high accuracy in risk assessment:
  - R-squared (R2) score: 0.926 (explains 92.6% of variance in risk scores)
  - Mean Absolute Error (MAE): 8.02
  - Mean Squared Error (MSE): 92.39
- Utilizes SHAP (SHapley Additive exPlanations) values for model interpretation and strategy formulation

## Usage Guide
You choose a club and the result is given to you!

## Data Sources
https://fbref.com/en/
https://www.statista.com/statistics/566666/premier-league-clubs-by-revenue/

## Model Training and Evaluation
The model was trained on predicting the risk scores and it was evaluated on various metrics outlined above

## Future Enhancements
- Integration with real-time financial data feeds
- Expansion of the model to include more leagues and clubs
- Development of a more granular strategy suggestion system


## License
Open Source

## Acknowledgements
Kudos to fbref and Statista for making this possible!

## Contact
Feel free to contact me at my email: adesina0202@gmail.com
