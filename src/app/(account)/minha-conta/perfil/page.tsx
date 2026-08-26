export default function Profile() {
  return (
    <>
      <header className="portal-header">
        <div>
          <span className="kicker">Configurações</span>
          <h1>Meu perfil</h1>
          <p>Mantenha seus dados de contato atualizados.</p>
        </div>
      </header>
      <section className="portal-content">
        <form className="data-card profile-form">
          <label>
            Nome completo
            <input defaultValue="Cliente LeoLab" />
          </label>
          <label>
            E-mail
            <input type="email" defaultValue="cliente@email.com" />
          </label>
          <label>
            WhatsApp
            <input defaultValue="(11) 99999-9999" />
          </label>
          <button className="button">Salvar alterações</button>
        </form>
      </section>
    </>
  );
}
