#!/bin/bash
database_path="/workspaces/BikeApp/database.db"  
table_name="Biketrips" 
sqlite3 "$database_path" <<EOF
DELETE FROM $table_name;
EOF