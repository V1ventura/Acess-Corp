#!/bin/bash

# Inicia o SQL Server em segundo plano
/opt/mssql/bin/sqlservr &

# Aguarda o SQL Server estar pronto para aceitar conexões
echo "Aguardando o SQL Server iniciar..."
sleep 30s

# Executa os scripts SQL
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "Accesscorp@123" -i /usr/work/script.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "Accesscorp@123" -i /usr/work/script1.sql

wait
