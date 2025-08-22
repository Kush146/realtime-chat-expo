import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export default function TypingDots() {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, delay) => Animated.loop(
      Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
        Animated.timing(val, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );
    const an1 = loop(a1, 0), an2 = loop(a2, 150), an3 = loop(a3, 300);
    an1.start(); an2.start(); an3.start();
    return () => { an1.stop(); an2.stop(); an3.stop(); };
  }, []);

  const Dot = ({ a }) => (
    <Animated.View style={{
      width: 6, height: 6, borderRadius: 3, marginHorizontal: 3,
      backgroundColor: '#E5E7EB',
      opacity: a.interpolate({ inputRange: [0,1], outputRange: [0.3, 1]}),
      transform: [{ translateY: a.interpolate({ inputRange:[0,1], outputRange:[0, -2]}) }]
    }} />
  );

  return (
    <View style={{ flexDirection:'row', paddingHorizontal:10, paddingVertical:6 }}>
      <Dot a={a1} /><Dot a={a2} /><Dot a={a3} />
    </View>
  );
}
