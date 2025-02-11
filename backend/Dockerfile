FROM node
WORKDIR /pet-match/fs-pet-adoption-be-chrome99
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["yarn", "dev"]