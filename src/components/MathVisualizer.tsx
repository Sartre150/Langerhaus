"use client";
import dynamic from "next/dynamic";
import { VisualizerConfig } from "@/lib/types";

const FunctionPlotter = dynamic(() => import("./visualizers/FunctionPlotter"), { ssr: false });
const FractionVisualizer = dynamic(() => import("./visualizers/FractionVisualizer"), { ssr: false });
const UnitCircleVisualizer = dynamic(() => import("./visualizers/UnitCircleVisualizer"), { ssr: false });
const DerivativeVisualizer = dynamic(() => import("./visualizers/DerivativeVisualizer"), { ssr: false });
const IntegralVisualizer = dynamic(() => import("./visualizers/IntegralVisualizer"), { ssr: false });
const VectorVisualizer = dynamic(() => import("./visualizers/VectorVisualizer"), { ssr: false });
const MatrixTransformVisualizer = dynamic(() => import("./visualizers/MatrixTransformVisualizer"), { ssr: false });

interface Props {
  config: VisualizerConfig;
}

export default function MathVisualizer({ config }: Props) {
  const { type, defaultExpression, params } = config;

  switch (type) {
    case "function-plot":
      return (
        <FunctionPlotter
          expression={defaultExpression || "x^2"}
          xMin={params?.xMin as number ?? -10}
          xMax={params?.xMax as number ?? 10}
        />
      );
    case "fraction-bars":
      return (
        <FractionVisualizer
          initialNumerator={params?.numerator as number ?? 3}
          initialDenominator={params?.denominator as number ?? 4}
        />
      );
    case "number-line":
      return (
        <FunctionPlotter
          expression={defaultExpression || "0"}
          xMin={params?.min as number ?? -20}
          xMax={params?.max as number ?? 20}
        />
      );
    case "unit-circle":
      return <UnitCircleVisualizer />;
    case "derivative-tangent":
      return (
        <DerivativeVisualizer
          expression={defaultExpression || "x^3-3*x"}
          xMin={params?.xMin as number ?? -5}
          xMax={params?.xMax as number ?? 5}
        />
      );
    case "integral-area":
      return (
        <IntegralVisualizer
          expression={defaultExpression || "x^2"}
          xMin={params?.xMin as number ?? -2}
          xMax={params?.xMax as number ?? 4}
          initialA={params?.a as number ?? 0}
          initialB={params?.b as number ?? 2}
        />
      );
    case "vector-2d":
      return <VectorVisualizer />;
    case "matrix-transform":
      return <MatrixTransformVisualizer />;
    case "none":
    default:
      return null;
  }
}
