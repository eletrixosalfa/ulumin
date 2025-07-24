import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Estilos gerais
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deviceName: {
    fontSize: 16,
    flex: 1,
  },

  // Estilos do modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },

  // Itens da lista dentro do modal
  item: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },

  // Botões dentro do modal
  buttonCancel: {
    backgroundColor: '#FF3B30',  // vermelho forte para cancelar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 15,
  },
  buttonSave: {
    backgroundColor: '#007AFF',  // azul para adicionar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
