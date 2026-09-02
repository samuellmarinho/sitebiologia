function showTab(tabId) {
    // Esconde todos os conteúdos das abas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove a classe 'active' de todos os botões
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostra o conteúdo da aba clicada
    document.getElementById(tabId).classList.add('active');

    // Adiciona a classe 'active' ao botão que foi clicado
    // Usa o evento para descobrir qual botão chamou a função
    event.currentTarget.classList.add('active');
}