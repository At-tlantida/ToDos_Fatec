import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Button,
  TextInput
} from 'react-native';
import TodoList from './comp/TodoList';
import { Todo } from './comp/Todo';
import { getDBConnection, createTable, getTodoItems, addTodoItem, deleteTodoItem } from './comp/database'; // Importar funções do banco de dados

const App: React.FC = () => {
  const [tarefas, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>(''); // Um campo para tanto o filtro quanto adicionar tarefas
  const [tarefasFiltradas, setTarefasFiltradas] = useState<Todo[]>([]); // Estado para armazenar as tarefas filtradas
  const [db, setDb] = useState<any>(null); // Estado para o banco de dados

// Função para carregar os dados do banco de dados na inicialização
const loadData = async () => {
  try {
    const db = await getDBConnection(); // Abre a conexão com o banco de dados
    setDb(db); // Armazena a conexão
    await createTable(db); // Cria a tabela caso não exista

    const storedTodos = await getTodoItems(db); // Recupera as tarefas salvas

    // Garantir que todas as tarefas tenham um 'text' válido
    const validTodos = storedTodos.map(todo => ({
      ...todo,
      text: todo.text ? todo.text : 'Tarefa sem descrição' // Se o texto estiver vazio, define um padrão
    }));

    setTodos(validTodos); // Define as tarefas no estado com o texto corrigido
  } catch (erro) {
    console.error("Erro ao carregar os dados: " + erro);
  }
};

  /*const loadData = async () => {
    try {
      const db = await getDBConnection(); // Abre a conexão com o banco de dados
      setDb(db); // Armazena a conexão
      await createTable(db); // Cria a tabela caso não exista
      const storedTodos = await getTodoItems(db); // Recupera as tarefas salvas
  
      // Verifica se todas as tarefas têm o campo "text" e define um valor padrão se estiver vazio
      const validTodos = storedTodos.map(todo => ({
        ...todo,
        text: todo.text ? todo.text : 'Tarefa sem descrição' // Se o texto estiver vazio, define um padrão
      }));
  
      setTodos(validTodos); // Define as tarefas no estado
    } catch (erro) {
      console.error("Erro ao carregar os dados: " + erro);
    }
  };*/
  

  // Função para adicionar uma nova tarefa e salvá-la no banco de dados
  const adicionaTarefa = async () => {
    if (input.length > 0) {
      const novaTarefa = { id: Date.now().toString(), text: input };
      try {
        await addTodoItem(db, novaTarefa); // Adiciona no banco de dados
        setTodos([...tarefas, novaTarefa]); // Adiciona no estado
        setInput(''); // Limpa o campo após adicionar
      } catch (erro) {
        console.error("Erro ao adicionar tarefa: " + erro);
      }
    } else {
      Alert.alert("Erro", "Preencha um valor na tarefa", [{ text: "OK" }]);
    }
  };

  // Função para remover uma tarefa tanto da lista quanto do banco de dados
  const removerTarefa = async (idTarefa: string) => {
    try {
      await deleteTodoItem(db, idTarefa); // Remove do banco de dados
      setTodos([...tarefas.filter(tarefa => tarefa.id !== idTarefa)]); // Atualiza o estado
    } catch (erro) {
      console.error("Erro ao remover tarefa: " + erro);
    }
  };

 /* // Função para filtrar as tarefas
  const filtrarTarefas = () => {
    if (input.length > 0) {
      const tarefasFiltradas = tarefas.filter(tarefa =>
        tarefa.text.toLowerCase().includes(input.toLowerCase())
      );
      setTarefasFiltradas(tarefasFiltradas);
    } else {
      setTarefasFiltradas(tarefas); // Exibe todas se o filtro estiver vazio
    }
  }; alguma das tarefas não tem a propriedade text definida */

  // Função para filtrar as tarefas
const filtrarTarefas = () => {
  if (input.length > 0) {
    const tarefasFiltradas = tarefas.filter(tarefa =>
      // Verifica se tarefa.text está definido e não é nulo ou indefinido
      tarefa.text && tarefa.text.toLowerCase().includes(input.toLowerCase())
    );
    setTarefasFiltradas(tarefasFiltradas);
  } else {
    setTarefasFiltradas(tarefas); // Exibe todas se o filtro estiver vazio
  }
};

  // Carrega os dados do banco de dados na primeira vez que o componente é montado
  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Linha com campo de entrada e botões */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa ou filtro"
          value={input}
          onChangeText={setInput}
        />
        <View style={styles.button}>
          <Button title="Filtrar" onPress={filtrarTarefas} />
        </View>
        <View style={styles.button}>
          <Button title="Incluir" onPress={adicionaTarefa} />
        </View>
      </View>

      {/* Lista de tarefas, mostrando as tarefas filtradas */}
      <TodoList todos={tarefasFiltradas.length > 0 ? tarefasFiltradas : tarefas} onRemoveTodo={removerTarefa} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row', // Coloca os itens lado a lado
    alignItems: 'center', // Alinha os itens verticalmente no centro
    marginBottom: 10,
  },
  input: {
    flex: 1, // O campo de texto ocupa o máximo possível da linha
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginRight: 5, // Espaço entre o input e os botões
  },
  button: {
    width: 80, // Define largura dos botões
    marginLeft: 5, // Espaço entre os botões
  },
});

export default App;





