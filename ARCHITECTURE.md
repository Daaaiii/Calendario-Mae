# Arquitetura do Projeto - Calendário

## 📚 Estrutura do Projeto (Clean Architecture + SOLID)

Este projeto segue os princípios de **Clean Architecture**, **SOLID** e **Clean Code** para garantir manutenibilidade, testabilidade e escalabilidade.

```
src/app/
├── core/                          # Camada de Domínio e Aplicação
│   ├── domain/                    # Regras de negócio
│   │   ├── entities/             # Entidades de domínio
│   │   │   └── activity.entity.ts
│   │   └── repositories/         # Interfaces de repositórios (Ports)
│   │       └── activity.repository.ts
│   ├── application/              # Casos de uso
│   │   └── use-cases/           # Use Cases (Application Business Rules)
│   │       ├── load-activities.use-case.ts
│   │       ├── load-activities-by-date.use-case.ts
│   │       ├── get-activity-by-id.use-case.ts
│   │       ├── save-activity.use-case.ts
│   │       ├── delete-activity.use-case.ts
│   │       └── clear-all-activities.use-case.ts
│   └── core.providers.ts         # Configuração de DI
│
├── infrastructure/               # Camada de Infraestrutura
│   ├── database/                # Implementações de banco de dados
│   │   └── sqlite-database.service.ts
│   └── repositories/            # Implementações de repositórios (Adapters)
│       └── sqlite-activity.repository.ts
│
├── presentation/                # Camada de Apresentação
│   ├── state/                  # Gerenciamento de estado
│   │   └── calendar-state.manager.ts
│   ├── mappers/               # Conversores de dados
│   │   └── calendar-event.mapper.ts
│   └── models/               # DTOs
│       └── activity.dto.ts
│
└── componentes/               # Componentes Angular (UI)
    ├── calendar/
    │   ├── calendar.ts
    │   ├── calendar.html
    │   └── calendar.css
    └── activity/
        ├── activity.ts
        ├── activity.html
        └── activity.css
```

---

## 🎯 Princípios SOLID Aplicados

### **S - Single Responsibility Principle (Responsabilidade Única)**
- ✅ **Activity.entity**: Responsável apenas pelas regras de negócio da entidade
- ✅ **Use Cases**: Cada Use Case tem uma única responsabilidade
- ✅ **SqliteDatabaseService**: Responsável apenas pela gestão do SQLite
- ✅ **CalendarEventMapper**: Responsável apenas pela conversão de dados

### **O - Open/Closed Principle (Aberto/Fechado)**
- ✅ Entidades são imutáveis (usam métodos `create` e `update`)
- ✅ Use Cases podem ser estendidos sem modificar código existente
- ✅ Novos repositórios podem ser adicionados sem alterar o domínio

### **L - Liskov Substitution Principle (Substituição de Liskov)**
- ✅ `SqliteActivityRepository` pode substituir `ActivityRepository` sem quebrar o código
- ✅ Qualquer implementação de `ActivityRepository` funciona com os Use Cases

### **I - Interface Segregation Principle (Segregação de Interface)**
- ✅ `ActivityRepository` define apenas métodos necessários
- ✅ DTOs contêm apenas dados necessários para a UI

### **D - Dependency Inversion Principle (Inversão de Dependência)**
- ✅ Use Cases dependem de `ActivityRepository` (abstração), não de implementações
- ✅ A infraestrutura implementa as interfaces definidas no domínio
- ✅ Injeção de dependência configurada em `core.providers.ts`

---

## 🏗️ Camadas da Arquitetura

### **1. Domain Layer (core/domain/)**
**O QUE É:** Coração da aplicação, contém as regras de negócio.

**RESPONSABILIDADES:**
- Definir entidades de negócio (`Activity`)
- Definir interfaces de repositórios (Ports)
- Validações de negócio
- Lógica de domínio pura (sem dependências externas)

**EXEMPLO:**
```typescript
// Activity.entity.ts
export class Activity {
  private constructor(
    public readonly id: number | undefined,
    public readonly date: string,
    public readonly title: string,
    public readonly description: string
  ) {
    this.validate(); // Validação de regras de negócio
  }

  static create(...) // Factory Method
  update(...) // Imutabilidade
  validate() // Regras de negócio
}
```

---

### **2. Application Layer (core/application/)**
**O QUE É:** Casos de uso da aplicação.

**RESPONSABILIDADES:**
- Orquestrar operações de negócio
- Coordenar entidades e repositórios
- Implementar fluxos de aplicação

**EXEMPLO:**
```typescript
// save-activity.use-case.ts
@Injectable()
export class SaveActivityUseCase {
  private repository = inject(ActivityRepository);

  async execute(params: {...}): Promise<Activity> {
    // Lógica de aplicação
    const activity = Activity.create(params);
    return await this.repository.save(activity);
  }
}
```

---

### **3. Infrastructure Layer (infrastructure/)**
**O QUE É:** Implementações concretas de tecnologias.

