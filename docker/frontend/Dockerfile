FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY app/frontend/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]