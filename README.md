# Formulário de Orçamento - Valensoft

Este é um sistema de formulário interativo para geração automática de orçamentos de projetos digitais da Valensoft.

## Funcionalidades

- Formulário interativo para coleta de requisitos
- Cálculo automático de orçamento baseado nas escolhas do usuário
- Interface responsiva e moderna
- Validação de campos em tempo real
- Máscara para campo de telefone
- Resultado detalhado do orçamento

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e layout responsivo)
- JavaScript (Vanilla JS)

## Estrutura do Projeto

```
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── logo.png
└── README.md
```

## Como Usar

1. Clone este repositório
2. Abra o arquivo `index.html` em um navegador web moderno
3. Preencha o formulário com as informações do projeto
4. Clique em "Gerar Orçamento" para ver o resultado

## Personalização

O sistema de cálculo de orçamento pode ser facilmente personalizado através das constantes no arquivo `script.js`:

- `valoresBase`: Define os valores base para cada etapa do projeto
- `multiplicadoresFuncionalidades`: Define os multiplicadores para cada funcionalidade adicional

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 