import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@calc_history';

export const saveToHistory = async (entry) => {
  const history = await getHistory();
  history.unshift(entry); // Add new at the top
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getHistory = async () => {
  const history = await AsyncStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const clearHistory = async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};

export const deleteHistoryItem = async (index) => {
  const history = await getHistory();
  history.splice(index, 1);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
};