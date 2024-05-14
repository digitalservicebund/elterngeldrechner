type ContingentOfVariant = {
  available: number;
  taken: number;
};

export type ContingentPerVariant = {
  basis: ContingentOfVariant;
  plus: ContingentOfVariant;
  bonus: ContingentOfVariant;
};
