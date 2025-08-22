import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getMessages } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';
import MessageBubble from '../components/MessageBubble';
import TypingDots from '../components/TypingDots';
import InputBar from '../components/InputBar';
import AppHeader from '../components/AppHeader';

export default function ChatScreen({ route, navigation }) {
  const { user: me } = useAuth();
  const other = route.params.user;
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { socket, typingFrom } = useSocket();
  const listRef = useRef(null);

  // helpers
  const idOf = (v) => (v && typeof v === 'object' ? v._id : v);
  const isForThisChat = (msg) => {
    const fromId = idOf(msg.from);
    const toId = idOf(msg.to);
    return (
      (fromId === me._id && toId === other._id) ||
      (fromId === other._id && toId === me._id)
    );
  };
  const upsert = (arr, msg) => {
    const i = arr.findIndex(
      (m) =>
        (msg.tempId && m.tempId === msg.tempId) ||
        (msg._id && m._id === msg._id)
    );
    if (i !== -1) {
      const next = [...arr];
      next[i] = { ...next[i], ...msg };
      return next;
    }
    return [...arr, msg];
  };

  useEffect(() => {
    (async () => {
      const data = await getMessages(other._id);
      setConversationId(data.conversationId);
      setMessages(data.messages || []);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 50);
    })();
  }, [other._id]);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;

    const onNew = (msg) => {
      if (!isForThisChat(msg)) return;
      setMessages((prev) => upsert(prev, msg));
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    };

    const onDelivered = ({ messageId, tempId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          (messageId && m._id === messageId) || (tempId && m.tempId === tempId)
            ? { ...m, deliveredAt: new Date().toISOString() }
            : m
        )
      );
    };

    const onRead = ({ conversationId: cid }) => {
      if (cid !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.from === me._id && !m.readAt
            ? { ...m, readAt: new Date().toISOString() }
            : m
        )
      );
    };

    s.on('message:new', onNew);
    s.on('message:delivered', onDelivered);
    s.on('message:read', onRead);
    return () => {
      s.off('message:new', onNew);
      s.off('message:delivered', onDelivered);
      s.off('message:read', onRead);
    };
  }, [socket.current, conversationId, me._id, other._id]);

  useEffect(() => {
    const s = socket.current;
    if (s && conversationId) s.emit('message:read', { conversationId, from: other._id });
  }, [socket.current, conversationId, messages.length]);

  const send = () => {
    if (!text.trim()) return;
    const s = socket.current;
    const tempId = Math.random().toString(36).slice(2);
    const optimistic = {
      _id: tempId,          // helps FlatList keying before server _id
      tempId,
      from: me._id,
      to: other._id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => upsert(prev, optimistic));
    setText('');
    s.emit('message:send', { to: other._id, text: optimistic.text, tempId });
  };

  const onTyping = (value) => {
    setText(value);
    const s = socket.current;
    if (!s) return;
    s.emit(value ? 'typing:start' : 'typing:stop', { to: other._id });
  };

  const renderItem = ({ item }) => {
    const isMine = idOf(item.from) === me._id;
    return (
      <MessageBubble
        text={item.text}
        isMine={isMine}
        time={new Date(item.createdAt).toLocaleTimeString()}
        delivered={!!item.deliveredAt}
        read={!!item.readAt}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f1220' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title={other.username}
        subtitle={typingFrom === other._id ? 'typing…' : ''}
        onBack={() => navigation.goBack()}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, idx) => item._id || item.tempId || String(idx)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
        {typingFrom === other._id ? <TypingDots /> : null}
        <InputBar value={text} onChange={onTyping} onSend={send} />
      </View>
    </KeyboardAvoidingView>
  );
}
