import React, { useState, useEffect } from 'react'; // { useState, useEffect } são os react hooks
import { Badge, Table, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'; // { useHistory } um hook do react
import api from '../../services/api'; // importa a api de tasks que criamos
import moment from 'moment';
import './index.css';


// Tipagem - Quando estamos trabalhando com react com typescript e queremos tipar alguma coisa
// Trabalhamos com o conceito de interface
interface Itask {
    id: number;
    title: string;
    description: string;
    finished: boolean;
    created_at: Date;
    updated_at: Date;
}


const Tasks: React.FC = () => {

    // Após a tipagem Itask a variavel tasks abaixo agora é um array de task por causa do useState<Itask[]>
    const [tasks, setTasks] = useState<Itask[]>([]);
    const history = useHistory();

    useEffect(() => {
        loadTasks();
    }, []); // Esse [] vazio, faz com que o método useEffect seja executado assim que a página for iniciada.

    // O uso do async é pq a função vai fazer uma requisição e essa requisição pode demorar ou não e vai retorna um dado.
    async function loadTasks() {
        const response = await api.get('/tasks');
        setTasks(response.data);
    };

    // Finalizar task
    async function finishedTask(id: number) {
        await api.patch(`/tasks/${id}`); // atualiza a task pelo ID atraves da API
        loadTasks();
    }

    // Remove task
    async function deleteTask(id: number) {
        await api.delete(`/tasks/${id}`); // deleta a task pelo ID atraves da API
        loadTasks();
    }

    function formateDate(date: Date) {
        return moment(date).format("DD/MM/YYYY");
    };

    function newTask() {
        history.push('/tarefas_cadastro');
    };

    function editTask(id: number) {
        history.push(`/tarefas_cadastro/${id}`);
    };

    function viewTask(id: number) {
        history.push(`/tarefas/${id}`)
    };

    return (
        <div className="container">
            <br/>
            <div className="task-header">
                <h1>Tasks page</h1>
                <Button variant="dark" size="sm" onClick={ newTask }>Nova Tarefa</Button>
            </div>
            <br/>
            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Data de Atualização</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        tasks.map(task => (
                            <tr key={ task.id }>
                                <td>{ task.id }</td>
                                <td>{ task.title }</td>
                                <td>{ formateDate(task.updated_at) }</td> 
                                <td>
                                    <Badge variant={ task.finished ? 'success' : 'warning' }>
                                        { task.finished ? 'FINALIZADO' : 'PENDENTE' }
                                    </Badge>
                                </td>
                                <td>
                                    <Button size="sm" disabled={task.finished} onClick={() => editTask(task.id)}>Editar</Button>{' '}
                                    <Button size="sm" disabled={task.finished} variant="success" onClick={() => finishedTask(task.id)}>Finalizar</Button>{' '}
                                    <Button size="sm" variant="info" onClick={() => viewTask(task.id)}>Visualizar</Button>{' '}
                                    <Button size="sm" variant="danger" onClick={() => deleteTask(task.id)}>Remover</Button>{' '}
                                </td>  
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default Tasks;

// o uso dos parenteses no final dos <Button size="sm" variant="success">Finalizar</Button>{' '}
// é para dar um espaçamento entre eles