import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const initialAllowed = ['+15551234567'];
const initialBlocked = ['+18005551234'];

export default function App() {
  const [autoBlockUnknown, setAutoBlockUnknown] = useState(true);
  const [allowedNumbers, setAllowedNumbers] = useState(initialAllowed);
  const [blockedNumbers, setBlockedNumbers] = useState(initialBlocked);
  const [newNumber, setNewNumber] = useState('');

  const normalize = (text) => text.trim();

  const addAllowedNumber = () => {
    const normalized = normalize(newNumber);
    if (!normalized) {
      Alert.alert('Enter a number');
      return;
    }
    if (allowedNumbers.includes(normalized)) {
      Alert.alert('Number already allowed');
      return;
    }
    setAllowedNumbers([normalized, ...allowedNumbers]);
    setNewNumber('');
  };

  const simulateIncomingCall = () => {
    const incoming = Math.random() > 0.5 ? '+18005550000' : '+15551234567';
    const isKnown = allowedNumbers.includes(incoming);
    const blocked = autoBlockUnknown && !isKnown;
    if (blocked) {
      setBlockedNumbers((prev) => [incoming, ...prev.filter((n) => n !== incoming)]);
    }
    Alert.alert('Incoming Call', `${incoming}\n${blocked ? 'Blocked' : 'Allowed'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Call Blocker</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Auto block unknown numbers</Text>
        <Switch value={autoBlockUnknown} onValueChange={setAutoBlockUnknown} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allowed numbers</Text>
        <TextInput
          style={styles.input}
          value={newNumber}
          onChangeText={setNewNumber}
          placeholder="Add allowed number"
          keyboardType="phone-pad"
        />
        <Button title="Add number" onPress={addAllowedNumber} />
        <FlatList
          style={styles.list}
          data={allowedNumbers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently blocked</Text>
        <FlatList
          style={styles.list}
          data={blockedNumbers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Text style={styles.blockedItem}>{item}</Text>}
          ListEmptyComponent={<Text style={styles.empty}>No blocked calls yet</Text>}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={simulateIncomingCall}>
        <Text style={styles.buttonText}>Simulate Incoming Call</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  list: {
    maxHeight: 140,
  },
  item: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    color: '#111827',
  },
  blockedItem: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fee2e2',
    color: '#b91c1c',
  },
  empty: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
