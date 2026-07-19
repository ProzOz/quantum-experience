FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 3000
CMD ["sh", "-c", "sed -i 's/listen 80;/listen 3000;/' /etc/nginx/http.d/default.conf && nginx -g 'daemon off;'"]
