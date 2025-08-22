import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { getUsers } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';
import Avatar from '../components/Avatar';
import AppHeader from '../components/AppHeader';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const { onlineUserIds } = useSocket();

  const load = async () => {
    setLoading(true);
    try { setUsers(await getUsers()); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const Item = ({ item }) => {
    const online = onlineUserIds.includes(item._id) || item.online;
    const scale = new Animated.Value(1);
    const onPressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

    return (
      <Animated.View style={{ transform:[{ scale }] }}>
        <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={0.8}
          onPress={() => navigation.navigate('Chat', { user: item })}
          style={{ padding:14, borderBottomWidth:0.5, borderBottomColor:'#252a54', flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'#14183a' }}>
          <Avatar name={item.username} />
          <View style={{ flex:1 }}>
            <Text style={{ color:'white', fontSize:16, fontWeight:'700' }}>
              {item.username} {online ? '• online' : ''}
            </Text>
            <Text numberOfLines={1} style={{ color:'#9CA3AF' }}>
              {item.lastMessage ? item.lastMessage.text : 'Tap to start chatting'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex:1, backgroundColor:'#0f1220' }}>
      <AppHeader title={`Hi, ${user?.username}`} subtitle={'Who do you want to chat with?'} />
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={Item}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={'#fff'} />}
      />
      <TouchableOpacity onPress={logout} activeOpacity={0.85}
        style={{ position:'absolute', right:16, bottom:16, backgroundColor: '#F87171', paddingVertical:12, paddingHorizontal:16, borderRadius:999 }}>
        <Text style={{ color:'white', fontWeight:'700' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
