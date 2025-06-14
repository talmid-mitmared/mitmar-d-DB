/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

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
