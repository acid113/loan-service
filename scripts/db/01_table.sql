-- Enable UUID generation extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'loans' table
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicantName TEXT NOT NULL,
    requestedAmount NUMERIC(12, 2) NOT NULL CHECK (requestedAmount >= 0),
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
