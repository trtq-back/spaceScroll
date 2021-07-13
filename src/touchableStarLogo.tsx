import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { romanize } from './utils';

type TouchableStarLogoProps = {
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  episodeNumber: number;
  subtitle: string;
};

export const TouchableStarLogo = ({
  onPress,
  style,
  episodeNumber,
  subtitle,
}: TouchableStarLogoProps): JSX.Element => (
  <TouchableOpacity onPress={onPress} style={[styles.touchableContainer, style]}>
    <View style={styles.topLineContainer}>
      <Text style={styles.topLogo}>STAR WARS</Text>
      <View style={styles.topLine} />
    </View>
    <View style={styles.centerContainer}>
      {[...('EPISODE ' + romanize(episodeNumber))].map((t, i) => (
        <Text key={`${t}${i}`} style={styles.centerCharacter}>
          {t}
        </Text>
      ))}
    </View>
    <View style={styles.bottomContainer}>
      {[...subtitle].map((t, i) => (
        <Text key={`${t}${i}`} style={styles.bottomCharacter}>
          {t}
        </Text>
      ))}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  touchableContainer: {
    width: scale(250),
  },
  topLineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  topLogo: {
    fontSize: scale(20),
    lineHeight: scale(22),
    color: 'yellow',
    fontFamily: 'StarJediHollow',
    textTransform: 'capitalize',
  },
  topLine: {
    flex: 1,
    height: scale(1),
    marginLeft: scale(3),
    marginBottom: scale(7),
    backgroundColor: 'yellow',
  },
  centerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'yellow',
    borderBottomWidth: scale(1),
    marginBottom: scale(4),
  },
  centerCharacter: {
    fontSize: scale(38),
    lineHeight: scale(40),
    color: 'yellow',
    fontFamily: 'SerifGothic LT',
    paddingVertical: scale(2),
    textTransform: 'capitalize',
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomCharacter: {
    fontSize: scale(20),
    lineHeight: scale(22),
    color: 'yellow',
    fontFamily: 'SerifGothic LT',
    textTransform: 'capitalize',
  },
});
