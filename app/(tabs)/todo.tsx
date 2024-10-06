import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';

/**
 * Represents a task in the to-do list.
 */
interface Task {
    /** Unique identifier for the task */
    id: string;
    /** Text content of the task */
    text: string;
}

/**
 * TodoListScreen component for managing a list of tasks.
 */
export default function TodoListScreen(): JSX.Element {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState<string>('');

    /**
     * Adds a new task to the list.
     */
    const addTask = (): void => {
        if (taskText.trim()) {
            setTasks([...tasks, { id: Date.now().toString(), text: taskText }]);
            setTaskText('');
        }
    };

    /**
     * Removes a task from the list.
     * @param id - The id of the task to remove
     */
    const removeTask = (id: string): void => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    /**
     * Renders an individual task item.
     */
    const renderTask: ListRenderItem<Task> = ({ item }) => (
        <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
                <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Tareas</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={taskText}
                    onChangeText={setTaskText}
                    placeholder="Nueva tarea"
                />
                <TouchableOpacity style={styles.addButton} onPress={addTask}>
                    <Text style={styles.addButtonText}>Agregar</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={(item: Task) => item.id}
            />
        </View>
    );
}

/**
 * Styles for the TodoListScreen component.
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    taskText: {
        flex: 1,
    },
    deleteButton: {
        color: 'red',
    },
});