import React, {useState} from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet
} from 'react-native'

type AddTodoProps = {
    onAddTodo: (text: string) => void;
};

const AddTodo: React.FC<AddTodoProps> = ( {onAddTodo}) => {

    const [text, setText] = useState('');

    const handleAddPress = () => {
        onAddTodo(text);
        setText('');
    }

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder='Crie uma nova tarefa...'
            />
            <Button
                title='Inclur'
                onPress={handleAddPress}
            />
        </View>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            flexDirection: 'row',
            paddingHorizontal: 16,
        },
        input: {
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: 'grey',
            marginRight: 8,
            paddingVertical: 8,
        },
    }
)

export default AddTodo;