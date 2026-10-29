# 🐍 CalcPython - Calculadora Interativa

Uma calculadora interativa e pedagógica desenvolvida no Google AI Studio com foco em usabilidade, lógica de programação clara, tratamento amigável de exceções e histórico completo da sessão.

O projeto conta tanto com uma **aplicação web moderna e interativa** (com interface visual e emulador de terminal CLI integrado) quanto com um **script Python 3 puro e autocontido (`calc.py`)**, pronto para execução em linha de comando.

---

## 🎯 Problema que a Aplicação Resolve

- **Perda de cálculos intermediários:** Permite ao usuário auditar e acompanhar o histórico de operações realizadas na mesma sessão, com opções de repetir qualquer cálculo ou reaproveitar o resultado anterior.
- **Mensagens de erro amigáveis:** Evita falhas silenciosas ou mensagens técnicas indecifráveis, tratando com clareza situações como divisão por zero (`ZeroDivisionError`) e caracteres não numéricos.
- **Didática e aprendizado prático:** Demonstra na prática conceitos fundamentais de desenvolvimento de software: estruturas condicionais, funções puras, laços de repetição (`while True`), imutabilidade de estado e tratamento de exceções.

---

## 👥 Público-Alvo

- **Estudantes e aprendizes de programação:** Que buscam compreender lógica condicional, funções modulares e manipulação de fluxos de entrada e saída.
- **Profissionais e usuários rotineiros:** Que precisam de uma calculadora confiável com histórico rastreável para conferências rápidas.
- **Instrutores e educadores:** Que desejam um exemplo prático de boas práticas de arquitetura de software e testes de aceitação.

---

## ⚡ Funcionalidades Principais

- [x] **5 Operações Matemáticas:**
  - `+` Adição (Tecla `1` ou `+`)
  - `−` Subtração (Tecla `2` ou `-`)
  - `×` Multiplicação (Tecla `3` ou `*`)
  - `÷` Divisão (Tecla `4` ou `/`)
  - `%` Porcentagem (Tecla `5` ou `%`)
- [x] **Validação Flexível de Números:** Suporta números inteiros e decimais usando tanto ponto (`15.5`) quanto vírgula (`15,5`).
- [x] **Tratamento de Exceções (`ZeroDivisionError`):** Intercepta divisões por zero e exibe explicações orientativas sem interromper o sistema.
- [x] **Histórico da Sessão:**
  - Numeração sequencial (`#1`, `#2`, ...) e timestamp de cada cálculo.
  - Ação **"Repetir"** para recarregar qualquer cálculo anterior nos campos de entrada.
  - Ação **"Copiar"** para a área de transferência.
  - Ação **"Limpar Histórico"** com diálogo de confirmação.
- [x] **Encadeamento de Cálculos:** Botão *"Usar no Próximo Cálculo"* para alimentar o resultado obtido diretamente no próximo operando.
- [x] **Terminal CLI Python Integrado:** Emulador no navegador que reproduz linha a linha o comportamento de um terminal Linux/Mac/Windows executando `python3 calc.py`.
- [x] **Bateria de Testes Automatizados:** Painel interativo com os 7 critérios de aceite (CT-01 a CT-07) verificáveis em tempo de execução com 1 clique.
- [x] **Exportação do Script Python:** Visualização do código-fonte completo com botão para copiar ou baixar o arquivo `calc.py`.

---

## 🧪 Critérios de Aceite e Testes (CT-01 a CT-07)

| ID | Cenário de Teste | Entrada Exemplo | Resultado Esperado | Status |
| :---: | :--- | :--- | :--- | :---: |
| **CT-01** | Operações Básicas | `15 + 27`, `100 - 35.5`, `8 × 7`, `50 / 4` | Resultados matemáticos exatos (`42`, `64.5`, `56`, `12.5`) | ✅ Aprovado |
| **CT-02** | Divisão por Zero | `10 ÷ 0` | Captura de `ZeroDivisionError` com alerta explicativo | ✅ Aprovado |
| **CT-03** | Entrada Inválida | `"abc"` ou símbolos especiais | Rejeição imediata com solicitação de valor numérico válido | ✅ Aprovado |
| **CT-04** | Registro no Histórico | Executar cálculos sucessivos | Todos os cálculos listados ordenadamente com timestamp | ✅ Aprovado |
| **CT-05** | Limpeza do Histórico | Acionar opção de limpar | Esvaziamento seguro da lista de histórico | ✅ Aprovado |
| **CT-06** | Continuidade do Loop | Novo cálculo após resultado | Reutilização do resultado anterior sem perda de sessão | ✅ Aprovado |
| **CT-07** | Encerramento Gracioso | Opção de sair / finalizar | Encerramento cordial preservando dados da sessão | ✅ Aprovado |

---

## 📂 Estrutura do Projeto

```text
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Barra de navegação, abas e reinício de sessão
│   │   ├── VisualCalculator.tsx    # Calculadora visual com suporte a atalhos
│   │   ├── HistoryPanel.tsx        # Painel lateral e gaveta móvel de histórico
│   │   ├── PythonTerminal.tsx      # Emulador de terminal interativo Python CLI
│   │   ├── TestSuitesModal.tsx     # Bateria dos 7 testes de aceitação automatizados
│   │   └── PythonCodeModal.tsx     # Visualizador e exportador do arquivo calc.py
│   ├── types/
│   │   └── calculator.ts           # Interfaces TypeScript (cálculos, operações e histórico)
│   ├── utils/
│   │   ├── calculator.ts           # Motor de cálculo, validações e tratamento de erros
│   │   └── pythonScript.ts         # Código-fonte Python 3 independente
│   ├── App.tsx                     # Orquestrador do estado global da aplicação
│   ├── main.tsx                    # Ponto de entrada React
│   └── index.css                   # Configurações globais do Tailwind CSS
├── calc.py                         # Script executável standalone em Python 3
├── package.json                    # Dependências e scripts do projeto web
└── README.md                       # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto

### Opção 1: Executar o Script Python no Terminal (CLI)

Se você possui o **Python 3** instalado em sua máquina:

1. Baixe ou acesse o arquivo `calc.py` (disponível também na aba *Código calc.py* da aplicação web);
2. Abra o terminal na pasta do arquivo e execute:

```bash
python3 calc.py
```

3. Siga as instruções do menu interativo exibido no console.

---

### Opção 2: Executar a Aplicação Web Localmente

Se você deseja rodar a interface interativa completa:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/calcpython.git
   # (Substitua SEU_USUARIO pelo seu nome de usuário no GitHub)
   cd calcpython
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Abra o navegador no endereço exibido (geralmente `http://localhost:3000`).

---

## 🛠️ Tecnologias Utilizadas

- **Python 3:** Lógica de controle de fluxo, tipagem por anotações, tratamento de exceções (`try/except`) e manipulação de listas e dicionários.
- **React 19 & TypeScript:** Construção da interface declarativa, tipagem estática rigorosa e gerenciamento de estados.
- **Tailwind CSS v4:** Estilização moderna e responsiva.
- **Lucide Icons & Motion:** Ícones semânticos e transições fluidas de interface.
- **Vite:** Ferramenta de build rápida e leve.

---


Desenvolvido com o Google AI Studio.
