FROM dockerhub1.matador.ais.co.th/dna/tts-asc/node-asc-web:14-alpine as dependencies

FROM dockerhub1.matador.ais.co.th/dna/tts-asc/node-asc-web:14-alpine

RUN adduser -D ttsasc && mkdir -p /app && chown -R ttsasc /app 
RUN mkdir -p /app/logs/application && mkdir -p /app/logs/access && chown -R ttsasc /app/logs 

WORKDIR /app

COPY --from=dependencies /tmp/node_modules ./node_modules
COPY . .
RUN npm run build-prod
EXPOSE 3004

USER ttsasc

CMD [ "node", "app.js" ]