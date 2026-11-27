import { Alert, Platform } from 'react-native';

export default function showAlert(title, message) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}