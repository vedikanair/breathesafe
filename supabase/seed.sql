-- ═══════════════════════════════════════════════════════════════
-- BreatheSafe — Seed Data
-- ═══════════════════════════════════════════════════════════════

-- 1. Health Advisories (Reflecting the Premium Palette)
INSERT INTO health_advisory (aqi_category, health_risk, precaution_message, color_code)
VALUES
  ('Good', 'Minimal impact on health', 'Enjoy outdoor activities freely. Air quality is ideal for all.', '#93B4B2'),
  ('Satisfactory', 'Minor breathing discomfort to sensitive people', 'Generally safe. Sensitive individuals should limit prolonged outdoor exertion.', '#557257'),
  ('Moderate', 'Breathing discomfort to people with lung disease, asthma, and heart conditions', 'Reduce prolonged outdoor exertion. Keep windows closed during peak pollution hours.', '#A76F28'),
  ('Poor', 'Breathing discomfort to most people on prolonged exposure', 'Avoid prolonged outdoor activities. Use air purifiers indoors. Wear N95 masks outside.', '#A44104'),
  ('Very Poor', 'Respiratory illness on prolonged exposure', 'Avoid all outdoor physical activities. Keep doors and windows shut. Use air purifiers.', '#830750'),
  ('Severe', 'Affects healthy people and seriously impacts those with existing conditions', 'Stay indoors. Avoid any physical activity outdoors. Seek medical help if experiencing distress.', '#5e0539')
ON CONFLICT (aqi_category) DO UPDATE SET
  health_risk = EXCLUDED.health_risk,
  precaution_message = EXCLUDED.precaution_message,
  color_code = EXCLUDED.color_code;

-- 2. Cities
INSERT INTO city (city_name, state)
VALUES
  ('Delhi', 'Delhi'),
  ('Mumbai', 'Maharashtra'),
  ('Bangalore', 'Karnataka'),
  ('Chennai', 'Tamil Nadu'),
  ('Kolkata', 'West Bengal')
ON CONFLICT DO NOTHING;

-- 3. Monitoring Stations (Example: Delhi)
INSERT INTO monitoring_station (station_name, latitude, longitude, city_id)
SELECT 'ITO', 28.6289, 77.2413, city_id FROM city WHERE city_name = 'Delhi'
UNION ALL
SELECT 'Anand Vihar', 28.6469, 77.3164, city_id FROM city WHERE city_name = 'Delhi'
UNION ALL
SELECT 'Bandra Kurla Complex', 19.0596, 72.8656, city_id FROM city WHERE city_name = 'Mumbai'
UNION ALL
SELECT 'BTM Layout', 12.9166, 77.6101, city_id FROM city WHERE city_name = 'Bangalore';

-- 4. Pollutants
INSERT INTO pollutant (pollutant_name, unit)
VALUES
  ('PM2.5', 'µg/m³'),
  ('PM10', 'µg/m³'),
  ('NO2', 'µg/m³'),
  ('SO2', 'µg/m³'),
  ('CO', 'mg/m³'),
  ('O3', 'µg/m³')
ON CONFLICT (pollutant_name) DO UPDATE SET unit = EXCLUDED.unit;

-- 5. Fun Facts
INSERT INTO fun_fact (min_aqi, max_aqi, fact_text)
VALUES
  (0, 50, 'Trees in urban areas can reduce street-level particulate matter by up to 60%.'),
  (0, 50, 'At this level, air quality is equivalent to a pristine forest.'),
  (51, 100, 'Morning hours between 6-8 AM typically have the cleanest air in Indian cities.'),
  (101, 200, 'Indoor plants like spider plants and peace lilies can absorb common pollutants.'),
  (201, 300, 'Vehicle emissions contribute to nearly 40% of air pollution in major Indian cities.'),
  (301, 400, 'Prolonged exposure at this AQI level can reduce life expectancy by 2-3 years.'),
  (401, 500, 'Cities hitting 400+ AQI often see emergency hospital admissions rise by 30-40%.')
ON CONFLICT DO NOTHING;
