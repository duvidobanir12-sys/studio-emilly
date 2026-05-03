# 📱 Configuração do WhatsApp para Notificações

Este guia vai te ensinar como configurar notificações via WhatsApp no seu projeto usando o **CallMeBot**.

---

## 🚀 Passo 1: Ativar o CallMeBot no WhatsApp

1. Abra o **WhatsApp** no seu celular
2. Adicione o número: **+34 603 21 25 97** aos seus contatos
3. Envie a seguinte mensagem para esse número:

```
I allow callmebot to send me messages
```

4. Você receberá uma mensagem de confirmação do CallMeBot
5. Guarde essa mensagem, ela contém a sua **API Key**

---

## 🔑 Passo 2: Obter a API Key do CallMeBot

Após enviar a mensagem de autorização, o CallMeBot vai te responder com algo assim:

```
CallMeBot API Key: xxxxxxxxxx
```

📋 **Copie essa API Key** - você vai precisar dela no próximo passo!

> 💡 **Dica:** Se não receber a resposta em alguns minutos, tente enviar a mensagem de autorização novamente.

---

## ⚙️ Passo 3: Configurar as Variáveis no Vercel

1. Acesse o [painel do Vercel](https://vercel.com/dashboard)
2. Selecione o seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

| Nome da Variável | Valor | Descrição |
|------------------|-------|-----------|
| `WHATSAPP_PHONE` | Seu número | Número com código do país, **sem o +** (ex: 5511999999999) |
| `WHATSAPP_APIKEY` | Sua API Key | A chave recebida do CallMeBot |

5. Clique em **Save** para salvar cada variável

### 📝 Exemplo de configuração:

```
WHATSAPP_PHONE=5511999999999
WHATSAPP_APIKEY=1234567890abcdef
```

> ⚠️ **Importante:** O número deve estar no formato internacional completo, mas **sem o sinal de +**. Exemplo para Brasil: `5511999999999` (55 = Brasil, 11 = DDD, 999999999 = número)

---

## 🚀 Passo 4: Fazer o Redeploy na Vercel

Após configurar as variáveis de ambiente, você precisa fazer um novo deploy para que as alterações tenham efeito:

### Opção A: Via Painel do Vercel
1. Vá na aba **Deployments** do seu projeto
2. Clique nos três pontinhos (⋮) no último deploy
3. Selecione **Redeploy**

### Opção B: Via Git (Recomendado)
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Opção C: Via Vercel CLI
```bash
vercel --prod
```

---

## ✅ Passo 5: Testar se está Funcionando

Para testar se as notificações estão funcionando:

1. Execute uma ação no seu app que deve disparar a notificação
2. Verifique se a mensagem chegou no seu WhatsApp
3. A mensagem deve chegar em poucos segundos

### 🧪 Teste Manual (opcional)

Você também pode testar diretamente via URL:

```
https://api.callmebot.com/whatsapp.php?phone=SEU_NUMERO&text=Teste+de+notificacao&apikey=SUA_API_KEY
```

Substitua:
- `SEU_NUMERO` pelo seu número (sem +)
- `SUA_API_KEY` pela chave do CallMeBot

---

## 🔧 Solução de Problemas Comum

### ❌ Não recebo mensagens no WhatsApp

**Verifique:**
- ✅ Se enviou a mensagem de autorização correta
- ✅ Se o número está salvo nos contatos
- ✅ Se a API Key está correta nas variáveis do Vercel
- ✅ Se o número no `WHATSAPP_PHONE` está sem o `+`

### ❌ Erro "Phone not authorized"

**Solução:**
1. Reenvie a mensagem de autorização: `I allow callmebot to send me messages`
2. Aguarde a resposta com a nova API Key
3. Atualize a variável `WHATSAPP_APIKEY` no Vercel
4. Faça um novo deploy

### ❌ Variáveis não funcionam após configurar

**Solução:**
- Certifique-se de que fez o **redeploy** após adicionar as variáveis
- Verifique se as variáveis estão no ambiente correto (Production/Preview/Development)

### ❌ Número inválido

**Verifique o formato:**
- ❌ Errado: `+5511999999999` ou `11999999999`
- ✅ Certo: `5511999999999`

### 📞 Suporte do CallMeBot

Se nada funcionar, visite a documentação oficial:
🔗 https://www.callmebot.com/blog/free-api-whatsapp-messages/

---

## 📚 Links Úteis

- [CallMeBot WhatsApp API](https://www.callmebot.com/whatsapp-api/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentação do CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)

---

<div align="center">
  <p>Feito com ❤️ para facilitar sua configuração</p>
</div>
