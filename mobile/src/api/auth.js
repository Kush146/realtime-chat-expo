import client from './client';

export async function register(username, password) {
  const { data } = await client.post('/auth/register', { username, password });
  return data;
}
export async function login(username, password) {
  const { data } = await client.post('/auth/login', { username, password });
  return data;
}
export async function getUsers() {
  const { data } = await client.get('/users');
  return data;
}
export async function getMessages(otherId) {
  const { data } = await client.get(`/conversations/${otherId}/messages`);
  return data;
}
