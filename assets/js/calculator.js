// ========================================
// CALCULATOR STATE
// ========================================
let display = document.getElementById('display');
let history = document.getElementById('history');
let memoryDisplay = document.getElementById('memoryDisplay');

let currentValue = '0';
let previousValue = '';
let operation = null;
let memory = 0;
let angleMode = 'deg'; // 'deg' or 'rad'
let waitingForOperand = false;
let historyText = '';

// ========================================
// UPDATE DISPLAY
// ========================================
function updateDisplay() {
  display.textContent = currentValue;
  history.textContent = historyText;
  if (memory !== 0) {
    memoryDisplay.textContent = `M:  ${memory}`;
  } else {
    memoryDisplay. textContent = '';
  }
}

// ========================================
// NUMBER INPUT
// ========================================
function inputNumber(num) {
  if (waitingForOperand) {
    currentValue = String(num);
    waitingForOperand = false;
  } else {
    currentValue = currentValue === '0' ? String(num) : currentValue + num;
  }
  updateDisplay();
}

// ========================================
// DECIMAL POINT
// ========================================
function inputDecimal() {
  if (waitingForOperand) {
    currentValue = '0.';
    waitingForOperand = false;
  } else if (currentValue.indexOf('.') === -1) {
    currentValue += '.';
  }
  updateDisplay();
}

// ========================================
// CLEAR FUNCTIONS
// ========================================
function clearAll() {
  currentValue = '0';
  previousValue = '';
  operation = null;
  historyText = '';
  waitingForOperand = false;
  updateDisplay();
}

function clearEntry() {
  currentValue = '0';
  updateDisplay();
}

function backspace() {
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = '0';
  }
  updateDisplay();
}

// ========================================
// BASIC OPERATIONS
// ========================================
function performOperation(nextOperation) {
  const inputValue = parseFloat(currentValue);

  if (previousValue === '') {
    previousValue = inputValue;
  } else if (operation) {
    const result = calculate(previousValue, inputValue, operation);
    currentValue = String(result);
    previousValue = result;
  }

  waitingForOperand = true;
  operation = nextOperation;
  historyText = `${previousValue} ${getOperatorSymbol(nextOperation)}`;
  updateDisplay();
}

function getOperatorSymbol(op) {
  const symbols = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷',
    'power': '^'
  };
  return symbols[op] || op;
}

function calculate(firstOperand, secondOperand, operation) {
  switch (operation) {
    case '+':  return firstOperand + secondOperand;
    case '-': return firstOperand - secondOperand;
    case '*': return firstOperand * secondOperand;
    case '/': return firstOperand / secondOperand;
    case 'power': return Math.pow(firstOperand, secondOperand);
    default: return secondOperand;
  }
}

function equals() {
  const inputValue = parseFloat(currentValue);

  if (operation && previousValue !== '') {
    const result = calculate(previousValue, inputValue, operation);
    historyText = `${previousValue} ${getOperatorSymbol(operation)} ${inputValue} =`;
    currentValue = String(result);
    previousValue = '';
    operation = null;
    waitingForOperand = true;
    updateDisplay();
  }
}

// ========================================
// ANGLE CONVERSION
// ========================================
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function getAngleValue(value) {
  return angleMode === 'deg' ? toRadians(value) : value;
}

