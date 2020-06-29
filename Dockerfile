FROM node:11.15.0 

COPY . /usr/src

RUN set -x \
    && cd /usr/src \
    && bash requirements.sh
    
CMD ["bash", "-c"]

