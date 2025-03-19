        // Função para mostrar o conteúdo de acordo com a categoria clicada (botões redondos)
        function showContent(category) {
            // Primeiro, esconder todos os conteúdos
            var contents = document.querySelectorAll('.info-box');
            contents.forEach(function(content) {
                content.classList.remove('show');
            });
        
            // Em seguida, mostrar o conteúdo da categoria clicada
            var selectedContent = document.getElementById(category + '-content');
            if (selectedContent) {
                selectedContent.classList.add('show');
            }
        
            // Remover a classe 'selected' de todos os botões
            var buttons = document.querySelectorAll('.category-button');
            buttons.forEach(function(button) {
                button.classList.remove('selected');
            });
        
            // Adicionar a classe 'selected' ao botão que foi clicado
            var selectedButton = document.getElementById('btn-' + category);
            if (selectedButton) {
                selectedButton.classList.add('selected');
            }
        
            // Remover a seleção automaticamente apos...
            setTimeout(function() {
                selectedButton.classList.remove('selected');
                selectedContent.classList.remove('show');
            }, 30000); // O tempo é em milissegundos
        }