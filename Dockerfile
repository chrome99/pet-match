FROM node
WORKDIR /pet-match/fs-pet-adoption-fe-chrome99
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]