import React, { useState, useEffect } from "react";
import api from './services/api'
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      if (response.status === 200)
        setRepositories(response.data);
      else
        alert('Ocorreu um erro ao listar repositórios')
    })
  }, []);

  async function handleAddRepository() {
    api.post('repositories', {
      title: `Repo - ${Date.now()}`,
      url: "http://github.com/",
      techs: [
        "Node.js",
        "qw"
      ]
    }).then(response => {
      if (response.status === 200)
        setRepositories([...repositories, response.data]);
      else
        alert('Ocorreu um erro ao adicionar um novo repositório')
    })
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`).then((response) => {
      if (response.status === 400) {
        alert('Erro ao tentar deletar repositório')
        return;
      }

      // Search for repository Index
      const repositoryIndex =
        repositories.findIndex(repository => repository.id === id);

      // Caso encontre o repositório
      if (repositoryIndex >= 0) {
        const newRepositoryList =
          repositories.filter(repository => repository.id !== id);

        newRepositoryList.splice(repositoryIndex, 1);
        console.log(newRepositoryList);
        setRepositories(newRepositoryList);
      }
    })
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories && (repositories.map(repository =>
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
