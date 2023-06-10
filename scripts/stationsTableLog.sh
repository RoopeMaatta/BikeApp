#!/bin/bash
database_path="/workspaces/BikeApp/database.db"  
sqlite3 "$database_path" <<EOF
.mode column
.headers on
SELECT * FROM Bikestations;
EOF


# run in terminal to show a table of data from a database