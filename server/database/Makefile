DBNAME = datastream
DBUSER = $(DBNAME)
DBPASS = $(DBNAME)
ROOTUSER = root
ROOTPASS = password

create:	createdb createuser grant

drop:	dropdb dropuser

createdb:
	echo "create database $(DBNAME)" | mysql --user=$(ROOTUSER) --password=$(ROOTPASS)

initdb:
	cat schema.sql | mysql --user=$(ROOTUSER) --password=$(ROOTPASS) --database=$(DBNAME)

dropdb:
	echo "drop database $(DBNAME)" | mysql --user=$(ROOTUSER) --password=$(ROOTPASS)

createuser:
	echo "create user '$(DBUSER)'@'localhost' IDENTIFIED BY '$(DBPASS)'" | mysql --user=$(ROOTUSER) --password=$(ROOTPASS)

dropuser:
	echo "drop user '$(DBUSER)'@'localhost'" | mysql --user=$(ROOTUSER) --password=$(ROOTPASS)

grant:
	echo "GRANT ALL PRIVILEGES ON \`$(DBNAME)\`.* TO '$(DBUSER)'@'localhost'" WITH GRANT OPTION | mysql --user=$(ROOTUSER) --password=$(ROOTPASS)

dump:
	mysqldump --add-drop-table -u $(DBUSER) -p$(DBPASS) $(DBNAME) > $(DBNAME).sql
