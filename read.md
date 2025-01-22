# *Sistema de Gestão com Hierarquia de Usuários*

## *Descrição Geral*
Este sistema foi desenvolvido utilizando *Angular 18* e *Ionic, adotando o **Princípio de Responsabilidade Única (SRP)* para gerenciar três tipos de usuários: *Admin, **Comercial* e *Usuário (Cooperado)*. Cada tipo de usuário possui responsabilidades e funcionalidades distintas, com acesso restrito a recursos específicos do sistema.

---

## *Objetivos do Sistema*
1. Garantir a segurança através de controle de acesso baseado em roles e permissões.
2. Estruturar as responsabilidades por tipo de usuário, evitando sobrecarga de funcionalidades.
3. Facilitar a expansão do sistema para novas funcionalidades ou regras de negócio.
4. Garantir a manutenção e escalabilidade do sistema através de boas práticas de *Clean Code*.

---

## *Estrutura de Roles e Funcionalidades*

### *Admin*
- *Responsabilidades*:
  - Gerenciar *Comerciais*.
  - Gerenciar todos os *Cooperados* do sistema.
  - Configurar parâmetros globais do sistema.
- *Funcionalidades*:
  1. Painel administrativo com resumo do sistema.
  2. Gerenciamento completo de Comerciais (CRUD).
  3. Gerenciamento de Cooperados criados pelos Comerciais.
  4. Configuração de taxas, vencimentos e outras configurações globais.

### *Comercial*
- *Responsabilidades*:
  - Gerenciar seus próprios *Cooperados*.
  - Registrar e visualizar pagamentos relacionados aos seus Cooperados.
  - Preencher fichas de adesão diretamente no sistema.
- *Funcionalidades*:
  1. Painel com resumo comercial (pagamentos pendentes e realizados).
  2. Gerenciamento completo de Cooperados (CRUD).
  3. Registro de pagamentos realizados.
  4. Preenchimento de fichas de adesão para novos clientes.

### *Usuário (Cooperado)*
- *Responsabilidades*:
  - Acessar seu histórico de pagamentos e notificações.
- *Funcionalidades*:
  1. Painel pessoal com informações financeiras e notificações.
  2. Consulta detalhada do histórico de pagamentos.

---

## *Estrutura do Sistema*

### *Hierarquia de Pastas*

plaintext
src/
|-- app/
|   |-- pages/
|   |   |-- admin/
|   |   |   |-- dashboard-admin/
|   |   |   |-- manage-comerciais/
|   |   |   |-- manage-cooperados/
|   |   |   |-- view-comercial-details/
|   |   |   |-- config-system/
|   |   |   |-- create-comercial/
|   |   |-- comercial/
|   |   |   |-- dashboard-comercial/
|   |   |   |-- manage-cooperados/
|   |   |   |-- register-payment/
|   |   |   |-- preencher-ficha-adesao/
|   |   |   |-- view-cooperado-details/
|   |   |   |-- create-cooperado/
|   |   |-- usuario/
|   |   |   |-- dashboard-usuario/
|   |   |   |-- payment-history/
|   |   |   |-- view-notifications/
|   |-- shared/
|   |   |-- services/
|   |   |   |-- auth.service.ts
|   |   |   |-- user.service.ts
|   |   |   |-- api.service.ts
|   |   |   |-- localstorage.service.ts
|   |   |-- models/
|   |   |   |-- auth.model.ts
|   |   |   |-- user.model.ts
|   |   |   |-- login-credentials.model.ts
|   |   |   |-- pagamento.model.ts
|   |   |   |-- ficha-adesao.model.ts
|   |   |   |-- resumo-admin.model.ts
|   |   |   |-- resumo-comercial.model.ts
|   |   |   |-- resumo-usuario.model.ts
|   |   |   |-- notificacao.model.ts
|   |   |-- guards/
|   |   |   |-- admin.guard.ts
|   |   |   |-- comercial.guard.ts
|   |   |   |-- usuario.guard.ts


---

## *Detalhamento de Páginas, Serviços e Modelos*

### *Admin*

#### *Páginas (Pages)*
1. *DashboardAdminPage*: Resumo geral do sistema com gráficos de estatísticas e relatórios consolidados.
2. *ManageComerciaisPage*: Gerenciar Comerciais (listar, criar, editar e excluir).
3. *ManageCooperadosAdminPage*: Gerenciar Cooperados criados pelos Comerciais.
4. *ViewComercialDetailsPage*: Exibir detalhes de um Comercial específico.
5. *ConfigSystemPage*: Atualizar configurações globais do sistema.
6. *CreateComercialPage*: Formulário para criação de Comerciais.

