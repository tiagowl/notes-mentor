# Notes Mentor

Uma aplicação moderna de gerenciamento de notas construída com React, TypeScript e Vite.

## 🚀 Funcionalidades

- ✅ Criar, editar e deletar notas
- 🔍 Busca por título, conteúdo ou tags
- ⭐ Sistema de favoritos
- 🏷️ Sistema de tags com cores personalizadas
- 📁 Sistema de projetos organizacionais
- ✏️ Editor de texto rico (Rich Text Editor)
- 💾 Armazenamento local (localStorage)
- 🌙 Modo escuro/claro
- 📱 Design responsivo
- 🎨 Interface moderna e intuitiva

## 🛠️ Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **React Quill** - Editor de texto rico
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização com variáveis CSS

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd notes-mentor
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🏗️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter ESLint
- `npm run deploy` - Build e preview da aplicação

## 📁 Estrutura do Projeto

```
notes-mentor/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── NoteCard.tsx
│   │   ├── NoteForm.tsx
│   │   └── SearchBar.tsx
│   ├── hooks/
│   │   └── useNotes.ts
│   ├── types/
│   │   └── Note.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Como Usar

1. **Criar uma nota**: Clique no botão "Nova Nota" no cabeçalho
2. **Editar uma nota**: Clique no ícone de edição em qualquer nota
3. **Deletar uma nota**: Clique no ícone de lixeira e confirme
4. **Marcar como favorito**: Clique na estrela em qualquer nota
5. **Buscar notas**: Use a barra de busca para encontrar notas por título, conteúdo ou tags
6. **Filtrar favoritos**: Use o botão "Favoritos" para mostrar apenas notas favoritas

## 🚀 Deploy

### Opções de Deploy

#### 1. **Vercel** (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy de produção
vercel --prod
```

#### 2. **Netlify**
```bash
# Build local
npm run build

# Arrastar pasta 'dist' para netlify.com/drop
# Ou conectar repositório GitHub no Netlify
```

#### 3. **GitHub Pages**
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script no package.json
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### 4. **Firebase Hosting**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login e inicializar
firebase login
firebase init hosting

# Deploy
firebase deploy
```

### Configurações Incluídas

- ✅ `vercel.json` - Configuração para Vercel
- ✅ `netlify.toml` - Configuração para Netlify
- ✅ Build otimizado para produção
- ✅ SPA routing configurado

## 💾 Armazenamento

As notas são salvas automaticamente no localStorage do navegador, permitindo que você mantenha suas notas mesmo após fechar o navegador.

## 🎨 Personalização

O projeto usa variáveis CSS para facilitar a personalização de cores e estilos. Você pode modificar as variáveis no arquivo `src/App.css`:

```css
:root {
  --primary-color: #3b82f6;
  --background-color: #f8fafc;
  --surface-color: #ffffff;
  /* ... outras variáveis */
}
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
