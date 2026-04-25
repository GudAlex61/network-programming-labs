
    (function() {
      let expression = '';
      let currentNumber = '';
      let waitingForNewNumber = false;

      const MAX_INT_LENGTH = 10;
      const MAX_FRAC_LENGTH = 6;
      const MAX_TOTAL_LENGTH = 15;

      const output = document.getElementById('result');
      const historyList = document.getElementById('historyList');

      function updateDisplay(value) {
        output.innerHTML = value !== '' ? value : '0';
      }

      function isNumberValid(numStr) {
        if (numStr === '') return true;
        if (numStr.length > MAX_TOTAL_LENGTH) {
          alert(`Число не может быть длиннее ${MAX_TOTAL_LENGTH} символов`);
          return false;
        }
        let [intPart, fracPart] = numStr.split('.');
        if (intPart === undefined) intPart = numStr;
        if (fracPart === undefined) fracPart = '';
        if (intPart.length > MAX_INT_LENGTH) {
          alert(`Целая часть не может содержать более ${MAX_INT_LENGTH} цифр`);
          return false;
        }
        if (fracPart.length > MAX_FRAC_LENGTH) {
          alert(`Дробная часть не может содержать более ${MAX_FRAC_LENGTH} цифр`);
          return false;
        }
        return true;
      }

      function trimFraction(numStr) {
        let [intPart, fracPart] = numStr.split('.');
        if (intPart === undefined) intPart = numStr;
        if (fracPart === undefined) fracPart = '';
        if (intPart.length > MAX_INT_LENGTH) {
          alert('Число слишком большое (целая часть превышает лимит)');
          return null;
        }
        if (fracPart.length > MAX_FRAC_LENGTH) {
          fracPart = fracPart.slice(0, MAX_FRAC_LENGTH);
        }
        let trimmed = intPart;
        if (fracPart !== '') trimmed += '.' + fracPart;
        else if (numStr.includes('.')) trimmed += '.';
        if (trimmed.length > MAX_TOTAL_LENGTH) {
          alert('Число слишком большое (превышает общую длину)');
          return null;
        }
        return trimmed;
      }

      function addDigit(digit) {
        if (waitingForNewNumber) {
          currentNumber = '';
          waitingForNewNumber = false;
        }
        if (currentNumber === '0' && digit !== '.') {
          currentNumber = digit;
          updateDisplay(currentNumber);
          return;
        }
        if (digit === '.' && currentNumber === '') {
          currentNumber = '0.';
          updateDisplay(currentNumber);
          return;
        }
        if (digit === '.' && currentNumber.includes('.')) return;
        let candidate = currentNumber + digit;
        if (!isNumberValid(candidate)) return;
        currentNumber = candidate;
        updateDisplay(currentNumber);
      }

      function addOperator(op) {
        if (currentNumber === '' && expression !== '') {
          let lastChar = expression.slice(-1);
          if (['+', '-', 'x', '/'].includes(lastChar)) {
            expression = expression.slice(0, -1) + op;
          }
          return;
        }
        if (currentNumber !== '') {
          expression += currentNumber + op;
          waitingForNewNumber = true;
        }
      }

      function calculate() {
        if (currentNumber !== '') {
          expression += currentNumber;
        } else if (expression === '') {
          return;
        }
        if (expression === '' || ['+', '-', 'x', '/'].includes(expression.slice(-1))) {
          return;
        }
        let result = evaluateExpression(expression);
        if (result === null) return;
        let resultStr = result.toString();
        let trimmed = trimFraction(resultStr);
        if (trimmed === null) return;
        let historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `<span class="history-expr">${expression}</span> <span class="history-result">= ${trimmed}</span>`;
        historyList.prepend(historyItem);
        if (historyList.children.length > 20) {
          historyList.removeChild(historyList.lastChild);
        }
        currentNumber = trimmed;
        expression = '';
        waitingForNewNumber = true;
        updateDisplay(currentNumber);
      }

      function evaluateExpression(expr) {
        expr = expr.replace(/x/g, '*');
        let tokens = [];
        let numStr = '';
        let lastWasOperator = true; // для определения унарного минуса
        for (let i = 0; i < expr.length; i++) {
          let ch = expr[i];
          if (('0123456789.').includes(ch)) {
            numStr += ch;
            lastWasOperator = false;
          } else if (['+', '-', '*', '/'].includes(ch)) {
            if (numStr !== '') {
              tokens.push(parseFloat(numStr));
              numStr = '';
            }
            if (ch === '-' && lastWasOperator) {
              // унарный минус — начинаем новое число с минуса
              numStr = '-';
            } else {
              tokens.push(ch);
            }
            // после оператора lastWasOperator становится true, но для унарного минуса мы уже начали число,
            // поэтому для следующего символа lastWasOperator должен оставаться false? Но мы обработали унарный минус как начало числа,
            // значит lastWasOperator нужно сбросить? Нет, потому что сам '-' уже обработан, и следующий символ будет частью числа.
            // В этой реализации после унарного минуса мы не пушим оператор, а начинаем число, поэтому lastWasOperator должен стать false,
            // но мы его устанавливаем ниже. Лучше управлять lastWasOperator явно.
            // Упростим: будем считать, что после любого оператора (включая унарный минус, который мы начали как число) lastWasOperator = false? Нет.
            // Перепишем логику понятнее.
          }
        }
        // Используем улучшенный алгоритм с явным флагом для унарного минуса
        // Перепишем функцию с нуля для ясности.
        return evaluateExpressionFixed(expr);
      }

      // Переопределим функцию полностью с правильной обработкой унарного минуса
      function evaluateExpressionFixed(expr) {
        expr = expr.replace(/x/g, '*');
        let tokens = [];
        let numStr = '';
        let i = 0;
        while (i < expr.length) {
          let ch = expr[i];
          if (('0123456789.').includes(ch)) {
            numStr += ch;
            i++;
          } else if (['+', '-', '*', '/'].includes(ch)) {
            if (numStr !== '') {
              tokens.push(parseFloat(numStr));
              numStr = '';
            }
            // Проверка на унарный минус
            if (ch === '-') {
              // если предыдущий токен был оператором или это начало выражения, то это унарный минус
              let prevToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
              if (prevToken === null || (typeof prevToken === 'string' && ['+', '-', '*', '/'].includes(prevToken))) {
                // унарный минус: начинаем новое число со знаком минус
                numStr = '-';
                i++;
                // продолжаем собирать число
                while (i < expr.length && ('0123456789.').includes(expr[i])) {
                  numStr += expr[i];
                  i++;
                }
                // после окончания числа добавляем его
                if (numStr !== '' && numStr !== '-') {
                  tokens.push(parseFloat(numStr));
                  numStr = '';
                } else {
                  // ошибка: минус без числа
                  alert('Некорректное выражение');
                  return null;
                }
                continue; // уже обработали следующий символ
              }
            }
            // обычный бинарный оператор
            tokens.push(ch);
            i++;
          } else {
            // неизвестный символ
            i++;
          }
        }
        if (numStr !== '') {
          tokens.push(parseFloat(numStr));
        }

        // Алгоритм сортировочной станции
        let output = [];
        let stack = [];
        let precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

        for (let token of tokens) {
          if (typeof token === 'number') {
            output.push(token);
          } else if (['+', '-', '*', '/'].includes(token)) {
            while (stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[token]) {
              output.push(stack.pop());
            }
            stack.push(token);
          }
        }
        while (stack.length > 0) {
          output.push(stack.pop());
        }

        // Вычисление RPN
        let calcStack = [];
        for (let token of output) {
          if (typeof token === 'number') {
            calcStack.push(token);
          } else {
            let b = calcStack.pop();
            let a = calcStack.pop();
            if (a === undefined || b === undefined) return null;
            switch (token) {
              case '+': calcStack.push(a + b); break;
              case '-': calcStack.push(a - b); break;
              case '*': calcStack.push(a * b); break;
              case '/':
                if (b === 0) {
                  alert('Деление на ноль');
                  return null;
                }
                calcStack.push(a / b);
                break;
            }
          }
        }
        return calcStack.length > 0 ? calcStack[0] : null;
      }

      function applyUnary(func) {
        if (currentNumber === '') return;
        let num = parseFloat(currentNumber);
        let result = func(num);
        if (result !== null) {
          let resultStr = result.toString();
          let trimmed = trimFraction(resultStr);
          if (trimmed === null) return;
          currentNumber = trimmed;
          updateDisplay(currentNumber);
          waitingForNewNumber = false;
        }
      }

      function clearAll() {
        expression = '';
        currentNumber = '';
        waitingForNewNumber = false;
        updateDisplay('0');
      }

      const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');
      digitButtons.forEach(btn => {
        btn.onclick = () => addDigit(btn.innerHTML);
      });

      document.getElementById('btn_op_plus').onclick = () => addOperator('+');
      document.getElementById('btn_op_minus').onclick = () => addOperator('-');
      document.getElementById('btn_op_mult').onclick = () => addOperator('x');
      document.getElementById('btn_op_div').onclick = () => addOperator('/');

      document.getElementById('btn_op_equal').onclick = calculate;
      document.getElementById('btn_op_clear').onclick = clearAll;

      document.getElementById('btn_op_sign').onclick = () => {
        applyUnary(x => -x);
      };
      document.getElementById('btn_op_percent').onclick = () => {
        applyUnary(x => x / 100);
      };
      document.getElementById('btn_backspace').onclick = () => {
        if (currentNumber.length > 0) {
          currentNumber = currentNumber.slice(0, -1);
          updateDisplay(currentNumber || '0');
        }
      };
      document.getElementById('btn_sqrt').onclick = () => {
        applyUnary(x => {
          if (x < 0) {
            alert('Корень из отрицательного числа');
            return null;
          }
          return Math.sqrt(x);
        });
      };
      document.getElementById('btn_square').onclick = () => {
        applyUnary(x => x * x);
      };
      document.getElementById('btn_factorial').onclick = () => {
        applyUnary(x => {
          if (!Number.isInteger(x) || x < 0) {
            alert('Факториал только для целых неотрицательных чисел');
            return null;
          }
          if (x > 170) {
            alert('Слишком большое число');
            return null;
          }
          let fact = 1;
          for (let i = 2; i <= x; i++) fact *= i;
          return fact;
        });
      };

      clearAll();
    })();
