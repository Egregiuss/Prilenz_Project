@echo off
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/Egregiuss/Prilenz_Project.git
git push -u origin master