#### *Serviços*
1. *AdminDashboardService*
   - *Métodos*:
     - getResumo(): Observable<ResumoAdmin>
2. *ComercialService*
   - *Métodos*:
     - listarComerciais(): Observable<Comercial[]>
     - criarComercial(comercial: Comercial): Observable<void>
     - editarComercial(id: string, comercial: Comercial): Observable<void>
     - deletarComercial(id: string): Observable<void>
3. *AdminCooperadosService*
   - *Métodos*:
     - listarCooperados(): Observable<Cooperado[]>
     - editarCooperado(id: string, cooperado: Cooperado): Observable<void>
     - deletarCooperado(id: string): Observable<void>
4. *ConfigService*
   - *Métodos*:
     - getConfiguracoes(): Observable<Configuracoes>
     - atualizarConfiguracoes(config: Configuracoes): Observable<void>

#### *Modelos*
1. *ResumoAdmin*
2. *Comercial*
3. *Cooperado*
4. *Configuracoes*

---

### *Comercial*

#### *Páginas (Pages)*
1. *DashboardComercialPage*: Resumo de pagamentos pendentes e realizados.
2. *ManageCooperadosComercialPage*: Gerenciar Cooperados (listar, criar, editar e excluir).
3. *RegisterPaymentPage*: Registro de pagamentos realizados para Cooperados.
4. *PreencherFichaAdesaoPage*: Preenchimento direto da ficha de adesão no sistema.
5. *ViewCooperadoDetailsPage*: Exibir detalhes de um Cooperado específico.
6. *CreateCooperadoPage*: Formulário para criação de Cooperados.

#### *Serviços*
1. *ComercialDashboardService*
   - *Métodos*:
     - getResumo(): Observable<ResumoComercial>
2. *CooperadoService*
   - *Métodos*:
     - listarCooperados(): Observable<Cooperado[]>
     - criarCooperado(cooperado: Cooperado): Observable<void>
     - editarCooperado(id: string, cooperado: Cooperado): Observable<void>
     - deletarCooperado(id: string): Observable<void>
3. *PagamentoService*
   - *Métodos*:
     - registrarPagamento(pagamento: Pagamento): Observable<void>
     - listarPagamentos(cooperadoId: string): Observable<Pagamento[]>
4. *FichaAdesaoService*
   - *Métodos*:
     - enviarFicha(ficha: FichaAdesao): Observable<void>
     - listarFichas(): Observable<FichaAdesao[]>

#### *Modelos*
1. *ResumoComercial*
2. *FichaAdesao*
3. *Pagamento*

---

### *Usuário (Cooperado)*

#### *Páginas (Pages)*
1. *DashboardUsuarioPage*: Resumo financeiro e notificações.
2. *PaymentHistoryPage*: Histórico completo de pagamentos realizados e pendentes.
3. *ViewNotificationsPage*: Visualização de notificações recebidas.

#### *Serviços*
1. *UsuarioDashboardService*
   - *Métodos*:
     - getResumoUsuario(): Observable<ResumoUsuario>
2. *HistoricoPagamentoService*
   - *Métodos*:
     - listarHistorico(cooperadoId: string): Observable<Pagamento[]>

#### *Modelos*
1. *ResumoUsuario*
2. *Notificacao*
3. *Pagamento*

---

### *Guards*
1. *AdminGuard*: Restringe o acesso às páginas de Admin e valida permissões específicas.
2. *ComercialGuard*: Restringe o acesso às páginas de Comerciais e valida permissões específicas.
3. *UsuarioGuard*: Restringe o acesso às páginas dos Cooperados e valida permissões específicas.

---

### *Novos Serviços Criados*
1. *ApiService*:
   - Centraliza chamadas HTTP para maior reutilização.
   - Gerencia headers e URLs dinâmicas.
2. *LocalStorageService*:
   - Gerencia operações de leitura e escrita no localStorage.
   - Evita duplicidade de código ao acessar o armazenamento local.

---

## *Próximos Passos*
1. Implementar as páginas frontend conforme descrito.
2. Integrar o frontend com os endpoints do backend em NestJS.
3. Realizar testes de segurança, fluxo de navegação e validação de regras de negócio.