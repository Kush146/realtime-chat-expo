import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try { await login(username.trim(), password); }
    catch (e) { Alert.alert('Login failed', e?.response?.data?.error || 'Error'); }
  };

  return (
    <View style={{ flex:1, backgroundColor: '#0f1220', padding:24, justifyContent:'center', gap:16 }}>
      <Text style={{ color: 'white', fontSize:28, fontWeight:'800', marginBottom:4 }}>Welcome back 👋</Text>
      <Text style={{ color: '#9CA3AF', marginBottom:8 }}>Sign in to continue</Text>

      <TextInput placeholder="Username" placeholderTextColor="#6B7280" value={username} onChangeText={setUsername}
        style={{ backgroundColor:'#1b1f3b', color:'white', borderRadius:12, padding:14 }} />
      <TextInput placeholder="Password" placeholderTextColor="#6B7280" secureTextEntry value={password} onChangeText={setPassword}
        style={{ backgroundColor:'#1b1f3b', color:'white', borderRadius:12, padding:14 }} />

      <TouchableOpacity onPress={onLogin} activeOpacity={0.85}
        style={{ backgroundColor: '#7C3AED', padding:14, borderRadius:12, alignItems:'center' }}>
        <Text style={{ color:'white', fontWeight:'700', fontSize:16 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7} style={{ alignItems:'center' }}>
        <Text style={{ color: '#22D3EE' }}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}
