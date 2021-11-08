#!/bin/sh
sudo service apache2 restart 
sudo pm2 delete 0
sudo pm2 start startup/server.js --time  #if startup location is changed, change this too
sudo pm2 save
