#!/bin/bash
database_path="/workspaces/BikeApp/database.db"  
table_name="Bikestations" 
sqlite3 "$database_path" <<EOF
DELETE FROM $table_name;
EOF