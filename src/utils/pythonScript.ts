export const PYTHON_SOURCE_CODE = `"""
CalcPython - Calculadora Interativa em Python
Desenvolvida com foco em usabilidade, histórico de sessão e tratamento amigável de erros.
Requisitos: Python 3.8+
"""

from datetime import datetime
import sys

def cabecalho():
    print("=" * 50)
    print("       🐍 CalcPython - Calculadora Interativa       ")
    print("=" * 50)

def exibir_menu():
    print("\\n--- OPERAÇÕES DISPONÍVEIS ---")
    print("1. [+] Soma")
    print("2. [-] Subtração")
    print("3. [*] Multiplicação")
    print("4. [/] Divisão")
    print("5. [%] Porcentagem")
    print("-----------------------------")
    print("H. [H] Ver Histórico da Sessão")
    print("L. [L] Limpar Histórico")
    print("0. [S] Sair do Programa")
    print("-----------------------------")

def ler_numero(mensagem: str) -> float:
    """Lê um número do usuário, aceitando ponto ou vírgula e tratando erros."""
    while True:
        entrada = input(mensagem).strip().replace(',', '.')
        try:
            return float(entrada)
        except ValueError:
            print("⚠️  Entrada inválida! Por favor, digite um número válido (ex: 15 ou 2.5).")

def formatar_numero(valor: float) -> str:
    """Formata inteiros sem casas decimais e floats com precisão limpa."""
    if valor.is_integer():
        return str(int(valor))
    return f"{valor:.6f}".rstrip('0').rstrip('.')

def calcular(num1: float, num2: float, operacao: str):
    """Executa a operação matemática com tratamento de divisão por zero."""
    if operacao in ('1', '+', 'soma'):
        res = num1 + num2
        simb = "+"
    elif operacao in ('2', '-', 'subtracao'):
        res = num1 - num2
        simb = "-"
    elif operacao in ('3', '*', 'multiplicacao'):
        res = num1 * num2
        simb = "*"
    elif operacao in ('4', '/', 'divisao'):
        if num2 == 0:
            raise ZeroDivisionError("Não é possível dividir um número por zero.")
        res = num1 / num2
        simb = "/"
    elif operacao in ('5', '%', 'porcentagem'):
        res = (num1 * num2) / 100
        simb = "%"
    else:
        raise ValueError("Operação desconhecida.")

    return res, simb

def exibir_historico(historico: list):
    """Exibe todos os cálculos realizados na sessão atual."""
    print("\\n📜 --- HISTÓRICO DA SESSÃO ATUAL ---")
    if not historico:
        print("ℹ️  O histórico está vazio. Faça algum cálculo para registrá-lo.")
        return

    for item in historico:
        horario = item['hora'].strftime('%H:%M:%S')
        print(f"#{item['id']} [{horario}] {item['expressao']}")
    print(f"Total de operações registradas: {len(historico)}")

def main():
    cabecalho()
    historico = []
    contador = 1
    ultimo_resultado = None

    while True:
        exibir_menu()
        opcao = input("Selecione uma opção: ").strip().lower()

        if opcao in ('0', 's', 'sair'):
            print("\\n👋 Obrigado por usar a CalcPython! Sessão finalizada com sucesso.")
            break

        if opcao in ('h', 'historico'):
            exibir_historico(historico)
            input("\\nPressione ENTER para continuar...")
            continue

        if opcao in ('l', 'limpar'):
            confirmar = input("Tem certeza de que deseja limpar todo o histórico? (s/n): ").strip().lower()
            if confirmar in ('s', 'sim'):
                historico.clear()
                print("🧹 Histórico de cálculos limpo com sucesso!")
            else:
                print("Operação de limpeza cancelada.")
            input("\\nPressione ENTER para continuar...")
            continue

        if opcao not in ('1', '2', '3', '4', '5', '+', '-', '*', '/', '%'):
            print("⚠️  Opção inválida! Escolha um número de 1 a 5, ou H para histórico, ou 0 para sair.")
            continue

        print("\\n-- ENTRADA DE DADOS --")
        
        # Pergunta se deseja reaproveitar o último resultado
        if ultimo_resultado is not None:
            usar_anterior = input(f"Deseja usar o último resultado ({formatar_numero(ultimo_resultado)}) como 1º número? (s/n): ").strip().lower()
            if usar_anterior in ('s', 'sim'):
                num1 = ultimo_resultado
                print(f"Primeiro número definido como: {formatar_numero(num1)}")
            else:
                num1 = ler_numero("Digite o primeiro número: ")
        else:
            num1 = ler_numero("Digite o primeiro número: ")

        num2 = ler_numero("Digite o segundo número: ")

        # Processamento e tratamento amigável de erros
        try:
            resultado, simbolo = calcular(num1, num2, opcao)
            n1_fmt = formatar_numero(num1)
            n2_fmt = formatar_numero(num2)
            res_fmt = formatar_numero(resultado)
            if simbolo == "%":
                expressao = f"{n1_fmt}% de {n2_fmt} = {res_fmt}"
            else:
                expressao = f"{n1_fmt} {simbolo} {n2_fmt} = {res_fmt}"

            print("\\n" + "=" * 35)
            print(f"✅ RESULTADO: {res_fmt}")
            print(f"📝 Expressão: {expressao}")
            print("=" * 35)

            # Salva no histórico da sessão
            historico.append({
                'id': contador,
                'hora': datetime.now(),
                'expressao': expressao,
                'resultado': resultado
            })
            contador += 1
            ultimo_resultado = resultado

        except ZeroDivisionError as err:
            print(f"\\n❌ ERRO MATEMÁTICO: {err}")
            print("💡 Dica: Na divisão matemática, o divisor (segundo número) deve ser diferente de zero.")

        # Pergunta de fluxo para continuar ou sair
        proximo = input("\\nDeseja realizar um novo cálculo? ([S]im / [N]ão / [H]istórico): ").strip().lower()
        if proximo in ('n', 'nao', 'não', 'sair'):
            print("\\n👋 Sessão encerrada. Até a próxima!")
            break
        elif proximo in ('h', 'historico'):
            exibir_historico(historico)
            input("\\nPressione ENTER para continuar...")

if __name__ == "__main__":
    main()
`;
