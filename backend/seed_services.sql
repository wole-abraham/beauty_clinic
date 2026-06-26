-- Run once on the server to seed initial services
-- psql -U beauty -d beauty_clinic -f seed_services.sql

INSERT INTO services (servicetype, price) VALUES
  ('Facial Treatment',     60.00),
  ('Makeup Artistry',      80.00),
  ('Nail Care',            35.00),
  ('Eyelash Perming',      45.00),
  ('Wax Care',             30.00),
  ('Mesotherapy',         100.00),
  ('Permanent Makeup',    120.00),
  ('Hair Styling',         50.00)
ON CONFLICT DO NOTHING;
