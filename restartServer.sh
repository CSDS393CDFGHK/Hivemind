#!/bin/sh
sudo service apache2 restart 
sudo pm2 delete 0
sudo pm2 start startup/server.js #if startup location is changed, change this too
