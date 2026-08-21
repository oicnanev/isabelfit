# IsabelFit

Website de personal trainer em Portugal, com foco em treino personalizado, avaliação corporal, plano alimentar e acompanhamento de resultados.

## Estrutura do projeto

```text
isabelfit/
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── index.html
├── src/
│   └── server.js
├── package.json
├── README.md
└── .env
```

## Como executar

```bash
cd src
npm install
npm start
```

O site fica disponível em http://localhost:3000

## Conteúdo principal

- landing page premium para personal trainer
- secções de plano alimentar, avaliação e planos
- contacto com formulário e envio de mensagem
- visual baseado nas imagens fornecidas da Isabel


Passo a passo para criar uma **VM sempre gratuita (e2-micro)** no Google Cloud e configurá-la para hospedar um site. 

---

### **Passo 1: Criar uma Conta no Google Cloud (GCP)**
1. Acesse [Google Cloud Free Tier](https://cloud.google.com/free).
2. Clique em **"Get started for free"** e faça login com sua conta Google.
3. Insira os dados do cartão de crédito (⚠️ **não será cobrado** se usar apenas recursos gratuitos).
4. Ative o **período de trial** (US$ 300 em créditos por 90 dias, mas focaremos no *always free*).

---

### **Passo 2: Criar a VM (Compute Engine)**
1. Acesse o [Console do GCP](https://console.cloud.google.com/).
2. No menu lateral, vá para **Compute Engine** > **VM instances**.
3. Clique em **"Create Instance"** e configure:
   - **Nome**: `vm-site-free` (ou outro nome).
   - **Região**: `us-west1` (Oregon) ou `us-central1` (Iowa) — [regiões sempre gratuitas](https://cloud.google.com/free/docs/always-free#compute).
   - **Máquina**: `e2-micro` (1 vCPU, 1GB RAM).
   - **Disco boot**: 30GB (Standard Persistent Disk, gratuito).
   - **Sistema operacional**: Ubuntu 22.04 LTS (ou Debian).
   - **Firewall**: Marque **"Allow HTTP traffic"** e **"Allow HTTPS traffic"**.


4. Clique em **"Create"**.

---

### **Passo 3: Conectar à VM via SSH**
1. Na lista de VMs, clique em **"SSH"** ao lado da sua instância (o GCP abrirá um terminal no navegador).
2. Ou use o comando local:
   ```bash
   gcloud compute ssh --zone us-west1-a vm-site-free
   ```
   (Instale o [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) se necessário.)

---

### **Passo 4: Instalar um Servidor Web (Nginx/Apache)**
No terminal da VM, execute:
#### **Para Nginx (recomendado para sites estáticos)**:
```bash
sudo apt update && sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```
- Teste: Acesse `http://<IP-DA-VM>` no navegador. Deve ver-se a página padrão do Nginx.

---

### **Passo 5: Configurar Domínio e Firewall (Opcional)**
1. **IP Externo**:  
   - Na console do GCP, vá para **VPC network** > **External IP addresses**.  
   - Altere o IP da VM de "Ephemeral" para **"Static"** (gratuito enquanto a VM existir).  

2. **Domínio**:  
   - Comprar um domínio (ex: no [Cloudflare](https://www.cloudflare.com/pt-br/products/registrar/)) e aponta-lo para o IP estático.  

3. **Firewall**:  
   - Libertar a porta 80 (HTTP) e 443 (HTTPS) em **VPC network** > **Firewall rules**.  

---

### **Passo 6: Implantar o Site**

#### **Para um site dinâmico (Node.js/PHP)**:
- **Node.js**: Use `pm2` para gerenciar o processo:
  ```bash
  sudo apt install nodejs npm
  npm install -g pm2
  pm2 start app.js
  pm2 startup
  ```
---

### **Passo 7: Monitorar Custos (Evitar Cobranças)**
1. Acesse [Billing](https://console.cloud.google.com/billing) no GCP.
2. Ative **alertas de orçamento** para receber notificações se ultrapassar os limites gratuitos.
3. **Always Free**:  
   - Mantenha a VM em `us-west1` ou `us-central1`.  
   - Não ultrapasse 1GB de saída de rede/dia.  

---

### **Dicas para Otimizar Recursos**
- **Reduzir o uso de CPU/RAM**: Otimizar o site para evitar esgotar os 1GB de RAM.  
- **Usar Cloud CDN**: Se o tráfego aumentar, ativar o Cloud CDN (custo adicional).  


Para associar o seu domínio ao IP público da sua VM (**34.133.75.90**),:

---

### **Passo 1: Configure um DNS (A ou CNAME)**
Você precisa apontar o domínio para o IP da VM via **registro DNS**. O método depende de onde seu domínio está registrado (ex: Cloudflare, GoDaddy, Google Domains).  

#### **Opção 1: Registro A (recomendado para IPs estáticos)**
- Aceder ao painel do seu **registrador de domínio** (ex: Cloudflare, Namecheap).  
- Adicionar um registro **A** com:  
  - **Host**: `@` (para o domínio raiz, ex: `seudominio.com`) ou `www` (para `www.seudominio.com`).  
  - **Value/IP**: `34.133.75.90` (IP da sua VM).  
  - **TTL**: `3600` (padrão).  

#### **Opção 2: Registro CNAME (se usar um subdomínio)**
- Para subdomínios (ex: `app.seudominio.com`), crie um **CNAME** apontando para:  
  - **Host**: `app`  
  - **Value**: `seudominio.com` (ou outro domínio já configurado).  

---

### **Passo 2: Verifique se o IP é estático**
No Google Cloud:  
1. Aceder a **VPC network** > **External IP addresses**.  
2. Se o IP `34.133.75.90` estiver como **"Ephemeral"**, mudar para **"Static"** (gratuito enquanto a VM existir).  
   - Isso evita que o IP mude após reiniciar a VM.  

---

### **Passo 3: Configure o servidor web (Nginx/Apache)**
Na sua VM, garanta que o servidor está respondendo no IP:  
```bash
sudo apt update && sudo apt install nginx -y  # Se usar Nginx
sudo systemctl start nginx
```
- Teste: Acesse `http://34.133.75.90` no navegador. Deve aparecer a página padrão do Nginx.  

---

### **Passo 4: Adicione o domínio ao servidor web**
Edite o arquivo de configuração do Nginx (ex: `/etc/nginx/sites-available/default`):  
```bash
sudo nano /etc/nginx/sites-available/default
```
Substitua ou adicione:  
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    root /var/www/html;
    index index.html;
}
```
Reinicie o Nginx:  
```bash
sudo systemctl restart nginx
```

---

### **Passo 5: Habilite HTTPS (SSL/TLS) - Opcional**
Use o **Certbot** para obter um certificado gratuito do Let's Encrypt:  
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```
Siga as instruções para validar o domínio.  

---

### **Passo 6: Espere a propagação do DNS**
- As alterações DNS podem levar **até 48 horas** para propagar globalmente.  
- Verifique com:  
  ```bash
  ping seudominio.com  # Deve retornar o IP da VM
  ``` 

---

### **Passo 7: Configure o Firewall (se necessário)**
No Google Cloud:  
1. Acesse **VPC network** > **Firewall rules**.  
2. Crie uma regra para permitir tráfego **HTTP (80)** e **HTTPS (443)**.  

---

### **Resolução de Problemas Comuns**  
- **Erro "Site not reachable"**:  
  - Verifique se o Nginx/Apache está rodando (`sudo systemctl status nginx`).  
  - Confira se o firewall do GCP permite as portas 80/443.  
- **DNS não propagou**: Use `dig seudominio.com` para ver o IP atual.  

---


### **Passo 3: Obtenha o certificado SSL (HTTPS)**
Execute o Certbot para gerar certificados gratuitos (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d marypets.pt -d www.marypets.pt
```
- Siga as instruções interativas para validar o domínio.  
- O Certbot **automaticamente atualizará** o arquivo `marypets.pt` com as configurações SSL.

---

### **Passo 4: Configure a aplicação Node.js**
1. Garanta que sua aplicação está rodando na **porta 3000** (localmente na VM).  
   - Use `pm2` para gerenciar o processo:
     ```bash
     sudo npm install -g pm2
     pm2 start app.js --name "marypets-app"
     pm2 startup
     pm2 save
     ```

2. Verifique se a aplicação responde localmente:
   ```bash
   curl http://localhost:3000
   ```

---


### **Resumo Final**
1. **Arquivo dedicado no Nginx**: Melhor organização e segurança.  
2. **HTTP → HTTPS**: Redirecionamento automático.  
3. **Proxy para Node.js**: Encaminha tráfego para a porta 3000.  
4. **SSL com Certbot**: HTTPS gratuito e automático.  

Para verificar se o Node.js está a correr na porta **3000** e garantir que continua em execução mesmo após desligar a sessão SSH:

---

### **1. Verificar se o Node.js está a correr na porta 3000**
Execute no terminal da sua VM:
```bash
sudo lsof -i :3000
```
ou
```bash
netstat -tulnp | grep 3000
```
- **Se estiver em execução**, você verá uma saída como:
  ```
  COMMAND  PID USER   FD TYPE DEVICE SIZE/OFF NODE NAME
  node    1234 user   20u IPv4 12345      0t0  TCP *:3000 (LISTEN)
  ```
- **Se não houver saída**, o Node.js não está ativo na porta 3000.

---

### **2. Como executar o Node.js em background (sem depender da sessão SSH)**
Usar `npm start &` não é suficiente, pois o processo será terminado quando você sair do SSH. Utilize uma destas opções:

#### **Opção 1: Usar `nohup` (simples, mas sem gestão avançada)**
```bash
nohup npm start > /dev/null 2>&1 &
```
- `nohup` mantém o processo ativo após logout.
- `> /dev/null 2>&1` redireciona logs para evitar arquivos `nohup.out`.

#### **Opção 2: Usar `pm2` (recomendado para produção)**
Instalar o [PM2](https://pm2.keymetrics.io/) (gerenciador de processos para Node.js):
```bash
sudo npm install -g pm2
```
Inicie a aplicação:
```bash
pm2 start npm --name "marypets-app" -- start
```
- **Comandos úteis do PM2**:
  ```bash
  pm2 list              # Lista processos ativos
  pm2 logs marypets-app # Mostra logs em tempo real
  pm2 save              # Salva os processos para reiniciar após reboot
  pm2 startup           # Configura para iniciar automaticamente com o sistema
  ```

---

### **3. Verificar se a aplicação está acessível**
Teste localmente na VM:
```bash
curl http://localhost:3000
```
- Se retornar o conteúdo esperado (ex: HTML, JSON), está tudo OK.

---

### **4. Se o Node.js não estiver a responder**
#### **Possíveis causas**:
- **A aplicação crashou**: Verifique os logs:
  ```bash
  pm2 logs marypets-app  # Se usou PM2
  cat nohup.out          # Se usou nohup
  ```
- **Porta bloqueada**: Verifique o firewall da VM ou do Google Cloud:
  ```bash
  sudo ufw status  # Se estiver usando UFW (Linux)
  ```
  No Google Cloud, acesse **VPC Network** > **Firewall Rules** e garanta que a porta 3000 está aberta para tráfego interno (se usada apenas pelo proxy do Nginx).

---

### **5. Configurar o Nginx para redirecionar para a porta 3000**
Se ainda não fez, edite o arquivo do Nginx (`/etc/nginx/sites-available/marypets.pt`) para incluir:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
Reinicie o Nginx após alterações:
```bash
sudo systemctl restart nginx
```

---

### **Resumo dos Comandos**
| Tarefa                          | Comando                              |
|---------------------------------|--------------------------------------|
| Verificar porta 3000            | `sudo lsof -i :3000`                 |
| Iniciar com PM2                 | `pm2 start npm --name "my-app" -- start` |
| Verificar processos PM2         | `pm2 list`                           |
| Iniciar com nohup               | `nohup npm start > /dev/null 2>&1 &` |
| Testar acesso local             | `curl http://localhost:3000`         |

---

### **Importante**
- **PM2 é a melhor opção** para produção (monitoramento, reinício automático, logs organizados).  
- Se a aplicação crasha frequentemente, verifique erros no código (ex: `try/catch` faltando).  


### Conclusão

Com esses passos, temos um site funcional usando [Node.js](https://nodejs.org/en) para o backend e [Tailwind CSS](https://tailwindcss.com) para a estilização. No HTML usar classes Tailwind é trabalhoso, mas o resultado é um site moderno e responsivo.
