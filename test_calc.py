"""
Testes Automatizados da CalcPython (CT-01 a CT-07)
Execute com: python test_calc.py
"""

import unittest
from unittest.mock import patch
import io
import calc


class TestCalcPython(unittest.TestCase):
    def test_ct01_operacoes_basicas_e_porcentagem(self):
        """CT-01: Valida as 5 operações matemáticas (soma, subtração, multiplicação, divisão e porcentagem)."""
        self.assertEqual(calc.calcular(15, 27, '1'), (42, '+'))
        self.assertEqual(calc.calcular(100, 35.5, '2'), (64.5, '-'))
        self.assertEqual(calc.calcular(8, 7, '3'), (56, '*'))
        self.assertEqual(calc.calcular(50, 4, '4'), (12.5, '/'))
        self.assertEqual(calc.calcular(20, 150, '5'), (30.0, '%'))

    def test_ct02_divisao_por_zero(self):
        """CT-02: Verifica se a divisão por zero lança ZeroDivisionError."""
        with self.assertRaises(ZeroDivisionError):
            calc.calcular(10, 0, '4')

    def test_ct03_entrada_invalida_e_virgula(self):
        """CT-03: Garante que entradas inválidas sejam rejeitadas e números com vírgula sejam aceitos."""
        with patch('builtins.input', side_effect=['abc', '@#$', '15,5']), \
             patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            val = calc.ler_numero("Digite: ")
            self.assertEqual(val, 15.5)
            self.assertIn("Entrada inválida", mock_stdout.getvalue())

    def test_ct04_a_ct07_fluxo_completo_sessao(self):
        """CT-04 a CT-07: Testa histórico da sessão, reaproveitamento de resultado, limpeza e encerramento."""
        entradas = [
            '1', '20', '5', 's',      # Soma: 20 + 5 = 25 -> continuar
            '3', 's', '2', 'h', '',   # Multiplicação usando resultado anterior (25 * 2 = 50) -> ver histórico
            'l', 's', '',             # Limpar histórico -> confirmar
            '0'                       # Sair do programa
        ]
        with patch('builtins.input', side_effect=entradas), \
             patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            calc.main()
            saida = mock_stdout.getvalue()
            self.assertIn("20 + 5 = 25", saida)
            self.assertIn("25 * 2 = 50", saida)
            self.assertIn("Total de operações registradas: 2", saida)
            self.assertIn("Histórico de cálculos limpo com sucesso!", saida)
            self.assertIn("Sessão finalizada com sucesso.", saida)


if __name__ == '__main__':
    unittest.main(verbosity=2)
