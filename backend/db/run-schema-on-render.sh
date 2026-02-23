#!/bin/bash
# Script to run schema on Render PostgreSQL database
# Usage: ./run-schema-on-render.sh

PGPASSWORD='PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm' psql -h dpg-d6e9js8gjchc738if5g0-a -p 5432 -U expense_manager_h1y2_user -d expense_manager_h1y2 -f schema.sql
