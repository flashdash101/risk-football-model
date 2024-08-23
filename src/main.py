from fastapi import FastAPI
from Models import RiskRequest, RiskResponse, Club
from fastapi.middleware.cors import CORSMiddleware
from datahandler import DataHandler
from Suggestions import StrategySuggester

app = FastAPI()
data_handler = DataHandler()


ALLOWED_ORIGINS = [
    "https://flashdash101.github.io",
    "http://localhost:5173",
    "http://localhost:5173/risk-football-model/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Pass the entire dataset to StrategySuggester for fitting the scaler
strategy_suggester = StrategySuggester(data_handler.model, data_handler.player_data)

@app.post("/api/risk", response_model=RiskResponse)
async def get_risk(request: RiskRequest):
    clubs_data = data_handler.get_clubs_data(request.club_names)
    response_clubs = []
    for _, club_data in clubs_data.iterrows():
        # Convert the club_data Series to a DataFrame for the strategy_suggester
        club_df = club_data.to_frame().T
        strategies, risk_score = strategy_suggester.generate_suggestions(club_df)
        
        # Create a Club object with the data
        club = Club(**club_data.to_dict())
        club.risk_score = risk_score
        club.risk_category = data_handler.get_risk_category(risk_score)
        club.strategies = strategies
        response_clubs.append(club)
    return RiskResponse(clubs=response_clubs)

@app.get("/api/clubs")
async def get_clubs():
    return data_handler.get_all_club_names()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)