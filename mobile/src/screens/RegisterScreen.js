import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onRegister = async () => {
    try { await register(username.trim(), password); }
    catch (e) { Alert.alert('Register failed', e?.response?.data?.error || 'Error'); }
  };

  return (
    <View style={{ flex:1, backgroundColor: '#0f1220', padding:24, justifyContent:'center', gap:16 }}>
      <Text style={{ color: 'white', fontSize:28, fontWeight:'800' }}>Create account ✨</Text>

      <TextInput placeholder="Username" placeholderTextColor="#6B7280" value={username} onChangeText={setUsername}
        style={{ backgroundColor:'#1b1f3b', color:'white', borderRadius:12, padding:14 }} />
      <TextInput placeholder="Password" placeholderTextColor="#6B7280" secureTextEntry value={password} onChangeText={setPassword}
        style={{ backgroundColor:'#1b1f3b', color:'white', borderRadius:12, padding:14 }} />

      <TouchableOpacity onPress={onRegister} activeOpacity={0.85}
        style={{ backgroundColor: '#7C3AED', padding:14, borderRadius:12, alignItems:'center' }}>
        <Text style={{ color:'white', fontWeight:'700', fontSize:16 }}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{ alignItems:'center' }}>
        <Text style={{ color: '#22D3EE' }}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
}
