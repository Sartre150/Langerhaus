import { TopicExplanation } from "./types";

// ═══════════════════════════════════════════════════════════════════
// EXPLICACIONES PROFUNDAS + APLICACIONES REALES + EJEMPLOS RESUELTOS
// Basado en: Stewart Cálculo, Strang Álgebra Lineal, Sheldon Ross,
// Polya (How to Solve It), Khan Academy, MIT OCW
// ═══════════════════════════════════════════════════════════════════

export const topicExplanations: TopicExplanation[] = [

  // ═══════════════════════════════════════
  // NIVEL 0 - ARITMÉTICA FUNDAMENTAL
  // ═══════════════════════════════════════

  {
    topic_id: "t-0-1",
    why_it_matters: "Las cuatro operaciones básicas son los ladrillos de TODA la matemática. Un ingeniero que no domina aritmética mental comete errores en cálculos de presupuesto, estimaciones rápidas y detección de bugs en código. Amazon, Google y Meta hacen preguntas de estimación rápida (Fermi problems) en entrevistas.",
    theory_sections: [
      {
        title: "Las Cuatro Operaciones",
        content_latex: "La suma ($+$), resta ($-$), multiplicación ($\\times$) y división ($\\div$) son las operaciones fundamentales.\n\n**Suma:** Combinar cantidades. $a + b = b + a$ (conmutativa).\n**Resta:** La operación inversa de la suma. $a - b \\neq b - a$.\n**Multiplicación:** Suma repetida. $3 \\times 4 = 4 + 4 + 4 = 12$.\n**División:** Repartir en partes iguales. $12 \\div 4 = 3$."
      },
      {
        title: "Propiedades Fundamentales",
        content_latex: "**Conmutativa:** $a + b = b + a$ y $a \\times b = b \\times a$\n\n**Asociativa:** $(a+b)+c = a+(b+c)$ y $(a \\times b) \\times c = a \\times (b \\times c)$\n\n**Distributiva:** $a \\times (b + c) = a \\times b + a \\times c$\n\nEsta última es la más poderosa — es la base de la factorización en álgebra."
      },
      {
        title: "Trucos de Cálculo Mental",
        content_latex: "**Multiplicar por 9:** $n \\times 9 = n \\times 10 - n$. Ejemplo: $7 \\times 9 = 70 - 7 = 63$.\n\n**Multiplicar por 11:** Para dos dígitos $ab$: suma los dígitos y coloca en medio. $23 \\times 11 = 2\\underline{5}3 = 253$.\n\n**Cuadrados cercanos a 50:** $(50+n)^2 = 2500 + 100n + n^2$. Ejemplo: $53^2 = 2500 + 300 + 9 = 2809$."
      }
    ],
    key_formulas: [
      { name: "Propiedad Distributiva", formula_latex: "$a(b + c) = ab + ac$" },
      { name: "División con residuo", formula_latex: "$a = bq + r$ donde $0 \\leq r < b$" },
    ],
    applications: [
      {
        field: "Ingeniería de Software",
        icon: "💻",
        title: "Complejidad algorítmica",
        description: "La estimación rápida de operaciones es crucial. Si un loop hace $n^2$ operaciones y $n = 10{,}000$, debes saber instantáneamente que son $10^8$ operaciones (~1 segundo de cómputo).",
        example_latex: "Si tu API procesa $500$ requests/segundo y recibes $1{,}800{,}000$ requests/hora, ¿necesitas escalar? $\\dfrac{1{,}800{,}000}{3{,}600} = 500$. Justo en el límite."
      },
      {
        field: "Finanzas",
        icon: "💰",
        title: "Cálculos de presupuesto",
        description: "Cada transacción financiera se reduce a las cuatro operaciones. Un error de redondeo acumulado puede costar millones.",
        example_latex: "Presupuesto mensual: Ingreso $\\$45{,}000$ - Renta $\\$12{,}000$ - Comida $\\$8{,}500$ - Transporte $\\$3{,}200$ = $\\$21{,}300$ disponibles."
      },
    ],
    worked_examples: [
      {
        title: "Estimación Fermi (estilo Google)",
        problem_latex: "¿Cuántos afinadores de piano hay en la Ciudad de México?",
        solution_latex: "Población: ~$22$ millones. Hogares: ~$5.5$ millones. Hogares con piano: ~$2\\%$ = $110{,}000$ pianos. Cada piano se afina ~$1$ vez/año. Un afinador hace ~$4$ al día, $250$ días/año = $1{,}000$/año. Afinadores necesarios: $\\dfrac{110{,}000}{1{,}000} \\approx 110$ afinadores."
      },
      {
        title: "Propiedad distributiva en acción",
        problem_latex: "Calcula $47 \\times 102$ mentalmente.",
        solution_latex: "$47 \\times 102 = 47 \\times (100 + 2) = 4{,}700 + 94 = 4{,}794$"
      }
    ],
    visualizer: { type: "number-line", defaultExpression: "0", params: { min: -20, max: 20 } },
    pro_tips: [
      "Practica cálculo mental diariamente — la velocidad aritmética acelera TODO lo demás.",
      "Verifica tus respuestas usando la operación inversa: si $24 \\div 6 = 4$, comprueba que $4 \\times 6 = 24$.",
      "Los problemas de Fermi (estimación rápida) son la habilidad #1 que prueban en entrevistas técnicas de FAANG.",
    ]
  },

  {
    topic_id: "t-0-2",
    why_it_matters: "Las fracciones aparecen EN TODAS PARTES: probabilidad ($P = \\frac{1}{6}$), proporciones en recetas, tasas de interés, y son la base para entender funciones racionales y cálculo. Si no dominas fracciones, el álgebra se vuelve imposible.",
    theory_sections: [
      {
        title: "¿Qué es una fracción?",
        content_latex: "Una fracción $\\dfrac{a}{b}$ representa $a$ partes de un total dividido en $b$ partes iguales.\n\n**Numerador** ($a$): cuántas partes tomamos.\n**Denominador** ($b$): en cuántas partes iguales dividimos el total.\n\n$\\dfrac{3}{4}$ = 3 de 4 partes iguales = $0.75$ = $75\\%$."
      },
      {
        title: "Operaciones con Fracciones",
        content_latex: "**Suma/Resta:** Necesitan MCM como denominador común.\n$$\\dfrac{a}{b} \\pm \\dfrac{c}{d} = \\dfrac{ad \\pm bc}{bd}$$\n\n**Multiplicación:** Directo.\n$$\\dfrac{a}{b} \\times \\dfrac{c}{d} = \\dfrac{ac}{bd}$$\n\n**División:** Multiplica por el recíproco.\n$$\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c} = \\dfrac{ad}{bc}$$"
      },
      {
        title: "Simplificación",
        content_latex: "Divide numerador y denominador por su MCD (Máximo Común Divisor).\n\nEjemplo: $\\dfrac{24}{36}$. MCD$(24, 36) = 12$. $\\dfrac{24 \\div 12}{36 \\div 12} = \\dfrac{2}{3}$.\n\n**Tip:** Si ambos son pares, divide por 2 repetidamente. Si ambos terminan en 0 o 5, divide por 5."
      }
    ],
    key_formulas: [
      { name: "Suma de fracciones", formula_latex: "$\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad + bc}{bd}$" },
      { name: "División de fracciones", formula_latex: "$\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c}$" },
    ],
    applications: [
      {
        field: "Probabilidad",
        icon: "🎲",
        title: "Cada probabilidad es una fracción",
        description: "La probabilidad de sacar un as de un mazo es $\\frac{4}{52} = \\frac{1}{13}$. En Machine Learning, Naive Bayes usa fracciones constantemente.",
        example_latex: "$P(\\text{lluvia}) = \\dfrac{\\text{días lluviosos}}{\\text{días totales}} = \\dfrac{73}{365} = \\dfrac{1}{5}$"
      },
      {
        field: "Cocina & Química",
        icon: "🧪",
        title: "Proporciones de mezcla",
        description: "Una receta para 4 personas necesita $\\frac{3}{4}$ taza de harina. Para 6 personas: $\\frac{3}{4} \\times \\frac{6}{4} = \\frac{18}{16} = \\frac{9}{8}$ tazas.",
      },
    ],
    worked_examples: [
      {
        title: "Suma de fracciones complejas",
        problem_latex: "Calcula: $\\dfrac{5}{12} + \\dfrac{7}{18}$",
        solution_latex: "MCM$(12, 18) = 36$.\n\n$\\dfrac{5}{12} = \\dfrac{15}{36}$, $\\dfrac{7}{18} = \\dfrac{14}{36}$\n\n$\\dfrac{15}{36} + \\dfrac{14}{36} = \\dfrac{29}{36}$"
      }
    ],
    visualizer: { type: "fraction-bars", defaultExpression: "3/4", params: { denominator: 8 } },
    pro_tips: [
      "Antes de operar, SIEMPRE simplifica primero — hace todo más fácil.",
      "Para comparar fracciones rápido: multiplica en cruz. $\\frac{3}{7}$ vs $\\frac{5}{11}$: $3 \\times 11 = 33$ vs $5 \\times 7 = 35$. Como $33 < 35$, $\\frac{3}{7} < \\frac{5}{11}$.",
      "Las fracciones son la BASE de la probabilidad y las ecuaciones racionales. Domínalas ahora."
    ]
  },

  {
    topic_id: "t-0-5",
    why_it_matters: "Una expresión como $2 + 3 \\times 4$ tiene UNA sola respuesta correcta ($14$, no $20$). Sin dominar PEMDAS, todo cálculo complejo será incorrecto. Los lenguajes de programación siguen exactamente estas reglas.",
    theory_sections: [
      {
        title: "Jerarquía de Operaciones (PEMDAS)",
        content_latex: "**P** — Paréntesis (resuelve lo de adentro primero)\n**E** — Exponentes (potencias y raíces)\n**M/D** — Multiplicación y División (izquierda a derecha)\n**A/S** — Adición y Sustracción (izquierda a derecha)\n\nIMPORTANTE: M y D tienen la MISMA prioridad. Se resuelven de izquierda a derecha.\nIgual con A y S."
      },
    ],
    key_formulas: [
      { name: "PEMDAS", formula_latex: "Paréntesis $\\to$ Exponentes $\\to$ Mult/Div $\\to$ Suma/Resta" },
    ],
    applications: [
      {
        field: "Programación",
        icon: "💻",
        title: "Precedencia de operadores",
        description: "En Python, JavaScript, C++: los operadores siguen PEMDAS exactamente. `2 + 3 * 4` devuelve `14`, no `20`. Errores de precedencia causan bugs sutiles en producción.",
        example_latex: "\\text{Python:} \\; 2 ** 3 + 4 * 2 = 8 + 8 = 16"
      },
    ],
    worked_examples: [
      {
        title: "Expresión compleja",
        problem_latex: "Evalúa: $\\dfrac{(2 + 3)^2 \\times 4}{10 - 2 \\times 3}$",
        solution_latex: "Numerador: $(2+3)^2 \\times 4 = 5^2 \\times 4 = 25 \\times 4 = 100$\nDenominador: $10 - 2 \\times 3 = 10 - 6 = 4$\n\nResultado: $\\dfrac{100}{4} = 25$"
      },
    ],
    visualizer: { type: "none" },
    pro_tips: [
      "Cuando tengas duda, agrega paréntesis extra. No cuesta nada y evita errores.",
      "En programación, SIEMPRE usa paréntesis explícitos en expresiones complejas para claridad.",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 2 - ÁLGEBRA I
  // ═══════════════════════════════════════

  {
    topic_id: "t-2-1",
    why_it_matters: "Los exponentes comprimen cálculos enormes en notación compacta. Son la base de los logaritmos, el crecimiento exponencial (poblaciones, inversiones, machine learning), y notación científica. Sin exponentes fluidos, el cálculo se paraliza.",
    theory_sections: [
      {
        title: "Las 7 Leyes de los Exponentes",
        content_latex: "1. **Producto:** $x^a \\cdot x^b = x^{a+b}$\n2. **Cociente:** $\\dfrac{x^a}{x^b} = x^{a-b}$\n3. **Potencia de potencia:** $(x^a)^b = x^{ab}$\n4. **Potencia de producto:** $(xy)^n = x^n y^n$\n5. **Potencia de cociente:** $\\left(\\dfrac{x}{y}\\right)^n = \\dfrac{x^n}{y^n}$\n6. **Exponente cero:** $x^0 = 1$ (para $x \\neq 0$)\n7. **Exponente negativo:** $x^{-n} = \\dfrac{1}{x^n}$"
      },
      {
        title: "Exponentes Fraccionarios",
        content_latex: "$x^{1/n} = \\sqrt[n]{x}$\n\n$x^{m/n} = \\sqrt[n]{x^m} = (\\sqrt[n]{x})^m$\n\nEjemplo: $8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4$\n\nEsto conecta exponentes con raíces — dos conceptos que parecían separados son realmente uno solo."
      },
    ],
    key_formulas: [
      { name: "Producto de potencias", formula_latex: "$x^a \\cdot x^b = x^{a+b}$" },
      { name: "Potencia de potencia", formula_latex: "$(x^a)^b = x^{ab}$" },
      { name: "Exponente negativo", formula_latex: "$x^{-n} = \\dfrac{1}{x^n}$" },
      { name: "Exponente fraccionario", formula_latex: "$x^{m/n} = \\sqrt[n]{x^m}$" },
    ],
    applications: [
      {
        field: "Ciencia de Datos",
        icon: "📊",
        title: "Notación Big-O",
        description: "La complejidad algorítmica se mide con exponentes: $O(n)$, $O(n^2)$, $O(2^n)$. La diferencia entre $n^2$ y $n \\log n$ puede ser horas vs. segundos en millones de datos.",
        example_latex: "Sorting: QuickSort $O(n \\log n)$ vs BubbleSort $O(n^2)$. Con $n=10^6$: $\\sim 20 \\times 10^6$ vs $10^{12}$ operaciones."
      },
      {
        field: "Biología",
        icon: "🧬",
        title: "Crecimiento de bacterias",
        description: "Una bacteria que se duplica cada 20 minutos: después de $t$ minutos hay $N = N_0 \\cdot 2^{t/20}$ bacterias.",
        example_latex: "Empezando con $1$ bacteria, tras $6$ horas ($360$ min): $2^{360/20} = 2^{18} = 262{,}144$ bacterias."
      },
    ],
    worked_examples: [
      {
        title: "Simplificación con múltiples leyes",
        problem_latex: "Simplifica: $\\dfrac{(2x^3y^{-2})^4}{8x^5y^{-3}}$",
        solution_latex: "Numerador: $2^4 x^{12} y^{-8} = 16x^{12}y^{-8}$\n\n$\\dfrac{16x^{12}y^{-8}}{8x^5 y^{-3}} = 2x^{12-5}y^{-8-(-3)} = 2x^7 y^{-5} = \\dfrac{2x^7}{y^5}$"
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "2^x", params: { xMin: -3, xMax: 5 } },
    pro_tips: [
      "Memoriza: $2^{10} = 1024 \\approx 10^3$. Esto te permite convertir rápido entre potencias de 2 y 10.",
      "Las leyes de exponentes son las mismas reglas que usarás en logaritmos, pero al revés.",
      "En Data Science: saber estimar $2^{20} \\approx 10^6$, $2^{30} \\approx 10^9$ es esencial.",
    ]
  },

  {
    topic_id: "t-2-3",
    why_it_matters: "Factorizar es la habilidad #1 del álgebra. Te permite resolver ecuaciones cuadráticas, simplificar expresiones racionales, y encontrar raíces de polinomios. Es el equivalente algebraico de descomponer un problema grande en partes manejables — exactamente lo que hace un ingeniero.",
    theory_sections: [
      {
        title: "Técnicas de Factorización",
        content_latex: "**1. Factor Común:** $6x^2 + 9x = 3x(2x + 3)$\n\n**2. Diferencia de Cuadrados:** $a^2 - b^2 = (a-b)(a+b)$\nEjemplo: $x^2 - 16 = (x-4)(x+4)$\n\n**3. Trinomio Cuadrado Perfecto:** $a^2 \\pm 2ab + b^2 = (a \\pm b)^2$\nEjemplo: $x^2 + 6x + 9 = (x+3)^2$\n\n**4. Trinomio de la forma $x^2 + bx + c$:**\nBusca $p, q$ con $p + q = b$ y $pq = c$.\n$x^2 + 7x + 12 = (x+3)(x+4)$\n\n**5. Factorización por Agrupación:** Para trinomios $ax^2 + bx + c$ con $a \\neq 1$."
      },
    ],
    key_formulas: [
      { name: "Diferencia de cuadrados", formula_latex: "$a^2 - b^2 = (a-b)(a+b)$" },
      { name: "TCP", formula_latex: "$a^2 + 2ab + b^2 = (a+b)^2$" },
      { name: "Suma de cubos", formula_latex: "$a^3 + b^3 = (a+b)(a^2 - ab + b^2)$" },
    ],
    applications: [
      {
        field: "Criptografía",
        icon: "🔐",
        title: "RSA depende de factorización",
        description: "La seguridad de internet se basa en que factorizar números enormes ($>300$ dígitos) es extremadamente difícil. RSA multiplica dos primos grandes; descifrar sin la clave requiere factorizarlos.",
        example_latex: "RSA usa $n = pq$ con primos de $\\sim 150$ dígitos. Factorizar $n$ tomaría millones de años."
      },
      {
        field: "Optimización",
        icon: "📈",
        title: "Encontrar máximos/mínimos",
        description: "Para optimizar $f(x) = -2x^2 + 12x - 10$, factorizas para encontrar raíces y vértice.",
        example_latex: "$-2(x^2 - 6x + 5) = -2(x-1)(x-5) = 0$. Raíces: $x=1, x=5$. Vértice en $x=3$, $f(3)=8$."
      },
    ],
    worked_examples: [
      {
        title: "Factorización por agrupación (Stewart-style)",
        problem_latex: "Factoriza: $2x^3 - x^2 - 8x + 4$",
        solution_latex: "Agrupa: $(2x^3 - x^2) + (-8x + 4)$\n\n$= x^2(2x - 1) - 4(2x - 1)$\n\n$= (2x-1)(x^2 - 4)$\n\n$= (2x-1)(x-2)(x+2)$"
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "x^2-9", params: { xMin: -5, xMax: 5 } },
    pro_tips: [
      "SIEMPRE saca el factor común PRIMERO. Simplifica todo antes de intentar técnicas avanzadas.",
      "Si el trinomio no factoriza fácilmente, verifica el discriminante: $b^2 - 4ac$. Si es negativo, no factoriza en reales.",
      "La factorización es precursora de la descomposición en fracciones parciales en cálculo integral.",
    ]
  },

  {
    topic_id: "t-2-6",
    why_it_matters: "La ecuación cuadrática $ax^2 + bx + c = 0$ aparece en física (movimiento de proyectiles), economía (maximizar ganancias), ingeniería (diseño de arcos), y es la puerta de entrada a polinomios de mayor grado. La fórmula general es una de las herramientas más usadas en toda la matemática.",
    theory_sections: [
      {
        title: "Tres Métodos de Resolución",
        content_latex: "**1. Factorización:** Si $x^2 - 5x + 6 = 0 \\Rightarrow (x-2)(x-3) = 0 \\Rightarrow x = 2, 3$\n\n**2. Fórmula General:**\n$$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n**3. Completar el cuadrado:**\n$x^2 + 6x + 5 = 0$\n$(x^2 + 6x + 9) = -5 + 9$\n$(x+3)^2 = 4$\n$x + 3 = \\pm 2$\n$x = -1$ o $x = -5$"
      },
      {
        title: "El Discriminante",
        content_latex: "$\\Delta = b^2 - 4ac$ determina la naturaleza de las raíces:\n\n• $\\Delta > 0$: Dos raíces reales distintas\n• $\\Delta = 0$: Una raíz real doble (la parábola toca el eje $x$)\n• $\\Delta < 0$: No hay raíces reales (dos complejas conjugadas)\n\nGeométricamente: $\\Delta$ te dice si la parábola cruza, toca o no toca el eje $x$."
      },
    ],
    key_formulas: [
      { name: "Fórmula General", formula_latex: "$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$" },
      { name: "Discriminante", formula_latex: "$\\Delta = b^2 - 4ac$" },
      { name: "Suma y producto de raíces", formula_latex: "$x_1 + x_2 = -\\dfrac{b}{a}$, $x_1 \\cdot x_2 = \\dfrac{c}{a}$" },
    ],
    applications: [
      {
        field: "Física",
        icon: "🚀",
        title: "Movimiento de proyectiles",
        description: "La altura de un proyectil es $h(t) = -\\frac{1}{2}gt^2 + v_0 t + h_0$. Para saber cuándo toca el suelo, resuelves $h(t) = 0$.",
        example_latex: "$h(t) = -5t^2 + 20t + 25 = 0$. $t = \\dfrac{-20 \\pm \\sqrt{400 + 500}}{-10} = \\dfrac{-20 \\pm 30}{-10}$. $t = 5$ seg."
      },
      {
        field: "Economía",
        icon: "📊",
        title: "Maximizar ganancias",
        description: "Si el ingreso es $R(x) = -2x^2 + 100x$ donde $x$ es el precio, el máximo está en el vértice.",
        example_latex: "Vértice: $x = -\\dfrac{b}{2a} = -\\dfrac{100}{-4} = 25$. Precio óptimo: $\\$25$. Ingreso máximo: $R(25) = \\$1{,}250$."
      },
    ],
    worked_examples: [
      {
        title: "Problema de optimización de área",
        problem_latex: "Un granjero tiene $200$ metros de cerca para un corral rectangular pegado a un muro. ¿Dimensiones para área máxima?",
        solution_latex: "Sea $x$ el lado perpendicular al muro. Perímetro: $2x + y = 200 \\Rightarrow y = 200 - 2x$.\n\n$A(x) = x(200 - 2x) = -2x^2 + 200x$\n\nVértice: $x = \\dfrac{200}{4} = 50$. $y = 100$.\n\nÁrea máxima: $50 \\times 100 = 5{,}000$ m²."
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "x^2-5*x+6", params: { xMin: -2, xMax: 7 } },
    pro_tips: [
      "Siempre intenta factorizar PRIMERO. Solo usa la fórmula general si la factorización no es obvia.",
      "El vértice está en $x = -b/(2a)$. Para máximos/mínimos, esto es todo lo que necesitas.",
      "Si $\\Delta < 0$, las raíces son complejas: $x = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a}$. Esto conecta con números complejos.",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 3 - ÁLGEBRA II Y FUNCIONES
  // ═══════════════════════════════════════

  {
    topic_id: "t-3-1",
    why_it_matters: "Las funciones son el lenguaje universal de la ciencia. Cada modelo de ML es una función. Cada API recibe inputs y produce outputs — es una función. Dominar funciones es dominar el pensamiento matemático moderno.",
    theory_sections: [
      {
        title: "¿Qué es una función?",
        content_latex: "Una función $f: A \\to B$ asigna a CADA elemento de $A$ EXACTAMENTE un elemento de $B$.\n\n**Dominio** ($A$): todos los inputs válidos.\n**Rango/Imagen:** todos los outputs posibles.\n\nEjemplo: $f(x) = \\sqrt{x}$ tiene dominio $[0, \\infty)$ porque no puedes sacar raíz de negativos (en los reales)."
      },
      {
        title: "Composición e Inversa",
        content_latex: "**Composición:** $(f \\circ g)(x) = f(g(x))$. Aplica $g$ primero, luego $f$.\n\nEjemplo: $f(x) = x^2$, $g(x) = x + 3$. $(f \\circ g)(x) = (x+3)^2$.\n\n**Inversa:** $f^{-1}$ \"deshace\" lo que $f$ hace. Si $f(2) = 8$, entonces $f^{-1}(8) = 2$.\n\nPara encontrar $f^{-1}$: escribe $y = f(x)$, despeja $x$, luego intercambia $x$ e $y$."
      },
    ],
    key_formulas: [
      { name: "Composición", formula_latex: "$(f \\circ g)(x) = f(g(x))$" },
      { name: "Inversa", formula_latex: "$f(f^{-1}(x)) = x = f^{-1}(f(x))$" },
    ],
    applications: [
      {
        field: "Machine Learning",
        icon: "🤖",
        title: "Funciones de activación",
        description: "Cada neurona en una red neuronal aplica una función: $\\text{output} = \\sigma(\\mathbf{w} \\cdot \\mathbf{x} + b)$ donde $\\sigma$ es la función de activación (ReLU, sigmoid, etc.).",
        example_latex: "\\text{ReLU}(x) = \\max(0, x), \\quad \\sigma(x) = \\dfrac{1}{1 + e^{-x}}"
      },
      {
        field: "APIs / Software",
        icon: "🔧",
        title: "Funciones puras en programación",
        description: "Una función que dado el mismo input siempre da el mismo output es una función pura. Es exactamente la definición matemática. La programación funcional se basa en esto.",
      },
    ],
    worked_examples: [
      {
        title: "Encontrar la inversa",
        problem_latex: "Encuentra $f^{-1}(x)$ si $f(x) = \\dfrac{2x + 3}{x - 1}$",
        solution_latex: "Sea $y = \\dfrac{2x+3}{x-1}$.\n\n$y(x-1) = 2x+3$\n$yx - y = 2x + 3$\n$yx - 2x = y + 3$\n$x(y-2) = y + 3$\n$x = \\dfrac{y+3}{y-2}$\n\n$f^{-1}(x) = \\dfrac{x+3}{x-2}$"
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "x^2", params: { xMin: -5, xMax: 5 } },
    pro_tips: [
      "Piensa en funciones como máquinas: input → procesamiento → output.",
      "La composición $(f \\circ g)(x)$ se lee 'f de g de x' — trabaja de adentro hacia afuera.",
      "En programación: `const compose = (f, g) => x => f(g(x))`. Es el mismo concepto.",
    ]
  },

  {
    topic_id: "t-3-3",
    why_it_matters: "Los logaritmos son la operación INVERSA de los exponentes. Son esenciales para: entropía en información (base de compresión y ML), escalas logarítmicas (Richter, decibelios, pH), complejidad algorítmica ($O(\\log n)$), y finanzas (interés compuesto). Si no entiendes logaritmos, no entiendes crecimiento exponencial, y TODA la ciencia de datos se basa en ello.",
    theory_sections: [
      {
        title: "Definición y Propiedades",
        content_latex: "$$\\log_b(x) = y \\iff b^y = x$$\n\n$\\log_b(x)$ pregunta: '¿A qué potencia elevo $b$ para obtener $x$?'\n\nEjemplo: $\\log_2(8) = 3$ porque $2^3 = 8$.\n\n**Propiedades Fundamentales:**\n1. $\\log_b(xy) = \\log_b(x) + \\log_b(y)$\n2. $\\log_b\\left(\\dfrac{x}{y}\\right) = \\log_b(x) - \\log_b(y)$\n3. $\\log_b(x^n) = n \\cdot \\log_b(x)$\n4. $\\log_b(1) = 0$\n5. $\\log_b(b) = 1$\n6. **Cambio de base:** $\\log_b(x) = \\dfrac{\\ln(x)}{\\ln(b)}$"
      },
      {
        title: "Logaritmo Natural y Base 10",
        content_latex: "$\\ln(x) = \\log_e(x)$ donde $e \\approx 2.71828$.\n\n$\\log(x) = \\log_{10}(x)$ (logaritmo común).\n\n$e$ es especial porque: $\\dfrac{d}{dx}[e^x] = e^x$ — la única función que es su propia derivada.\n\n$\\ln$ aparece en: entropía, distribución normal, interés compuesto continuo, soluciones de EDOs."
      },
    ],
    key_formulas: [
      { name: "Definición", formula_latex: "$\\log_b(x) = y \\iff b^y = x$" },
      { name: "Producto", formula_latex: "$\\log_b(xy) = \\log_b(x) + \\log_b(y)$" },
      { name: "Potencia", formula_latex: "$\\log_b(x^n) = n \\log_b(x)$" },
      { name: "Cambio de base", formula_latex: "$\\log_b(x) = \\dfrac{\\ln(x)}{\\ln(b)}$" },
    ],
    applications: [
      {
        field: "Data Science / ML",
        icon: "🧠",
        title: "Cross-entropy y log-loss",
        description: "La función de pérdida en clasificación es: $L = -\\sum y_i \\log(\\hat{y}_i)$. Sin logaritmos, no hay redes neuronales modernas.",
        example_latex: "Si el modelo predice $\\hat{y} = 0.9$ para la clase correcta: $-\\log(0.9) \\approx 0.105$ (pérdida baja)."
      },
      {
        field: "Ciencias de la Tierra",
        icon: "🌍",
        title: "Escala Richter (sismología)",
        description: "La magnitud Richter es logarítmica: un terremoto de magnitud 7 es 10 veces más fuerte que uno de 6, y 100 veces más que uno de 5.",
        example_latex: "Magnitud: $M = \\log_{10}\\left(\\dfrac{A}{A_0}\\right)$. De $M=5$ a $M=7$: factor $10^{7-5} = 100$ en amplitud."
      },
      {
        field: "Ciencias de la Computación",
        icon: "💻",
        title: "Búsqueda binaria: $O(\\log n)$",
        description: "En un arreglo ordenado de 1 millón de elementos, búsqueda binaria encuentra cualquier elemento en ~20 pasos porque $\\log_2(10^6) \\approx 20$.",
        example_latex: "\\log_2(1{,}000{,}000) \\approx 20 \\text{ pasos (vs 1,000,000 en búsqueda lineal)}"
      },
    ],
    worked_examples: [
      {
        title: "Ecuación exponencial resuelta con logaritmos",
        problem_latex: "Resuelve: $5^{2x-1} = 3^{x+2}$",
        solution_latex: "Toma $\\ln$ de ambos lados:\n$(2x-1)\\ln(5) = (x+2)\\ln(3)$\n\n$2x\\ln(5) - \\ln(5) = x\\ln(3) + 2\\ln(3)$\n\n$x(2\\ln 5 - \\ln 3) = 2\\ln 3 + \\ln 5$\n\n$x = \\dfrac{2\\ln 3 + \\ln 5}{2\\ln 5 - \\ln 3} = \\dfrac{2(1.099) + 1.609}{2(1.609) - 1.099} \\approx \\dfrac{3.807}{2.119} \\approx 1.797$"
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "log(x)/log(2)", params: { xMin: 0.1, xMax: 20 } },
    pro_tips: [
      "Memoriza: $\\log_2(1024) = 10$. Cada vez que doblas datos, necesitas solo 1 paso más de búsqueda binaria.",
      "Los logaritmos CONVIERTEN multiplicaciones en sumas — por eso fueron inventados (John Napier, 1614) para simplificar cálculos astronómicos.",
      "En ML: 'log-likelihood', 'log-loss', 'log-scale' — los logaritmos están EN TODAS PARTES.",
    ]
  },

  {
    topic_id: "t-3-6",
    why_it_matters: "Las sucesiones y series modelan patrones predecibles: cuotas de crédito, crecimiento de inversiones, convergencia de algoritmos (gradient descent), y son la base de las series de Taylor que permiten a las computadoras calcular $\\sin$, $\\cos$ y $e^x$.",
    theory_sections: [
      {
        title: "Sucesiones Aritméticas y Geométricas",
        content_latex: "**Aritmética:** Diferencia constante $d$.\n$a_n = a_1 + (n-1)d$, $S_n = \\dfrac{n}{2}(a_1 + a_n)$\n\n**Geométrica:** Razón constante $r$.\n$a_n = a_1 \\cdot r^{n-1}$, $S_n = a_1 \\cdot \\dfrac{1 - r^n}{1 - r}$\n\n**Serie geométrica infinita** (si $|r| < 1$):\n$$S = \\dfrac{a_1}{1 - r}$$"
      },
    ],
    key_formulas: [
      { name: "Término general aritmético", formula_latex: "$a_n = a_1 + (n-1)d$" },
      { name: "Término general geométrico", formula_latex: "$a_n = a_1 \\cdot r^{n-1}$" },
      { name: "Serie geométrica infinita", formula_latex: "$S = \\dfrac{a_1}{1-r}$ para $|r| < 1$" },
    ],
    applications: [
      {
        field: "Finanzas",
        icon: "🏦",
        title: "Valor futuro de inversiones",
        description: "Si inviertes $\\$P$ cada mes con tasa $r$ mensual por $n$ meses: $FV = P \\cdot \\frac{(1+r)^n - 1}{r}$ (serie geométrica).",
        example_latex: "\\$5{,}000$/mes, $8\\%$/año ($r=0.00667$/mes), 30 años: $FV = 5000 \\cdot \\dfrac{(1.00667)^{360}-1}{0.00667} \\approx \\$7{,}451{,}000$"
      },
    ],
    worked_examples: [
      {
        title: "Serie telescópica",
        problem_latex: "Calcula: $\\displaystyle\\sum_{k=1}^{n} \\dfrac{1}{k(k+1)}$",
        solution_latex: "Fracciones parciales: $\\dfrac{1}{k(k+1)} = \\dfrac{1}{k} - \\dfrac{1}{k+1}$\n\nSuma telescópica: $\\left(1 - \\dfrac{1}{2}\\right) + \\left(\\dfrac{1}{2} - \\dfrac{1}{3}\\right) + \\cdots = 1 - \\dfrac{1}{n+1} = \\dfrac{n}{n+1}$"
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "1/(1-0.5*x)", params: { xMin: -1, xMax: 1.8 } },
    pro_tips: [
      "Para identificar si es aritmética o geométrica: si las diferencias son constantes → aritmética. Si los cocientes son constantes → geométrica.",
      "La convergencia de series es CRÍTICA en análisis numérico y ML (¿converge el gradiente descendente?).",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 4 - TRIGONOMETRÍA
  // ═══════════════════════════════════════

  {
    topic_id: "t-4-1",
    why_it_matters: "La trigonometría conecta ángulos con medidas lineales. Es indispensable en: gráficos 3D (rotaciones en videojuegos), procesamiento de señales (audio, WiFi), GPS, ingeniería civil (fuerzas en estructuras), y machine learning (transformada de Fourier para series temporales).",
    theory_sections: [
      {
        title: "El Círculo Unitario",
        content_latex: "El círculo unitario tiene radio $1$ centrado en el origen. Para un ángulo $\\theta$:\n\n$$\\cos(\\theta) = x, \\quad \\sin(\\theta) = y, \\quad \\tan(\\theta) = \\dfrac{y}{x}$$\n\n**Valores clave:** $\\sin(30°) = \\dfrac{1}{2}$, $\\cos(60°) = \\dfrac{1}{2}$, $\\sin(45°) = \\cos(45°) = \\dfrac{\\sqrt{2}}{2}$\n\n**Radianes:** $180° = \\pi$ rad. Conversión: $\\theta_{rad} = \\theta_{deg} \\times \\dfrac{\\pi}{180}$"
      },
      {
        title: "Gráficas Trigonométricas",
        content_latex: "$y = A\\sin(Bx + C) + D$\n\n**Amplitud:** $|A|$ (altura máxima).\n**Período:** $\\dfrac{2\\pi}{|B|}$ (longitud de un ciclo).\n**Desfase:** $-\\dfrac{C}{B}$ (desplazamiento horizontal).\n**Desplazamiento vertical:** $D$."
      },
    ],
    key_formulas: [
      { name: "Identidad pitagórica", formula_latex: "$\\sin^2\\theta + \\cos^2\\theta = 1$" },
      { name: "Tangente", formula_latex: "$\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$" },
      { name: "Ángulo doble seno", formula_latex: "$\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$" },
    ],
    applications: [
      {
        field: "Gráficos 3D / Videojuegos",
        icon: "🎮",
        title: "Rotaciones en el espacio",
        description: "Rotar un punto $(x,y)$ un ángulo $\\theta$: $x' = x\\cos\\theta - y\\sin\\theta$, $y' = x\\sin\\theta + y\\cos\\theta$. Cada frame de un videojuego hace miles de estas operaciones.",
        example_latex: "\\text{Rotar } (1, 0) \\text{ por } 90°: \\; x' = \\cos 90° = 0, \\; y' = \\sin 90° = 1. \\text{ Resultado: } (0,1)"
      },
      {
        field: "Procesamiento de Señales",
        icon: "📡",
        title: "Ondas y Fourier",
        description: "Toda señal (audio, WiFi, imagen) se puede descomponer en sumas de senos y cosenos (Series de Fourier). Tu celular hace esto cada vez que envías un mensaje.",
      },
    ],
    worked_examples: [
      {
        title: "Encontrar todos los valores del ángulo",
        problem_latex: "Resuelve $2\\sin^2(x) - \\sin(x) - 1 = 0$ para $0 \\leq x < 2\\pi$.",
        solution_latex: "Sea $u = \\sin(x)$: $2u^2 - u - 1 = 0$\n\n$(2u + 1)(u - 1) = 0$\n\n$u = -\\frac{1}{2}$ o $u = 1$\n\n$\\sin(x) = -\\frac{1}{2}$: $x = \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$\n\n$\\sin(x) = 1$: $x = \\frac{\\pi}{2}$\n\nSoluciones: $x = \\dfrac{\\pi}{2}, \\dfrac{7\\pi}{6}, \\dfrac{11\\pi}{6}$"
      },
    ],
    visualizer: { type: "unit-circle" },
    pro_tips: [
      "MEMORIZA el círculo unitario. Es como saber las tablas de multiplicar — lo usarás constantemente.",
      "Piensa en radianes naturalmente: $\\pi/6 = 30°$, $\\pi/4 = 45°$, $\\pi/3 = 60°$, $\\pi/2 = 90°$.",
      "En programación, TODAS las funciones trig usan radianes, no grados.",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 5 - CÁLCULO DIFERENCIAL
  // ═══════════════════════════════════════

  {
    topic_id: "t-5-1",
    why_it_matters: "Los límites son el fundamento filosófico y técnico de TODO el cálculo. Sin límites no hay derivadas, no hay integrales, no hay series infinitas. Es la idea de 'acercarse infinitamente sin llegar' que permite medir lo instantáneo (velocidad, tasa de cambio).",
    theory_sections: [
      {
        title: "Concepto Intuitivo",
        content_latex: "$\\displaystyle\\lim_{x \\to a} f(x) = L$ significa que $f(x)$ se acerca a $L$ cuando $x$ se acerca a $a$.\n\nIMPORTANTE: No importa qué valor tiene $f(a)$ — solo importa el comportamiento CERCA de $a$.\n\nEjemplo: $\\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x + 2) = 4$\n\nAunque $f(2)$ no existe (división por 0), el límite SÍ existe."
      },
      {
        title: "Indeterminaciones y L'Hôpital",
        content_latex: "Las formas $\\dfrac{0}{0}$ y $\\dfrac{\\infty}{\\infty}$ son indeterminadas — necesitan análisis.\n\n**Regla de L'Hôpital:** Si $\\dfrac{f(a)}{g(a)} = \\dfrac{0}{0}$ o $\\dfrac{\\infty}{\\infty}$:\n$$\\lim_{x \\to a} \\dfrac{f(x)}{g(x)} = \\lim_{x \\to a} \\dfrac{f'(x)}{g'(x)}$$\n\nEjemplo: $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = \\lim_{x \\to 0} \\dfrac{\\cos x}{1} = 1$"
      },
    ],
    key_formulas: [
      { name: "Límite notable", formula_latex: "$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$" },
      { name: "Número $e$", formula_latex: "$\\lim_{n \\to \\infty} \\left(1 + \\dfrac{1}{n}\\right)^n = e$" },
      { name: "L'Hôpital", formula_latex: "$\\lim \\dfrac{f}{g} = \\lim \\dfrac{f'}{g'}$ (si $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$)" },
    ],
    applications: [
      {
        field: "Física",
        icon: "⚡",
        title: "Velocidad instantánea",
        description: "La velocidad instantánea es un límite: $v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta s}{\\Delta t}$. Sin este concepto, Newton no habría podido formular la mecánica clásica.",
        example_latex: "Si $s(t) = t^2$: $v = \\lim_{h \\to 0} \\dfrac{(t+h)^2 - t^2}{h} = \\lim_{h \\to 0} (2t + h) = 2t$"
      },
    ],
    worked_examples: [
      {
        title: "Límite que define $e$ (Stewart Cap. 3)",
        problem_latex: "Calcula: $\\displaystyle\\lim_{x \\to 0} \\dfrac{e^x - 1}{x}$",
        solution_latex: "Forma $\\frac{0}{0}$. L'Hôpital:\n\n$\\lim_{x \\to 0} \\dfrac{e^x}{1} = e^0 = 1$\n\nEste límite es fundamental: define la derivada de $e^x$."
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "sin(x)/x", params: { xMin: -10, xMax: 10 } },
    pro_tips: [
      "Siempre intenta sustitución directa primero. Solo si obtienes $0/0$ o $\\infty/\\infty$, usa técnicas adicionales.",
      "Visualiza: el límite es hacia dónde APUNTA la función, no necesariamente donde ESTÁ.",
      "L'Hôpital solo funciona para $0/0$ o $\\infty/\\infty$. Para otras formas, primero transforma.",
    ]
  },

  {
    topic_id: "t-5-3",
    why_it_matters: "La derivada mide el CAMBIO INSTANTÁNEO. Es la herramienta más poderosa de la ciencia e ingeniería: velocidad, aceleración, tasa de reacción química, marginal en economía, gradiente en machine learning. Gradient descent (base de TODA la IA moderna) es literalmente 'seguir la derivada'.",
    theory_sections: [
      {
        title: "Definición y Reglas",
        content_latex: "**Definición formal:**\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\n**Reglas de derivación:**\n1. Potencia: $(x^n)' = nx^{n-1}$\n2. Constante: $(c)' = 0$\n3. Suma: $(f+g)' = f' + g'$\n4. Producto: $(fg)' = f'g + fg'$\n5. Cociente: $\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f'g - fg'}{g^2}$\n6. **Cadena:** $(f(g(x)))' = f'(g(x)) \\cdot g'(x)$"
      },
      {
        title: "Interpretación Geométrica",
        content_latex: "$f'(a)$ es la **pendiente de la recta tangente** a $f$ en $x = a$.\n\nRecta tangente: $y - f(a) = f'(a)(x - a)$\n\nSi $f'(a) > 0$: $f$ crece en $a$.\nSi $f'(a) < 0$: $f$ decrece en $a$.\nSi $f'(a) = 0$: posible máximo, mínimo o punto de inflexión."
      },
    ],
    key_formulas: [
      { name: "Potencia", formula_latex: "$\\dfrac{d}{dx}[x^n] = nx^{n-1}$" },
      { name: "Cadena", formula_latex: "$\\dfrac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$" },
      { name: "Exponencial", formula_latex: "$\\dfrac{d}{dx}[e^x] = e^x$" },
      { name: "Logaritmo", formula_latex: "$\\dfrac{d}{dx}[\\ln x] = \\dfrac{1}{x}$" },
    ],
    applications: [
      {
        field: "Inteligencia Artificial",
        icon: "🧠",
        title: "Gradient Descent (Gradiente Descendente)",
        description: "TODA red neuronal moderna se entrena con gradient descent: $\\theta_{\\text{new}} = \\theta - \\alpha \\nabla L(\\theta)$. La derivada (gradiente) indica la dirección de máximo descenso de la pérdida.",
        example_latex: "L(\\theta) = (\\theta - 3)^2. \\; L'(\\theta) = 2(\\theta-3). \\; \\text{Con } \\theta=0, \\alpha=0.1: \\; \\theta_{new} = 0 - 0.1(-6) = 0.6"
      },
      {
        field: "Economía",
        icon: "📈",
        title: "Costo marginal",
        description: "Si $C(x)$ es el costo de producir $x$ unidades, entonces $C'(x)$ es el costo de producir UNA unidad adicional. Las empresas producen hasta donde $C'(x) = R'(x)$ (ingreso marginal).",
        example_latex: "C(x) = 0.01x^2 + 5x + 1000. \\; C'(x) = 0.02x + 5. \\; C'(100) = \\$7 \\text{ por unidad extra.}"
      },
    ],
    worked_examples: [
      {
        title: "Regla de la cadena anidada (Stewart Cap. 3.4)",
        problem_latex: "Deriva: $f(x) = \\ln(\\sin(e^{2x}))$",
        solution_latex: "Cadena capa por capa (afuera hacia adentro):\n\n$f'(x) = \\dfrac{1}{\\sin(e^{2x})} \\cdot \\cos(e^{2x}) \\cdot e^{2x} \\cdot 2$\n\n$= \\dfrac{2e^{2x} \\cos(e^{2x})}{\\sin(e^{2x})} = 2e^{2x} \\cot(e^{2x})$"
      },
    ],
    visualizer: { type: "derivative-tangent", defaultExpression: "x^3-3*x", params: { xMin: -3, xMax: 3 } },
    pro_tips: [
      "La regla de la cadena es la regla MÁS IMPORTANTE. Si solo memorizas una cosa, que sea la cadena.",
      "Piensa en la derivada como 'sensibilidad': ¿cuánto cambia el output si muevo el input un poquito?",
      "En ML, backpropagation es simplemente la regla de la cadena aplicada repetidamente a través de la red.",
    ]
  },

  {
    topic_id: "t-5-5",
    why_it_matters: "La optimización es para lo que existe el cálculo diferencial. Encontrar máximos y mínimos es lo que hacen los ingenieros (minimizar costo), los científicos de datos (minimizar error), los físicos (principio de mínima acción), y los economistas (maximizar utilidad).",
    theory_sections: [
      {
        title: "Puntos Críticos y Test de Derivada",
        content_latex: "**Puntos críticos:** donde $f'(x) = 0$ o $f'(x)$ no existe.\n\n**Test de la segunda derivada:**\n• $f''(c) > 0$: mínimo local\n• $f''(c) < 0$: máximo local\n• $f''(c) = 0$: inconcluso (usar test de la primera derivada)\n\n**Puntos de inflexión:** donde $f''(x) = 0$ y cambia de signo (cambio de concavidad)."
      },
      {
        title: "Problemas de Optimización",
        content_latex: "**Método de Polya:**\n1. ENTENDER: ¿Qué quiero maximizar/minimizar? ¿Cuáles son las restricciones?\n2. MODELAR: Expresar como función de una variable.\n3. DERIVAR: $f'(x) = 0$ para puntos críticos.\n4. VERIFICAR: Confirmar que es max/min (segunda derivada o valores extremos)."
      },
    ],
    key_formulas: [
      { name: "Test 2da derivada", formula_latex: "$f''(c) > 0 \\Rightarrow$ mínimo, $f''(c) < 0 \\Rightarrow$ máximo" },
    ],
    applications: [
      {
        field: "Ingeniería",
        icon: "🏗️",
        title: "Diseño óptimo de envases",
        description: "Minimizar material (superficie) para un volumen dado. Cada lata de refresco que ves fue optimizada así.",
        example_latex: "Lata cilíndrica de $V = 330$ ml: $S = 2\\pi r^2 + \\dfrac{660}{r}$. $S'(r) = 4\\pi r - \\dfrac{660}{r^2} = 0 \\Rightarrow r = \\sqrt[3]{\\dfrac{165}{2\\pi}} \\approx 3.7$ cm."
      },
    ],
    worked_examples: [
      {
        title: "Optimización con restricción (estilo Stewart)",
        problem_latex: "Minimizar la distancia del punto $(0, 0)$ a la parábola $y = x^2 + 1$.",
        solution_latex: "Distancia²: $D^2 = x^2 + y^2 = x^2 + (x^2+1)^2 = x^2 + x^4 + 2x^2 + 1 = x^4 + 3x^2 + 1$\n\n$\\dfrac{d}{dx}(D^2) = 4x^3 + 6x = 2x(2x^2 + 3) = 0$\n\n$x = 0$ (único real). $y = 1$. Distancia mínima $= 1$."
      },
    ],
    visualizer: { type: "derivative-tangent", defaultExpression: "x^3-6*x^2+9*x+1", params: { xMin: -1, xMax: 5 } },
    pro_tips: [
      "En problemas de optimización, DIBUJA siempre. El diagrama vale más que 100 ecuaciones.",
      "Si tienes DOS variables y UNA restricción, usa la restricción para eliminar una variable.",
      "Siempre verifica que tu punto crítico es realmente un max/min (no un punto de silla).",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 6 - CÁLCULO INTEGRAL
  // ═══════════════════════════════════════

  {
    topic_id: "t-6-1",
    why_it_matters: "Si la derivada mide cambio instantáneo, la integral ACUMULA cambio. Área bajo curvas, volúmenes, trabajo, probabilidad acumulada, valor esperado en estadística — todo es integración. Es la otra mitad del cálculo y completa tu toolbox matemático.",
    theory_sections: [
      {
        title: "La Antiderivada",
        content_latex: "Si $F'(x) = f(x)$, entonces $F(x)$ es una antiderivada de $f(x)$.\n\n$$\\int f(x)\\,dx = F(x) + C$$\n\n**Reglas básicas:**\n$\\int x^n dx = \\dfrac{x^{n+1}}{n+1} + C$ (para $n \\neq -1$)\n\n$\\int e^x dx = e^x + C$\n\n$\\int \\dfrac{1}{x} dx = \\ln|x| + C$\n\n$\\int \\cos x\\,dx = \\sin x + C$\n\n$\\int \\sin x\\,dx = -\\cos x + C$"
      },
    ],
    key_formulas: [
      { name: "Potencia", formula_latex: "$\\int x^n dx = \\dfrac{x^{n+1}}{n+1} + C$" },
      { name: "TFC", formula_latex: "$\\int_a^b f(x)dx = F(b) - F(a)$" },
    ],
    applications: [
      {
        field: "Probabilidad",
        icon: "📊",
        title: "Distribuciones continuas",
        description: "Si $f(x)$ es la función de densidad de probabilidad, $P(a \\leq X \\leq b) = \\int_a^b f(x)dx$. La distribución normal, usada en TODO, requiere integración.",
        example_latex: "P(-1 \\leq Z \\leq 1) = \\int_{-1}^{1} \\dfrac{1}{\\sqrt{2\\pi}} e^{-x^2/2} dx \\approx 0.6827 \\; (68.27\\%)"
      },
    ],
    worked_examples: [
      {
        title: "Integral por sustitución (u-sub)",
        problem_latex: "Calcula: $\\displaystyle\\int \\dfrac{\\ln(x)}{x} dx$",
        solution_latex: "Sea $u = \\ln(x)$, $du = \\dfrac{1}{x}dx$.\n\n$\\int u\\,du = \\dfrac{u^2}{2} + C = \\dfrac{(\\ln x)^2}{2} + C$"
      },
    ],
    visualizer: { type: "integral-area", defaultExpression: "x^2", params: { xMin: -1, xMax: 3, a: 0, b: 2 } },
    pro_tips: [
      "Verifica tu integral derivándola — deberías obtener el integrando original.",
      "La sustitución (u-sub) es la técnica #1 más usada. Domínala completamente.",
      "NUNCA olvides el $+ C$ en integrales indefinidas. Es un error que cuesta puntos.",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 7 - CÁLCULO MULTIVARIABLE
  // ═══════════════════════════════════════

  {
    topic_id: "t-7-1",
    why_it_matters: "En el mundo real, nada depende de una sola variable. La temperatura depende de $(x,y,z,t)$, un modelo de ML tiene miles de parámetros, la economía tiene múltiples factores. Las derivadas parciales y el gradiente son la extensión natural del cálculo a múltiples dimensiones.",
    theory_sections: [
      {
        title: "Derivadas Parciales y Gradiente",
        content_latex: "**Derivada parcial:** Derivar respecto a una variable, tratando las demás como constantes.\n\n$\\dfrac{\\partial f}{\\partial x}$: derivar con respecto a $x$, $y$ es constante.\n\n**Gradiente:** Vector de todas las parciales.\n$$\\nabla f = \\left(\\dfrac{\\partial f}{\\partial x}, \\dfrac{\\partial f}{\\partial y}, \\ldots\\right)$$\n\nEl gradiente apunta en la dirección de **máximo crecimiento** de $f$."
      },
    ],
    key_formulas: [
      { name: "Gradiente", formula_latex: "$\\nabla f = \\left(\\dfrac{\\partial f}{\\partial x_1}, \\ldots, \\dfrac{\\partial f}{\\partial x_n}\\right)$" },
      { name: "Derivada direccional", formula_latex: "$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}$" },
    ],
    applications: [
      {
        field: "Deep Learning",
        icon: "🧠",
        title: "Backpropagation",
        description: "El entrenamiento de redes neuronales calcula $\\frac{\\partial L}{\\partial w_i}$ para CADA peso $w_i$ — son derivadas parciales. Con millones de pesos, esto es cálculo multivariable a escala masiva.",
        example_latex: "Red simple: $L = (y - \\sigma(wx+b))^2$. $\\dfrac{\\partial L}{\\partial w} = -2(y-\\hat{y})\\hat{y}(1-\\hat{y})x$"
      },
    ],
    worked_examples: [
      {
        title: "Plano tangente",
        problem_latex: "Encuentra el plano tangente a $f(x,y) = x^2 + y^2$ en $(1, 2, 5)$.",
        solution_latex: "$f_x = 2x \\Rightarrow f_x(1,2) = 2$\n$f_y = 2y \\Rightarrow f_y(1,2) = 4$\n\nPlano: $z - 5 = 2(x-1) + 4(y-2)$\n$z = 2x + 4y - 5$"
      },
    ],
    visualizer: { type: "vector-2d", params: { showGradient: true } },
    pro_tips: [
      "El gradiente SIEMPRE apunta hacia donde la función crece más rápido. En gradient descent, vamos EN CONTRA del gradiente.",
      "Para derivadas parciales: tapa mentalmente las otras variables y deriva normalmente.",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 8 - ÁLGEBRA LINEAL
  // ═══════════════════════════════════════

  {
    topic_id: "t-8-1",
    why_it_matters: "Los vectores son el lenguaje de los datos. Cada fila de un dataset es un vector. Word embeddings (GPT, BERT) mapean palabras a vectores de ~768 dimensiones. Imágenes son vectores de miles de píxeles. Si no piensas en vectores, no puedes hacer data science.",
    theory_sections: [
      {
        title: "Vectores y Operaciones",
        content_latex: "Un vector $\\mathbf{v} = (v_1, v_2, \\ldots, v_n)$ es una lista de números.\n\n**Suma:** $(a_1, a_2) + (b_1, b_2) = (a_1+b_1, a_2+b_2)$\n\n**Escalar:** $c(a_1, a_2) = (ca_1, ca_2)$\n\n**Producto punto:** $\\mathbf{a} \\cdot \\mathbf{b} = a_1b_1 + a_2b_2 + \\cdots$\n\n**Norma:** $||\\mathbf{v}|| = \\sqrt{v_1^2 + v_2^2 + \\cdots}$\n\n**Ángulo:** $\\cos\\theta = \\dfrac{\\mathbf{a} \\cdot \\mathbf{b}}{||\\mathbf{a}|| \\cdot ||\\mathbf{b}||}$"
      },
    ],
    key_formulas: [
      { name: "Producto punto", formula_latex: "$\\mathbf{a} \\cdot \\mathbf{b} = \\sum a_i b_i = ||\\mathbf{a}|| \\cdot ||\\mathbf{b}|| \\cos\\theta$" },
      { name: "Norma", formula_latex: "$||\\mathbf{v}|| = \\sqrt{\\sum v_i^2}$" },
    ],
    applications: [
      {
        field: "NLP (IA)",
        icon: "💬",
        title: "Similitud coseno en embeddings",
        description: "GPT y BERT representan palabras como vectores. La similitud entre palabras se mide con el coseno del ángulo: $\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{||a|| \\cdot ||b||}$. Esto es producto punto normalizado.",
        example_latex: "\\text{similitud}(\\text{'rey'}, \\text{'reina'}) = \\cos\\theta \\approx 0.92 \\text{ (muy similares)}"
      },
      {
        field: "Recomendaciones",
        icon: "🎬",
        title: "Netflix / Spotify",
        description: "Tu perfil es un vector de preferencias. Las películas también son vectores. La recomendación es: encontrar películas cuyo vector tenga alto producto punto con tu vector de gustos.",
      },
    ],
    worked_examples: [
      {
        title: "Proyección vectorial (Strang Cap. 1)",
        problem_latex: "Proyecta $\\mathbf{b} = (1, 2, 2)$ sobre $\\mathbf{a} = (1, 0, 0)$.",
        solution_latex: "$\\text{proj}_{\\mathbf{a}} \\mathbf{b} = \\dfrac{\\mathbf{a} \\cdot \\mathbf{b}}{\\mathbf{a} \\cdot \\mathbf{a}} \\mathbf{a} = \\dfrac{1}{1}(1, 0, 0) = (1, 0, 0)$"
      },
    ],
    visualizer: { type: "vector-2d", params: { showProjection: true } },
    pro_tips: [
      "Piensa en vectores como FLECHAS con dirección y magnitud, no solo como listas de números.",
      "Si $\\mathbf{a} \\cdot \\mathbf{b} = 0$, son perpendiculares (ortogonales). Esto es la base de PCA.",
      "En ML: todo son vectores en altas dimensiones. Distancia, similitud, clustering — todo usa normas y productos punto.",
    ]
  },

  {
    topic_id: "t-8-6",
    why_it_matters: "Los eigenvalues y eigenvectores revelan la ESTRUCTURA ESENCIAL de una transformación. PCA (la técnica de reducción dimensional más usada) se basa 100% en eigenvalores. Google PageRank es un problema de eigenvalores. La mecánica cuántica se expresa en eigenvalores.",
    theory_sections: [
      {
        title: "Eigenvalores y Eigenvectores",
        content_latex: "Si $A\\mathbf{v} = \\lambda \\mathbf{v}$ ($\\mathbf{v} \\neq 0$), entonces:\n• $\\lambda$ es un **eigenvalor** de $A$\n• $\\mathbf{v}$ es el **eigenvector** correspondiente\n\n**Cálculo:**\n1. Resuelve $\\det(A - \\lambda I) = 0$ → da los eigenvalores.\n2. Para cada $\\lambda$, resuelve $(A - \\lambda I)\\mathbf{v} = 0$ → da los eigenvectores.\n\n**Diagonalización:** Si $A$ tiene $n$ eigenvectores linealmente independientes: $A = PDP^{-1}$ donde $D$ es diagonal con los eigenvalores."
      },
    ],
    key_formulas: [
      { name: "Ecuación de eigenvalores", formula_latex: "$\\det(A - \\lambda I) = 0$" },
      { name: "Diagonalización", formula_latex: "$A = PDP^{-1}$" },
    ],
    applications: [
      {
        field: "Data Science",
        icon: "📊",
        title: "PCA (Análisis de Componentes Principales)",
        description: "PCA calcula la matriz de covarianza de tus datos y encuentra sus eigenvectores. El eigenvector con mayor eigenvalor indica la dirección de máxima varianza — la 'dimensión más importante'.",
        example_latex: "Dataset con 1000 features → PCA → 50 componentes que capturan $95\\%$ de la varianza."
      },
      {
        field: "Internet",
        icon: "🌐",
        title: "Google PageRank",
        description: "PageRank modela internet como una matriz de enlaces. El ranking de cada página es el eigenvector dominante de esa matriz. Así Google decidía qué páginas mostrar primero.",
      },
    ],
    worked_examples: [
      {
        title: "Eigenvalores 2×2 completo",
        problem_latex: "Encuentra eigenvalores y eigenvectores de $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$",
        solution_latex: "$\\det(A - \\lambda I) = (4-\\lambda)(3-\\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = (\\lambda-5)(\\lambda-2) = 0$\n\n$\\lambda_1 = 5$: $(A - 5I)\\mathbf{v} = 0 \\Rightarrow \\begin{pmatrix}-1&1\\\\2&-2\\end{pmatrix}\\mathbf{v}=0 \\Rightarrow \\mathbf{v}_1 = (1,1)$\n\n$\\lambda_2 = 2$: $(A-2I)\\mathbf{v}=0 \\Rightarrow \\begin{pmatrix}2&1\\\\2&1\\end{pmatrix}\\mathbf{v}=0 \\Rightarrow \\mathbf{v}_2 = (1,-2)$"
      },
    ],
    visualizer: { type: "matrix-transform", params: { a: 4, b: 1, c: 2, d: 3 } },
    pro_tips: [
      "Los eigenvalores de una matriz simétrica siempre son reales — por eso las matrices de covarianza son tan bien comportadas.",
      "La traza $= \\sum \\lambda_i$ y el determinante $= \\prod \\lambda_i$. Útil para verificación rápida.",
      "En ML: si un eigenvalor es muy pequeño, esa dirección es 'ruido'. PCA descarta esas dimensiones.",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 9 - ECUACIONES DIFERENCIALES
  // ═══════════════════════════════════════

  {
    topic_id: "t-9-1",
    why_it_matters: "Las EDOs modelan TODO lo que cambia con el tiempo: crecimiento de poblaciones, decaimiento radiactivo, circuitos eléctricos, propagación de epidemias (SIR), dinámica de precios. Si quieres modelar el mundo real, necesitas ecuaciones diferenciales.",
    theory_sections: [
      {
        title: "Tipos de EDOs de Primer Orden",
        content_latex: "**Separable:** $\\dfrac{dy}{dx} = g(x)h(y) \\Rightarrow \\int \\dfrac{dy}{h(y)} = \\int g(x)dx$\n\n**Lineal:** $\\dfrac{dy}{dx} + P(x)y = Q(x)$\nFactor integrante: $\\mu(x) = e^{\\int P(x)dx}$\nSolución: $y = \\dfrac{1}{\\mu}\\int \\mu Q\\,dx$\n\n**Exacta:** $M(x,y)dx + N(x,y)dy = 0$ es exacta si $\\dfrac{\\partial M}{\\partial y} = \\dfrac{\\partial N}{\\partial x}$"
      },
    ],
    key_formulas: [
      { name: "Separable", formula_latex: "$\\int \\dfrac{dy}{h(y)} = \\int g(x)\\,dx$" },
      { name: "Factor integrante", formula_latex: "$\\mu(x) = e^{\\int P(x)dx}$" },
    ],
    applications: [
      {
        field: "Epidemiología",
        icon: "🦠",
        title: "Modelo SIR (epidemias)",
        description: "La propagación de enfermedades se modela con EDOs: $\\frac{dI}{dt} = \\beta SI - \\gamma I$. Este modelo guió decisiones durante pandemias globales.",
        example_latex: "\\dfrac{dS}{dt} = -\\beta SI, \\quad \\dfrac{dI}{dt} = \\beta SI - \\gamma I, \\quad \\dfrac{dR}{dt} = \\gamma I"
      },
      {
        field: "Electrónica",
        icon: "⚡",
        title: "Circuitos RC",
        description: "La carga de un capacitor sigue: $RC\\frac{dV}{dt} + V = V_0$, una EDO lineal de primer orden.",
        example_latex: "V(t) = V_0(1 - e^{-t/RC}). \\text{ Con } R=1k\\Omega, C=1\\mu F: \\tau = 1ms."
      },
    ],
    worked_examples: [
      {
        title: "Crecimiento logístico (poblaciones)",
        problem_latex: "Resuelve: $\\dfrac{dP}{dt} = rP\\left(1 - \\dfrac{P}{K}\\right)$ con $P(0) = P_0$.",
        solution_latex: "Separable. Fracciones parciales:\n\n$\\int \\dfrac{dP}{P(1-P/K)} = \\int r\\,dt$\n\n$\\dfrac{1}{P(1-P/K)} = \\dfrac{1}{P} + \\dfrac{1/K}{1-P/K}$\n\nSolución: $P(t) = \\dfrac{K}{1 + \\left(\\dfrac{K-P_0}{P_0}\\right)e^{-rt}}$"
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "10/(1+9*exp(-x))", params: { xMin: -2, xMax: 8 } },
    pro_tips: [
      "Siempre identifica el TIPO de EDO primero: ¿separable? ¿lineal? ¿exacta? El tipo determina el método.",
      "Las EDOs son el puente entre teoría y simulación numérica (Euler, Runge-Kutta).",
    ]
  },

  // ═══════════════════════════════════════
  // NIVEL 10 - DATA SCIENCE
  // ═══════════════════════════════════════

  {
    topic_id: "t-10-1",
    why_it_matters: "La probabilidad es el LENGUAJE de la incertidumbre, y toda la IA moderna se basa en ella. Classificación bayesiana, redes bayesianas, estimación de parámetros, intervalos de confianza, generative models — todo es probabilidad. Sin ella, Data Science es imposible.",
    theory_sections: [
      {
        title: "Axiomas y Teorema de Bayes",
        content_latex: "**Axiomas de Kolmogorov:**\n1. $P(A) \\geq 0$\n2. $P(\\Omega) = 1$\n3. $P(A \\cup B) = P(A) + P(B)$ si $A \\cap B = \\emptyset$\n\n**Probabilidad condicional:**\n$$P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}$$\n\n**Teorema de Bayes:**\n$$P(A|B) = \\dfrac{P(B|A) \\cdot P(A)}{P(B)}$$\n\nBayes invierte causa y efecto: conociendo el efecto ($B$), infiere la causa ($A$)."
      },
      {
        title: "Distribuciones Clave",
        content_latex: "**Bernoulli:** Éxito/fracaso. $P(X=1) = p$.\n\n**Binomial:** $n$ ensayos, $P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}$\n\n**Normal:** $f(x) = \\dfrac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$\n\n**Poisson:** Eventos raros. $P(X=k) = \\dfrac{\\lambda^k e^{-\\lambda}}{k!}$"
      },
    ],
    key_formulas: [
      { name: "Bayes", formula_latex: "$P(A|B) = \\dfrac{P(B|A)P(A)}{P(B)}$" },
      { name: "Binomial", formula_latex: "$P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}$" },
      { name: "Valor esperado", formula_latex: "$E[X] = \\sum x_i P(x_i) = \\int x f(x)dx$" },
    ],
    applications: [
      {
        field: "Clasificación (ML)",
        icon: "🤖",
        title: "Naive Bayes Classifier",
        description: "El clasificador Naive Bayes usa directamente el Teorema de Bayes para spam detection, análisis de sentimiento, y diagnóstico médico.",
        example_latex: "P(\\text{spam}|\\text{palabra}) = \\dfrac{P(\\text{palabra}|\\text{spam}) \\cdot P(\\text{spam})}{P(\\text{palabra})}"
      },
      {
        field: "A/B Testing",
        icon: "🧪",
        title: "Decisiones basadas en datos",
        description: "Decidir si un cambio en una app mejora la conversión: se diseña un experimento probabilístico y se usa inferencia estadística bayesiana o frecuentista para decidir.",
      },
    ],
    worked_examples: [
      {
        title: "Problema de Bayes aplicado (diagnóstico)",
        problem_latex: "Una enfermedad afecta al $0.1\\%$ de la población. Un test tiene sensibilidad $99\\%$ y especificidad $95\\%$. Si el test da positivo, ¿qué probabilidad hay de estar enfermo?",
        solution_latex: "$P(E) = 0.001$, $P(+|E) = 0.99$, $P(+|\\bar{E}) = 0.05$\n\n$P(+) = P(+|E)P(E) + P(+|\\bar{E})P(\\bar{E}) = 0.99(0.001) + 0.05(0.999) = 0.05094$\n\n$P(E|+) = \\dfrac{0.99 \\times 0.001}{0.05094} \\approx 0.019 = 1.9\\%$\n\nAún con un test '$99\\%$ preciso', solo hay un $1.9\\%$ de estar enfermo."
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "exp(-x*x/2)/sqrt(2*3.14159)", params: { xMin: -4, xMax: 4 } },
    pro_tips: [
      "La intuición probabilística FALLA constantemente. Confía en las fórmulas, no en tu instinto.",
      "Bayes es quizás el teorema MÁS importante para un científico de datos. Entiéndelo profundamente.",
      "La probabilidad es conteo sofisticado: P = (casos favorables) / (casos totales). Siempre vuelve a esto.",
    ]
  },

  {
    topic_id: "t-10-3",
    why_it_matters: "La optimización es LITERALMENTE lo que hace machine learning: encontrar los parámetros que minimizan el error. Gradient descent, Adam, SGD — todos son algoritmos de optimización. Sin entender optimización, estás usando herramientas como caja negra.",
    theory_sections: [
      {
        title: "Gradiente Descendente",
        content_latex: "**Idea:** Ir 'cuesta abajo' siguiendo el negativo del gradiente.\n\n$$\\mathbf{\\theta}_{t+1} = \\mathbf{\\theta}_t - \\alpha \\nabla L(\\mathbf{\\theta}_t)$$\n\n$\\alpha$: learning rate (hiperparámetro crítico).\n$\\nabla L$: gradiente de la función de pérdida.\n\n**Variantes:**\n• SGD (Stochastic): usa un mini-batch aleatorio.\n• Adam: adapta $\\alpha$ por parámetro usando momentos.\n• RMSprop: normaliza gradientes por su magnitud reciente."
      },
      {
        title: "Convexidad y Convergencia",
        content_latex: "**Función convexa:** $f(\\lambda x + (1-\\lambda)y) \\leq \\lambda f(x) + (1-\\lambda)f(y)$\n\nSi $f$ es convexa, gradient descent converge al mínimo GLOBAL.\nSi no es convexa (redes neuronales), puede quedarse en un mínimo local.\n\n**Hessiana:** $H_{ij} = \\dfrac{\\partial^2 f}{\\partial x_i \\partial x_j}$. Si $H$ es definida positiva, el punto es un mínimo."
      },
    ],
    key_formulas: [
      { name: "Gradient Descent", formula_latex: "$\\theta_{t+1} = \\theta_t - \\alpha \\nabla L(\\theta_t)$" },
      { name: "Lagrange (con restricción)", formula_latex: "$\\nabla f = \\lambda \\nabla g$ donde $g(\\mathbf{x}) = 0$" },
    ],
    applications: [
      {
        field: "Deep Learning",
        icon: "🧠",
        title: "Entrenamiento de redes neuronales",
        description: "Cada paso de entrenamiento de GPT, DALL-E, o cualquier red neuronal es un paso de optimización. GPT-4 tiene ~1.7 trillones de parámetros, cada uno ajustado por gradient descent.",
        example_latex: "\\text{SGD paso: } w_{\\text{new}} = w - 0.001 \\times \\dfrac{\\partial L}{\\partial w}"
      },
    ],
    worked_examples: [
      {
        title: "GD manual para regresión lineal",
        problem_latex: "Datos: $(1,2), (2,4), (3,5)$. Ajusta $y = wx$ minimizando $L = \\sum(y_i - wx_i)^2$ con gradient descent ($\\alpha = 0.01, w_0 = 0$).",
        solution_latex: "$L(w) = (2-w)^2 + (4-2w)^2 + (5-3w)^2 = 14w^2 - 40w + 45$\n\n$L'(w) = 28w - 40$\n\nPaso 1: $w_1 = 0 - 0.01(-40) = 0.4$\nPaso 2: $w_2 = 0.4 - 0.01(28(0.4)-40) = 0.4 - 0.01(-28.8) = 0.688$\n\nConverge a $w^* = 40/28 \\approx 1.429$."
      },
    ],
    visualizer: { type: "function-plot", defaultExpression: "x*x", params: { xMin: -3, xMax: 3 } },
    pro_tips: [
      "Learning rate demasiado alto → diverge. Demasiado bajo → tarda una eternidad. Empieza con $0.001$.",
      "Adam es el optimizer 'seguro' — funciona bien en la mayoría de los casos sin mucho tuning.",
      "La optimización NO convexa es el gran desafío abierto de ML. No hay garantía de encontrar el mínimo global.",
    ]
  },
];

/** Get explanation for a specific subtopic */
export function getExplanation(topicId: string): TopicExplanation | undefined {
  return topicExplanations.find((e) => e.topic_id === topicId);
}
