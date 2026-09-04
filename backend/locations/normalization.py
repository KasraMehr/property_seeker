import re


def normalize_persian(value: str) -> str:
    """Normalize only technical Persian variants used for identity matching."""

    return re.sub(r"\s+", " ", str(value or "").replace("ي", "ی").replace("ك", "ک").strip())
