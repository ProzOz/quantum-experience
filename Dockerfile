FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf

# Public classroom only. Do not COPY the repo root — notes, scrap
# photos, and unused media would be served on the live hostname.
COPY index.html \
     styles.css game.css lab.css circuit.css coop.css station-chrome.css \
     app.js lab.js theory.js circuit.js coop.js game.js \
     buraphalogo.png scius-buu-logo.png \
     /usr/share/nginx/html/
COPY images/classroom.jpg \
     images/quantum-core-poster.jpg \
     images/station1-bg.jpg \
     images/station2-bg.jpg \
     images/station3-bg.jpg \
     images/station4-bg.jpg \
     images/station5-bg.jpg \
     images/station6-bg.jpg \
     images/station7-bg.jpg \
     /usr/share/nginx/html/images/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
