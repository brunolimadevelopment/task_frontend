import React, { useState, useEffect, ChangeEvent } from 'react'; // { useState, useEffect } são os react hooks
import { useHistory, useParams } from 'react-router-dom'; // { useHistory, useParams } useHistory: cria tipo o historico de navegção - useParams: ele pega todos os parametros da url. Os 2 são os hooks do react-router-dom
import { Button, Form } from 'react-bootstrap';
import api from '../../../services/api'; // importa a api de tasks que criamos
import './index.css';


// Tipagem - Quando estamos trabalhando com react com typescript e queremos tipar alguma coisa
// Trabalhamos com o conceito de interface
interface Itask {
    // id: number;
    title: string;
    description: string;
    // finished: boolean;
    // created_at: Date;
    // updated_at: Date;
    // os campos comentados são inseridos automaticamente, então não precisamos
}


const Tasks: React.FC = () => {

    const history = useHistory();
    const { id }  = useParams();

    const [model, setModel] = useState<Itask>({
        title: '',
        description: ''
    });

    useEffect(() => {
        
        if(id !== undefined) {
            findTask(id);
        }

    }, [id]);

    // e: ChangeEvent<HTMLInputElement> que é do react, ele recebe o tipo do campo do html que mexemos
    function updatedModel(e: ChangeEvent<HTMLInputElement>) {

        // Desistruturação do que ja tiver no model.
        setModel({
            ...model, // rest operator
            // a chave title e description vai ser o nme de cada campo e 
            // em seguida atribuimos o value do campo ao valor da chave
            [e.target.name]: e.target.value 
        })
    };

    async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()

        if(id !== undefined) {// se o id for diferente de underfined atualize pelo ID da task

            const response = await api.put(`/tasks/${id}`, model); 

        } else { // se o id for underfined ao clicar em uma nova task
            
            const response = await api.post('/tasks', model); // Envia os dados para a API no evento do submit
        }

        back();
        
    }

    // Busca uma Task na API pelo ID
    async function findTask(id: string) {
        const response = await api.get(`tasks/${id}`); // pegando uma task da api pelo ID
        setModel({
            title: response.data.title,
            description: response.data.description
        })
    }

    function back() {
        history.goBack();
    }

    return (
        <div className="container">
            <br/>
            <div className="task-header">
                <h1>New Task</h1>
                <Button variant="dark" size="sm" onClick={back}>Voltar</Button>
            </div>
            <br/>
            <div className="container">
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Título</Form.Label>
                        <Form.Control type="text" name="title" value={model.title} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} />

                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={model.description} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} />
                    </Form.Group>
                    <Button variant="dark" type="submit">
                        Salvar
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Tasks;