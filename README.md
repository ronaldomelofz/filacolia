# 🤖 Assistente da Filacolia

Um assistente de IA conversacional que utiliza os textos da Filacolia (Philokalia) como base de conhecimento para responder perguntas sobre a tradição ortodoxa.

## 🌟 Características

- **Chat Conversacional**: Interface moderna e responsiva
- **Base de Conhecimento**: Textos completos da Filacolia
- **Busca Inteligente**: Algoritmo de relevância otimizado
- **Respostas em Duas Etapas**: Sucintas primeiro, detalhadas sob demanda
- **Deploy Automático**: GitHub + Netlify

## 🚀 Deploy Automático

Este projeto está configurado para deploy automático no Netlify através do GitHub:

### Status do Deploy
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

### URL de Produção
https://filacolia-assistant.netlify.app

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Shadcn/UI
- **Deploy**: Netlify (GitHub Integration)
- **Base de Conhecimento**: Textos extraídos da Filacolia

## 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/ronaldomelofz/filacolia.git
cd filacolia

# Instale as dependências
pnpm install

# Execute em desenvolvimento
pnpm dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Configurações do projeto
NEXT_PUBLIC_APP_NAME="Assistente da Filacolia"
NEXT_PUBLIC_APP_DESCRIPTION="IA conversacional baseada na Filacolia"
```

## 📚 Base de Conhecimento

O sistema utiliza os seguintes volumes da Filacolia:

- **Tomo 1, Volume 1**: Textos dos Padres sobre oração
- **Tomo 1, Volume 2**: Textos sobre humildade e virtudes
- **Tomo 1, Volume 3**: Textos sobre vida espiritual
- **Tomo 2, Volume 1**: Textos sobre vida ascética
- **Tomo 2, Volume 2**: Textos sobre amor ao próximo
- **Tomo 2, Volume 3**: Textos sobre paciência
- **Tomo 2, Volume 4**: Textos complementares

## 🎯 Como Usar

1. **Faça uma pergunta** sobre a Filacolia
2. **Receba uma resposta sucinta** com informações relevantes
3. **Clique em "Ver mais detalhes"** para informações completas
4. **Explore os trechos** relacionados ao tema

## 🔄 Deploy Automático

### GitHub Actions

O projeto está configurado para deploy automático:

1. **Push para `main`** → Deploy automático no Netlify
2. **Pull Requests** → Preview automático
3. **Merges** → Deploy de produção

### Configuração do Netlify

- **Build Command**: `npm run build`
- **Publish Directory**: `out`
- **Node Version**: 18
- **Framework**: Next.js (Static Export)

## 📊 Funcionalidades

### Chat Conversacional
- Interface moderna e responsiva
- Histórico de conversas
- Indicadores de carregamento
- Tratamento de erros

### Busca Inteligente
- Algoritmo de relevância por palavras-chave
- Busca exata e semântica
- Ranking de resultados
- Cache de consultas

### Respostas Estruturadas
- **Resposta Sucinta**: Primeiros 300 caracteres + opção de detalhes
- **Resposta Completa**: Todos os trechos relevantes
- **Formatação**: Markdown para melhor legibilidade

## 🏗️ Estrutura do Projeto

```
filacolia/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # API de chat
│   │   ├── globals.css          # Estilos globais
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página principal
│   └── components/
│       └── ui/                  # Componentes UI
├── textos-extraidos/            # Base de conhecimento
├── next.config.js               # Configuração Next.js
├── netlify.toml                 # Configuração Netlify
└── package.json                 # Dependências
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Verificação de código

# Deploy
git push origin main  # Deploy automático no Netlify
```

## 📈 Monitoramento

### Métricas de Performance
- **Tempo de Build**: < 2 minutos
- **Tempo de Carregamento**: < 3 segundos
- **Tamanho do Bundle**: ~120kB
- **Lighthouse Score**: 95+

### Logs e Debugging
- **Netlify Logs**: Painel de controle do Netlify
- **GitHub Actions**: Logs de build e deploy
- **Console**: Logs do navegador

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Comunidade Ortodoxa**: Pela inspiração e conteúdo
- **Padres da Filacolia**: Pela sabedoria transmitida
- **Next.js Team**: Pela excelente framework
- **Netlify**: Pela plataforma de deploy

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/ronaldomelofz/filacolia/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/ronaldomelofz/filacolia/wiki)
- **Email**: ronaldomelofz@gmail.com

---

**🚀 O Assistente da Filacolia está pronto para servir a comunidade ortodoxa!**

**✨ Deploy automático via GitHub + Netlify**
