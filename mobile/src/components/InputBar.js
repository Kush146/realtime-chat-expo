import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

export default function InputBar({ value, onChange, onSend, placeholder='Type a message' }) {
  return (
    <View style={{
      flexDirection:'row', alignItems:'center', gap:8, padding:10,
      backgroundColor:'#14183a', borderTopWidth:0.5, borderTopColor:'#2c325d'
    }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={'#6B7280'}
        style={{ flex:1, padding:12, borderRadius:14, backgroundColor:'#1b1f3b', color:'white' }}
      />
      <TouchableOpacity onPress={onSend} activeOpacity={0.8}
        style={{ backgroundColor: '#7C3AED', paddingVertical:12, paddingHorizontal:16, borderRadius:12 }}>
        <Text style={{ color:'white', fontWeight:'700' }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
