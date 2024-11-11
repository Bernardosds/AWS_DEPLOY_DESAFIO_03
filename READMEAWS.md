# Deploy AWS Compass Car API

Este guia explica como realizar o deploy da API em uma instancia EC2 na **AWS**

### Pré-requisitos

- Conta na **AWS** (Amazon Web Services).
## Links importantes
- Acesse o [Swagger](https://compass-car-api-documentation.s3.us-east-1.amazonaws.com/estaticoswagger.html)
- Acesse o [Repositório](https://github.com/Bernardosds/AWS_DEPLOY_DESAFIO_03)

## Começando
- Acesse o menu da Amazon AWS
- No menu superior direito defina sua regiâo como **Ohio/us-east-2**<br>
  ![Imagem 0](https://s3.us-east-2.amazonaws.com/imagens.readme/image0-AdKUa2Ph9-transformed.png)

## Criando a instancia EC2
- Na barra superior esquerda clique em **Services**
- Em **Compute**, selecione **EC2** 
 ![Imagem 1](https://s3.us-east-2.amazonaws.com/imagens.readme/image1-transformed.png)
- No menu de instâncias clique no botão Laranja **Launch Instance**
![Imagem 2](https://s3.us-east-2.amazonaws.com/imagens.readme/image2-transformed.png)
## Configurando a instância
### Name and tags
- Configure os como na imagem abaixo:
![Imagem 3](https://s3.us-east-2.amazonaws.com/imagens.readme/image3-transformed.png)
### Application and OS Images 
- Selecione o Ubuntu Server 22.04 LTS
### Instance type
- Selecione o t2.micro
### Key pair
- Clique no botão **create new key pair**
![Imagem 4](https://s3.us-east-2.amazonaws.com/imagens.readme/image4-transformed.png)
- Defina o nome da sua key pair, e troque o file format para .ppk
![Imagem 5](https://s3.us-east-2.amazonaws.com/imagens.readme/image5-transformed.png)
- O arquivo será baixado automaticamente. **Recomenda-se criar uma pasta no diretório (C:)** para armazenar suas chaves com segurança, pois você precisará dela para acessar a instância via SSH.
### Network settings
- Crie um novo security group
- Marque as opções para permitir SSH, HTTPS e HTTP para **Anywhere**
![Imagem 6](https://s3.us-east-2.amazonaws.com/imagens.readme/image6-transformed.png)
### Configure Storage
- Altere o tamanho do storage para **30 GiB**
![Imagem de Armazenamento](https://s3.us-east-2.amazonaws.com/imagens.readme/imagestorage-transformed.png)
### Advanced details
- Não altere nada nesta aba
### Clique em **Launch Instance**

## Para conectar a insância vamos utilizar o Putty
- Acesse a [página oficial do Putty](https://www.putty.org/) e baixe a versão correspondente ao seu sistema operacional
- Realize a instalação do Putty
 
## Conectando a instância EC2 via SSH
- No menu de instâncias da AWS, copie o **Public IPv4 adress**
 ![Imagem 7](https://s3.us-east-2.amazonaws.com/imagens.readme/image7-transformed.png)
- Abra o putty
- Na pagina inicial em **Host Name** coloque ubutu@**PublicIPv4adress**
 ![Imagem 8](https://s3.us-east-2.amazonaws.com/imagens.readme/image8-transformed.png)
- No menu lateral esquerdo navegue, clicando em **+SSH**, **+Auth** e **Credentials**
- Em **Private Key file for authentication**, clique em **Browse** e localize o arquivo `.ppk` criado na hora da criação da instância.
 ![Imagem 9](https://s3.us-east-2.amazonaws.com/imagens.readme/image9-transformed.png)
- Clique em **Open**
- Na primeira vez o Putty irá mostrar um aviso de segurança, clique em **Accept**
 ![Imagem 10](https://s3.us-east-2.amazonaws.com/imagens.readme/image10-transformed.png)

## Configurando o Servidor Linux
### Atualizando
- Digite os comandos:
```bash
sudo su
sudo apt update -y && sudo apt upgrade -y
```
- Após atualização utilize esse comando para reiniciar o sistema:
```bash
sudo reboot
```
- Abra o putty e entre novamente no servidor.
- Digite novamente o comandos:
```bash
sudo su
```
### Instalando o banco de dados
- Para instalar o MariaDB utilize os comandos:
```bash
sudo apt install mariadb-server
sudo mysql_secure_installation
```
- Responda as perguntas de instalação, caso altere a senha grave ela.
- Caso não tenha alterado, vamos defini-lá agora para evitar bugs:
```bash
sudo mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'sua_nova_senha';
FLUSH PRIVILEGES;
```
- Criando o banco de dados
```bash
CREATE DATABASE compass_car;
```
- Para verificar se foi criado certo utiliza o comando:
```bash
SHOW DATABASES;
```
- Após isso feche o terminal mysql com o comando:
```bash
exit
```

### Instalando NPM, NODE e Typescript
```bash
sudo apt install unzip -y
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm use --install-if-missing 20
fnm default 20
npm install -g typescript
```
### Clonando o repósitorio
- Para clonar o repósitorio da API para o servidor digite o comando:
```
https://github.com/Bernardosds/AWS_DEPLOY_DESAFIO_03 API
```
- Preparando para rodar a API digite os comandos:
```bash
npm install
```
- Depois
```bash
tsc
```
- Crie um arquivo .env com o comando:
```bash
nano .env
```
- Exemplo de configuração
```bash
DB_NAME=compass_car
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua senha
PORT=3000
```
- Pressione Ctrl + O para salvar o arquivo com o nome .env, e Ctrl + X para sair do editor.

## Configurando as tabelas com Migration
- Digite o comando:
```bash
npm run migration:generate
```
- E após digite o comando:
```bash
npm run migration:run
```

## Rodando a API
- Para rodar a API basta digitar o comando:
```bash
npm start
```
 
## Instalando PM2
- Digite o comando:
```bash
npm install -g pm2
```
- Agora inicie a API pelo PM2
- Navegue até o diretorio API/dist/
```bash
pm2 start server.js --name "APIRodando"
```
- Para garantir que o PM2 vai reiniciar automatico sempre utilize os comandos:
```bash
pm2 startup
pm2 save
```

## Como utilizar a API
- No postman ou outro app de sua preferência substitua o localhost por: 3.144.187.153
- Exemplo POST http:/3.144.187.153:3000/login
```json
  {
  "email": "user@example.com",
  "password": "your_password"
  }
```
# Como fazer um Bucket S3 na AWS
- No menu superior esquerdo clique em **Services**, role até em baixo clique em **Storage** e por fim selecione **S3**
- No menu do S3 clique no botão Laranja **Create Bucket**
- De um nome para seu bucket, e configure ele de acordo com sua necessidade.
- Por fim clique no botão laranja **Create Bucket** novamente.
## Subindo arquivos
- Com o bucket já criado, clique no bucket que deseja usar.
- Clique no botão laranja **upload** a direita da página e envie seu arquivo ou pasta.

