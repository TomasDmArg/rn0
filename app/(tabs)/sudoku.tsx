import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

/** Representa una celda del tablero de Sudoku. */
type Cell = {
    value: string;
    isDefault: boolean;
};

/** Representa un tablero de Sudoku completo. */
type Board = Cell[][];

/**
 * Genera un tablero de Sudoku válido con algunos números eliminados.
 * @returns {Board} Un tablero de Sudoku parcialmente completo.
 */
const generateSudoku = (): Board => {
    const base: number[][] = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];

    const board: Board = base.map(row =>
        row.map(value => ({ value: Math.random() > 0.3 ? '' : value.toString(), isDefault: false }))
    );

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j].value !== '') {
                board[i][j].isDefault = true;
            }
        }
    }

    return board;
};

/**
 * Verifica si el tablero de Sudoku está resuelto correctamente de manera altamente eficiente.
 * @param {Board} board - El tablero de Sudoku a verificar.
 * @returns {boolean} True si el Sudoku está resuelto correctamente, false en caso contrario.
 */
const verifySudoku = (board: Board): boolean => {
    const rows = new Array(9).fill(0);
    const cols = new Array(9).fill(0);
    const boxes = new Array(9).fill(0);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const value = parseInt(board[i][j].value);
            if (isNaN(value) || value < 1 || value > 9) return false;

            const boxIndex = 3 * Math.floor(i / 3) + Math.floor(j / 3);
            const bitMask = 1 << (value - 1);

            if ((rows[i] & bitMask) !== 0 || (cols[j] & bitMask) !== 0 || (boxes[boxIndex] & bitMask) !== 0) {
                return false;
            }

            rows[i] |= bitMask;
            cols[j] |= bitMask;
            boxes[boxIndex] |= bitMask;
        }
    }

    return true;
};

// Componente para mostrar mensajes
const Message: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => (
    <View style={[styles.messageContainer, type === 'success' ? styles.successMessage : styles.errorMessage]}>
        <Text style={styles.messageText}>{message}</Text>
    </View>
);

/**
 * Componente principal de la pantalla de Sudoku.
 */
const SudokuScreen: React.FC = () => {
    const [board, setBoard] = useState<Board>(generateSudoku());
    const [timer, setTimer] = useState<number>(0);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isRunning, setIsRunning] = useState<boolean>(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    /**
     * Formatea el tiempo en minutos y segundos.
     * @param {number} time - Tiempo en segundos.
     * @returns {string} Tiempo formateado como "MM:SS".
     */
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    /**
     * Renderiza una celda individual del tablero de Sudoku.
     * @param {number} row - Índice de la fila.
     * @param {number} col - Índice de la columna.
     * @returns {React.ReactElement} Elemento TextInput que representa la celda.
     */
    const renderCell = (row: number, col: number): React.ReactElement => (
        <TextInput
            key={`${row}-${col}`}
            style={[
                styles.cell,
                board[row][col].isDefault ? styles.defaultCell : styles.userCell,
                col === 2 || col === 5 ? styles.rightBorder : null,
                row === 2 || row === 5 ? styles.bottomBorder : null,
            ]}
            value={board[row][col].value}
            onChangeText={(text: string) => {
                if (text === '' || (text >= '1' && text <= '9')) {
                    const newBoard = [...board];
                    newBoard[row][col].value = text;
                    setBoard(newBoard);
                }
            }}
            keyboardType="numeric"
            maxLength={1}
            editable={!board[row][col].isDefault}
        />
    );

    /**
     * Renderiza una región 3x3 del tablero de Sudoku.
     * @param {number} regionRow - Índice de la fila de la región.
     * @param {number} regionCol - Índice de la columna de la región.
     * @returns {React.ReactElement} Elemento View que representa la región 3x3.
     */
    const renderRegion = (regionRow: number, regionCol: number): React.ReactElement => (
        <View key={`region-${regionRow}-${regionCol}`} style={styles.region}>
            {[0, 1, 2].map((row) => (
                <View key={`row-${regionRow * 3 + row}`} style={styles.row}>
                    {[0, 1, 2].map((col) => renderCell(regionRow * 3 + row, regionCol * 3 + col))}
                </View>
            ))}
        </View>
    );

    /**
     * Verifica si el Sudoku está resuelto correctamente y muestra un mensaje.
     */
    const checkSudoku = (): void => {
        if (verifySudoku(board)) {
            setMessage({ text: "¡Felicidades! Has resuelto el Sudoku correctamente.", type: 'success' });
            setIsRunning(false);
        } else {
            setMessage({ text: "El Sudoku no está resuelto correctamente. Sigue intentando.", type: 'error' });
        }
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
    };

    /**
     * Reinicia el juego generando un nuevo tablero y reiniciando el temporizador.
     */
    const resetGame = (): void => {
        setBoard(generateSudoku());
        setTimer(0);
        setIsRunning(true);
        setMessage(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sudoku</Text>
            <Text style={styles.timer}>Tiempo: {formatTime(timer)}</Text>
            {message && <Message message={message.text} type={message.type} />}
            <View style={styles.board}>
                {[0, 1, 2].map((regionRow) => (
                    <View key={`regionRow-${regionRow}`} style={styles.regionRow}>
                        {[0, 1, 2].map((regionCol) => renderRegion(regionRow, regionCol))}
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={checkSudoku}>
                <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetGame}>
                <Text style={styles.buttonText}>Reiniciar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    timer: {
        fontSize: 18,
        marginBottom: 10,
    },
    board: {
        borderWidth: 2,
        borderColor: '#000',
    },
    regionRow: {
        flexDirection: 'row',
    },
    region: {
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 30,
        height: 30,
        borderWidth: 0.5,
        borderColor: '#999',
        textAlign: 'center',
        fontSize: 16,
    },
    defaultCell: {
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
    },
    userCell: {
        backgroundColor: '#fff',
    },
    rightBorder: {
        borderRightWidth: 1,
        borderRightColor: '#000',
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    primaryButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '80%',
    },
    secondaryButton: {
        marginTop: 10,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
    },
    successMessage: {
        backgroundColor: '#4CAF50',
    },
    errorMessage: {
        backgroundColor: '#f44336',
    },
    messageText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default SudokuScreen;