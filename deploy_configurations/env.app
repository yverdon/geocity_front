# Specific for https://geocity.ch/app
PRODUCTION_PATH=/app
#Must not be empty
LOCATION_API=
GEOCITY_API=https://geocity.ch/rest/
GEOCITY_API_EVENTS_START=2022-09-01
GEOCITY_API_EVENTS_END=2030-12-01
GEOCITY_API_ADMINISTRATIVE_ENTITES=
GEOCITY_API_SHOW_ONLY_FUTURE=false
CTA_LINK=https://geocity.ch
DEFAULT_VIEW='calendar'
DISPLAY_FOOTER_AND_HEADER=true
DEFAULT_CALENDAR_MODE='default'
MOCK=
# To show only events between 05:00 and 00:00 you can chose DAY_SPLIT_START=5 and DAY_SPLIT_END=24
# Chose a value between 0 and 24 (integer). 0 Means 00:00 at the beginning of day, 24 means 00:00 at the end of the day
# default let it empty. It's shows by default between 0 and 24
DAY_SPLIT_START=
DAY_SPLIT_END=