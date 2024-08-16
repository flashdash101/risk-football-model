from pydantic import BaseModel, Field
from typing import List, Optional

class Club(BaseModel):
    club: str = Field(alias='Club')
    wins: Optional[int] = Field(alias='Wins')
    matches_played: Optional[int] = Field(alias='Matches Played')
    total_revenue: Optional[float] = Field(alias='Total Revenue (£m)')
    annual_wages: Optional[float] = Field(alias='Annual Wages (£m)')
    transfer_expenditure: Optional[float] = Field(alias='Transfer Expenditure (£m)')
    transfer_income: Optional[float] = Field(alias='Transfer Income (£m)')
    transfer_balance: Optional[float] = Field(alias='Transfer Balance (£m)')
    number_of_players: Optional[int] = Field(alias='Number of Players')
    weekly_wages: Optional[float] = Field(alias='Weekly Wages (£m)')
    season: Optional[str] = Field(alias='Season')
    rank: Optional[int] = Field(alias='Rank')
    points: Optional[int] = Field(alias='Points')
    goal_difference: Optional[int] = Field(alias='Goal Difference')
    rank_change: Optional[int] = Field(alias='Rank Change')
    points_change: Optional[int] = Field(alias='Points Change')
    goal_difference_change: Optional[float] = Field(alias='Goal Difference Change')  # Changed to float
    rank_change_category: Optional[str] = Field(alias='Rank Change Category')
    points_change_category: Optional[str] = Field(alias='Points Change Category')
    goal_difference_change_category: Optional[str] = Field(alias='Goal Difference Change Category')  # Changed to str
    european_competition: Optional[bool] = Field(alias='European Competition')
    win_percentage: Optional[float] = Field(alias='Win Percentage')
    revenue_per_win: Optional[float] = Field(alias='Revenue per Win')
    wage_to_revenue_ratio: Optional[float] = Field(alias='Wage to Revenue Ratio')
    transfer_efficiency: Optional[float] = Field(alias='Transfer Efficiency')
    transfer_net_spend_ratio: Optional[float] = Field(alias='Transfer Net Spend Ratio')
    revenue_per_point: Optional[float] = Field(alias='Revenue per Point')
    wage_per_point: Optional[float] = Field(alias='Wage per Point')
    points_per_player: Optional[float] = Field(alias='Points per Player')
    revenue_per_player: Optional[float] = Field(alias='Revenue per Player')
    adjusted_rank_change: Optional[float] = Field(alias='Adjusted Rank Change')
    adjusted_points_change: Optional[float] = Field(alias='Adjusted Points Change')
    risk_score: Optional[float] = Field(alias='Risk Score')
    strategies: Optional[List[str]] = Field(default_factory=list)  # Add this line
    risk_category: Optional[str] = Field(alias='Risk Catgeogry')  # Note: Keeping the misspelling as you mentioned

    class Config:
        allow_population_by_field_name = True

# Rest of the code remains the same

    class Config:
        allow_population_by_field_name = True

class RiskResponse(BaseModel):
    clubs: List[Club]

class RiskRequest(BaseModel):
    club_names: List[str]

    class Config:
        populate_by_name = True