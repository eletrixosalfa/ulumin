import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    deviceName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5
    },
    deviceModel: {
        marginBottom: 20,
        color: '#555'
    },
    actionsContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    actionButton: {
        width: 100,
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    actionInactive: {
        backgroundColor: '#eee',
    },
    actionActive: {
        backgroundColor: '#4CAF50',
    },
    actionText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center'
    },
    deleteButton: {
        backgroundColor: '#cc0000',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    },
    deleteText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    }
});