// script.js - Calculadora simples
(function(){
  const displayEl = document.getElementById('display');
  const historyEl = document.getElementById('history');
  const keys = document.querySelectorAll('.keys .btn');

  let current = '0';
  let previous = '';
  let operator = null;
  let resetNext = false;

  function updateDisplay(){
    displayEl.textContent = current;
    historyEl.textContent = previous + (operator ? ' ' + operatorSymbol(operator) : '');
  }

  function operatorSymbol(op){
    switch(op){
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '';
    }
  }

  function inputNumber(num){
    if(resetNext){
      current = (num === '.') ? '0.' : num;
      resetNext = false;
      return;
    }
    if(num === '.'){
      if(current.includes('.')) return;
      current += '.';
    } else {
      current = (current === '0') ? num : current + num;
    }
  }

  function handleOperator(op){
    if(operator && !resetNext){
      compute();
    }
    previous = current;
    operator = op;
    resetNext = true;
  }

  function compute(){
    if(!operator || previous === '') return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result = 0;
    switch(operator){
      case 'add': result = a + b; break;
      case 'subtract': result = a - b; break;
      case 'multiply': result = a * b; break;
      case 'divide':
        result = b === 0 ? 'Erro' : a / b;
        break;
    }
    current = (typeof result === 'number') ? String(roundNumber(result)) : String(result);
    previous = '';
    operator = null;
    resetNext = true;
  }

  function roundNumber(n){
    // evita longas casas decimais
    return Math.round((n + Number.EPSILON) * 100000000) / 100000000;
  }

  function clearAll(){
    current = '0';
    previous = '';
    operator = null;
    resetNext = false;
  }

  function backspace(){
    if(resetNext){
      current = '0';
      resetNext = false;
      return;
    }
    if(current.length <= 1 || (current.length === 2 && current.startsWith('-'))){
      current = '0';
    } else {
      current = current.slice(0, -1);
    }
  }

  function percent(){
    current = String(parseFloat(current) / 100);
  }

  keys.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.num;
      const action = btn.dataset.action;

      if(num !== undefined){
        inputNumber(num);
        updateDisplay();
        return;
      }

      switch(action){
        case 'clear': clearAll(); break;
        case 'back': backspace(); break;
        case 'percent': percent(); break;
        case 'add': handleOperator('add'); break;
        case 'subtract': handleOperator('subtract'); break;
        case 'multiply': handleOperator('multiply'); break;
        case 'divide': handleOperator('divide'); break;
        case 'equals': compute(); break;
      }
      updateDisplay();
    });
  });

  // Suporte ao teclado
  window.addEventListener('keydown', (e) => {
    if(e.key >= '0' && e.key <= '9'){ inputNumber(e.key); updateDisplay(); return; }
    if(e.key === '.') { inputNumber('.'); updateDisplay(); return; }
    if(e.key === 'Enter' || e.key === '=') { compute(); updateDisplay(); return; }
    if(e.key === 'Backspace') { backspace(); updateDisplay(); return; }
    if(e.key === 'Escape') { clearAll(); updateDisplay(); return; }
    if(e.key === '+'){ handleOperator('add'); updateDisplay(); return; }
    if(e.key === '-'){ handleOperator('subtract'); updateDisplay(); return; }
    if(e.key === '*' || e.key === 'x'){ handleOperator('multiply'); updateDisplay(); return; }
    if(e.key === '/' || e.key === ':'){ handleOperator('divide'); updateDisplay(); return; }
    if(e.key === '%'){ percent(); updateDisplay(); return; }
  });

  // inicializa
  updateDisplay();
})();
