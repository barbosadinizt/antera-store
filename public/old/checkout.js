// checkout.js - Sistema de pagamento da Antera Store
class CheckoutAntera {
    constructor() {
        this.API_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api'
            : '/api';
    }
    
    async processarPagamento(carrinho, entrega) {
        // Calcular totais
        let subtotal = 0;
        const itensFormatados = [];
        
        carrinho.forEach(item => {
            const preco = item.precoAtual || item.preco || 0;
            const totalItem = preco * item.quantidade;
            subtotal += totalItem;
            
            itensFormatados.push({
                id: item.id,
                nome: item.nome,
                quantidade: item.quantidade,
                preco_unitario: preco,
                total: totalItem
            });
        });
        
        const total = subtotal + (entrega.valor || 0);
        
        // 1. Salvar pedido no backend
        const pedidoSalvo = await this.salvarPedido(itensFormatados, entrega, total);
        
        if (!pedidoSalvo) {
            throw new Error('Erro ao salvar pedido');
        }
        
        // 2. Criar pagamento no Mercado Pago
        const pagamento = await this.criarPagamentoMercadoPago(itensFormatados, total, pedidoSalvo.id);
        
        return {
            pedido: pedidoSalvo,
            pagamento: pagamento,
            total: total
        };
    }
    
    async salvarPedido(itens, entrega, total) {
        try {
            const response = await fetch(`${this.API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itens: itens,
                    entrega: entrega,
                    total: total,
                    status: 'aguardando_pagamento'
                })
            });
            
            if (!response.ok) throw new Error('Erro API');
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            return null;
        }
    }
    
    async criarPagamentoMercadoPago(itens, total, pedidoId) {
        try {
            const response = await fetch(`${this.API_URL}/criar-pagamento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itens: itens,
                    total: total,
                    descricao: `Pedido #${pedidoId} - Antera Store`,
                    pedido_id: pedidoId
                })
            });
            
            if (!response.ok) throw new Error('Erro Mercado Pago');
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao criar pagamento:', error);
            
            // Fallback: link genérico do Mercado Pago
            return {
                init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=demo&item=${encodeURIComponent(`Pedido Antera Store - R$ ${total.toFixed(2)}`)}`,
                sandbox: true
            };
        }
    }
    
    abrirCheckout(urlPagamento) {
        // Abre em nova janela
        const janela = window.open(urlPagamento, '_blank', 'width=800,height=600');
        
        // Verifica periodicamente se o pagamento foi concluído
        const verificarPagamento = setInterval(() => {
            if (janela.closed) {
                clearInterval(verificarPagamento);
                this.verificarStatusPagamento();
            }
        }, 1000);
    }
    
    async verificarStatusPagamento() {
        // Aqui você verificaria o status real com o backend
        alert('Pagamento processado! Verifique seu email para confirmação.');
        window.location.href = 'sucesso.html';
    }
}

// Instância global
const checkout = new CheckoutAntera();

// Função para integrar com seu carrinho
async function finalizarComPagamento() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_antera')) || [];
    
    if (carrinho.length === 0) {
        alert('Adicione produtos ao carrinho primeiro!');
        return;
    }
    
    // Perguntar entrega
    const tipoEntrega = prompt(
        'ESCOLHA ENTREGA:\n\n1. Retirada (GRÁTIS)\n2. Entrega Local (R$ 5,00)\n\nDigite 1 ou 2:'
    );
    
    if (!tipoEntrega) return;
    
    const entrega = tipoEntrega === '2' 
        ? { nome: 'Entrega Local', valor: 5.00 }
        : { nome: 'Retirada na Loja', valor: 0.00 };
    
    try {
        // Processar pagamento
        const resultado = await checkout.processarPagamento(carrinho, entrega);
        
        // Mostrar opções
        const usarMP = confirm(
            `Total: R$ ${resultado.total.toFixed(2)}\n\n` +
            `1. Mercado Pago (Cartão/PIX/Boleto)\n` +
            `2. WhatsApp (Pagamento manual)\n\n` +
            `Clique OK para Mercado Pago ou Cancelar para WhatsApp`
        );
        
        if (usarMP && resultado.pagamento.init_point) {
            // Abrir checkout Mercado Pago
            checkout.abrirCheckout(resultado.pagamento.init_point);
        } else {
            // Fallback para WhatsApp
            enviarPedidoWhatsApp(carrinho, entrega, resultado.total);
        }
        
    } catch (error) {
        console.error('Erro no checkout:', error);
        alert('Erro ao processar pagamento. Tente novamente ou use WhatsApp.');
        enviarPedidoWhatsApp(carrinho, entrega, 0);
    }
}

// Fallback WhatsApp (já temos)
function enviarPedidoWhatsApp(carrinho, entrega, total) {
    // ... seu código atual do WhatsApp ...
}