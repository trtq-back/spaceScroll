import { Alert } from 'react-native';

const romanMatrix: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function romanize(num?: number): string {
  if (!num || num === 0) {
    return '';
  }
  for (let i = 0; i < romanMatrix.length; i++) {
    if (num >= romanMatrix[i][0]) {
      return `${romanMatrix[i][1]}${romanize(num - romanMatrix[i][0])}`;
    }
  }
  return '';
}

export const errorHandle = (callback: () => void): void => {
  Alert.alert('Something went wrong', "We couldn't get the info. Please try again", [
    { text: 'OK', onPress: callback },
  ]);
};
