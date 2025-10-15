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