**RESPONSABILIDADES:**
- Implementar interfaces do domínio
- Acessar banco de dados
- Comunicação com APIs externas

**EXEMPLO:**
```typescript
// sqlite-activity.repository.ts
@Injectable()
export class SqliteActivityRepository extends ActivityRepository {
  private db = inject(SqliteDatabaseService);

  async findAll(): Promise<Activity[]> {
    const rows = await this.db.executeQuery('SELECT ...');
    return rows.map(row => Activity.fromPersistence(...));
  }
}
```

---

### **4. Presentation Layer (presentation/)**
**O QUE É:** Gerenciamento de estado e preparação de dados para UI.

**RESPONSABILIDADES:**
- Gerenciar estado reativo (Signals)
- Converter entidades para DTOs
- Coordenar Use Cases para a UI

**EXEMPLO:**
```typescript
// calendar-state.manager.ts
@Injectable()
export class CalendarStateManager {
  private loadActivitiesUseCase = inject(LoadActivitiesUseCase);
  
  private state = signal<CalendarState>({...});
  
  async loadActivities(): Promise<void> {
    const activities = await this.loadActivitiesUseCase.execute();
    this.setActivities(activities);
  }
}
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                      UI COMPONENT                           │
│                     (calendar.ts)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                             │
│            (CalendarStateManager)                           │
│  - Gerencia estado reativo                                  │
│  - Coordena Use Cases                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER                              │
│              (Use Cases)                                    │
│  - SaveActivityUseCase                                      │
│  - LoadActivitiesUseCase                                    │
│  - DeleteActivityUseCase                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              DOMAIN LAYER                                   │
│  - Activity (Entity)                                        │
│  - ActivityRepository (Interface)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE LAYER                           │
│  - SqliteActivityRepository                                 │
│  - SqliteDatabaseService                                    │
│  - localStorage                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Benefícios da Arquitetura

### **Testabilidade**
- ✅ Use Cases podem ser testados isoladamente
- ✅ Repositórios podem ser mockados facilmente
- ✅ Lógica de negócio isolada da infraestrutura

### **Manutenibilidade**
- ✅ Código organizado por responsabilidades
- ✅ Fácil localizar e modificar funcionalidades
- ✅ Mudanças em uma camada não afetam outras

### **Escalabilidade**
- ✅ Novos Use Cases podem ser adicionados facilmente
- ✅ Trocar SQLite por outro banco requer apenas nova implementação
- ✅ UI pode ser substituída sem alterar lógica de negócio

### **Reutilização**
- ✅ Use Cases podem ser usados em diferentes contextos
- ✅ Entidades de domínio reutilizáveis
- ✅ Repositórios podem ter múltiplas implementações

---

## 📝 Convenções de Código

### **Nomenclatura**
- **Entities**: `*.entity.ts` (ex: `activity.entity.ts`)
- **Use Cases**: `*.use-case.ts` (ex: `save-activity.use-case.ts`)
- **Repositories**: `*.repository.ts` (ex: `activity.repository.ts`)
- **DTOs**: `*.dto.ts` (ex: `activity.dto.ts`)
- **Mappers**: `*.mapper.ts` (ex: `calendar-event.mapper.ts`)

### **Estrutura de Classes**
1. Propriedades privadas
2. Propriedades públicas
3. Constructor
4. Métodos públicos
5. Métodos privados

### **Comentários**
- JSDoc para classes e métodos públicos
- Comentários explicativos para lógica complexa
- Emojis nos logs (✅, ❌) para melhor visualização

---

## 🚀 Como Adicionar Novas Funcionalidades

### **1. Nova Entidade de Domínio**
```typescript
// core/domain/entities/new-entity.entity.ts
export class NewEntity {
  private constructor(...) { }
  static create(...) { }
  validate() { }
}
```

### **2. Novo Repositório**
```typescript
// core/domain/repositories/new-entity.repository.ts
export abstract class NewEntityRepository {
  abstract findAll(): Promise<NewEntity[]>;
  abstract save(entity: NewEntity): Promise<NewEntity>;
}
```

### **3. Novo Use Case**
```typescript
// core/application/use-cases/new-action.use-case.ts
@Injectable()
export class NewActionUseCase {
  private repository = inject(NewEntityRepository);
  
  async execute(...): Promise<...> {
    // Implementação
  }
}
```

### **4. Implementação de Repositório**
```typescript
// infrastructure/repositories/sqlite-new-entity.repository.ts
@Injectable()
export class SqliteNewEntityRepository extends NewEntityRepository {
  // Implementação
}
```

### **5. Atualizar Providers**
```typescript
// core/core.providers.ts
export const CORE_PROVIDERS: Provider[] = [
  { provide: NewEntityRepository, useClass: SqliteNewEntityRepository }
];
```

---

## 📚 Referências

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Angular Architecture Patterns](https://angular.io/guide/architecture)

---

**Desenvolvido com ❤️ seguindo as melhores práticas de engenharia de software**
