export function MaxNumberOfKeysFormula(degree: number) {
  const formula = (t: number) => {
    return 2 * t - 1;
  };
  return formula(degree);
}

export function MinNumberOfKeysFormula(degree: number) {
  const formula = (t: number) => {
    return t - 1;
  };
  return formula(degree);
}

export function PrimaryKeyIndexFormula(degree: number) {
  const formula = (t: number) => {
    return t - 1;
  };
  return formula(degree);
}
