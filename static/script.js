function processarLista() {
    const textarea = document.getElementById('paste-list');
    const texto = textarea.value.trim();
    
    if (!texto) {
        alert('Cole a lista de convidados primeiro!');
        return;
    }
    
    const linhas = texto.split('\n');
    const container = document.getElementById('familiares-container');
    
    // Limpa campos existentes
    container.innerHTML = '';
    
    linhas.forEach(linha => {
        linha = linha.trim();
        if (!linha) return;
        
        // Processa formato "Nome +X" ou apenas "Nome"
        const match = linha.match(/^(.+?)\s*\+?\s*(\d+)?$/);
        if (match) {
            const nome = match[1].trim();
            const quantidade = parseInt(match[2] || '0');
            
            // Adiciona a pessoa principal
            const item = document.createElement('div');
            item.className = 'familiar-item';
            item.innerHTML = `
                <input type="text" class="familiar-input" value="${nome}" placeholder="Nome do familiar/amigo">
                <button type="button" class="btn-remove" onclick="removeFamiliar(this)">❌</button>
            `;
            container.appendChild(item);
            
            // Adiciona acompanhantes se houver
            for (let i = 0; i < quantidade; i++) {
                const acompItem = document.createElement('div');
                acompItem.className = 'familiar-item';
                acompItem.innerHTML = `
                    <input type="text" class="familiar-input" value="${nome} - Acompanhante ${i + 1}" placeholder="Nome do familiar/amigo">
                    <button type="button" class="btn-remove" onclick="removeFamiliar(this)">❌</button>
                `;
                container.appendChild(acompItem);
            }
        }
    });
    
    // Se não adicionou nada, mantém um campo vazio
    if (container.children.length === 0) {
        addFamiliar();
    }
    
    // Limpa o textarea
    textarea.value = '';
    
    alert(`✅ Lista processada! Total de pessoas adicionadas: ${container.children.length}`);
}

function addFamiliar() {
    const container = document.getElementById('familiares-container');
    const newItem = document.createElement('div');
    newItem.className = 'familiar-item';
    newItem.innerHTML = `
        <input type="text" class="familiar-input" placeholder="Nome do familiar/amigo">
        <button type="button" class="btn-remove" onclick="removeFamiliar(this)">❌</button>
    `;
    container.appendChild(newItem);
}

function removeFamiliar(button) {
    const container = document.getElementById('familiares-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        button.previousElementSibling.value = '';
    }
}

document.getElementById('inscricaoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const messageDiv = document.getElementById('message');
    
    if (!email.endsWith('@claro.com.br')) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ O email deve ser do domínio @claro.com.br';
        return;
    }
    
    const familiarInputs = document.querySelectorAll('.familiar-input');
    const familiares = [];
    familiarInputs.forEach(input => {
        if (input.value.trim()) {
            familiares.push(input.value.trim());
        }
    });
    
    const dados = {
        email: email,
        familiares: familiares
    };
    
    try {
        const response = await fetch('/api/inscricao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = '✅ Inscrição confirmada com sucesso!';
            
            document.getElementById('email').value = '';
            familiarInputs.forEach(input => input.value = '');
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = '❌ ' + (result.error || 'Erro ao confirmar inscrição');
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Erro ao enviar inscrição. Tente novamente.';
    }
});
