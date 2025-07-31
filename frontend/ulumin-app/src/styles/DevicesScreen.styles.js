import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  grid: {
    padding: 12,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  deviceCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 5,
    minHeight: 200,
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    alignSelf: 'center',
  },
  actionMenuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'center',
    marginTop: 0,
    padding: 5,
  },
  categoryItem: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 5,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 15,
  },
  cancelButtonText: {
    color: '#666',
  },
  confirmButtonText: {
    color: '#6e3b6e',
    fontWeight: 'bold',
  },
  iconOption: {
    marginRight: 15,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  iconOptionSelected: {
    backgroundColor: '#6e3b6e',
  },
  iconOptionUnselected: {
    backgroundColor: '#eee',
  },
  iconOptionColorSelected: '#fff',
  iconOptionColorUnselected: '#666',
  existingDeviceItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  existingDeviceItemSelected: {
    backgroundColor: '#6e3b6e',
  },
  existingDeviceItemUnselected: {
    backgroundColor: '#eee',
  },
  existingDeviceTextSelected: {
    color: '#fff',
  },
  existingDeviceTextUnselected: {
    color: '#000',
  },
});
