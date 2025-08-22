import React from 'react';
import { View, Text } from 'react-native';

function hashColor(str='?') {
  let h = 0;
  for (let i=0;i<str.length;i++) h = str.charCodeAt(i) + ((h<<5)-h);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 80%, 50%)`;
}

export default function Avatar({ name='?', size=40 }) {
  const initials = (name||'?').slice(0,2).toUpperCase();
  return (
    <View style={{
      width: size, height: size, borderRadius: size/2,
      backgroundColor: hashColor(name),
      alignItems:'center', justifyContent:'center'
    }}>
      <Text style={{ color: 'white', fontWeight:'700' }}>{initials}</Text>
    </View>
  );
}
