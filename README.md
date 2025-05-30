# 🌍 Demo Geolocation

Projeto Node.js com Express para geolocalização, utilizando MongoDB Atlas como banco de dados e a API do OpenCage para conversão geográfica.

---

## 🚀 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com/)
- [OpenCage Geocoding API](https://opencagedata.com/)
- [Axios](https://axios-http.com/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Pug](https://pugjs.org/)
- Middlewares: `cors`, `cookie-parser`, `morgan`, `http-errors`

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/demo-geolocation.git
cd demo-geolocation
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Crie o arquivo .env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
OPENCAGE_API_KEY=sua_api_key

## ▶️ Execução

### Desenvolvimento (com nodemon):
```bash
npm run dev
```
### Produção:
```bash
npm start
```
O servidor estará disponível em http://localhost:3000 (ou na porta definida em .env).

## 📂 Estrutura sugerida
```
.
├── server.js              # Ponto de entrada principal
├── routes/                # Rotas da API
├── models/                # Modelos do Mongoose
├── views/                 # Templates Pug
├── .env                   # Variáveis de ambiente
├── package.json
└── README.md
```

## 🔑 MongoDB Atlas
Certifique-se de que seu cluster no MongoDB Atlas está com IP liberado para conexões externas (0.0.0.0/0, ou um IP específico) e que o usuário tem acesso ao banco usado.

## 🌐 OpenCage API
Obtenha sua chave de API gratuita em: https://opencagedata.com/api