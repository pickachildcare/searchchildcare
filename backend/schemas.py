from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# Shared properties
class WaitlistEntryBase(BaseModel):
    parent_names: str
    child_name: str
    child_age: str
    dob_or_due_date: str
    desired_start_month: str
    desired_start_year: int
    provider_id: int

class WaitlistEntryCreate(WaitlistEntryBase):
    pass

class WaitlistEntry(WaitlistEntryBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class ProviderBase(BaseModel):
    name: str
    type: str
    rating: float
    reviews: int
    location: str
    spots_available: int
    max_capacity: int
    ages_served: List[str]
    meals_provided: bool
    snack_provided: bool
    registered_with_city: bool
    image: str
    tags: List[str]
    description: str
    agency_id: Optional[int] = None

class Provider(ProviderBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AgencyBase(BaseModel):
    name: str
    phone: str
    email: str

class Agency(AgencyBase):
    id: int
    providers: List[Provider] = []
    model_config = ConfigDict(from_attributes=True)