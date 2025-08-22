import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';

export default function AppHeader({ title, subtitle, onBack }) {
  return (
    <View style={{
      paddingTop: 50, paddingBottom: 12, paddingHorizontal: 16,
      backgroundColor: '#131735', borderBottomWidth: 0.5, borderBottomColor: '#2c325d',
      flexDirection:'row', alignItems:'center', gap:12
    }}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={{ padding:8 }} activeOpacity={0.7}>
          <Text style={{ color: '#E5E7EB', fontSize:18 }}>{'‹'}</Text>
        </TouchableOpacity>
      ) : <Avatar name={title} size={36} />}
      <View style={{ flex:1 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight:'700' }}>{title}</Text>
        {subtitle ? <Text style={{ color: '#9CA3AF', fontSize:12 }}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}
