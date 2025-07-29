import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 10,
    borderRadius: 4,
  },
  actionBtnSelected: {
    backgroundColor: '#007AFF',
  },
  actionTextSelected: {
    color: 'white',
  },
  timeText: {
    fontSize: 16,
    paddingVertical: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBtn: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 6,
    margin: 4,
    borderRadius: 4,
    width: 32,
    alignItems: 'center',
  },
  dayBtnSelected: {
    backgroundColor: '#007AFF',
  },
  dayTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
