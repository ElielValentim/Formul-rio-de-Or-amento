document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orcamentoForm');
    const resultadoContainer = document.getElementById('resultadoOrcamento');
    const enviarWhatsAppButton = document.getElementById('enviarWhatsApp');


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
        
        // Mostrar o botão de envio via WhatsApp
        const enviarWhatsAppButton = document.getElementById('enviarWhatsApp');
        if (enviarWhatsAppButton) {
            enviarWhatsAppButton.style.display = 'inline-flex';
        }

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
            acessibilidade: dados.acessibilidade || [],
            empresa: dados.empresa,
            design: dados.design,
            orcamento: dados.orcamento,
            suporte: dados.suporte
        };
        
        // Captura o telefone do cliente
        const telefoneCliente = document.getElementById('telefone').value;

        // Adicionar evento de click para envio pelo WhatsApp
        enviarWhatsAppButton.onclick = () => enviarParaWhatsApp(dadosOrcamento, telefoneCliente);

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

        const integracoesTexto = dados.integracoes.length > 0 ? dados.integracoes.join(', ') : 'Nenhuma';
        const segurancaTexto = dados.seguranca.length > 0 ? dados.seguranca.join(', ') : 'Nenhuma';

        const html = `
            <h3>Orçamento Detalhado</h3>
            
            <h4>Dados do Cliente</h4>
            <ul>
                <li><strong>Nome:</strong> ${dados.nome}</li>
                <li><strong>E-mail:</strong> ${dados.email}</li>
                <li><strong>Telefone:</strong> ${dados.telefone}</li>
                <li><strong>Empresa:</strong> ${dados.empresa || 'Não informado'}</li>
            </ul>

            <h4>Detalhes do Projeto</h4>
            <ul>
                <li><strong>Tipo de Projeto:</strong> ${dados.tipoProjeto.charAt(0).toUpperCase() + dados.tipoProjeto.slice(1)}</li>
                <li><strong>Design:</strong> ${dados.design === 'possui' ? 'Já possui identidade visual' : 'Necessita criar identidade visual'}</li>
                <li><strong>Funcionalidades:</strong> ${funcionalidadesTexto}</li>
                <li><strong>Plataforma:</strong> ${dados.plataforma}</li>
                <li><strong>Número de Usuários:</strong> ${dados.usuarios}</li>
                <li><strong>Integrações:</strong> ${integracoesTexto}</li>
                <li><strong>Segurança:</strong> ${segurancaTexto}</li>
            </ul>

            <h4>Prazos e Investimento</h4>
            <ul>
                <li><strong>Prazo Estimado:</strong> ${dados.prazo}</li>
                <li><strong>Faixa de Investimento Desejada:</strong> ${dados.orcamento}</li>
                <li><strong>Suporte Pós-lançamento:</strong> ${dados.suporte === 'sim' ? 'Incluído' : 'Não incluído'}</li>
            </ul>

            <h4>Valor Estimado</h4>
            <p class="valor-estimado">💰 ${formatarMoeda(orcamento.minTotal)} a ${formatarMoeda(orcamento.maxTotal)}</p>

            <p class="observacao">* Este é um orçamento estimado. O valor final pode variar de acordo com requisitos específicos do projeto.</p>
        `;

        resultadoContainer.innerHTML = html;
        resultadoContainer.style.display = 'block';
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

    function enviarParaWhatsApp(dadosOrcamento, telefoneCliente) {
        const formatarMoeda = (valor) => {
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        };

        // Traduzir valores para textos mais amigáveis
        const traduzirFaixaOrcamento = {
            'ate-20k': 'Até R$ 20.000',
            '20k-50k': 'R$ 20.000 - R$ 50.000',
            '50k+': 'Acima de R$ 50.000'
        };

        const traduzirUsuarios = {
            'pequeno': 'Até 100 usuários',
            'medio': '101 a 1.000 usuários',
            'grande': '1.001 a 10.000 usuários',
            'enterprise': 'Mais de 10.000 usuários'
        };

        let mensagem = `*Orçamento Valensoft*\n\n`;
        
        // Dados do Cliente
        mensagem += `📋 *Dados do Cliente*\n`;
        mensagem += `👤 Nome: ${dadosOrcamento.nome}\n`;
        mensagem += `📧 E-mail: ${dadosOrcamento.email}\n`;
        mensagem += `📱 Telefone: ${dadosOrcamento.telefone}\n`;
        mensagem += `🏢 Empresa: ${dadosOrcamento.empresa || 'Não informado'}\n\n`;
        
        // Detalhes do Projeto
        mensagem += `🔧 *Detalhes do Projeto*\n`;
        mensagem += `📱 Tipo: ${dadosOrcamento.tipoProjeto.charAt(0).toUpperCase() + dadosOrcamento.tipoProjeto.slice(1)}\n`;
        mensagem += `🎨 Design: ${dadosOrcamento.design === 'possui' ? 'Já possui identidade visual' : 'Necessita criar identidade visual'}\n`;
        mensagem += `⚙️ Funcionalidades: ${dadosOrcamento.funcionalidades.join(", ")}\n`;
        mensagem += `💻 Plataforma: ${dadosOrcamento.plataforma}\n`;
        mensagem += `👥 Usuários: ${traduzirUsuarios[dadosOrcamento.usuarios]}\n`;
        
        // Integrações e Segurança
        if (dadosOrcamento.integracoes.length > 0) {
            mensagem += `🔄 Integrações: ${dadosOrcamento.integracoes.join(", ")}\n`;
        }
        if (dadosOrcamento.seguranca.length > 0) {
            mensagem += `🔒 Segurança: ${dadosOrcamento.seguranca.join(", ")}\n`;
        }
        
        // Prazos e Custos
        mensagem += `\n⏱️ *Prazos e Investimento*\n`;
        mensagem += `📅 Prazo Desejado: ${dadosOrcamento.prazo}\n`;
        mensagem += `💼 Faixa de Investimento Pretendida: ${traduzirFaixaOrcamento[dadosOrcamento.orcamento]}\n`;
        mensagem += `🛠️ Suporte Pós-lançamento: ${dadosOrcamento.suporte === 'sim' ? 'Incluído' : 'Não incluído'}\n\n`;
        
        // Valor Estimado
        mensagem += `💰 *Investimento Estimado*\n`;
        mensagem += `${formatarMoeda(dadosOrcamento.valorTotal.minTotal)} a ${formatarMoeda(dadosOrcamento.valorTotal.maxTotal)}\n\n`;
        
        mensagem += `_Orçamento gerado automaticamente pelo sistema Valensoft._`;
        
        // Criar o link para o WhatsApp
        const numeroWhatsApp = "+5591992891008";
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        
        // Abrir o link no WhatsApp
        window.open(url, '_blank');
    }

    // Inicializar particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "opacity": {
                    "value": 0.08, // Reduzido de 0.15 para 0.08
                },
                "line_linked": {
                    "opacity": 0.08, // Reduzido de 0.15 para 0.08
                }
            }
        });
    }
});
