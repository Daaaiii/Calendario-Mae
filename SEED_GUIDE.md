# 🌱 Guia de Seed do Banco de Dados

## 📋 Sobre os Dados

O seed popula o banco de dados com **33 eventos** de grupos de diversas cidades do Rio Grande do Sul, com datas entre **novembro de 2025** e **dezembro de 2026**.

### Grupos Incluídos:
- Reviver Nova Esperança do Sul (4 eventos)
- Sempre Jovem Uruguaiana - ATAPUR (1 evento)
- Festiva Chapadão (1 evento)
- Alegria de Viver Bossoroca (3 eventos)
- Renascer Quevedo (3 eventos)
- Amor a Vida Jaguari (3 eventos)
- Viver a Vida São Vicente do Sul (3 eventos)
- A Vida é para ser Vivida São Gabriel (3 eventos)
- Raízes de Pedra Mata (1 evento)
- Paz e Amor São Pedro do Sul (1 evento)
- Renascer São Francisco de Assis (4 eventos)
- Anita Garibaldi Restinga Seca (2 eventos)
- Amigos para Viver Alegrete (1 evento)
- Novo Amanhecer Cacequi (1 evento)
- Amigos para Sempre Manuel Viana (2 eventos)

---

## 🚀 Como Usar

### Seed Automático (Primeira Vez)

O seed é executado **automaticamente** na primeira vez que você abre a aplicação, se o banco estiver vazio.

```
✅ Ao abrir a aplicação pela primeira vez:
   → O sistema detecta banco vazio
   → Executa o seed automaticamente
   → Carrega os 33 eventos
```

### Comandos no Console do Navegador

A aplicação expõe comandos úteis no console para gerenciar o seed:

#### 1. Ver Ajuda
```javascript
dev.help()
```
Mostra todos os comandos disponíveis.

#### 2. Executar Seed (Apenas se Vazio)
```javascript
dev.seed()
```
- Popula o banco com os 33 eventos
- **Só funciona se o banco estiver vazio**
- Recarrega a página automaticamente após inserir

#### 3. Forçar Seed (Adicionar Mais Dados)
```javascript
dev.forceSeed()
```
- Adiciona os 33 eventos **mesmo se já existirem dados**
- Útil para testes ou recuperação de dados
- ⚠️ Pode criar duplicatas
- Pede confirmação antes de executar

#### 4. Limpar Banco de Dados
```javascript
dev.clearDatabase()
```
- **⚠️ DELETA TODOS OS DADOS**
- Útil para resetar o banco e começar do zero
- Pede confirmação antes de executar
- Após limpar, você pode executar `dev.seed()` novamente

---

## 📊 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│  1. Aplicação Inicia                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  2. CalendarStateManager.initialize()                   │
│     └─ Chama DatabaseSeeder.seed()                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  3. DatabaseSeeder verifica banco                       │
│     └─ Se vazio: insere 33 eventos                      │
│     └─ Se tem dados: pula o seed                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  4. LoadActivitiesUseCase carrega dados                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  5. Calendário exibe os eventos                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Cenários de Uso

### Cenário 1: Primeira Instalação
```
1. Usuário abre a aplicação
2. Banco está vazio
3. Seed é executado automaticamente
4. Calendário mostra 33 eventos
```

### Cenário 2: Resetar Dados
```
1. Abrir console (F12)
2. Digite: dev.clearDatabase()
3. Confirme a operação
4. Digite: dev.seed()
5. Dados restaurados
```

### Cenário 3: Adicionar Dados de Teste
```
1. Abrir console (F12)
2. Digite: dev.forceSeed()
3. Confirme a operação
4. Mais 33 eventos adicionados
```

### Cenário 4: Desenvolvimento
```
1. Limpar banco: dev.clearDatabase()
2. Testar funcionalidade sem dados
3. Restaurar dados: dev.seed()
```

---

## 📝 Estrutura dos Dados

### Formato do Seed Data
```typescript
{
  title: 'Nome do Grupo',
  date: 'YYYY-MM-DD'
}
```

### Exemplo:
```typescript
{
  title: 'Reviver Nova Esperança do Sul',
  date: '2025-11-30'
}
```

### Arquivo de Origem
`src/app/infrastructure/database/seed-data.ts`

---

## 🔧 Customização

### Adicionar Novos Dados ao Seed

1. Edite o arquivo `seed-data.ts`:
```typescript
export const SEED_DATA = [
  { title: 'Novo Grupo', date: '2026-01-15' },
  // ... outros dados
];
```

2. Salve o arquivo

3. No console:
```javascript
dev.clearDatabase()  // Limpa dados antigos
dev.seed()          // Carrega novos dados
```

### Desabilitar Seed Automático

Edite `calendar-state.manager.ts`:
```typescript
private async initialize(): Promise<void> {
  // Comente esta linha:
  // await this.databaseSeeder.seed();
  
  await this.loadActivities();
}
```

---

## ⚠️ Avisos Importantes

### 1. Persistência de Dados
- Os dados são salvos no **localStorage** do navegador
- **Limpar o localStorage apaga todos os dados**
- Use `dev.seed()` para restaurar

### 2. Duplicatas
- `dev.forceSeed()` pode criar duplicatas
- Para evitar: use `dev.clearDatabase()` antes de `dev.seed()`

### 3. Ambiente de Produção
- As ferramentas de desenvolvimento (`dev.*`) devem ser desabilitadas em produção
- Considere usar variável de ambiente para controlar

---

## 🎯 Resumo dos Comandos

| Comando | Descrição | Quando Usar |
|---------|-----------|-------------|
| `dev.help()` | Mostra ajuda | Sempre que precisar lembrar os comandos |
| `dev.seed()` | Seed inicial | Primeira vez ou após limpar banco |
| `dev.forceSeed()` | Adiciona mais dados | Testes ou recuperação |
| `dev.clearDatabase()` | Limpa tudo | Reset completo |

---

**💡 Dica:** Mantenha o console aberto (F12) durante o desenvolvimento para ver os logs de seed e depuração!
