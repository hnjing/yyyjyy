FROM nginx
RUN rm -rf /etc/nginx/nginx.conf /etc/nginx/conf.d && \
    mkdir -p /tmp/log && \
    touch /tmp/log/access_log.json
ADD nginx_conf/nginx.conf /etc/nginx/
ADD nginx_conf/conf/* /etc/nginx/conf.d/
ADD dist /usr/share/nginx/html/
EXPOSE 80
WORKDIR /usr/share/nginx/html
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
