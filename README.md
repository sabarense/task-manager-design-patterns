# Gerenciador de Tarefas com Padrões de Projeto

Este é um projeto de Gerenciador de Tarefas desenvolvido em JavaScript, HTML e CSS, com foco em aplicar e demonstrar diversos **Padrões de Projeto** clássicos de software.

## 💡 Objetivo

O objetivo deste projeto é demonstrar, de forma prática, a aplicação dos seguintes padrões de projeto:

- **Factory Method**
- **Decorator**
- **Observer**
- **Singleton**
- **Adapter**
- **Strategy**

## 🚀 Funcionalidades

- **Criar, visualizar e excluir tarefas** de diferentes tipos (Pessoal, Trabalho, Estudo, Lazer)
- **Aplicar decoradores** às tarefas (alta prioridade, etiqueta colorida, data de vencimento, tarefa opcional)
- **Notificações** por diferentes canais (tela, email simulado, log)
- **Exportar tarefas para CSV** (com suporte a caracteres especiais)
- **Ordenar tarefas** por data de criação ou tipo (Strategy Pattern)
- **Gerenciamento centralizado** das tarefas (Singleton Pattern)

## 🛠️ Padrões de Projeto Utilizados

### 1. Factory Method
Responsável por criar instâncias de diferentes tipos de tarefas de forma flexível e centralizada.

### 2. Decorator
Permite adicionar funcionalidades extras às tarefas (como prioridade, etiquetas, etc.) sem alterar a estrutura original das classes.

### 3. Observer
Permite que múltiplos observadores sejam notificados automaticamente sobre mudanças no status das tarefas (ex: mostrar toast, simular email, log).

### 4. Singleton
Garante que o gerenciador de tarefas (`TaskManager`) tenha apenas uma instância em toda a aplicação.

### 5. Adapter
Permite exportar tarefas para o formato CSV, adaptando o objeto de tarefa para uma representação textual compatível.

### 6. Strategy
Permite alternar dinamicamente a forma de ordenação das tarefas (por data ou por tipo), encapsulando cada algoritmo de ordenação em uma classe separada.

## 🖥️ Como usar

1. git clone https://github.com/sabarense/task-manager-design-patterns.git
2. Abra o arquivo `index.html` em seu navegador.
3. Crie tarefas, aplique decoradores, mude a ordenação, exporte para CSV e veja as notificações em ação!

## 📚 Demonstração dos Padrões

- **Criar tarefa:** Usa Factory Method e adiciona ao Singleton.
- **Aplicar decorador:** Usa Decorator Pattern para adicionar recursos à tarefa.
- **Alterar status:** Notifica todos os Observers (Observer Pattern).
- **Exportar CSV:** Usa Adapter para gerar arquivo compatível.
- **Ordenar tarefas:** Usa Strategy Pattern para alternar algoritmos de ordenação.

## 📝 Observações

- O projeto é 100% front-end e não requer backend.
- O código está comentado para facilitar o entendimento dos padrões aplicados.
- O Adapter já exporta o CSV com suporte a caracteres especiais (UTF-8 com BOM).

## 👥 Autores

- [Yan Sabarense](https://github.com/sabarense)
- [Sophia Carrazza](https://github.com/sophiacarrazza)

