// Splashscreen
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splashscreen');
        if (splash) {
            splash.style.display = 'none';
        }
    }, 3000);
});

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
            let nomeCompleto = match[1].trim();
            const quantidade = parseInt(match[2] || '0');
            
            // Separa nome e sobrenome (se houver)
            const partesNome = nomeCompleto.split(' ').filter(p => p.length > 0);
            const primeiroNome = partesNome[0] || '';
            const sobrenome = partesNome.slice(1).join(' ') || '';
            
            // Adiciona a pessoa principal
            const item = document.createElement('div');
            item.className = 'familiar-item-grid';
            item.innerHTML = `
                <input type="text" class="familiar-input-nome" value="${primeiroNome}" placeholder="Nome">
                <input type="text" class="familiar-input-sobrenome" value="${sobrenome}" placeholder="Sobrenome">
                <input type="text" class="familiar-input-documento" value="" placeholder="RG/CPF">
                <button type="button" class="btn-remove" onclick="removeFamiliar(this)">❌</button>
            `;
            container.appendChild(item);
            
            // Adiciona acompanhantes se houver
            for (let i = 0; i < quantidade; i++) {
                const acompItem = document.createElement('div');
                acompItem.className = 'familiar-item-grid';
                acompItem.innerHTML = `
                    <input type="text" class="familiar-input-nome" value="${primeiroNome} - Acomp ${i + 1}" placeholder="Nome">
                    <input type="text" class="familiar-input-sobrenome" value="${sobrenome}" placeholder="Sobrenome">
                    <input type="text" class="familiar-input-documento" value="" placeholder="RG/CPF">
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
    newItem.className = 'familiar-item-grid';
    newItem.innerHTML = `
        <input type="text" class="familiar-input-nome" placeholder="Nome">
        <input type="text" class="familiar-input-sobrenome" placeholder="Sobrenome">
        <input type="text" class="familiar-input-documento" placeholder="RG/CPF">
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
    
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const rg = document.getElementById('rg').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const messageDiv = document.getElementById('message');
    
    if (!email.endsWith('@claro.com.br')) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ O email deve ser do domínio @claro.com.br';
        return;
    }
    
    const familiarItems = document.querySelectorAll('.familiar-item-grid');
    const familiares = [];
    
    familiarItems.forEach(item => {
        const nome = item.querySelector('.familiar-input-nome').value.trim();
        const sobrenome = item.querySelector('.familiar-input-sobrenome').value.trim();
        const documento = item.querySelector('.familiar-input-documento').value.trim();
        
        if (nome || sobrenome) {
            familiares.push({
                nome: nome,
                sobrenome: sobrenome,
                documento: documento
            });
        }
    });
    
    const dados = {
        nome: nome,
        sobrenome: sobrenome,
        rg: rg,
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
            
            document.getElementById('nome').value = '';
            document.getElementById('sobrenome').value = '';
            document.getElementById('rg').value = '';
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
