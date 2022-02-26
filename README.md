# Module to export data from Umami into PDFs

## Installation
create a .env file that contains:
- URL: url of the website
- USER: the user for the login
- PASSWORD: the password for the login
- SENDER_EMAIL: email of the sender
- SENDER_PASS: password of the account of the sender
- RECEIVER_EMAIL: "to" email of the person who get the mail

then install dependancies with npm
```
npm i
```

## Use
finally you can launch the script manually or by a cron task with the command:
```
node script.js
```
