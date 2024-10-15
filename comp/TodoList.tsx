import React from 'react';
import {
    View,
    FlatList 
} from 'react-native';

import TodoItem from './TodoItem';
import { Todo } from './Todo';

type TodoListProps = {
    todos: Todo[];
    onRemoveTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onRemoveTodo } ) => {
    return (
        <FlatList 
            data={todos}
            renderItem={({ item }) => <TodoItem todo={item} onRemoveTodo={onRemoveTodo} />}
            keyExtractor={item => item.id}
        />
    );
};

export default TodoList;