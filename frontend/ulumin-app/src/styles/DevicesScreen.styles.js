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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deviceCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 5,
    minHeight: 140,
    justifyContent: 'center',
    position: 'relative',
  },
  deviceCardPressed: {
  backgroundColor: '#e6d6e6', 
},

  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
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
  deviceCard: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      marginHorizontal: 5,
      minHeight: 140,
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
});
