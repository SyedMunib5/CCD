# Build front-end files
FROM node:alpine AS app-fe
WORKDIR /fecode
COPY . /fecode
ARG NPM_AUTH_TOKEN

RUN echo -e "@graana:registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc && \
  yarn && yarn build

# Nginx based web server
FROM nginx:1.13-alpine
COPY --from=app-fe /fecode/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_proxy.conf /etc/nginx/nginx_proxy.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