// ========================================
// SCIENTIFIC FUNCTIONS
// ========================================
function applyFunction(func) {
  let value = parseFloat(currentValue);
  let result;

  try {
    switch (func) {
      // Trigonometry
      case 'sin': 
        result = Math.sin(getAngleValue(value));
        historyText = `sin(${value})`;
        break;
      case 'cos': 
        result = Math.cos(getAngleValue(value));
        historyText = `cos(${value})`;
        break;
      case 'tan': 
        result = Math.tan(getAngleValue(value));
        historyText = `tan(${value})`;
        break;
      
      // Inverse Trigonometry
      case 'asin':
        result = Math.asin(value);
        result = angleMode === 'deg' ? toDegrees(result) : result;
        historyText = `sin⁻¹(${value})`;
        break;
      case 'acos':
        result = Math.acos(value);
        result = angleMode === 'deg' ? toDegrees(result) : result;
        historyText = `cos⁻¹(${value})`;
        break;
      case 'atan':
        result = Math.atan(value);
        result = angleMode === 'deg' ? toDegrees(result) : result;
        historyText = `tan⁻¹(${value})`;
        break;
      
      // Hyperbolic
      case 'sinh':
        result = Math.sinh(value);
        historyText = `sinh(${value})`;
        break;
      case 'cosh':
        result = Math.cosh(value);
        historyText = `cosh(${value})`;
        break;
      case 'tanh':
        result = Math.tanh(value);
        historyText = `tanh(${value})`;
        break;
      
      // Logarithms
      case 'ln':
        result = Math.log(value);
        historyText = `ln(${value})`;
        break;
      case 'log':
        result = Math.log10(value);
        historyText = `log(${value})`;
        break;
      case 'exp': 
        result = Math.exp(value);
        historyText = `e^${value}`;
        break;
      case 'pow10':
        result = Math.pow(10, value);
        historyText = `10^${value}`;
        break;
      
      // Powers & Roots
      case 'sqrt':
        result = Math.sqrt(value);
        historyText = `√${value}`;
        break;
      case 'cbrt':
        result = Math.cbrt(value);
        historyText = `∛${value}`;
        break;
      case 'square':
        result = value * value;
        historyText = `${value}²`;
        break;
      case 'cube': 
        result = value * value * value;
        historyText = `${value}³`;
        break;
      case 'power':
        previousValue = value;
        operation = 'power';
        waitingForOperand = true;
        historyText = `${value}^`;
        updateDisplay();
        return;
      
      // Other
      case 'factorial':
        result = factorial(value);
        historyText = `${value}!`;
        break;
      case 'abs':
        result = Math. abs(value);
        historyText = `|${value}|`;
        break;
      case 'reciprocal':
        result = 1 / value;
        historyText = `1/${value}`;
        break;
      case 'percent':
        result = value / 100;
        historyText = `${value}%`;
        break;
      
      // Constants
      case 'pi': 
        currentValue = String(Math.PI);
        historyText = 'π';
        updateDisplay();
        return;
      case 'e': 
        currentValue = String(Math.E);
        historyText = 'e';
        updateDisplay();
        return;
      
      // Random
      case 'rand':
        result = Math.random();
        historyText = 'rand()';
        break;
      
      // Combinatorics (placeholder - needs two numbers)
      case 'nPr':
        alert('Enter first number, click nPr, then enter second number and press =');
        return;
      case 'nCr':
        alert('Enter first number, click nCr, then enter second number and press =');
        return;
      
      // Parentheses (placeholder for future expression parser)
      case 'leftParen':
        currentValue += '(';
        updateDisplay();
        return;
      case 'rightParen': 
        currentValue += ')';
        updateDisplay();
        return;
      
      // Modulo
      case 'mod':
        previousValue = value;
        operation = 'mod';
        waitingForOperand = true;
        historyText = `${value} mod`;
        updateDisplay();
        return;
      
      default:
        result = value;
    }

    currentValue = String(result);
    waitingForOperand = true;
    updateDisplay();

  } catch (error) {
    currentValue = 'Error';
    historyText = 'Math Error';
    updateDisplay();
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Prevent overflow
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// ========================================
// MEMORY FUNCTIONS
// ========================================
function memoryAdd() {
  memory += parseFloat(currentValue);
  updateDisplay();
}

function memorySubtract() {
  memory -= parseFloat(currentValue);
  updateDisplay();
}

function memoryRecall() {
  currentValue = String(memory);
  updateDisplay();
}

function memoryClear() {
  memory = 0;
  updateDisplay();
}

// ========================================
// ANGLE MODE TOGGLE
// ========================================
function setAngleMode(mode) {
  angleMode = mode;
  document.getElementById('degBtn').classList.toggle('active', mode === 'deg');
  document.getElementById('radBtn').classList.toggle('active', mode === 'rad');
}

// ========================================
// UPDATE TIME IN MENU BAR
// ========================================
function updateTime() {
  const now = new Date();
  const options = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  };
  const timeString = now.toLocaleString('en-US', options);
  document.getElementById('menuTime').textContent = timeString;
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Update time immediately and every second
  updateTime();
  setInterval(updateTime, 1000);

  // Number buttons
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-value');
      if (value === '. ') {
        inputDecimal();
      } else {
        inputNumber(value);
      }
    });
  });

  // Operator buttons
  document.querySelectorAll('.op-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-value');
      if (value) {
        performOperation(value);
      }
    });
  });

  // Scientific function buttons
  document.querySelectorAll('[data-func]').forEach(btn => {
    btn.addEventListener('click', () => {
      const func = btn.getAttribute('data-func');
      applyFunction(func);
    });
  });

  // Clear buttons
  document.getElementById('ac').addEventListener('click', clearAll);
  document.getElementById('ce').addEventListener('click', clearEntry);
  document.getElementById('backspace').addEventListener('click', backspace);

  // Equals button
  document.getElementById('equals').addEventListener('click', equals);

  // Memory buttons
  document. getElementById('mc').addEventListener('click', memoryClear);
  document.getElementById('mr').addEventListener('click', memoryRecall);
  document.getElementById('mplus').addEventListener('click', memoryAdd);
  document.getElementById('mminus').addEventListener('click', memorySubtract);

  // Angle mode buttons
  document.getElementById('degBtn').addEventListener('click', () => setAngleMode('deg'));
  document.getElementById('radBtn').addEventListener('click', () => setAngleMode('rad'));

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      inputNumber(e.key);
    } else if (e.key === '. ') {
      inputDecimal();
    } else if (e. key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      performOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      equals();
    } else if (e.key === 'Escape') {
      clearAll();
    } else if (e.key === 'Backspace') {
      backspace();
    }
  });

  // Maximize button functionality
  document.getElementById('maximizeBtn').addEventListener('click', () => {
    const window = document.querySelector('.window');
    window.classList.toggle('maximized');
  });
});

// ========================================
// INITIAL DISPLAY
// ========================================
updateDisplay();