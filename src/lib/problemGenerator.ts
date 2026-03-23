import { Problem } from "./types";

// ══════════════════════════════════════════════════════════════════
// GENERADOR DE PROBLEMAS ALEATORIOS
// Genera problemas parametrizados por tema y dificultad (1-5)
// ══════════════════════════════════════════════════════════════════

let _counter = 0;
function uid(topic: string): string {
  return `rnd-${topic}-${++_counter}`;
}

// ── Utilidades numéricas ──
function ri(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
function frac(n: number, d: number): string {
  const g = gcd(n, d);
  let sn = n / g,
    sd = d / g;
  if (sd < 0) {
    sn = -sn;
    sd = -sd;
  }
  if (sd === 1) return `${sn}`;
  return `\\frac{${sn}}{${sd}}`;
}
type Gen = (d: number) => Problem;

// ══════════════════════════════════════════════════════════════════
// LEVEL 0: ARITMÉTICA
// ══════════════════════════════════════════════════════════════════

const genBasicOps: Gen = (d) => {
  const tid = "t-0-1";
  const sizes = [
    [1, 20],
    [10, 100],
    [50, 500],
    [100, 9999],
    [1000, 99999],
  ];
  const [lo, hi] = sizes[d - 1];
  const op = pick(d <= 2 ? ["+", "-", "\\times"] : ["+", "-", "\\times", "\\div"]);
  let a = ri(lo, hi),
    b = ri(lo, hi);
  let ans: number;
  let statement: string;

  if (op === "\\div") {
    ans = ri(2, Math.min(hi, 50));
    b = ri(2, Math.min(Math.floor(hi / ans), 30));
    a = ans * b;
    statement = `Calcula: $${a} \\div ${b}$`;
    return prob(tid, d, statement, `${ans}`,
      `Piensa: ¿cuántas veces cabe $${b}$ en $${a}$?`,
      `$${a} \\div ${b} = \\frac{${a}}{${b}}$. Simplifica.`,
      `$${a} \\div ${b} = ${ans}$ porque $${b} \\times ${ans} = ${a}$`);
  }

  if (op === "-" && a < b) [a, b] = [b, a];
  ans = op === "+" ? a + b : op === "-" ? a - b : a * b;
  statement = `Calcula: $${a} ${op} ${b}$`;
  return prob(tid, d, statement, `${ans}`,
    op === "\\times" ? `Descompón: $${a} \\times ${b}$. Prueba multiplicar por partes.` : `Realiza la operación de ${op === "+" ? "suma" : "resta"} paso a paso.`,
    op === "\\times" ? `$${a} \\times ${b}$: multiplica las unidades, luego las decenas...` : `Alinea las cifras y opera columna por columna.`,
    `$${a} ${op} ${b} = ${ans}$`);
};

const genFractions: Gen = (d) => {
  const tid = "t-0-2";
  if (d <= 2) {
    // Same or simple denominator addition/subtraction
    const den = pick([2, 3, 4, 5, 6, 8]);
    const n1 = ri(1, den - 1);
    const n2 = ri(1, den - 1);
    const op = pick(["+", "-"]);
    const resN = op === "+" ? n1 + n2 : n1 - n2;
    if (op === "-" && resN < 0) return genFractions(d); // retry to keep positive
    const ans = frac(resN, den);
    return prob(tid, d,
      `Calcula: $${frac(n1, den)} ${op} ${frac(n2, den)}$`,
      ans,
      `Cuando los denominadores son iguales, solo opera los numeradores.`,
      `$\\frac{${n1} ${op} ${n2}}{${den}}$`,
      `$${frac(n1, den)} ${op} ${frac(n2, den)} = \\frac{${n1} ${op === "+" ? "+" : "-"} ${n2}}{${den}} = ${ans}$`);
  }
  if (d <= 3) {
    // Different denominators
    const d1 = pick([2, 3, 4, 5]);
    const d2 = pick([3, 4, 5, 6, 7].filter((x) => x !== d1));
    const n1 = ri(1, d1 - 1);
    const n2 = ri(1, d2 - 1);
    const lcm = (d1 * d2) / gcd(d1, d2);
    const resN = n1 * (lcm / d1) + n2 * (lcm / d2);
    const ans = frac(resN, lcm);
    return prob(tid, d,
      `Calcula: $${frac(n1, d1)} + ${frac(n2, d2)}$`,
      ans,
      `Encuentra el mínimo común denominador de $${d1}$ y $${d2}$.`,
      `El MCM es $${lcm}$. Convierte ambas fracciones: $\\frac{${n1 * (lcm / d1)}}{${lcm}} + \\frac{${n2 * (lcm / d2)}}{${lcm}}$`,
      `$${frac(n1, d1)} + ${frac(n2, d2)} = \\frac{${n1 * (lcm / d1)} + ${n2 * (lcm / d2)}}{${lcm}} = ${ans}$`);
  }
  // d >= 4: multiplication/division
  const n1 = ri(1, 7), d1 = ri(2, 9);
  const n2 = ri(1, 7), d2 = ri(2, 9);
  const op = d === 4 ? "\\times" : "\\div";
  let resN: number, resD: number;
  if (op === "\\times") {
    resN = n1 * n2;
    resD = d1 * d2;
  } else {
    resN = n1 * d2;
    resD = d1 * n2;
  }
  const ans = frac(resN, resD);
  const statementOp = op === "\\times" ? "\\times" : "\\div";
  return prob(tid, d,
    `Calcula: $${frac(n1, d1)} ${statementOp} ${frac(n2, d2)}$`,
    ans,
    op === "\\times" ? `Multiplica numerador con numerador y denominador con denominador.` : `Para dividir fracciones, multiplica por el recíproco.`,
    op === "\\times" ? `$\\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}}$ y simplifica.` : `$\\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}}$ y simplifica.`,
    op === "\\times"
      ? `$${frac(n1, d1)} \\times ${frac(n2, d2)} = \\frac{${n1 * n2}}{${d1 * d2}} = ${ans}$`
      : `$${frac(n1, d1)} \\div ${frac(n2, d2)} = ${frac(n1, d1)} \\times ${frac(d2, n2)} = ${ans}$`);
};

const genDecimals: Gen = (d) => {
  const tid = "t-0-3";
  const places = d <= 2 ? 1 : 2;
  const factor = Math.pow(10, places);
  const a = ri(1 * factor, 99 * factor) / factor;
  const b = ri(1 * factor, 50 * factor) / factor;
  const op = d <= 3 ? pick(["+", "-"]) : pick(["\\times", "+"]);
  let ans: number;
  if (op === "+") ans = +(a + b).toFixed(places);
  else if (op === "-") ans = +(Math.max(a, b) - Math.min(a, b)).toFixed(places);
  else ans = +(a * b).toFixed(places * 2);
  const aa = op === "-" ? Math.max(a, b) : a;
  const bb = op === "-" ? Math.min(a, b) : b;
  return prob(tid, d,
    `Calcula: $${aa} ${op} ${bb}$`,
    `${ans}`,
    `Alinea los puntos decimales antes de operar.`,
    op === "\\times" ? `Multiplica sin decimales y luego coloca ${places * 2} decimales en el resultado.` : `Opera columna por columna desde la derecha.`,
    `$${aa} ${op} ${bb} = ${ans}$`);
};

const genPercentages: Gen = (d) => {
  const tid = "t-0-4";
  if (d <= 2) {
    const pct = pick([10, 15, 20, 25, 30, 50, 75]);
    const base = ri(2, 20) * 10;
    const ans = (pct * base) / 100;
    return prob(tid, d, `¿Cuánto es el $${pct}\\%$ de $${base}$?`, `${ans}`,
      `$${pct}\\% = \\frac{${pct}}{100}$`,
      `Multiplica $${base} \\times \\frac{${pct}}{100}$`,
      `$${base} \\times \\frac{${pct}}{100} = ${ans}$`);
  }
  if (d <= 3) {
    const part = ri(5, 50);
    const whole = ri(part + 10, 200);
    const pct = +((part / whole) * 100).toFixed(1);
    return prob(tid, d, `¿Qué porcentaje es $${part}$ de $${whole}$?`, `${pct}\\%`,
      `Porcentaje $= \\frac{\\text{parte}}{\\text{total}} \\times 100$`,
      `$\\frac{${part}}{${whole}} \\times 100$`,
      `$\\frac{${part}}{${whole}} \\times 100 = ${pct}\\%$`);
  }
  // Discount/increase
  const price = ri(5, 100) * 10;
  const pct = pick([10, 15, 20, 25, 30]);
  const isDiscount = d === 4;
  const change = (pct * price) / 100;
  const ans = isDiscount ? price - change : price + change;
  return prob(tid, d,
    isDiscount
      ? `Un artículo cuesta $\\$${price}$ y tiene un descuento del $${pct}\\%$. ¿Cuál es el precio final?`
      : `Un artículo cuesta $\\$${price}$ y sube un $${pct}\\%$. ¿Cuál es el nuevo precio?`,
    `${ans}`,
    `Calcula primero el ${pct}\\% de $${price}$.`,
    `$${price} \\times \\frac{${pct}}{100} = ${change}$. Luego ${isDiscount ? "resta" : "suma"}.`,
    `$${price} ${isDiscount ? "-" : "+"} ${change} = ${ans}$`);
};

const genPEMDAS: Gen = (d) => {
  const tid = "t-0-5";
  let expr: string, ans: number;
  if (d <= 2) {
    const a = ri(2, 10), b = ri(2, 10), c = ri(1, 5);
    ans = a + b * c;
    expr = `${a} + ${b} \\times ${c}`;
  } else if (d === 3) {
    const a = ri(2, 8), b = ri(1, 5), c = ri(2, 6), e = ri(1, 4);
    ans = (a + b) * (c - e);
    if (c - e <= 0) return genPEMDAS(d);
    expr = `(${a} + ${b}) \\times (${c + (c <= e ? e + 1 : 0)} - ${e})`;
    ans = (a + b) * (c + (c <= e ? e + 1 : 0) - e);
  } else if (d === 4) {
    const a = ri(2, 6), b = ri(1, 4), c = ri(2, 5), e = ri(1, 3);
    ans = a ** 2 + b * c - e;
    expr = `${a}^2 + ${b} \\times ${c} - ${e}`;
  } else {
    const a = ri(2, 5), b = ri(2, 4), c = ri(1, 3), e = ri(2, 4);
    ans = (a ** 2 + b) * c - e;
    expr = `(${a}^2 + ${b}) \\times ${c} - ${e}`;
  }
  return prob(tid, d, `Evalúa: $${expr}$`, `${ans}`,
    `Recuerda: Paréntesis, Exponentes, Multiplicación/División, Suma/Resta.`,
    `Resuelve primero lo que está entre paréntesis y los exponentes.`,
    `$${expr} = ${ans}$`);
};

const genRatios: Gen = (d) => {
  const tid = "t-0-6";
  const a = ri(2, 12 * d);
  const b = ri(2, 12 * d);
  const c = ri(2, 15 * d);
  const ans = +((a * c) / b).toFixed(2);
  return prob(tid, d,
    `Si $${a}$ corresponde a $${b}$, ¿cuánto corresponde a $${c}$?$ (regla de tres directa)`,
    `${ans}`,
    `Usa la regla de tres: $\\frac{${a}}{${b}} = \\frac{x}{${c}}$`,
    `Despeja: $x = \\frac{${a} \\times ${c}}{${b}}$`,
    `$x = \\frac{${a} \\times ${c}}{${b}} = \\frac{${a * c}}{${b}} = ${ans}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 1: PRE-ÁLGEBRA
// ══════════════════════════════════════════════════════════════════

const genIntegers: Gen = (d) => {
  const tid = "t-1-1";
  if (d <= 3) {
    const a = ri(-20 * d, 20 * d);
    const b = ri(-20 * d, 20 * d);
    const op = pick(["+", "-", "\\times"]);
    const ans = op === "+" ? a + b : op === "-" ? a - b : a * b;
    const sa = a < 0 ? `(${a})` : `${a}`;
    const sb = b < 0 ? `(${b})` : `${b}`;
    return prob(tid, d, `Calcula: $${sa} ${op} ${sb}$`, `${ans}`,
      `Recuerda las reglas de signos: negativo × negativo = positivo.`,
      op === "\\times" ? `Multiplica los valores absolutos y determina el signo.` : `Opera considerando los signos.`,
      `$${sa} ${op} ${sb} = ${ans}$`);
  }
  const a = ri(-30, 30);
  const b = ri(-30, 30);
  const expr = d === 4 ? `|${a}| + |${b}|` : `|${a} + ${b}| - |${a} - ${b}|`;
  const ans = d === 4 ? Math.abs(a) + Math.abs(b) : Math.abs(a + b) - Math.abs(a - b);
  return prob(tid, d, `Calcula: $${expr}$`, `${ans}`,
    `$|x|$ es la distancia de $x$ al cero: siempre positiva.`,
    `Calcula lo de dentro del valor absoluto primero.`,
    `$${expr} = ${ans}$`);
};

const genPowersRoots: Gen = (d) => {
  const tid = "t-1-2";
  if (d <= 2) {
    const base = ri(2, 10);
    const exp = pick([2, 3]);
    const ans = base ** exp;
    return prob(tid, d, `Calcula: $${base}^{${exp}}$`, `${ans}`,
      `$${base}^{${exp}}$ significa multiplicar $${base}$ por sí mismo $${exp}$ veces.`,
      `$${base} \\times ${base}${exp === 3 ? ` \\times ${base}` : ``}$`,
      `$${base}^{${exp}} = ${ans}$`);
  }
  if (d === 3) {
    const perfect = pick([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]);
    const ans = Math.sqrt(perfect);
    return prob(tid, d, `Calcula: $\\sqrt{${perfect}}$`, `${ans}`,
      `Busca qué número multiplicado por sí mismo da $${perfect}$.`,
      `$? \\times ? = ${perfect}$`,
      `$\\sqrt{${perfect}} = ${ans}$ porque $${ans}^2 = ${perfect}$`);
  }
  // d >= 4: cube roots, mixed
  const base = ri(2, 5);
  const cube = base ** 3;
  return prob(tid, d, `Calcula: $\\sqrt[3]{${cube}}$`, `${base}`,
    `$\\sqrt[3]{n}$ es el número que al cubo da $n$.`,
    `$?^3 = ${cube}$. Prueba con números pequeños.`,
    `$\\sqrt[3]{${cube}} = ${base}$ porque $${base}^3 = ${cube}$`);
};

const genVariables: Gen = (d) => {
  const tid = "t-1-3";
  const x = ri(-5 * d, 5 * d);
  if (d <= 2) {
    const a = ri(1, 10), b = ri(1, 10);
    const ans = a * x + b;
    return prob(tid, d,
      `Si $x = ${x}$, evalúa: $${a}x + ${b}$`,
      `${ans}`,
      `Sustituye $x$ por $${x}$ en la expresión.`,
      `$${a}(${x}) + ${b}$`,
      `$${a}(${x}) + ${b} = ${a * x} + ${b} = ${ans}$`);
  }
  const a = ri(1, 5), b = ri(1, 5), c = ri(1, 5);
  const ans = a * x * x + b * x + c;
  return prob(tid, d,
    `Si $x = ${x}$, evalúa: $${a}x^2 + ${b}x + ${c}$`,
    `${ans}`,
    `Sustituye $x = ${x}$ y calcula $x^2$ primero.`,
    `$${a}(${x})^2 + ${b}(${x}) + ${c} = ${a * x * x} + ${b * x} + ${c}$`,
    `$${a}(${x})^2 + ${b}(${x}) + ${c} = ${a * x * x} + ${b * x} + ${c} = ${ans}$`);
};

const genOneStep: Gen = (d) => {
  const tid = "t-1-4";
  const x = ri(-10 * d, 10 * d);
  const type = pick(d <= 2 ? ["add", "sub"] : ["add", "sub", "mul", "div"]);
  const b = ri(1, 10 * d);
  let statement: string, hint1: string, hint2: string, sol: string;
  if (type === "add") {
    const rhs = x + b;
    statement = `Resuelve: $x + ${b} = ${rhs}$`;
    hint1 = `Resta $${b}$ de ambos lados.`;
    hint2 = `$x = ${rhs} - ${b}$`;
    sol = `$x + ${b} = ${rhs} \\Rightarrow x = ${rhs} - ${b} = ${x}$`;
  } else if (type === "sub") {
    const rhs = x - b;
    statement = `Resuelve: $x - ${b} = ${rhs}$`;
    hint1 = `Suma $${b}$ a ambos lados.`;
    hint2 = `$x = ${rhs} + ${b}$`;
    sol = `$x - ${b} = ${rhs} \\Rightarrow x = ${rhs} + ${b} = ${x}$`;
  } else if (type === "mul") {
    const a = ri(2, 8);
    const rhs = a * x;
    statement = `Resuelve: $${a}x = ${rhs}$`;
    hint1 = `Divide ambos lados entre $${a}$.`;
    hint2 = `$x = \\frac{${rhs}}{${a}}$`;
    sol = `$${a}x = ${rhs} \\Rightarrow x = \\frac{${rhs}}{${a}} = ${x}$`;
  } else {
    const a = ri(2, 6);
    const rhs = x; // x/a = rhs => x = rhs*a
    const lhs = x * a;
    statement = `Resuelve: $\\frac{x}{${a}} = ${rhs}$`;
    hint1 = `Multiplica ambos lados por $${a}$.`;
    hint2 = `$x = ${rhs} \\times ${a}$`;
    sol = `$\\frac{x}{${a}} = ${rhs} \\Rightarrow x = ${rhs} \\times ${a} = ${lhs}$`;
    return prob(tid, d, statement, `${lhs}`, hint1, hint2, sol);
  }
  return prob(tid, d, statement, `${x}`, hint1, hint2, sol);
};

const genInequalities: Gen = (d) => {
  const tid = "t-1-5";
  const a = ri(2, 6 + d);
  const b = ri(1, 15 * d);
  const rhs = ri(1, 20 * d);
  const comp = pick(["<", ">", "\\leq", "\\geq"]);
  // ax + b < rhs  =>  x < (rhs - b) / a
  const val = (rhs - b) / a;
  const valStr = Number.isInteger(val) ? `${val}` : frac(rhs - b, a);
  const solComp = comp.replace("<", "<").replace(">", ">");
  return prob(tid, d,
    `Resuelve: $${a}x + ${b} ${comp} ${rhs}$`,
    `x ${solComp} ${valStr}`,
    `Resta $${b}$ de ambos lados primero.`,
    `$${a}x ${comp} ${rhs - b}$. Ahora divide entre $${a}$.`,
    `$${a}x + ${b} ${comp} ${rhs} \\Rightarrow ${a}x ${comp} ${rhs - b} \\Rightarrow x ${solComp} ${valStr}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 2: ÁLGEBRA I
// ══════════════════════════════════════════════════════════════════

const genExponentRules: Gen = (d) => {
  const tid = "t-2-1";
  const base = pick(["x", "a", "y"]);
  const m = ri(2, 4 + d);
  const n = ri(2, 4 + d);
  const rule = pick(d <= 2 ? ["product", "quotient"] : ["product", "quotient", "power"]);
  if (rule === "product") {
    return prob(tid, d,
      `Simplifica: $${base}^{${m}} \\cdot ${base}^{${n}}$`,
      `${base}^{${m + n}}`,
      `Cuando multiplicas potencias con la misma base, suma los exponentes.`,
      `$${base}^{${m}+${n}}$`,
      `$${base}^{${m}} \\cdot ${base}^{${n}} = ${base}^{${m}+${n}} = ${base}^{${m + n}}$`);
  }
  if (rule === "quotient") {
    const big = Math.max(m, n) + ri(1, 3);
    return prob(tid, d,
      `Simplifica: $\\frac{${base}^{${big}}}{${base}^{${n}}}$`,
      `${base}^{${big - n}}`,
      `Cuando divides potencias con la misma base, resta los exponentes.`,
      `$${base}^{${big}-${n}}$`,
      `$\\frac{${base}^{${big}}}{${base}^{${n}}} = ${base}^{${big}-${n}} = ${base}^{${big - n}}$`);
  }
  return prob(tid, d,
    `Simplifica: $(${base}^{${m}})^{${n}}$`,
    `${base}^{${m * n}}`,
    `Potencia de una potencia: multiplica los exponentes.`,
    `$${base}^{${m} \\times ${n}}$`,
    `$(${base}^{${m}})^{${n}} = ${base}^{${m} \\times ${n}} = ${base}^{${m * n}}$`);
};

const genPolynomials: Gen = (d) => {
  const tid = "t-2-2";
  // Addition/subtraction of polynomials
  const a = ri(1, 5 + d), b = ri(1, 5 + d), c = ri(1, 5 + d);
  const e = ri(1, 5 + d), f = ri(1, 5 + d), g = ri(1, 5 + d);
  const op = pick(["+", "-"]);
  const ra = op === "+" ? a + e : a - e;
  const rb = op === "+" ? b + f : b - f;
  const rc = op === "+" ? c + g : c - g;
  const polyStr = (x: number, y: number, z: number) => {
    let s = `${x}x^2`;
    s += y >= 0 ? ` + ${y}x` : ` - ${Math.abs(y)}x`;
    s += z >= 0 ? ` + ${z}` : ` - ${Math.abs(z)}`;
    return s;
  };
  return prob(tid, d,
    `Calcula: $(${a}x^2 + ${b}x + ${c}) ${op} (${e}x^2 + ${f}x + ${g})$`,
    polyStr(ra, rb, rc),
    `Agrupa los términos del mismo grado.`,
    `$x^2$: $${a} ${op} ${e} = ${ra}$; $x$: $${b} ${op} ${f} = ${rb}$; constante: $${c} ${op} ${g} = ${rc}$`,
    `$(${a}x^2 + ${b}x + ${c}) ${op} (${e}x^2 + ${f}x + ${g}) = ${polyStr(ra, rb, rc)}$`);
};

const genFactoring: Gen = (d) => {
  const tid = "t-2-3";
  // Factor x² + bx + c = (x + p)(x + q) where p+q=b, p*q=c
  const p = ri(-8 - d, 8 + d);
  const q = ri(-8 - d, 8 + d);
  if (p === 0 || q === 0) return genFactoring(d);
  const b = p + q;
  const c = p * q;
  const termB = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`;
  const termC = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
  const factorStr = (v: number) => (v >= 0 ? `(x + ${v})` : `(x - ${Math.abs(v)})`);
  return prob(tid, d,
    `Factoriza: $x^2${termB}${termC}$`,
    `${factorStr(p)}${factorStr(q)}`,
    `Busca dos números que sumados den $${b}$ y multiplicados den $${c}$.`,
    `$p + q = ${b}$ y $p \\times q = ${c}$. Prueba con $${p}$ y $${q}$.`,
    `$x^2${termB}${termC} = ${factorStr(p)}${factorStr(q)}$ porque $${p} + ${q} = ${b}$ y $${p} \\times ${q} = ${c}$`);
};

const genLinearEq: Gen = (d) => {
  const tid = "t-2-4";
  const x = ri(-10 * d, 10 * d);
  const a = ri(2, 5 + d);
  const b = ri(1, 15 * d);
  const c = d >= 3 ? ri(1, 5) : 0;
  const rhs = a * x + b - c * x;
  if (c === 0) {
    return prob(tid, d,
      `Resuelve: $${a}x + ${b} = ${a * x + b}$`,
      `${x}`,
      `Aísla el término con $x$: resta $${b}$.`,
      `$${a}x = ${a * x + b} - ${b} = ${a * x}$. Divide entre $${a}$.`,
      `$${a}x + ${b} = ${a * x + b} \\Rightarrow ${a}x = ${a * x} \\Rightarrow x = ${x}$`);
  }
  return prob(tid, d,
    `Resuelve: $${a}x + ${b} = ${c}x + ${rhs}$`,
    `${x}`,
    `Mueve los términos con $x$ a un lado y las constantes al otro.`,
    `$${a}x - ${c}x = ${rhs} - ${b}$, es decir $${a - c}x = ${rhs - b}$`,
    `$${a}x - ${c}x = ${rhs} - ${b} \\Rightarrow ${a - c}x = ${rhs - b} \\Rightarrow x = ${x}$`);
};

const genSystems: Gen = (d) => {
  const tid = "t-2-5";
  const x = ri(-5 - d, 5 + d);
  const y = ri(-5 - d, 5 + d);
  const a1 = ri(1, 3 + d), b1 = ri(1, 3 + d);
  const a2 = ri(1, 3 + d), b2 = ri(1, 3 + d);
  if (a1 * b2 === a2 * b1) return genSystems(d); // avoid dependent system
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  return prob(tid, d,
    `Resuelve el sistema:\\\\$${a1}x + ${b1}y = ${c1}$\\\\$${a2}x + ${b2}y = ${c2}$`,
    `x=${x}, y=${y}`,
    `Usa eliminación o sustitución. Intenta multiplicar una ecuación para eliminar una variable.`,
    `Multiplica la primera ecuación por $${b2}$ y la segunda por $${b1}$ para eliminar $y$.`,
    `De la primera: $x = \\frac{${c1} - ${b1}y}{${a1}}$. Sustituyendo: $x = ${x}$, $y = ${y}$`);
};

const genQuadratics: Gen = (d) => {
  const tid = "t-2-6";
  // ax² + bx + c = 0 with integer roots
  const r1 = ri(-8 - d, 8 + d);
  const r2 = ri(-8 - d, 8 + d);
  const a = d >= 4 ? ri(2, 3) : 1;
  const b = -a * (r1 + r2);
  const c_val = a * r1 * r2;
  const termA = a === 1 ? "x^2" : `${a}x^2`;
  const termB = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`;
  const termC = c_val === 0 ? "" : c_val > 0 ? ` + ${c_val}` : ` - ${Math.abs(c_val)}`;
  const sorted = [r1, r2].sort((a, b) => a - b);
  const ansStr = sorted[0] === sorted[1] ? `x = ${sorted[0]}` : `x = ${sorted[0]}, x = ${sorted[1]}`;
  const disc = b * b - 4 * a * c_val;
  return prob(tid, d,
    `Resuelve: $${termA}${termB}${termC} = 0$`,
    ansStr,
    `Usa la fórmula cuadrática: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$`,
    `$a=${a}$, $b=${b}$, $c=${c_val}$. Discriminante: $${b}^2 - 4(${a})(${c_val}) = ${disc}$`,
    `$x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}} = \\frac{${-b} \\pm ${Math.round(Math.sqrt(Math.abs(disc)))}}{${2 * a}}$. Soluciones: $${ansStr}$`);
};

const genAbsValue: Gen = (d) => {
  const tid = "t-2-7";
  const a = ri(1, 3 + d);
  const b = ri(-10 * d, 10 * d);
  const c = ri(1, 15 * d);
  // |ax + b| = c => ax + b = c or ax + b = -c
  const x1 = (c - b) / a;
  const x2 = (-c - b) / a;
  const x1Str = Number.isInteger(x1) ? `${x1}` : frac(c - b, a);
  const x2Str = Number.isInteger(x2) ? `${x2}` : frac(-c - b, a);
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  return prob(tid, d,
    `Resuelve: $|${a === 1 ? "" : a}x ${bStr}| = ${c}$`,
    `x = ${x1Str}, x = ${x2Str}`,
    `Si $|A| = c$, entonces $A = c$ o $A = -c$.`,
    `Caso 1: $${a}x ${bStr} = ${c}$. Caso 2: $${a}x ${bStr} = -${c}$.`,
    `Caso 1: $x = ${x1Str}$. Caso 2: $x = ${x2Str}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 3: ÁLGEBRA II
// ══════════════════════════════════════════════════════════════════

const genFunctions: Gen = (d) => {
  const tid = "t-3-1";
  const a = ri(1, 5), b = ri(-5, 10), c = ri(-5, 5);
  const x = ri(-4, 6);
  if (d <= 3) {
    const ans = a * x + b;
    return prob(tid, d,
      `Si $f(x) = ${a}x + ${b < 0 ? `(${b})` : b}$, calcula $f(${x})$.`,
      `${ans}`,
      `Sustituye $x = ${x}$ en la función.`,
      `$f(${x}) = ${a}(${x}) + ${b < 0 ? `(${b})` : b}$`,
      `$f(${x}) = ${a * x} + ${b < 0 ? `(${b})` : b} = ${ans}$`);
  }
  // Composition f(g(x))
  const ans1 = 2 * x + c;
  const ans2 = a * ans1 + b;
  return prob(tid, d,
    `Si $f(x) = ${a}x + ${b}$ y $g(x) = 2x + ${c < 0 ? `(${c})` : c}$, calcula $f(g(${x}))$.`,
    `${ans2}`,
    `Primero calcula $g(${x})$, luego sustituye en $f$.`,
    `$g(${x}) = 2(${x}) + ${c} = ${ans1}$. Ahora $f(${ans1})$.`,
    `$g(${x}) = ${ans1}$. $f(${ans1}) = ${a}(${ans1}) + ${b} = ${ans2}$`);
};

const genLinearFunctions: Gen = (d) => {
  const tid = "t-3-2";
  const m = ri(-5, 5);
  const b = ri(-10, 10);
  if (m === 0) return genLinearFunctions(d);
  if (d <= 2) {
    return prob(tid, d,
      `¿Cuál es la pendiente y la ordenada al origen de $y = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}$?`,
      `m=${m}, b=${b}`,
      `En $y = mx + b$, $m$ es la pendiente y $b$ es la ordenada al origen.`,
      `Compara con la forma $y = mx + b$.`,
      `Pendiente $m = ${m}$, ordenada al origen $b = ${b}$`);
  }
  // Find equation given two points
  const x1 = ri(-3, 3), x2 = ri(x1 + 1, x1 + 5);
  const y1 = m * x1 + b, y2 = m * x2 + b;
  return prob(tid, d,
    `Encuentra la ecuación de la recta que pasa por $(${x1}, ${y1})$ y $(${x2}, ${y2})$.`,
    `y = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`,
    `La pendiente es $m = \\frac{y_2 - y_1}{x_2 - x_1}$.`,
    `$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$`,
    `$m = ${m}$. Usando punto-pendiente: $y - ${y1} = ${m}(x - ${x1})$. Simplificando: $y = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}$`);
};

const genQuadFunctions: Gen = (d) => {
  const tid = "t-3-3";
  const a = pick([-2, -1, 1, 2]);
  const h = ri(-4, 4), k = ri(-5, 5);
  // f(x) = a(x-h)² + k  => vertex (h, k)
  return prob(tid, d,
    `Encuentra el vértice de $f(x) = ${a}(x ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
    `(${h}, ${k})`,
    `La forma $a(x-h)^2 + k$ tiene vértice en $(h, k)$.`,
    `Identifica $h$ y $k$ directamente de la expresión.`,
    `El vértice es $(${h}, ${k})$. La parábola abre ${a > 0 ? "hacia arriba" : "hacia abajo"}.`);
};

const genLogs: Gen = (d) => {
  const tid = "t-3-4";
  const bases = [2, 3, 5, 10];
  const base = pick(bases);
  const exp = ri(1, 4 + (d > 3 ? 2 : 0));
  const val = base ** exp;
  if (d <= 3) {
    return prob(tid, d,
      `Calcula: $\\log_{${base}}(${val})$`,
      `${exp}`,
      `$\\log_b(x) = n$ significa $b^n = x$.`,
      `¿A qué potencia debes elevar $${base}$ para obtener $${val}$?`,
      `$\\log_{${base}}(${val}) = ${exp}$ porque $${base}^{${exp}} = ${val}$`);
  }
  // Log rules
  const a = ri(2, 5), b_val = ri(2, 5);
  return prob(tid, d,
    `Simplifica: $\\log_{${base}}(${base ** a}) + \\log_{${base}}(${base ** b_val})$`,
    `${a + b_val}`,
    `$\\log_b(x) + \\log_b(y) = \\log_b(xy)$. También $\\log_b(b^n) = n$.`,
    `$\\log_{${base}}(${base ** a}) = ${a}$ y $\\log_{${base}}(${base ** b_val}) = ${b_val}$`,
    `$${a} + ${b_val} = ${a + b_val}$`);
};

const genExponentials: Gen = (d) => {
  const tid = "t-3-5";
  const base = pick([2, 3, 5]);
  const x = ri(1, 4);
  const rhs = base ** x;
  return prob(tid, d,
    `Resuelve: $${base}^x = ${rhs}$`,
    `${x}`,
    `Expresa $${rhs}$ como potencia de $${base}$.`,
    `$${base}^? = ${rhs}$. Prueba con $x = ${x}$.`,
    `$${base}^{${x}} = ${rhs}$, por lo tanto $x = ${x}$`);
};

const genSequences: Gen = (d) => {
  const tid = "t-3-6";
  if (d <= 3) {
    // Arithmetic sequence
    const a1 = ri(1, 10);
    const diff = ri(1, 8);
    const n = ri(5, 10 + d * 3);
    const ans = a1 + (n - 1) * diff;
    return prob(tid, d,
      `En la sucesión aritmética con $a_1 = ${a1}$ y diferencia común $d = ${diff}$, ¿cuál es $a_{${n}}$?`,
      `${ans}`,
      `$a_n = a_1 + (n-1)d$`,
      `$a_{${n}} = ${a1} + (${n}-1)(${diff}) = ${a1} + ${(n - 1) * diff}$`,
      `$a_{${n}} = ${a1} + ${(n - 1) * diff} = ${ans}$`);
  }
  // Geometric sequence
  const a1 = ri(1, 5);
  const r = pick([2, 3, -2]);
  const n = ri(3, 6);
  const ans = a1 * r ** (n - 1);
  return prob(tid, d,
    `En la sucesión geométrica con $a_1 = ${a1}$ y razón $r = ${r}$, ¿cuál es $a_{${n}}$?`,
    `${ans}`,
    `$a_n = a_1 \\cdot r^{n-1}$`,
    `$a_{${n}} = ${a1} \\cdot (${r})^{${n - 1}}$`,
    `$a_{${n}} = ${a1} \\cdot ${r ** (n - 1)} = ${ans}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 4: TRIGONOMETRÍA
// ══════════════════════════════════════════════════════════════════

const TRIG_ANGLES: { deg: number; rad: string; sin: string; cos: string; tan: string }[] = [
  { deg: 0, rad: "0", sin: "0", cos: "1", tan: "0" },
  { deg: 30, rad: "\\frac{\\pi}{6}", sin: "\\frac{1}{2}", cos: "\\frac{\\sqrt{3}}{2}", tan: "\\frac{1}{\\sqrt{3}}" },
  { deg: 45, rad: "\\frac{\\pi}{4}", sin: "\\frac{\\sqrt{2}}{2}", cos: "\\frac{\\sqrt{2}}{2}", tan: "1" },
  { deg: 60, rad: "\\frac{\\pi}{3}", sin: "\\frac{\\sqrt{3}}{2}", cos: "\\frac{1}{2}", tan: "\\sqrt{3}" },
  { deg: 90, rad: "\\frac{\\pi}{2}", sin: "1", cos: "0", tan: "\\text{undef}" },
];

const genTrig: Gen = (d) => {
  const tid = "t-4-1";
  const angle = pick(TRIG_ANGLES.filter((a) => a.deg !== 90 || d >= 4));
  const fn = pick(d <= 2 ? ["\\sin", "\\cos"] : ["\\sin", "\\cos", "\\tan"]);
  const val = fn === "\\sin" ? angle.sin : fn === "\\cos" ? angle.cos : angle.tan;
  return prob(tid, d,
    `Calcula: $${fn}(${angle.deg}°)$`,
    val,
    `Recuerda los valores del triángulo notable de $${angle.deg}°$.`,
    `Para $${angle.deg}°$, consulta la tabla de valores trigonométricos.`,
    `$${fn}(${angle.deg}°) = ${val}$`);
};

const genTrigIdentities: Gen = (d) => {
  const tid = "t-4-2";
  if (d <= 3) {
    const angle = pick(TRIG_ANGLES.filter((a) => a.deg > 0 && a.deg < 90));
    return prob(tid, d,
      `Verifica que $\\sin^2(${angle.deg}°) + \\cos^2(${angle.deg}°) = 1$. ¿Cuánto vale $\\sin^2(${angle.deg}°)$?`,
      `${angle.sin}^2`,
      `Identidad pitagórica: $\\sin^2\\theta + \\cos^2\\theta = 1$ siempre.`,
      `$\\sin(${angle.deg}°) = ${angle.sin}$, entonces $\\sin^2(${angle.deg}°) = (${angle.sin})^2$.`,
      `$\\sin^2(${angle.deg}°) = (${angle.sin})^2$. Verificación: $(${angle.sin})^2 + (${angle.cos})^2 = 1$ ✓`);
  }
  // Double angle
  const angle = pick(TRIG_ANGLES.filter((a) => a.deg === 30 || a.deg === 45));
  return prob(tid, d,
    `Usando la identidad del ángulo doble, calcula $\\sin(${angle.deg * 2}°)$.`,
    angle.deg === 30 ? "\\frac{\\sqrt{3}}{2}" : "1",
    `$\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$`,
    `$\\sin(${angle.deg * 2}°) = 2\\sin(${angle.deg}°)\\cos(${angle.deg}°) = 2(${angle.sin})(${angle.cos})$`,
    `$\\sin(${angle.deg * 2}°) = 2(${angle.sin})(${angle.cos}) = ${angle.deg === 30 ? "\\frac{\\sqrt{3}}{2}" : "1"}$`);
};

const genTrigEquations: Gen = (d) => {
  const tid = "t-4-3";
  const angle = pick(TRIG_ANGLES.filter((a) => a.deg > 0 && a.deg < 90));
  const fn = pick(["\\sin", "\\cos"]);
  const val = fn === "\\sin" ? angle.sin : angle.cos;
  return prob(tid, d,
    `Encuentra $\\theta$ en $[0°, 90°]$ tal que $${fn}(\\theta) = ${val}$.`,
    `${angle.deg}°`,
    `¿Qué ángulo notable tiene ${fn === "\\sin" ? "seno" : "coseno"} igual a $${val}$?`,
    `Revisa los valores de $${fn}$ para $0°, 30°, 45°, 60°, 90°$.`,
    `$${fn}(${angle.deg}°) = ${val}$, por lo tanto $\\theta = ${angle.deg}°$`);
};

const genAnalyticGeometry: Gen = (d) => {
  const tid = "t-4-4";
  const x1 = ri(-5, 5), y1 = ri(-5, 5);
  const x2 = ri(-5, 5), y2 = ri(-5, 5);
  if (x1 === x2 && y1 === y2) return genAnalyticGeometry(d);
  if (d <= 3) {
    // Distance
    const dist2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    const sqrtVal = Math.sqrt(dist2);
    const isInt = Number.isInteger(sqrtVal);
    return prob(tid, d,
      `Calcula la distancia entre $(${x1}, ${y1})$ y $(${x2}, ${y2})$.`,
      isInt ? `${sqrtVal}` : `\\sqrt{${dist2}}`,
      `$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$`,
      `$d = \\sqrt{(${x2}-${x1})^2 + (${y2}-${y1})^2} = \\sqrt{${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}}$`,
      `$d = \\sqrt{${dist2}}${isInt ? ` = ${sqrtVal}` : ""}$`);
  }
  // Midpoint
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const mxStr = Number.isInteger(mx) ? `${mx}` : frac(x1 + x2, 2);
  const myStr = Number.isInteger(my) ? `${my}` : frac(y1 + y2, 2);
  return prob(tid, d,
    `Encuentra el punto medio entre $(${x1}, ${y1})$ y $(${x2}, ${y2})$.`,
    `(${mxStr}, ${myStr})`,
    `Punto medio $= \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$`,
    `$\\left(\\frac{${x1}+${x2}}{2}, \\frac{${y1}+${y2}}{2}\\right)$`,
    `$\\left(\\frac{${x1 + x2}}{2}, \\frac{${y1 + y2}}{2}\\right) = (${mxStr}, ${myStr})$`);
};

const genInverseTrig: Gen = (d) => {
  const tid = "t-4-5";
  const angle = pick(TRIG_ANGLES.filter((a) => a.deg > 0 && a.deg < 90));
  const fn = pick(["\\arcsin", "\\arccos"]);
  const val = fn === "\\arcsin" ? angle.sin : angle.cos;
  return prob(tid, d,
    `Calcula: $${fn}(${val})$ (en grados).`,
    `${angle.deg}°`,
    `$${fn}$ es la función inversa de $${fn.replace("arc", "")}$.`,
    `Busca qué ángulo tiene ${fn.includes("sin") ? "seno" : "coseno"} = $${val}$.`,
    `$${fn}(${val}) = ${angle.deg}°$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 5: CÁLCULO DIFERENCIAL
// ══════════════════════════════════════════════════════════════════

const genLimits: Gen = (d) => {
  const tid = "t-5-1";
  const a = ri(1, 5 + d);
  const b = ri(1, 5 + d);
  const c = ri(-3, 5);
  if (d <= 2) {
    const ans = a * c + b;
    return prob(tid, d,
      `Calcula: $\\lim_{x \\to ${c}} (${a}x + ${b})$`,
      `${ans}`,
      `Para funciones polinómicas, el límite se calcula por sustitución directa.`,
      `Sustituye $x = ${c}$: $${a}(${c}) + ${b}$`,
      `$\\lim_{x \\to ${c}} (${a}x + ${b}) = ${a}(${c}) + ${b} = ${ans}$`);
  }
  if (d === 3) {
    // (x²-a²)/(x-a) as x->a
    const a2 = ri(1, 5);
    return prob(tid, d,
      `Calcula: $\\lim_{x \\to ${a2}} \\frac{x^2 - ${a2 ** 2}}{x - ${a2}}$`,
      `${2 * a2}`,
      `Factoriza el numerador: $x^2 - ${a2 ** 2} = (x-${a2})(x+${a2})$.`,
      `Simplifica: $\\frac{(x-${a2})(x+${a2})}{x-${a2}} = x + ${a2}$.`,
      `$\\lim_{x \\to ${a2}} \\frac{(x-${a2})(x+${a2})}{x-${a2}} = \\lim_{x \\to ${a2}} (x+${a2}) = ${2 * a2}$`);
  }
  // Infinity limit
  const n = ri(2, 5), m = ri(1, 4);
  return prob(tid, d,
    `Calcula: $\\lim_{x \\to \\infty} \\frac{${n}x^2 + 1}{${m}x^2 - 3}$`,
    frac(n, m),
    `Cuando el grado del numerador y denominador son iguales, el límite es el cociente de los coeficientes principales.`,
    `Divide todo entre $x^2$: $\\frac{${n} + \\frac{1}{x^2}}{${m} - \\frac{3}{x^2}}$`,
    `$\\lim_{x \\to \\infty} \\frac{${n}x^2 + 1}{${m}x^2 - 3} = \\frac{${n}}{${m}}${gcd(n, m) > 1 ? ` = ${frac(n, m)}` : ""}$`);
};

const genContinuity: Gen = (d) => {
  const tid = "t-5-2";
  const pt = ri(-2, 3);
  return prob(tid, d,
    `¿Es $f(x) = \\frac{x^2 - ${pt ** 2 > 0 ? pt ** 2 : `(${pt ** 2})`}}{x - ${pt}}$ continua en $x = ${pt}$?`,
    `No`,
    `Una función es continua en $x=a$ si $f(a)$ está definida, el límite existe y son iguales.`,
    `¿Está $f(${pt})$ definida? ¿Qué pasa con el denominador en $x = ${pt}$?`,
    `En $x = ${pt}$, el denominador es $0$, así que $f(${pt})$ no está definida. La función no es continua en $x = ${pt}$.`);
};

const genDerivatives: Gen = (d) => {
  const tid = "t-5-3";
  if (d <= 2) {
    const n = ri(2, 5);
    const a = ri(1, 5);
    return prob(tid, d,
      `Calcula la derivada de $f(x) = ${a}x^{${n}}$.`,
      `${a * n}x^{${n - 1}}`,
      `Regla de la potencia: $\\frac{d}{dx}x^n = nx^{n-1}$.`,
      `$f'(x) = ${a} \\cdot ${n} \\cdot x^{${n}-1}$`,
      `$f'(x) = ${a} \\cdot ${n}x^{${n - 1}} = ${a * n}x^{${n - 1}}$`);
  }
  if (d === 3) {
    const a = ri(1, 5), b = ri(1, 5), c = ri(1, 10);
    return prob(tid, d,
      `Calcula la derivada de $f(x) = ${a}x^3 + ${b}x^2 + ${c}$.`,
      `${3 * a}x^2 + ${2 * b}x`,
      `Deriva término por término usando la regla de la potencia.`,
      `$\\frac{d}{dx}(${a}x^3) = ${3 * a}x^2$, $\\frac{d}{dx}(${b}x^2) = ${2 * b}x$, $\\frac{d}{dx}(${c}) = 0$.`,
      `$f'(x) = ${3 * a}x^2 + ${2 * b}x$`);
  }
  // Product rule or chain rule
  const a = ri(2, 5);
  if (d === 4) {
    return prob(tid, d,
      `Calcula la derivada de $f(x) = x^2 \\cdot e^x$ (regla del producto).`,
      `(2x + x^2)e^x`,
      `Regla del producto: $(uv)' = u'v + uv'$.`,
      `$u = x^2$, $u' = 2x$, $v = e^x$, $v' = e^x$.`,
      `$f'(x) = 2x \\cdot e^x + x^2 \\cdot e^x = (2x + x^2)e^x$`);
  }
  return prob(tid, d,
    `Calcula la derivada de $f(x) = (${a}x + 1)^3$ (regla de la cadena).`,
    `${3 * a}(${a}x + 1)^2`,
    `Regla de la cadena: $\\frac{d}{dx}[g(h(x))] = g'(h(x)) \\cdot h'(x)$.`,
    `$g(u) = u^3 \\Rightarrow g'(u) = 3u^2$. $h(x) = ${a}x+1 \\Rightarrow h'(x) = ${a}$.`,
    `$f'(x) = 3(${a}x+1)^2 \\cdot ${a} = ${3 * a}(${a}x+1)^2$`);
};

const genSpecialDerivatives: Gen = (d) => {
  const tid = "t-5-4";
  const funcs = [
    { f: "\\sin(x)", fp: "\\cos(x)" },
    { f: "\\cos(x)", fp: "-\\sin(x)" },
    { f: "e^x", fp: "e^x" },
    { f: "\\ln(x)", fp: "\\frac{1}{x}" },
    { f: "\\tan(x)", fp: "\\sec^2(x)" },
  ];
  const fn = pick(d <= 2 ? funcs.slice(0, 3) : funcs);
  const a = d >= 3 ? ri(2, 5) : 1;
  const fStr = a === 1 ? fn.f : `${a}${fn.f}`;
  const fpStr = a === 1 ? fn.fp : `${a} \\cdot ${fn.fp}`;
  return prob(tid, d,
    `Calcula la derivada de $f(x) = ${fStr}$.`,
    fpStr,
    `Recuerda las derivadas de funciones elementales.`,
    `$\\frac{d}{dx}[${fn.f}] = ${fn.fp}$`,
    `$f'(x) = ${a === 1 ? "" : `${a} \\cdot `}${fn.fp}${a === 1 ? "" : ` = ${fpStr}`}$`);
};

const genDerivativeApps: Gen = (d) => {
  const tid = "t-5-5";
  // Find critical points
  const a = ri(1, 3), b = ri(1, 8);
  void d;
  const critX = b / (2 * a);
  const critXStr = Number.isInteger(critX) ? `${critX}` : frac(b, 2 * a);
  return prob(tid, d,
    `Encuentra los puntos críticos de $f(x) = ${a}x^2 - ${b}x + 1$.`,
    `x = ${critXStr}`,
    `Los puntos críticos se encuentran donde $f'(x) = 0$.`,
    `$f'(x) = ${2 * a}x - ${b}$. Iguala a cero: $${2 * a}x - ${b} = 0$.`,
    `$f'(x) = ${2 * a}x - ${b} = 0 \\Rightarrow x = \\frac{${b}}{${2 * a}} = ${critXStr}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 6: CÁLCULO INTEGRAL
// ══════════════════════════════════════════════════════════════════

const genIndefiniteIntegral: Gen = (d) => {
  const tid = "t-6-1";
  const n = ri(1, 5 + d);
  const a = ri(1, 5);
  return prob(tid, d,
    `Calcula: $\\int ${a}x^{${n}} \\, dx$`,
    `${frac(a, n + 1)}x^{${n + 1}} + C`,
    `$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$`,
    `$\\int ${a}x^{${n}} \\, dx = ${a} \\cdot \\frac{x^{${n + 1}}}{${n + 1}} + C$`,
    `$\\int ${a}x^{${n}} \\, dx = \\frac{${a}}{${n + 1}}x^{${n + 1}} + C = ${frac(a, n + 1)}x^{${n + 1}} + C$`);
};

const genIntTechniques: Gen = (d) => {
  const tid = "t-6-2";
  if (d <= 3) {
    // Sum of power terms
    const a = ri(1, 4), b = ri(1, 5), m = ri(1, 3), n = ri(1, 3);
    return prob(tid, d,
      `Calcula: $\\int (${a}x^{${m}} + ${b}x^{${n}}) \\, dx$`,
      `${frac(a, m + 1)}x^{${m + 1}} + ${frac(b, n + 1)}x^{${n + 1}} + C`,
      `Integra término por término.`,
      `$\\int ${a}x^{${m}} dx = ${frac(a, m + 1)}x^{${m + 1}}$ e $\\int ${b}x^{${n}} dx = ${frac(b, n + 1)}x^{${n + 1}}$`,
      `$${frac(a, m + 1)}x^{${m + 1}} + ${frac(b, n + 1)}x^{${n + 1}} + C$`);
  }
  // Trig integral
  return prob(tid, d,
    `Calcula: $\\int \\cos(x) \\, dx$`,
    `\\sin(x) + C`,
    `Recuerda: la derivada de $\\sin(x)$ es $\\cos(x)$.`,
    `Busca una función cuya derivada sea $\\cos(x)$.`,
    `$\\int \\cos(x) \\, dx = \\sin(x) + C$`);
};

const genDefiniteIntegral: Gen = (d) => {
  const tid = "t-6-3";
  const n = ri(1, 3);
  const a = ri(0, 2), b = ri(a + 1, a + 3);
  // ∫_a^b x^n dx = [x^(n+1)/(n+1)]_a^b
  const antideriv = (x: number) => (x ** (n + 1)) / (n + 1);
  const ans = +(antideriv(b) - antideriv(a)).toFixed(4);
  const ansStr = Number.isInteger(ans) ? `${ans}` : frac(b ** (n + 1) - a ** (n + 1), n + 1);
  return prob(tid, d,
    `Calcula: $\\int_{${a}}^{${b}} x^{${n}} \\, dx$`,
    ansStr,
    `$\\int_a^b f(x)dx = F(b) - F(a)$ donde $F$ es la antiderivada.`,
    `La antiderivada de $x^{${n}}$ es $\\frac{x^{${n + 1}}}{${n + 1}}$. Evalúa en $x=${b}$ y $x=${a}$.`,
    `$\\left[\\frac{x^{${n + 1}}}{${n + 1}}\\right]_{${a}}^{${b}} = \\frac{${b}^{${n + 1}}}{${n + 1}} - \\frac{${a}^{${n + 1}}}{${n + 1}} = ${ansStr}$`);
};

const genIntegralApps: Gen = (d) => {
  const tid = "t-6-4";
  // Area under curve
  const a = ri(1, 3);
  const b_val = ri(a + 1, a + 3);
  const coef = ri(1, 3);
  // Area = ∫_a^b coef*x dx = coef * [x²/2]_a^b
  const area = (coef * (b_val ** 2 - a ** 2)) / 2;
  const areaStr = Number.isInteger(area) ? `${area}` : frac(coef * (b_val ** 2 - a ** 2), 2);
  return prob(tid, d,
    `Calcula el área bajo $f(x) = ${coef}x$ entre $x = ${a}$ y $x = ${b_val}$.`,
    areaStr,
    `El área bajo una curva es $\\int_a^b f(x)\\,dx$.`,
    `$\\int_{${a}}^{${b_val}} ${coef}x\\,dx = ${coef}\\left[\\frac{x^2}{2}\\right]_{${a}}^{${b_val}}$`,
    `$${coef} \\cdot \\frac{${b_val}^2 - ${a}^2}{2} = ${coef} \\cdot \\frac{${b_val ** 2 - a ** 2}}{2} = ${areaStr}$`);
};

const genTaylorSeries: Gen = (d) => {
  const tid = "t-6-5";
  return prob(tid, d,
    `Escribe los primeros 3 términos de la serie de Taylor de $e^x$ alrededor de $x=0$.`,
    `1 + x + \\frac{x^2}{2}`,
    `La serie de Taylor de $e^x$ es $\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$.`,
    `$n=0$: $\\frac{x^0}{0!}=1$; $n=1$: $\\frac{x^1}{1!}=x$; $n=2$: $\\frac{x^2}{2!}$`,
    `$e^x \\approx 1 + x + \\frac{x^2}{2} + \\cdots$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 7: CÁLCULO MULTIVARIABLE
// ══════════════════════════════════════════════════════════════════

const genPartialDeriv: Gen = (d) => {
  const tid = "t-7-1";
  const a = ri(1, 5), b = ri(1, 5), c = ri(1, 5);
  const wrt = pick(["x", "y"]);
  const fpx = `${2 * a}x + ${b}y`;
  const fpy = `${b}x + ${2 * c}y`;
  return prob(tid, d,
    `Calcula $\\frac{\\partial}{\\partial ${wrt}} (${a}x^2 + ${b}xy + ${c}y^2)$.`,
    wrt === "x" ? fpx : fpy,
    `Trata la otra variable como constante al derivar.`,
    wrt === "x"
      ? `$\\frac{\\partial}{\\partial x}(${a}x^2) = ${2 * a}x$, $\\frac{\\partial}{\\partial x}(${b}xy) = ${b}y$, $\\frac{\\partial}{\\partial x}(${c}y^2) = 0$`
      : `$\\frac{\\partial}{\\partial y}(${a}x^2) = 0$, $\\frac{\\partial}{\\partial y}(${b}xy) = ${b}x$, $\\frac{\\partial}{\\partial y}(${c}y^2) = ${2 * c}y$`,
    `$\\frac{\\partial f}{\\partial ${wrt}} = ${wrt === "x" ? fpx : fpy}$`);
};

const genOptimization: Gen = (d) => {
  const tid = "t-7-2";
  const a = ri(1, 3), b = ri(1, 5);
  return prob(tid, d,
    `Encuentra el mínimo de $f(x) = ${a}x^2 - ${b}x + 1$. ¿En qué $x$ ocurre?`,
    frac(b, 2 * a),
    `El mínimo de una parábola que abre hacia arriba está en $x = -\\frac{b}{2a}$.`,
    `$a = ${a}$, $b = -${b}$. $x = -\\frac{-${b}}{2 \\cdot ${a}}$`,
    `$x = \\frac{${b}}{${2 * a}} = ${frac(b, 2 * a)}$`);
};

const genDoubleIntegral: Gen = (d) => {
  const tid = "t-7-3";
  const a = ri(1, 3), b = ri(1, 3);
  // ∫₀ᵃ∫₀ᵇ xy dy dx = (a²/2)(b²/2)
  const ans = (a * a * b * b) / 4;
  const ansStr = Number.isInteger(ans) ? `${ans}` : frac(a * a * b * b, 4);
  return prob(tid, d,
    `Calcula: $\\int_0^{${a}} \\int_0^{${b}} xy \\, dy \\, dx$`,
    ansStr,
    `Integra primero respecto a $y$, luego respecto a $x$.`,
    `$\\int_0^{${b}} xy \\, dy = x \\cdot \\frac{y^2}{2}\\Big|_0^{${b}} = x \\cdot \\frac{${b * b}}{2}$. Luego integra respecto a $x$.`,
    `$\\int_0^{${a}} \\frac{${b * b}}{2}x \\, dx = \\frac{${b * b}}{2} \\cdot \\frac{x^2}{2}\\Big|_0^{${a}} = \\frac{${b * b}}{2} \\cdot \\frac{${a * a}}{2} = ${ansStr}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 8: ÁLGEBRA LINEAL
// ══════════════════════════════════════════════════════════════════

const genVectors: Gen = (d) => {
  const tid = "t-8-1";
  const a1 = ri(-5, 5), a2 = ri(-5, 5);
  const b1 = ri(-5, 5), b2 = ri(-5, 5);
  if (d <= 3) {
    // Dot product
    const dot = a1 * b1 + a2 * b2;
    return prob(tid, d,
      `Calcula el producto punto: $\\vec{u} = (${a1}, ${a2})$, $\\vec{v} = (${b1}, ${b2})$. $\\vec{u} \\cdot \\vec{v} = ?$`,
      `${dot}`,
      `$\\vec{u} \\cdot \\vec{v} = u_1 v_1 + u_2 v_2$`,
      `$(${a1})(${b1}) + (${a2})(${b2}) = ${a1 * b1} + ${a2 * b2}$`,
      `$\\vec{u} \\cdot \\vec{v} = ${a1 * b1} + ${a2 * b2} = ${dot}$`);
  }
  // Magnitude
  const mag2 = a1 * a1 + a2 * a2;
  const magSqrt = Math.sqrt(mag2);
  const isInt = Number.isInteger(magSqrt);
  return prob(tid, d,
    `Calcula la magnitud de $\\vec{u} = (${a1}, ${a2})$.`,
    isInt ? `${magSqrt}` : `\\sqrt{${mag2}}`,
    `$|\\vec{u}| = \\sqrt{u_1^2 + u_2^2}$`,
    `$|\\vec{u}| = \\sqrt{${a1}^2 + ${a2}^2} = \\sqrt{${a1 * a1} + ${a2 * a2}}$`,
    `$|\\vec{u}| = \\sqrt{${mag2}}${isInt ? ` = ${magSqrt}` : ""}$`);
};

const genMatrices: Gen = (d) => {
  const tid = "t-8-2";
  // 2x2 determinant
  const a = ri(-5, 5), b = ri(-5, 5), c = ri(-5, 5), e = ri(-5, 5);
  const det = a * e - b * c;
  return prob(tid, d,
    `Calcula el determinante: $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${e} \\end{vmatrix}$`,
    `${det}`,
    `$\\det = ad - bc$ para una matriz $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$.`,
    `$\\det = (${a})(${e}) - (${b})(${c}) = ${a * e} - ${b * c}$`,
    `$\\det = ${a * e} - ${b * c} = ${det}$`);
};

const genEigenvalues: Gen = (d) => {
  const tid = "t-8-6";
  // Diagonal-like matrix eigenvalues
  const l1 = ri(-3, 5), l2 = ri(-3, 5);
  return prob(tid, d,
    `Encuentra los eigenvalores de $A = \\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$.`,
    `\\lambda_1 = ${l1}, \\lambda_2 = ${l2}`,
    `Para una matriz diagonal, los eigenvalores son los elementos de la diagonal.`,
    `Resuelve $\\det(A - \\lambda I) = 0$: $(${l1} - \\lambda)(${l2} - \\lambda) = 0$.`,
    `$\\lambda_1 = ${l1}$, $\\lambda_2 = ${l2}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 9: ECUACIONES DIFERENCIALES
// ══════════════════════════════════════════════════════════════════

const genFirstOrderODE: Gen = (d) => {
  const tid = "t-9-1";
  const k = ri(1, 5);
  return prob(tid, d,
    `Resuelve: $\\frac{dy}{dx} = ${k}y$. ¿Cuál es la solución general?`,
    `y = Ce^{${k}x}`,
    `Esta es una EDO separable: $\\frac{dy}{y} = ${k}\\,dx$.`,
    `Integra ambos lados: $\\ln|y| = ${k}x + C_1$.`,
    `$\\frac{dy}{y} = ${k}\\,dx \\Rightarrow \\ln|y| = ${k}x + C_1 \\Rightarrow y = Ce^{${k}x}$`);
};

const genSecondOrderODE: Gen = (d) => {
  const tid = "t-9-2";
  const r1 = ri(1, 4), r2 = ri(1, 4);
  const b = r1 + r2, c = r1 * r2;
  return prob(tid, d,
    `Encuentra la ecuación característica de $y'' - ${b}y' + ${c}y = 0$ y sus raíces.`,
    `r = ${r1}, r = ${r2}`,
    `La ecuación característica es $r^2 - ${b}r + ${c} = 0$.`,
    `Factoriza: $(r - ${r1})(r - ${r2}) = 0$.`,
    `$r^2 - ${b}r + ${c} = 0 \\Rightarrow (r-${r1})(r-${r2}) = 0 \\Rightarrow r = ${r1}, r = ${r2}$`);
};

// ══════════════════════════════════════════════════════════════════
// LEVEL 10: MATEMÁTICAS PARA CIENCIA DE DATOS
// ══════════════════════════════════════════════════════════════════

const genProbability: Gen = (d) => {
  const tid = "t-10-1";
  if (d <= 3) {
    const n = ri(2, 8);
    const total = ri(n + 2, 20);
    const g = gcd(n, total);
    return prob(tid, d,
      `En una bolsa hay $${total}$ bolas, $${n}$ son rojas. ¿Cuál es la probabilidad de sacar una roja?`,
      frac(n, total),
      `$P = \\frac{\\text{favorables}}{\\text{total}}$`,
      `$P = \\frac{${n}}{${total}}$`,
      `$P(\\text{roja}) = \\frac{${n}}{${total}}${g > 1 ? ` = ${frac(n, total)}` : ""}$`);
  }
  // Conditional probability / complement
  const pa = ri(1, 9) / 10;
  const comp = +(1 - pa).toFixed(1);
  return prob(tid, d,
    `Si $P(A) = ${pa}$, ¿cuánto vale $P(A^c)$ (el complemento)?`,
    `${comp}`,
    `$P(A^c) = 1 - P(A)$`,
    `$P(A^c) = 1 - ${pa}$`,
    `$P(A^c) = 1 - ${pa} = ${comp}$`);
};

const genInference: Gen = (d) => {
  const tid = "t-10-2";
  const mean = ri(50, 200);
  const std = ri(5, 20);
  const z = pick([1, 1.96, 2]);
  const lower = +(mean - z * std).toFixed(1);
  const upper = +(mean + z * std).toFixed(1);
  return prob(tid, d,
    `Si $\\mu = ${mean}$ y $\\sigma = ${std}$, calcula el intervalo $\\mu \\pm ${z}\\sigma$.`,
    `[${lower}, ${upper}]`,
    `$\\mu \\pm z\\sigma = ${mean} \\pm ${z} \\times ${std}$`,
    `$${mean} - ${z}(${std}) = ${lower}$ y $${mean} + ${z}(${std}) = ${upper}$`,
    `Intervalo: $[${lower}, ${upper}]$`);
};

const genGradientDescent: Gen = (d) => {
  const tid = "t-10-3";
  const a = ri(1, 5);
  const x0 = ri(1, 10);
  const lr = pick([0.1, 0.01, 0.05]);
  // f(x) = ax², f'(x) = 2ax, x1 = x0 - lr * 2a * x0
  const grad = 2 * a * x0;
  const x1 = +(x0 - lr * grad).toFixed(4);
  return prob(tid, d,
    `Si $f(x) = ${a}x^2$, $x_0 = ${x0}$, y la tasa de aprendizaje es $\\alpha = ${lr}$, calcula $x_1$ con gradient descent.`,
    `${x1}`,
    `$x_1 = x_0 - \\alpha \\cdot f'(x_0)$. Primero calcula $f'(x_0)$.`,
    `$f'(x) = ${2 * a}x$, $f'(${x0}) = ${grad}$. $x_1 = ${x0} - ${lr} \\times ${grad}$`,
    `$x_1 = ${x0} - ${lr}(${grad}) = ${x0} - ${+(lr * grad).toFixed(4)} = ${x1}$`);
};

const genAppliedLinAlg: Gen = (d) => {
  const tid = "t-10-4";
  // Matrix-vector multiplication
  const a = ri(-3, 5), b = ri(-3, 5), c = ri(-3, 5), e = ri(-3, 5);
  const v1 = ri(-3, 5), v2 = ri(-3, 5);
  const r1 = a * v1 + b * v2;
  const r2 = c * v1 + e * v2;
  return prob(tid, d,
    `Calcula: $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${e} \\end{pmatrix} \\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix}$`,
    `\\begin{pmatrix} ${r1} \\\\ ${r2} \\end{pmatrix}`,
    `Multiplica fila por columna: primera fila $\\cdot$ vector, segunda fila $\\cdot$ vector.`,
    `Fila 1: $(${a})(${v1}) + (${b})(${v2}) = ${a * v1} + ${b * v2} = ${r1}$`,
    `$\\begin{pmatrix} ${r1} \\\\ ${r2} \\end{pmatrix}$: $(${a})(${v1})+(${b})(${v2})=${r1}$; $(${c})(${v1})+(${e})(${v2})=${r2}$`);
};

// ══════════════════════════════════════════════════════════════════
// MAPA DE GENERADORES
// ══════════════════════════════════════════════════════════════════

const generators: Record<string, Gen> = {
  // Level 0
  "t-0-1": genBasicOps,
  "t-0-2": genFractions,
  "t-0-3": genDecimals,
  "t-0-4": genPercentages,
  "t-0-5": genPEMDAS,
  "t-0-6": genRatios,
  // Level 1
  "t-1-1": genIntegers,
  "t-1-2": genPowersRoots,
  "t-1-3": genVariables,
  "t-1-4": genOneStep,
  "t-1-5": genInequalities,
  // Level 2
  "t-2-1": genExponentRules,
  "t-2-2": genPolynomials,
  "t-2-3": genFactoring,
  "t-2-4": genLinearEq,
  "t-2-5": genSystems,
  "t-2-6": genQuadratics,
  "t-2-7": genAbsValue,
  // Level 3
  "t-3-1": genFunctions,
  "t-3-2": genLinearFunctions,
  "t-3-3": genQuadFunctions,
  "t-3-4": genLogs,
  "t-3-5": genExponentials,
  "t-3-6": genSequences,
  // Level 4
  "t-4-1": genTrig,
  "t-4-2": genTrigIdentities,
  "t-4-3": genTrigEquations,
  "t-4-4": genAnalyticGeometry,
  "t-4-5": genInverseTrig,
  // Level 5
  "t-5-1": genLimits,
  "t-5-2": genContinuity,
  "t-5-3": genDerivatives,
  "t-5-4": genSpecialDerivatives,
  "t-5-5": genDerivativeApps,
  // Level 6
  "t-6-1": genIndefiniteIntegral,
  "t-6-2": genIntTechniques,
  "t-6-3": genDefiniteIntegral,
  "t-6-4": genIntegralApps,
  "t-6-5": genTaylorSeries,
  // Level 7
  "t-7-1": genPartialDeriv,
  "t-7-2": genOptimization,
  "t-7-3": genDoubleIntegral,
  // Level 8
  "t-8-1": genVectors,
  "t-8-2": genMatrices,
  "t-8-6": genEigenvalues,
  // Level 9
  "t-9-1": genFirstOrderODE,
  "t-9-2": genSecondOrderODE,
  // Level 10
  "t-10-1": genProbability,
  "t-10-2": genInference,
  "t-10-3": genGradientDescent,
  "t-10-4": genAppliedLinAlg,
};

// ── Helper to build a Problem object ──
function prob(
  topicId: string,
  difficulty: number,
  statement: string,
  answer: string,
  hint1: string,
  hint2: string,
  solution: string
): Problem {
  return {
    id: uid(topicId),
    topic_id: topicId,
    difficulty: Math.min(Math.max(difficulty, 1), 5),
    statement_latex: statement,
    correct_answer_latex: answer,
    hint_1_latex: hint1,
    hint_2_latex: hint2,
    step_by_step_solution_latex: solution,
  };
}

// ══════════════════════════════════════════════════════════════════
// API PÚBLICA
// ══════════════════════════════════════════════════════════════════

/** True if we have a random generator for this topic */
export function hasGenerator(topicId: string): boolean {
  return topicId in generators;
}

/** Generate one random problem for a topic at the given difficulty (1-5) */
export function generateOne(topicId: string, difficulty: number): Problem | null {
  const gen = generators[topicId];
  if (!gen) return null;
  return gen(Math.min(Math.max(difficulty, 1), 5));
}

/**
 * Generate a balanced set of random problems for a topic.
 * Default: 8 problems with escalating difficulty.
 */
export function generateProblemSet(topicId: string, count = 8): Problem[] {
  const gen = generators[topicId];
  if (!gen) return [];

  const problems: Problem[] = [];
  // Distribute difficulties: 2×d1, 2×d2, 2×d3, 1×d4, 1×d5
  const diffs =
    count <= 5
      ? Array.from({ length: count }, (_, i) => i + 1)
      : [1, 1, 2, 2, 3, 3, 4, 5, ...Array.from({ length: Math.max(0, count - 8) }, () => ri(2, 4))];

  for (const d of diffs.slice(0, count)) {
    // Retry a few times to avoid degenerate cases
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const p = gen(d);
        if (p) {
          problems.push(p);
          break;
        }
      } catch {
        // generator hit edge case, retry
      }
    }
  }

  return problems;
}
