create database cityManager;
use cityManager;

create table city (
                      name varchar(255),
                      country varchar(255),
                      S int(255),
                      numberPeople int(255),
                      GDP int(255),
                      description varchar(255)
);

alter table city
    add primary key(name);
