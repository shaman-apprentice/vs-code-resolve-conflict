import { IVersionLine } from '../../model/line';

export const changesToText = (changes: IVersionLine[]): string =>
  changes
    .reduce((acc, line) => {
      acc.push(...line.content);
      if (line.paddingBottom) {
        acc.push(...new Array(line.paddingBottom).fill(''));
      }
      return acc;
    }, [] as string[])
    .join('\n');
