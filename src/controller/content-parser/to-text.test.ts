import { changesToText } from './to-text';

it('adds empty lines for padding', () => {
  const changes = [
    {
      content: ['1'],
      paddingBottom: 2,
      wasAdded: false,
    },
  ];

  expect(changesToText(changes)).toBe('1\n\n');
});
