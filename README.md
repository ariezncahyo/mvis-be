# MVis-BE

## Stack
  - Node Express
  - MySQL
  - JWT
  - Sequelize
  - Multer
  - Bcrypt

## Install
  - Clone this repo https://github.com/ariezncahyo/mvis-be.git
  - Create .env
  ```
    NODE_ENV=development

    DB_USER='root'
    DB_HOST='localhost'
    DB_PASSWORD=''
    DB_NAME='mvis'
    PORT=9000

    ACCESS_TOKEN_SECRET_KEY='secret'
    REFRESH_TOKEN_SECRET_KEY='secret'
  ```
  - run npm install
  - run npm start
  - open yourhost:9000 or your setup port on env

## Deployment
  - Nginx
  
  ```
    server {
        server_name api.yourdomain;

        underscores_in_headers on;
        proxy_pass_request_headers on;

        access_log /var/log/nginx/mvis-be.access.log;
        error_log /var/log/nginx/mvis-be.error.log;

        add_header Strict-Transport-Security max-age=2678400 always;

        location / {
                proxy_pass_request_headers on;
                include proxy_params;
                proxy_connect_timeout 120s;
                proxy_send_timeout 120s;
                proxy_read_timeout 120s;
                send_timeout 30s;
                proxy_pass http://localhost:9000;
        }
        
        // Use SLL
    }
  ```
  
  - PM2
  ```
    pm2 start npm --name "mvis-be" -- start
  ```
  
  - Endpoint: https://api.ariezncahyo.my.id
  
## API Docs
  - https://www.postman.com/gold-moon-630531/workspace/mvis/collection/9643342-ee419629-2b27-4d94-99ea-0c5f75dbb25d?action=share&creator=9643342

## Follow this link for FE
  - https://github.com/ariezncahyo/mvis-fe
 
