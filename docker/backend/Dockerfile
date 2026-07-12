# ---------- Base Image ----------
FROM node:20-alpine

# ---------- Application Directory ----------
WORKDIR /app

# ---------- Copy Package Files ----------
COPY app/backend/package*.json ./

# ---------- Install Production Dependencies ----------
RUN npm install --omit=dev

# ---------- Copy Application ----------
COPY app/backend/ .

# ---------- Application Port ----------
EXPOSE 3000

# ---------- Start Application ----------
CMD ["npm", "start"]