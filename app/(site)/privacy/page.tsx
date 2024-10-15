export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Política de Privacidade
        </h1>
        <div className="max-w-3xl mx-auto space-y-6 text-purple-200">
          <p>
            A sua privacidade é importante para nós. É política do Dream Oracle
            respeitar a sua privacidade em relação a qualquer informação sua que
            possamos coletar em nosso site.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            1. Informações que coletamos
          </h2>
          <p>
            Coletamos informações pessoais que você nos fornece diretamente,
            como nome, endereço de e-mail e detalhes de pagamento quando você se
            registra em nossa plataforma ou faz uma compra.
          </p>
          <p>
            Também coletamos informações sobre os sonhos que você compartilha
            para interpretação, bem como seu histórico de uso do serviço.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            2. Como usamos suas informações
          </h2>
          <p>Usamos as informações que coletamos para:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              Fornecer, manter e melhorar nossos serviços de interpretação de
              sonhos
            </li>
            <li>
              Processar transações e enviar notificações relacionadas à sua
              conta
            </li>
            <li>Responder a seus comentários, perguntas e solicitações</li>
            <li>
              Enviar informações sobre recursos, serviços e promoções que possam
              ser de seu interesse
            </li>
            <li>
              Monitorar e analisar tendências, uso e atividades em conexão com
              nosso serviço
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            3. Compartilhamento de informações
          </h2>
          <p>
            Não compartilhamos suas informações pessoais com terceiros, exceto
            nas seguintes circunstâncias:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Com seu consentimento</li>
            <li>Para cumprir obrigações legais</li>
            <li>Para proteger e defender nossos direitos e propriedade</li>
            <li>
              Com prestadores de serviços que nos ajudam a operar nosso negócio
              (estes são obrigados a manter a confidencialidade das informações)
            </li>
          </ul>
          <p className="mt-4">
            Além disso, quando você compartilha um sonho publicamente em nossa
            plataforma, você nos concede permissão para usar esse conteúdo,
            incluindo interpretações e imagens associadas, em nossas redes
            sociais, como Instagram, para fins de portfólio e divulgação do
            serviço. Seu nome de usuário e informações pessoais não serão
            compartilhados nessas postagens sem sua permissão explícita.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            4. Segurança dos dados
          </h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações
            contra acesso não autorizado, alteração, divulgação ou destruição.
            Isso inclui criptografia de dados, firewalls e controles de acesso
            físico a nossos data centers.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            5. Seus direitos
          </h2>
          <p>
            Você tem o direito de acessar, corrigir ou excluir suas informações
            pessoais. Também pode optar por não receber comunicações
            promocionais nossas. Para exercer esses direitos, entre em contato
            conosco através do nosso formulário de contato.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            6. Uso de IA e dados dos sonhos
          </h2>
          <p>
            Os detalhes dos sonhos que você compartilha são processados por
            nossa IA para fornecer interpretações. Esses dados são anonimizados
            e podem ser usados para melhorar nossos algoritmos de IA. Não
            compartilhamos os detalhes específicos dos seus sonhos com
            terceiros.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            7. Cookies e tecnologias similares
          </h2>
          <p>
            Usamos cookies e tecnologias similares para melhorar a experiência
            do usuário, analisar o tráfego do site e personalizar o conteúdo.
            Você pode controlar o uso de cookies através das configurações do
            seu navegador.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            8. Alterações nesta política
          </h2>
          <p>
            Podemos atualizar nossa Política de Privacidade de tempos em tempos.
            Notificaremos você sobre quaisquer alterações publicando a nova
            Política de Privacidade nesta página.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            9. Contato
          </h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, por
            favor entre em contato conosco através do nosso formulário de
            contato.
          </p>

          <p className="mt-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
