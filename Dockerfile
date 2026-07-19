FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/http.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
