import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
  hash: (input: string) => {
    const salt = genSaltSync(10);
    return hashSync(input, salt);
  },
  compare: (input: string, hashed: string) => {
    return compareSync(input, hashed);
  },
};
