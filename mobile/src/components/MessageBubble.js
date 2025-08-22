import React from 'react';
import { View, Text } from 'react-native';
import { bubble as bubbleColors } from '../theme/colors';

export default function MessageBubble({ text, isMine, time, delivered, read }) {
  const bg = isMine ? bubbleColors.mine : bubbleColors.theirs;
  return (
    <View style={{ padding:8, alignItems: isMine ? 'flex-end' : 'flex-start' }}>
      <View style={{
        backgroundColor: bg, padding:12, borderRadius:16, maxWidth:'80%',
        borderBottomRightRadius: isMine ? 4 : 16,
        borderBottomLeftRadius: isMine ? 16 : 4,
      }}>
        <Text style={{ color:'white', fontSize:16 }}>{text}</Text>
        <View style={{ flexDirection:'row', justifyContent:'flex-end', gap:6, marginTop:6 }}>
          <Text style={{ fontSize:10, color:'#D1D5DB' }}>{time}</Text>
          {isMine ? (
            <Text style={{ fontSize:10, color: read ? '#34D399' : delivered ? '#E5E7EB' : '#9CA3AF' }}>
              {read ? '✓✓' : delivered ? '✓✓' : '✓'}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
