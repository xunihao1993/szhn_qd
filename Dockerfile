FROM haohao/antdpro-base:20211228 as builder



FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html/

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/
COPY ./docker/dj_static /home/dj_myapp/static
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
