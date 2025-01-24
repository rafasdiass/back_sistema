


export class DashboardDto{


    nome: string; // Nome do cooperado.
    cpf: string; // CPF do cooperado.
    historicoPagamentos: { nome: string; valor: number }[]; // Histórico de pagamentos.
    pagamentosRealizados: number; // Total de pagamentos realizados.
    pagamentosPendentes: number; // Total de pagamentos pendentes.
    pagamentosCancelados: number; // Total de pagamentos cancelados.
    totalCooperados: number; // Total de cooperados cadastrados.
    totalComercial: number; // Total de comerciais cadastrados.
    cooperadosAtivos: number; // Total de cooperados ativos.


}