from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class DiscoveredListing:
    external_id: str
    url: str
    position: int
    card_fingerprint: str = ""
    card_payload: dict[str, Any] = field(default_factory=dict)


@dataclass
class ScrapedListing:
    external_id: str
    url: str
    title: str
    phone: str = ""
    description: str = ""
    divar_neighborhood_name: str = ""
    area_m2: int | None = None
    build_year: int | None = None
    room_count: int | None = None
    total_price_toman: int | None = None
    price_per_meter_toman: int | None = None
    mortgage_toman: int | None = None
    monthly_rent_toman: int | None = None
    deposit_toman: int | None = None
    floor_number: int | None = None
    total_floors: int | None = None
    pictures_match_property: bool | None = None
    picture_count: int = 0
    source_published_at: datetime | None = None
    source_updated_at: datetime | None = None

    def as_payload(self) -> dict[str, Any]:
        payload = asdict(self)
        for key in ("source_published_at", "source_updated_at"):
            value = payload[key]
            payload[key] = value.isoformat() if value else None
        return payload
