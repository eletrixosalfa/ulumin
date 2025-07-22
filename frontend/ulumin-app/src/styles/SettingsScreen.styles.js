import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginBottom: 5, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
