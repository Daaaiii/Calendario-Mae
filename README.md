# CalendarioMae1

Sistema de calendário com autenticação e gerenciamento de atividades, desenvolvido com Angular 20 e arquitetura limpa (Clean Architecture).

## 🚀 Tecnologias

- **Angular 20.3.0** - Framework frontend com Signals e standalone components
- **sql.js** - SQLite no navegador com persistência em localStorage
- **angular-calendar** - Componente de calendário
- **RxJS** - Programação reativa
- **Clean Architecture** - Separação em 4 camadas (Domain/Application/Infrastructure/Presentation)

## 📋 Funcionalidades

- ✅ Calendário interativo com visualização mensal
- ✅ 84 feriados brasileiros (2025-2030)
- ✅ Autenticação com usuários admin
- ✅ CRUD completo de atividades
- ✅ Notificações personalizadas (4 tipos)
- ✅ Confirmação de exclusões
- ✅ Toggle de visibilidade de senha
- ✅ Banco de dados SQLite no navegador
- ✅ Persistência automática em localStorage

## 👥 Usuários Padrão

- **Admin**: `admin` / `admin123`


## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
npm install
```

### Servidor de desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200/`

### Build para produção

```bash
npm run build
```

### Build para GitHub Pages

```bash
npm run build:gh-pages
```

## 🌐 Deploy no GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages via GitHub Actions.

### Configuração inicial

1. **Ativar GitHub Pages no repositório:**
   - Vá em Settings > Pages
   - Em "Source", selecione "GitHub Actions"

2. **Push para master:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin master
   ```

3. **Acompanhar deploy:**
   - Vá na aba "Actions" do repositório
   - O workflow "Deploy to GitHub Pages" será executado automaticamente
   - Após conclusão, acesse: `https://[seu-usuario].github.io/Calendario-Mae/`

### Arquivos de configuração do deploy

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `public/.nojekyll` - Previne Jekyll do GitHub Pages
- `public/404.html` - Suporte a SPA routing
- `src/index.html` - Handler de redirecionamento
- `package.json` - Script `build:gh-pages`

### Como funciona

1. **GitHub Actions** detecta push na branch main
2. Instala dependências (`npm ci`)
3. Faz build com base-href correto (`--base-href /Calendario-Mae/`)
4. Faz upload dos arquivos em `dist/calendario-mae1/browser`
5. Deploy automático no GitHub Pages

### Solução de problemas

**Assets não carregam:**
- Verifique se o base-href está correto no workflow: `/Calendario-Mae/`
- Confirme que o nome do repositório é `Calendario-Mae`

**Rotas não funcionam (404):**
- Verifique se `404.html` e `.nojekyll` estão no diretório `public/`
- Confirme que o script de redirecionamento está no `index.html`

**Build falha:**
- Verifique os logs na aba "Actions"
- Confirme que todas as dependências estão no `package.json`

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── domain/          # Entidades e contratos
│   │   ├── application/     # Casos de uso
│   │   └── infrastructure/  # Implementações (SQLite, Auth)
│   ├── componentes/
│   │   ├── calendar/        # Componente principal do calendário
│   │   ├── activity/        # Modal de atividades
│   │   ├── login/           # Tela de login
│   │   ├── notification/    # Sistema de notificações
│   │   └── confirmation/    # Modais de confirmação
│   └── shared/              # Guards e serviços compartilhados
```

## 🗄️ Banco de Dados

O projeto usa **sql.js** (SQLite no navegador):

- Dados salvos em `localStorage` como JSON
- Versionamento automático (v6 atual)
- Tabelas: `activities` e `users`
- IDs autoincrementais com fallback MAX(id)

### Limpar dados

```javascript
// Console do navegador
localStorage.clear();
location.reload();
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
