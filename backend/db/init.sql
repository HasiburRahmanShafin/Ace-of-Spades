-- Database initialization for IndustrySphere AI
CREATE DATABASE industryphere;
\c industryphere;

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS vector;

-- Machine Telemetry Timeseries
CREATE TABLE IF NOT EXISTS telemetry (
    time TIMESTAMPTZ NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    vibration_mm_s DOUBLE PRECISION,
    temperature_c DOUBLE PRECISION,
    pressure_psi DOUBLE PRECISION,
    power_kw DOUBLE PRECISION
);

SELECT create_hypertable('telemetry', 'time', if_not_exists => TRUE);
