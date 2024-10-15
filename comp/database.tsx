import SQLite from 'react-native-sqlite-storage';
import { Todo } from './Todo';

SQLite.enablePromise(true);

const databaseParams = {
    name: 'todos.db',
    location: 'default',
};

interface Database {
    executeSql: (sql: string, params?: any[]) => Promise<any>;
}

export const getDBConnection = async () : Promise<Database> => {
    try {
        return await SQLite.openDatabase(
            databaseParams
        );
    }
    catch (erro) {
        console.error("Erro na abertura do banco: " + erro);
        throw new Error("Falha de conexao com o banco de dados");
    }
};

export const createTable = async (db: Database) : Promise<any> => {
    try {
        const query = "CREATE TABLE IF NOT EXISTS todo_items (id TEXT PRIMARY KEY, task TEXT NOT NULL);"
        await db.executeSql(query);
    }
    catch (erro) {
        console.error("Erro criando tabelas: " + erro);
        throw new Error("Falha de conexao com o banco de dados");
    }
}

/*export const getTodoItems = async (db: Database) : Promise<any[]> => {

    try {
        const query = "select id, task from todo_items";
        const result = await db.executeSql(query);
        let todos = [];
        let rows = result[0].rows;
        for(let i = 0; i < rows.length; i++) {
            todos.push(
                ...rows.item[i]
            );
        }
        return todos;
    } catch (erro) {
        console.log("Erro ao ler tabela: " + erro);
        throw new Error("Falha para ler dados do banco");
    }
}

export const getTodoItems = async (db: Database): Promise<Todo[]> => { 
    try {
        const query = "SELECT id, task FROM todo_items";
        const result = await db.executeSql(query);
        const todos: Todo[] = [];
        const rows = result[0].rows;

        for (let i = 0; i < rows.length; i++) {
            const todoItem = rows.item(i);
            console.log(todoItem); // Adicione este log para ver o que está sendo retornado
            todos.push(todoItem);
        }

        return todos;
    } catch (erro) {
        console.log("Erro ao ler tabela: " + erro);
        throw new Error("Falha para ler dados do banco");
    }
}*/
export const getTodoItems = async (db: Database): Promise<Todo[]> => {
    try {
      const query = "SELECT id, task FROM todo_items";
      const result = await db.executeSql(query);
      const todos: Todo[] = [];
      const rows = result[0].rows;
  
      for (let i = 0; i < rows.length; i++) {
        const todoItem = rows.item(i);
        // Garante que sempre tenha um texto para a tarefa
        todos.push({
          id: todoItem.id,
          text: todoItem.task || 'Tarefa sem descrição'  // Aqui define uma descrição padrão
        });
      }
  
      return todos;
    } catch (erro) {
      console.log("Erro ao ler tabela: " + erro);
      throw new Error("Falha para ler dados do banco");
    }
  };
  


export const addTodoItem = async (db: Database, tarefa: Todo) : Promise<void> => {
    try {
        const query = "INSERT INTO todo_items (id, task) VALUES (?, ?)";
        await db.executeSql(query, [tarefa.id, tarefa.text]);

    } catch (erro) {
        console.log("Erro ao adicionar items: " + erro + ' ' + tarefa.id + ' ' + tarefa.text);
        throw new Error("Falha para ler dados do banco");
    }
}

export const deleteTodoItem = async(db: Database, id: String) : Promise<void> => {
    try {

        const query = "DELETE FROM todo_items WHERE id = ?";
        await db.executeSql(query, [id]);

    } catch (erro) {
        console.log("Erro ao excluir items: " + erro + ' ' + id);
        throw new Error("Falha para ler dados do banco");
    }
}

export const updateTodoItem = async(db: Database, tarefa: Todo) : Promise<void> => {
    try {

        const query = "UPDATE todo_items SET task = ? WHERE id = ?";
        await db.executeSql(query, [tarefa.text, tarefa.id]);

    } catch (erro) {
        console.log("Erro ao atualizar items: " + erro + ' ' + tarefa.id + ' ' + tarefa.text);
        throw new Error("Falha para ler dados do banco");
    }
}

