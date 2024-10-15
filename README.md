   <h1>🎟️ Sistema de Vendas de Ingressos Online</h1>

   <div class="section">
        <h2>Sobre o Projeto</h2>
        <p>
            Este é um sistema de vendas de ingressos online desenvolvido com o objetivo de aprimorar habilidades em backend, 
            com foco em regras de negócio mais complexas e funcionalidades de um sistema real. O sistema possui autenticação 
            diferenciada para administradores e usuários comuns, possibilitando o gerenciamento de eventos, ingressos e promoções.
        </p>
    </div>

   <div class="section">
        <h2>Funcionalidades</h2>
        <ul>
            <li>🔐 <strong>Autenticação e Registro de Usuários</strong>: Diferenciação entre perfis ADMIN e USER, com controle de acesso via middleware e token JWT.</li>
            <li>🛠️ <strong>Gerenciamento de Eventos e Ingressos</strong>: CRUD completo para eventos, ingressos e promoções, acessível apenas para usuários ADMIN.</li>
            <li>🏷️ <strong>Promoções e Descontos</strong>: Criação e aplicação de códigos promocionais para ofertas especiais.</li>
            <li>💳 <strong>Processo de Compra</strong>: Integração com Stripe para pagamentos online e envio de ingressos em PDF por e-mail após a confirmação.</li>
            <li>📧 <strong>Validação de Registro por E-mail</strong>: Os usuários só são registrados após clicar em um link enviado para o e-mail fornecido.</li>
        </ul>
    </div>
    <div class="section">
        <h2>Arquitetura do Projeto</h2>
        <p>A estrutura do projeto segue boas práticas de desenvolvimento de software, com divisão clara de responsabilidades:</p>
        <ul>
            <li><strong>Controllers</strong>: Gerenciam as requisições e respostas.</li>
            <li><strong>Repositories</strong>: Isolam a lógica de acesso a dados para manter o código desacoplado e modular.</li>
            <li><strong>Services</strong>: Implementam a lógica de negócios.</li>
            <li><strong>Middlewares</strong>: Validam dados, gerenciam tokens e lidam com erros.</li>
            <li><strong>DTOs</strong>: Definem os objetos de transferência de dados.</li>
            <li><strong>Use Cases</strong>: Organizam funcionalidades por casos de uso específicos.</li>
        </ul>
    </div>
    <div class="section">
        <h2>Instalação</h2>
        <p>Para rodar o projeto localmente, siga os passos abaixo:</p>
        <ol>
            <li>Clone o repositório: <code>git clone https://github.com/ms-gustavo/tickets-system.git</code></li>
            <li>Instale as dependências: <code>npm install</code></li>
            <li>Crie um arquivo <code>.env</code> com as variáveis de ambiente necessárias (Stripe, banco de dados, etc.).</li>
            <li>Inicie o servidor: <code>npm run dev</code></li>
        </ol>
    </div>

  <div class="section">
        <h2>Como Usar</h2>
        <p>O sistema oferece as seguintes rotas principais:</p>
        <ul>
            <li><strong>/auth</strong>: Autenticação e registro de usuários.</li>
            <li><strong>/events</strong>: Gerenciamento de eventos.</li>
            <li><strong>/tickets</strong>: Gerenciamento de ingressos.</li>
            <li><strong>/promotions</strong>: Criação e aplicação de promoções.</li>
            <li><strong>/purchase</strong>: Compra de ingressos com pagamento via Stripe.</li>
        </ul>
    </div>

   <div class="section">
        <h2>Próximos Passos</h2>
        <p>O projeto ainda está em construção e há melhorias planejadas, incluindo:</p>
        <ul>
            <li>Refatoração de código para melhorar a legibilidade e desempenho.</li>
            <li>Otimização da arquitetura do sistema para reduzir acoplamento.</li>
            <li>Novas funcionalidades para melhorar a experiência do usuário.</li>
        </ul>
    </div>
    <div class="section">
        <h2>Tecnologias Utilizadas</h2>
        <ul>
            <li>Node.js</li>
            <li>TypeScript</li>
            <li>Express</li>
            <li>Prisma (ORM)</li>
            <li>JWT para autenticação</li>
            <li>Stripe para pagamentos</li>
            <li>PDFKit para geração de PDFs</li>
        </ul>
    </div>

  <div class="section">
        <h2>Contribuição</h2>
        <p>Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.</p>
    </div>
