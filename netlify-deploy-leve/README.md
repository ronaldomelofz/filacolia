# 📚 Assistente da Filacolia

Um assistente de IA conversacional que permite consultar e explorar os textos dos Padres da Igreja Ortodoxa através da Filacolia.

## ✨ Características

- **Diálogo Natural**: Sistema de conversação em duas etapas (resposta sucinta + detalhes completos)
- **Base de Conhecimento Completa**: Acesso a todos os volumes da Filacolia
- **Interface Moderna**: Design responsivo e intuitivo
- **Busca Inteligente**: Encontra informações relevantes nos textos
- **Sem Dependências Externas**: Funciona completamente offline

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Tailwind CSS, Shadcn/UI
- **Backend**: API Routes do Next.js
- **Deploy**: Netlify
- **Processamento**: Node.js

## 📁 Estrutura do Projeto

```
filacolia-ai-search/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # API de chat
│   │   ├── page.tsx             # Página principal
│   │   └── layout.tsx           # Layout da aplicação
│   └── components/ui/           # Componentes UI
├── textos-extraidos/            # Base de conhecimento
├── netlify.toml                 # Configuração do Netlify
├── next.config.js               # Configuração do Next.js
└── package.json                 # Dependências
```

## 🛠️ Instalação Local

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd filacolia-ai-search
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Execute em desenvolvimento**
   ```bash
   pnpm dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🚀 Deploy no Netlify

### Método 1: Deploy Automático (Recomendado)

1. **Conecte seu repositório** ao Netlify
2. **Configure as variáveis de build**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

### Método 2: Deploy Manual

1. **Faça o build do projeto**
   ```bash
   pnpm build
   ```

2. **Faça upload** da pasta `.next` para o Netlify

## 📋 Configurações do Netlify

O projeto inclui um arquivo `netlify.toml` com as configurações otimizadas:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = ".netlify/functions"
```

## 🎯 Como Usar

1. **Faça uma pergunta** sobre os textos da Filacolia
2. **Receba uma resposta sucinta** inicial
3. **Clique em "Ver mais detalhes"** para informações completas
4. **Explore os trechos** relacionados à sua pergunta

### Exemplos de Perguntas

- "O que é a oração do coração?"
- "Como os Padres ensinam sobre a humildade?"
- "Fale sobre a vida ascética"
- "O que significa vigilância espiritual?"

## 🔧 Funcionalidades Técnicas

### Sistema de Busca
- **Divisão em Trechos**: Textos divididos em segmentos menores para busca precisa
- **Relevância**: Algoritmo de pontuação baseado em palavras-chave
- **Cache**: Base de conhecimento carregada uma vez e mantida em memória

### API de Chat
- **Endpoint**: `/api/chat`
- **Método**: POST
- **Parâmetros**:
  - `messages`: Array de mensagens
  - `requestType`: 'sucinta' ou 'completa'

### Interface Responsiva
- **Design Mobile-First**: Otimizado para dispositivos móveis
- **Tema Escuro/Claro**: Suporte automático ao tema do sistema
- **Acessibilidade**: Componentes acessíveis e navegação por teclado

## 📊 Base de Conhecimento

A aplicação utiliza os seguintes volumes da Filacolia:

- **Introdução**: Sobre a Filacolia
- **Tomo 1, Volume 1-3**: Textos dos Padres
- **Tomo 2, Volume 1-4**: Textos dos Padres

**Total**: 15.494 trechos de conhecimento

## 🐛 Solução de Problemas

### Erro de Build
```bash
# Limpe o cache
rm -rf .next
pnpm build
```

### Problemas de API
- Verifique se os arquivos estão em `textos-extraidos/`
- Confirme que o Node.js versão 18 está sendo usado

### Problemas no Netlify
- Verifique as configurações no `netlify.toml`
- Confirme que o build está passando localmente

## 📝 Licença

Este projeto é de uso educacional e religioso, baseado nos textos da Filacolia.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação técnica
- Verifique os logs de erro

---

**Desenvolvido com ❤️ para a comunidade ortodoxa**
