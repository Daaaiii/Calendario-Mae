# 🔐 Sistema de Autenticação e Autorização

## 📋 Visão Geral

O sistema implementa autenticação e autorização seguindo os princípios de **Clean Architecture** e **SOLID**, garantindo que apenas usuários administradores possam criar, editar e excluir atividades no calendário.

## 🏗️ Arquitetura

### Domain Layer (Domínio)
```
core/domain/
├── entities/
│   └── user.entity.ts          # Entidade User, LoginCredentials, AuthResult
└── repositories/
    └── auth.repository.ts      # Interface abstrata do repositório
```

### Application Layer (Aplicação)
```
core/application/use-cases/
├── login.use-case.ts           # Caso de uso: Login
├── logout.use-case.ts          # Caso de uso: Logout
└── get-current-user.use-case.ts # Caso de uso: Obter usuário atual
```

### Infrastructure Layer (Infraestrutura)
```
infrastructure/repositories/
└── local-storage-auth.repository.ts  # Implementação com localStorage
```

### Presentation Layer (Apresentação)
```
presentation/
├── state/
│   └── auth-state.manager.ts   # Gerenciador de estado reativo
├── guards/
│   └── auth.guard.ts           # Guards de rota (authGuard, adminGuard)
└── componentes/
    └── login/                  # Componente de login
```

## 🔑 Credenciais Padrão

**Usuário Administrador:**
- **Usuário:** `admin`
- **Senha:** `admin123`

## 🚀 Funcionalidades

### ✅ Autenticação
- Login com validação de credenciais
- Logout com limpeza de sessão
- Persistência de sessão no localStorage
- Feedback visual de erros de login

### ✅ Autorização
- Controle de acesso baseado em roles (admin/viewer)
- Proteção de ações de edição/exclusão
- Bloqueio de duplo clique para criar eventos (apenas admin)
- UI adaptativa baseada em permissões

### ✅ Interface do Usuário
- Badge de usuário no header do calendário
- Botões de Login/Logout
- Mensagem de não autorizado no formulário
- Campos desabilitados para usuários não-admin
- Redirecionamento automático após login

## 📱 Fluxo de Autenticação

### 1. Login
```
Usuário → Tela de Login → Validação → AuthStateManager → LoginUseCase → AuthRepository
```

### 2. Proteção de Ações
```
Usuário clica duplo → Calendar verifica isAdmin() → Permite/Bloqueia criação
Usuário clica evento → Activity mostra/oculta botões baseado em isAdmin()
```

### 3. Logout
```
Usuário clica Sair → AuthStateManager → LogoutUseCase → AuthRepository → Limpa sessão
```

## 🔒 Níveis de Permissão

### Administrador (admin)
✅ Visualizar todas as atividades  
✅ Criar novas atividades (duplo clique)  
✅ Editar atividades existentes  
✅ Excluir atividades  
✅ Acesso total ao calendário  

### Visualizador (viewer) / Não autenticado
✅ Visualizar todas as atividades  
✅ Ver detalhes das atividades (somente leitura)  
❌ Criar novas atividades  
❌ Editar atividades  
❌ Excluir atividades  

## 🛡️ Guards de Rota

### `authGuard`
Verifica se o usuário está autenticado. Se não estiver, redireciona para `/login`.

```typescript
// Uso nas rotas
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard]
}
```

### `adminGuard`
Verifica se o usuário é administrador. Se não for, redireciona para `/`.

```typescript
// Uso nas rotas
{
  path: 'admin/settings',
  component: SettingsComponent,
  canActivate: [adminGuard]
}
```

## 💾 Armazenamento

O sistema usa **localStorage** para armazenar:

### Usuários Cadastrados
```javascript
Key: calendar_users
Value: Array de objetos { id, username, password, role }
```

### Sessão Atual
```javascript
Key: calendar_auth
Value: { user: { id, username, role }, token, timestamp }
```

⚠️ **Nota de Segurança:** Em produção, use:
- Backend real com API REST
- Tokens JWT com expiração
- Senhas com hash (bcrypt, argon2)
- HTTPS obrigatório
- Refresh tokens
- Rate limiting

## 🎨 Componentes Visuais

### LoginComponent
- Formulário de login estilizado
- Validação em tempo real
- Feedback de erro
- Loading state
- Credenciais de demonstração visíveis

### Calendar Header
- Badge do usuário logado
- Botão de Login (quando não autenticado)
- Botão de Logout (quando autenticado)
- Layout responsivo

### Activity Form
- Mensagem de aviso para não-admins
- Campos desabilitados para visualizadores
- Botões de edição/exclusão ocultos para não-admins
- Botão "Fechar" para visualizadores

## 🔧 Como Adicionar Novos Usuários

### Manualmente via Console do Navegador
```javascript
// Obter usuários atuais
const users = JSON.parse(localStorage.getItem('calendar_users'));

// Adicionar novo usuário
users.push({
  id: '2',
  username: 'novo_admin',
  password: 'senha123',
  role: 'admin'
});

// Salvar de volta
localStorage.setItem('calendar_users', JSON.stringify(users));
```

### Via DevTools (Futuro)
```javascript
dev.addUser({ username: 'novo_admin', password: 'senha123', role: 'admin' });
dev.listUsers();
dev.removeUser('2');
```

## 🧪 Testando a Autenticação

### 1. Acesso sem login
- Navegue para o calendário
- Tente dar duplo clique em um dia → Alerta de permissão
- Clique em um evento → Formulário em modo leitura

### 2. Login de administrador
- Clique em "🔐 Login Admin"
- Use: `admin` / `admin123`
- Teste criação/edição/exclusão → Deve funcionar

### 3. Logout
- Clique em "Sair"
- Verifique que os botões de edição desaparecem

## 📊 Estado Reativo

O **AuthStateManager** usa Signals para estado reativo:

```typescript
// Signals disponíveis
authStateManager.currentUser()      // User | null
authStateManager.isAuthenticated()  // boolean
authStateManager.isAdmin()          // boolean
authStateManager.isLoading()        // boolean
authStateManager.error()            // string | null
```

## 🎯 Princípios Aplicados

### SOLID
- **S**ingle Responsibility: Cada use case tem uma responsabilidade
- **O**pen/Closed: Extensível via novos repositórios
- **L**iskov Substitution: Repositórios são intercambiáveis
- **I**nterface Segregation: Interfaces focadas
- **D**ependency Inversion: Depende de abstrações

### Clean Architecture
- **Domain** independente de frameworks
- **Use Cases** encapsulam lógica de negócio
- **Infrastructure** implementa detalhes técnicos
- **Presentation** coordena e apresenta

## 📝 Próximas Melhorias

- [ ] Implementar backend real com API
- [ ] Adicionar refresh tokens
- [ ] Implementar "Lembrar-me"
- [ ] Adicionar recuperação de senha
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria
- [ ] Implementar 2FA (autenticação em dois fatores)
- [ ] Adicionar roles customizáveis
- [ ] Implementar permissões granulares

## 🐛 Troubleshooting

### "Usuário ou senha inválidos"
- Verifique se está usando `admin` / `admin123`
- Limpe o localStorage e recarregue a página

### "Apenas administradores podem criar atividades"
- Faça login com credenciais de admin
- Verifique se o localStorage tem a sessão

### Botões não aparecem após login
- Verifique se o AuthStateManager está sendo injetado
- Recarregue a página

## 📚 Referências

- [Angular Authentication](https://angular.io/guide/router#preventing-unauthorized-access)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
