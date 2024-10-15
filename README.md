# Compass Car API

A RESTful API projetada para o gerenciamento da locação de carros. Permite o gerenciamento de usuários, o cadastro de clientes, o controle de carros disponíveis para locação e a criação e acompanhamento de pedidos de locação.

## Começando

### Pré-requisitos

- Node.js e npm instalados.
- MySQL instalado.
- Express instalado.
- Um banco de dados MySQL configurado.

### Passos de Instalação

**Clone o repositório**

```bash
git clone https://github.com/Bernardosds/CarRentalAPI.git
cd CarRentalAPI
```

**Instale as Dependências** 

```bash
npm install
```

## Criação do Banco de Dados com Migrations

Este projeto utiliza o TypeORM para gerenciar o banco de dados, e as migrations são usadas para aplicar alterações na estrutura do banco. Siga os passos abaixo para criar e atualizar o banco de dados utilizando migratios.

### Pré-requisitos

- Certifique-se de que você tem o [Node.js](https://nodejs.org/) instalado.
- O [MySQL](https://www.mysql.com/) ou outro banco de dados compatível com o TypeORM deve estar instalado e em execução.
- As dependências do projeto devem estar instaladas.

### Configuração do banco de dados
Crie um arquivo `.env` na raíz do projeto e adicione as configurações do banco do seu banco de dados.
um exemplo de configuração é: 

```bash
DB_HOST=localhost
DB_PORT=3333
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

### Utilizando as migrations
Primeiro gere a migration utilizando o comando:
```bash
npm run migration:generate
```
Após ser gerado o arquivo de migrations, execute ele utilizando o comando:
```
npm run migration:run
```

## Executando a aplicação
Após ter clonado o repositório, instalado as dependencias, configurado o banco de dados e executado as migraitons. Inicie a API utilizando o comando:
```
npm start
```

## Estrutura da Documentação para cada Endpoint

## Endpoint de Users
### POST users
**Descrição**: Criação de um novo usuário.

**Corpo da Requisição** (Campos obrigatórios):
```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string (email)",
  "password": "string (senha criptografada)"
}
```

### GET users
**Descrição**: Listagem de usuários com filtros e paginação.

**Parâmetros de Consulta**:

`name` (string, opcional): Filtrar por parte do nome do usuário.
`email` (string, opcional): Filtrar por parte do e-mail.
`excluded` (boolean, opcional): Filtrar por status de exclusão (sim/não).
`sort` (string, opcional): Campo de ordenação (nome, data de cadastro, data de exclusão).
`page` (integer, opcional): Página atual da lista.
`pageSize` (integer, opcional): Tamanho da pági

**Exemplo de requisição**: <br>
GET users?name=John&email=john.doe@example.com&excluded=false&sort=name&page=1&pageSize=10

**200:** Lista de usuários retornada com sucesso: 
```json
{
  "total": "integer",
  "totalPages": "integer",
  "currentPage": "integer",
  "users": [ "/lista de usuários/" ]
}
```
### GET users/:{id}
**Descrição**: Busca um usuário por ID.

**Parâmetro de Caminho**:

`id` (string, obrigatório): ID do usuário.

### PATCH users/:{id}
**Descrição**: Atualizar informações de um usuário.

**Parâmetro de Caminho**:

`id` (string, obrigatório): ID do usuário.
**Corpo da Requisição** (Campos opcionais):

```json
{
  "name": "string",
  "email": "string (email)",
  "password": "string (senha criptografada)"
}
```
### DELETE users/:{id}
**Descrição**: Soft delete de um usuário (marcar como excluído).

**Parâmetro de Caminho**:

`id` (string, obrigatório): ID do usuário.

### POST login
**Descrição**: Autenticação de usuário (login).

**Corpo da Requisição** (Campos obrigatórios):

```json
{
  "email": "string (email)",
  "password": "string (senha)"
}
```
## Endpoint de Carros

### POST /cars/create
**Descrição**: Cria um novo carro.

**Corpo da requisição** (Campos obrigatórios):
```json
{
  "plate": "string",
  "brand": "string",
  "model": "string",
  "mileage": "integer",
  "year": "integer",
  "items": ["string"],
  "daily_price": "number (float)",
  "status": "string (active ou inactive)"
}
```
### GET cars/
**Descrição**: Lista todos os carros com opções de filtragem.

**Parâmetros de Consulta** (opcionais):
`status` (string): Filtra pelo status do carro. Valores possíveis: `active`, `inactive`, `deleted`.
`plateEnd` (string): Filtra pelos últimos caracteres da placa.
`brand` (string): Filtra pela marca do carro.
`model` (string): Filtra pelo modelo do carro.
`mileage` (integer): Filtra pela quilometragem do carro.
`yearFrom` (integer): Filtra pelo ano mínimo.
`yearTo` (integer): Filtra pelo ano máximo.
`dailyPriceMin` (number): Filtra pelo preço diário mínimo.
`dailyPriceMax` (number): Filtra pelo preço diário máximo.
`items` (string): Filtra por itens (valores separados por vírgula).

**Resposta**:
```json
{
  "totalCount": "integer",
  "totalPages": "integer",
  "currentPage": "integer",
  "cars": [
    {
      "id": "string",
      "plate": "string",
      "brand": "string",
      "model": "string",
      "mileage": "integer",
      "year": "integer",
      "items": ["string"],
      "daily_price": "number (float)",
      "status": "string",
      "registration_date": "string (date-time)",
      "updated_time": "string (date-time)"
    }
  ]
}
```

### GET cars/:{id}
**Descrição**: Busca um carro por ID.

**Parâmetro de Caminho**:
`id` (string, obrigatório): ID do carro.
  
### PATCH cars/update/:{id}
**Descrição**: Atualiza informações de um carro.

**Parâmetro de Caminho**:
- `id` (string, obrigatório): ID do carro.

**Corpo da Requisição** (Campos opcionais):

```json
{
  "plate": "string",
  "brand": "string",
  "model": "string",
  "mileage": "integer",
  "year": "integer",
  "items": ["string"],
  "daily_price": "number (float)"
}
```

### DELETE cars/delete/:{id}
**Descrição**: Soft delete de um carro (marcar como excluído).

Parâmetro de Caminho:

`id` (string, obrigatório): ID do carro.

## Endpoint de Clientes

### POST /customers/create

**Descrição**: Cria um novo cliente.

**Corpo da Requisição** (Campos obrigatórios):

```json
{
  "fullName": "string",
  "email": "string (email)",
  "birthDate": "string (date)",
  "cpf": "string",
  "phone": "string"
}
```

### GET /customers/
**Descrição**: Listagem de clientes com filtros e paginação.

**Parâmetros de Consulta** (opcionais):

`fullName` (string): Filtrar por parte do nome do cliente.
`email` (string): Filtrar por parte do e-mail.
`cpf` (string): Filtrar por parte do CPF do cliente.
`exclude` (boolean): Filtrar por status de exclusão (sim/não).
`order` (string): Campo de ordenação (nome, data de cadastro, data de exclusão).
`page` (integer): Página atual da lista.
`pageSize` (integer): Tamanho da página.

**Resposta**:
```json
{
  "totalCount": "integer",
  "totalPages": "integer",
  "currentPage": "integer",
  "customers": [
    {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "birthDate": "string",
      "cpf": "string",
      "phone": "string",
      "registrationDate": "string (date-time)",
      "status": "string"
    }
  ]
}
```

### GET customers/:{id}

**Descrição**: Busca um cliente por ID.

**Parâmetro de Caminho**:

`id` (string, obrigatório): ID do cliente.

**Resposta**:
```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "birthDate": "string",
  "cpf": "string",
  "phone": "string",
  "registrationDate": "string (date-time)",
  "status": "string"
}
```

### PATCH customers/{id}

**Descrição**: Atualizar informações de um cliente.

**Parâmetro de Caminho**:

`id` (string, obrigatório): ID do cliente.
**Corpo da Requisição** (Campos opcionais):
```json
{
  "fullName": "string",
  "email": "string (email)",
  "birthDate": "string",
  "cpf": "string",
  "phone": "string"
}
```
### DELETE customers/{id}
**Descrição**: Soft delete de um cliente (marcar como excluído).

**Parâmetro de Caminho**:

`id` (string, obrigatório): ID do cliente.

## Endpoint de Pedidos
### POST /orders/create
 
**Descrição**: Criação de um novo pedido de locação.
 
**Corpo da Requisição** (Campos obrigatórios):

```json
{
  "cpf_cliente": "string (CPF do cliente)",
  "plate": "string (Placa do carro)"
} 
```
 
### GET /orders
**Descrição**: Lista todos os pedidos de locação.
 
Resposta:
 
```json
[
  {
    "id": "string (UUID)",
    "cpf_cliente": "string (CPF do cliente)",
    "plate": "string (Placa do carro)",
    "statusRequest": "string (Status do pedido)",
    "dateRequest": "string (data-hora da solicitação)",
    "startDate": "string (data de início do aluguel)",
    "endDate": "string (data de término do aluguel)"
  }
]
```
### GET /orders/{id}
**Descrição**: Busca um pedido de locação por ID.
 
**Parâmetro de Caminho**:
 
 `id` (string, obrigatório): ID do pedido de locação.
 
Resposta:
 
```json
{
  "id": "string (UUID)",
  "cpf_cliente": "string (CPF do cliente)",
  "plate": "string (Placa do carro)",
  "statusRequest": "string (Status do pedido)",
  "dateRequest": "string (data-hora da solicitação)",
  "startDate": "string (data de início do aluguel)",
  "endDate": "string (data de término do aluguel)"
}
```
 
### PATCH /orders/update/{id}
**Descrição**: Atualização de um pedido de locação.
 
**Parâmetro de Caminho**:
 
´id´ (string, obrigatório): ID do pedido de locação.
 
**Corpo da Requisição** (Campos obrigatórios):
 
```json
{
  "statusRequest": "string (Novo status do pedido)"
}
```
 
### DELETE /orders/delete/{id}
**Descrição**: Cancela um pedido de locação.
 
**Parâmetro de Caminho**:
`id` (string, obrigatório): ID do pedido de locação.


## Autenticação
 
A API usa autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, é necessário incluir o token no cabeçalho `Authorization` como `Bearer <token>`.
 
### Exemplo de Requisição Autenticada
 
```http

GET /users

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```
**Middleware de Autenticação**:
Um middleware valida o token e adiciona o usuário à request (req.user), contendo o e-mail do usuário autenticado.


# SCRUM
**Documentação das Dailies**: <br>

**Notion**: https://fluttering-starflower-2cd.notion.site/AWS_NODE_AGO24_DESAFIO_02_CORINGA-1189cc978ad280b58f9ec2763907bf52

**Organização de tasks**: Para vizualizar os dados do Trello, solicite acesso através do link:<br>

**Trello**: https://trello.com/b/09SpYG44/squad-coringa
