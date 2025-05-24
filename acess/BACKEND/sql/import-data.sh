# aguardando 30s para aguardar o provisionamento e start do banco
sleep 30s
# rodar o comando para criar o banco
/opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U SA -P "Accesscorp@123" -i script.sql
sleep 30s
/opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U SA -P "Accesscorp@123" -i script1.sql