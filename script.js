document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orcamentoForm');
    const resultadoContainer = document.getElementById('resultadoOrcamento');
    const downloadPDFButton = document.getElementById('downloadPDF');

    // Valores base para cálculo do orçamento
    const valoresBase = {
        planejamento: { min: 1000, max: 3000 },
        design: { 
            possui: { min: 1000, max: 2000 },
            criar: { min: 2000, max: 6000 }
        },
        desenvolvimento: {
            site: { min: 8000, max: 20000 },
            app: { min: 15000, max: 30000 },
        },
        infraestrutura: { min: 2000, max: 5000 },
        testes: { min: 1000, max: 3000 },
        suporte: { min: 500, max: 2000 }
    };

    // Multiplicadores para funcionalidades
    const multiplicadoresFuncionalidades = {
        cadastro: 1.2,
        pedidos: 1.3,
        pagamentos: 1.25,
        rastreamento: 1.15,
        admin: 1.35
    };

    // Adicionar novos multiplicadores
    const multiplicadoresPlataforma = {
        web: 1,
        android: 1.2,
        ios: 1.3,
        hibrido: 1.4,
        todos: 1.8
    };

    const multiplicadoresUsuarios = {
        pequeno: 1,
        medio: 1.3,
        grande: 1.6,
        enterprise: 2
    };

    const multiplicadoresIntegracoes = {
        apis: 1.1,
        erp: 1.25,
        crm: 1.2,
        analytics: 1.15,
        social: 1.1
    };

    const multiplicadoresSeguranca = {
        autenticacao: 1.15,
        criptografia: 1.2,
        backup: 1.1,
        auditoria: 1.15
    };

    const multiplicadoresIdiomas = {
        pt: 1,
        en: 1.15,
        es: 1.15,
        outros: 1.2
    };

    const multiplicadoresAcessibilidade = {
        wcag: 1.2,
        contraste: 1.1,
        leitor: 1.15
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const formData = new FormData(form);
    
        // Para campos com valor único
        const dados = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            empresa: formData.get('empresa'),
            tipoProjeto: formData.get('tipoProjeto'),
            design: formData.get('design'),
            prazo: formData.get('prazo'),
            orcamento: formData.get('orcamento'),
            suporte: formData.get('suporte'),
            plataforma: formData.get('plataforma'),
            usuarios: formData.get('usuarios')
        };
    
        // Para campos que podem ter múltiplos valores
        const funcionalidades = formData.getAll('funcionalidades');
        dados.integracoes = formData.getAll('integracoes');
        dados.seguranca = formData.getAll('seguranca');
        dados.idiomas = formData.getAll('idiomas');
        dados.acessibilidade = formData.getAll('acessibilidade');
    
        // Cálculo do orçamento
        const orcamento = calcularOrcamento(dados, funcionalidades);
    
        // Exibir resultado
        exibirResultado(orcamento, dados, funcionalidades);
    });
    
    function calcularOrcamento(dados, funcionalidades) {
        let minTotal = 0;
        let maxTotal = 0;

        // Planejamento
        minTotal += valoresBase.planejamento.min;
        maxTotal += valoresBase.planejamento.max;

        // Design
        const designValues = valoresBase.design[dados.design];
        minTotal += designValues.min;
        maxTotal += designValues.max;

        // Desenvolvimento
        const devValues = valoresBase.desenvolvimento[dados.tipoProjeto];
        let devMin = devValues.min;
        let devMax = devValues.max;

        // Aplicar multiplicadores de funcionalidades
        funcionalidades.forEach(func => {
            const multiplicador = multiplicadoresFuncionalidades[func];
            devMin *= multiplicador;
            devMax *= multiplicador;
        });

        minTotal += devMin;
        maxTotal += devMax;

        // Infraestrutura
        minTotal += valoresBase.infraestrutura.min;
        maxTotal += valoresBase.infraestrutura.max;

        // Testes
        minTotal += valoresBase.testes.min;
        maxTotal += valoresBase.testes.max;

        // Suporte (se selecionado)
        if (dados.suporte === 'sim') {
            minTotal += valoresBase.suporte.min;
            maxTotal += valoresBase.suporte.max;
        }

        // Aplicar multiplicadores das novas características
        const plataformaMulti = multiplicadoresPlataforma[dados.plataforma] || 1;
        const usuariosMulti = multiplicadoresUsuarios[dados.usuarios] || 1;
        
        // Integrações
        const integracoes = dados.integracoes || [];
        const integracoesMulti = integracoes.reduce((acc, integ) => 
            acc * (multiplicadoresIntegracoes[integ] || 1), 1);

        // Segurança
        const seguranca = dados.seguranca || [];
        const segurancaMulti = seguranca.reduce((acc, seg) => 
            acc * (multiplicadoresSeguranca[seg] || 1), 1);

        // Idiomas
        const idiomas = dados.idiomas || [];
        const idiomasMulti = idiomas.reduce((acc, idioma) => 
            acc * (multiplicadoresIdiomas[idioma] || 1), 1);

        // Acessibilidade
        const acessibilidade = dados.acessibilidade || [];
        const acessibilidadeMulti = acessibilidade.reduce((acc, aces) => 
            acc * (multiplicadoresAcessibilidade[aces] || 1), 1);

        // Aplicar todos os multiplicadores
        minTotal *= plataformaMulti * usuariosMulti * integracoesMulti * 
                    segurancaMulti * idiomasMulti * acessibilidadeMulti;
        maxTotal *= plataformaMulti * usuariosMulti * integracoesMulti * 
                    segurancaMulti * idiomasMulti * acessibilidadeMulti;

        const valorTotal = {
            minTotal: Math.round(minTotal),
            maxTotal: Math.round(maxTotal)
        };

        // Mostrar o botão de download
        downloadPDFButton.style.display = 'inline-flex';
        
        // Armazenar os dados do orçamento
        const dadosOrcamento = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            tipoProjeto: dados.tipoProjeto,
            funcionalidades: funcionalidades,
            valorTotal: valorTotal,
            prazo: dados.prazo,
            plataforma: dados.plataforma,
            usuarios: dados.usuarios,
            integracoes: dados.integracoes || [],
            seguranca: dados.seguranca || [],
            idiomas: dados.idiomas || [],
            acessibilidade: dados.acessibilidade || []
        };
        
        // Adicionar evento de click para o botão de download
        downloadPDFButton.onclick = () => gerarPDF(dadosOrcamento);

        return valorTotal;
    }

    function exibirResultado(orcamento, dados, funcionalidades) {
        const formatarMoeda = (valor) => {
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        };

        const funcionalidadesTexto = funcionalidades.map(f => {
            const nomes = {
                cadastro: 'Cadastro de Usuários',
                pedidos: 'Sistema de Pedidos',
                pagamentos: 'Integração de Pagamentos',
                rastreamento: 'Rastreamento de Entregas',
                admin: 'Painel Administrativo'
            };
            return nomes[f];
        }).join(', ');

        const html = `
            <h3>Orçamento Estimado</h3>
            <p>Valor estimado: ${formatarMoeda(orcamento.minTotal)} a ${formatarMoeda(orcamento.maxTotal)}</p>
            
            <h4>Detalhes do Projeto:</h4>
            <ul>
                <li><strong>Tipo de Projeto:</strong> ${dados.tipoProjeto.charAt(0).toUpperCase() + dados.tipoProjeto.slice(1)}</li>
                <li><strong>Design:</strong> ${dados.design === 'possui' ? 'Já possui identidade visual' : 'Necessita criar identidade visual'}</li>
                <li><strong>Funcionalidades:</strong> ${funcionalidadesTexto}</li>
                <li><strong>Prazo Estimado:</strong> ${dados.prazo}</li>
                <li><strong>Suporte Pós-lançamento:</strong> ${dados.suporte === 'sim' ? 'Incluído' : 'Não incluído'}</li>
            </ul>

            <p class="observacao">* Este é um orçamento estimado. O valor final pode variar de acordo com requisitos específicos do projeto.</p>
        `;

        resultadoContainer.innerHTML = html;
        resultadoContainer.style.display = 'block';

        // Scroll suave até o resultado
        resultadoContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Máscara para o campo de telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 9) {
            value = `${value.slice(0, 9)}-${value.slice(9)}`;
        }
        
        e.target.value = value;
    });

    function gerarPDF(dadosOrcamento) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações iniciais
        const azulValensoft = [0, 102, 204];
        const cinzaTexto = [60, 60, 60];
        const margemEsquerda = 20;
        let yPos = 0;
        
        // Função auxiliar para formatar moeda
        const formatarMoeda = (valor) => {
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        };

        // Função para desenhar linha decorativa
        function desenharLinha(y) {
            doc.setDrawColor(...azulValensoft);
            doc.setLineWidth(0.5);
            doc.line(margemEsquerda, y, 190, y);
        }

        // Cabeçalho
        doc.setFillColor(...azulValensoft);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Orçamento Valensoft', 105, 25, { align: 'center' });

        // Subtítulo com data
        const dataFormatada = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        doc.setFontSize(12);
        doc.text(`Gerado em ${dataFormatada}`, 105, 35, { align: 'center' });

        // Informações do Cliente
        yPos = 60;
        doc.setTextColor(...cinzaTexto);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Dados do Cliente', margemEsquerda, yPos);
        
        yPos += 10;
        desenharLinha(yPos);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const dadosCliente = [
            { label: 'Nome:', valor: dadosOrcamento.nome },
            { label: 'E-mail:', valor: dadosOrcamento.email },
            { label: 'Telefone:', valor: dadosOrcamento.telefone }
        ];

        dadosCliente.forEach(dado => {
            doc.setFont('helvetica', 'bold');
            doc.text(dado.label, margemEsquerda, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(dado.valor, margemEsquerda + 30, yPos);
            yPos += 10;
        });

        // Detalhes do Projeto
        yPos += 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalhes do Projeto', margemEsquerda, yPos);
        
        yPos += 10;
        desenharLinha(yPos);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        // Tipo de Projeto
        doc.setFont('helvetica', 'bold');
        doc.text('Tipo de Projeto:', margemEsquerda, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(dadosOrcamento.tipoProjeto.charAt(0).toUpperCase() + dadosOrcamento.tipoProjeto.slice(1), margemEsquerda + 50, yPos);

        // Funcionalidades
        yPos += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('Funcionalidades Selecionadas:', margemEsquerda, yPos);
        
        const nomesFuncionalidades = {
            cadastro: 'Cadastro de Usuários',
            pedidos: 'Sistema de Pedidos',
            pagamentos: 'Integração de Pagamentos',
            rastreamento: 'Rastreamento de Entregas',
            admin: 'Painel Administrativo'
        };

        yPos += 10;
        doc.setFont('helvetica', 'normal');
        dadosOrcamento.funcionalidades.forEach(func => {
            doc.text(`• ${nomesFuncionalidades[func] || func}`, margemEsquerda + 5, yPos);
            yPos += 8;
        });

        // Orçamento
        yPos += 20;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Investimento', margemEsquerda, yPos);
        
        yPos += 10;
        desenharLinha(yPos);
        
        yPos += 15;
        doc.setFontSize(14);
        doc.setTextColor(...azulValensoft);
        doc.text('Valor Estimado:', margemEsquerda, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`${formatarMoeda(dadosOrcamento.valorTotal.minTotal)} a ${formatarMoeda(dadosOrcamento.valorTotal.maxTotal)}`, margemEsquerda + 50, yPos);

        // Observações e Rodapé
        yPos += 20;
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('Observações:', margemEsquerda, yPos);
        yPos += 7;
        doc.text('1. Este orçamento é uma estimativa inicial baseada nas informações fornecidas.', margemEsquerda, yPos);
        yPos += 7;
        doc.text('2. O valor final pode variar de acordo com requisitos específicos identificados durante o projeto.', margemEsquerda, yPos);
        yPos += 7;
        doc.text('3. Orçamento válido por 15 dias a partir da data de geração.', margemEsquerda, yPos);

        // Linha divisória
        yPos += 15;
        desenharLinha(yPos);

        // Informações de Prazo e Escopo
        yPos += 15;
        doc.setFont('helvetica', 'normal');
        doc.text('• Prazo Estimado: ' + dadosOrcamento.prazo + ' meses', margemEsquerda, yPos);
        yPos += 7;
        doc.text('• Inclui planejamento, desenvolvimento e implementação', margemEsquerda, yPos);
        yPos += 7;
        doc.text('• Suporte técnico durante o desenvolvimento', margemEsquerda, yPos);

        // Linha divisória final
        yPos += 15;
        desenharLinha(yPos);

        // Rodapé com informações de contato
        yPos += 15;
        doc.setTextColor(...azulValensoft);
        doc.setFont('helvetica', 'bold');
        doc.text('Valensoft - Desenvolvimento de Software', 105, yPos, { align: 'center' });

        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('contato@valensoft.com.br | (91) 99289-1008', 105, yPos, { align: 'center' });

        // Salvar o PDF
        doc.save('orcamento-valensoft.pdf');
    }
}); 
