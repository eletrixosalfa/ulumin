import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingTop: 80,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  date: {
    fontSize: 24,
    color: '#eee',
    marginBottom: 50,
  },
  temp: {
    fontSize: 24,
    color: '#ff6600',
    fontWeight: 'bold',
  },
  city: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 5,
    marginTop: 10,
  }
});

export default styles;
