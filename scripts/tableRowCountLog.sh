#!/bin/bash

database_path="/workspaces/BikeApp/database.db"  

# Get a list of all tables
tables=$(sqlite3 "$database_path" .tables)

# For each table
for table in $tables; do
    # Count rows and print the result
    count=$(sqlite3 "$database_path" "SELECT COUNT(*) FROM $table;")
    echo "Number of rows in $table: $count"
done
