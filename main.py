from flask import Flask, render_template, request, jsonify, send_file
import json
import os
import qrcode
from io import BytesIO

app = Flask(__name__)

DATA_FILE = 'inscricoes.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Migrar dados antigos para novo formato se necessário
            for inscricao in data.get('inscricoes', []):
                if 'familiares' in inscricao and isinstance(inscricao['familiares'], list):
                    if inscricao['familiares'] and not isinstance(inscricao['familiares'][0], dict):
                        # Converter array de strings para array de objetos com ID
                        inscricao['familiares'] = [
                            {"id": f"{inscricao['email']}_{i}", "nome": nome}
                            for i, nome in enumerate(inscricao['familiares'])
                        ]
            return data
    return {"inscricoes": []}

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/inscricoes', methods=['GET'])
def get_inscricoes():
    data = load_data()
    return jsonify(data)

@app.route('/api/inscricao', methods=['POST'])
def add_inscricao():
    dados = request.json
    email = dados.get('email', '').lower().strip()
    
    if not email.endswith('@claro.com.br'):
        return jsonify({"error": "Email deve ser @claro.com.br"}), 400
    
    data = load_data()
    
    for inscricao in data['inscricoes']:
        if inscricao['email'] == email:
            return jsonify({"error": "Email já cadastrado"}), 400
    
    familiares_nomes = dados.get('familiares', [])
    familiares_com_id = [
        {"id": f"{email}_{i}", "nome": nome}
        for i, nome in enumerate(familiares_nomes)
    ]
    
    nova_inscricao = {
        "email": email,
        "familiares": familiares_com_id
    }
    
    data['inscricoes'].append(nova_inscricao)
    save_data(data)
    
    return jsonify({"success": True, "inscricao": nova_inscricao})

@app.route('/qrcode/maps')
def qrcode_maps():
    maps_url = "https://maps.google.com/?q=Rua+Doutor+Barros+Cruz,+104+-+Vila+Mariana,+São+Paulo"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(maps_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    
    return send_file(buf, mimetype='image/png')

@app.route('/qrcode/lista')
def qrcode_lista():
    base_url = os.environ.get('REPL_SLUG', 'localhost:5000')
    lista_url = f"https://{base_url}.replit.dev/lista"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(lista_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    
    return send_file(buf, mimetype='image/png')

@app.route('/api/inscricao/delete', methods=['POST'])
def delete_inscricoes():
    ids = request.json.get('ids', [])
    
    if not ids:
        return jsonify({"error": "Nenhum ID fornecido"}), 400
    
    data = load_data()
    deletados = []
    
    for inscricao in data['inscricoes'][:]:
        # Deletar a inscrição completa se o email estiver nos IDs
        if inscricao['email'] in ids:
            deletados.append(inscricao['email'])
            data['inscricoes'].remove(inscricao)
        else:
            # Deletar convidados individuais
            familiares_atualizados = []
            for familiar in inscricao.get('familiares', []):
                if familiar['id'] not in ids:
                    familiares_atualizados.append(familiar)
                else:
                    deletados.append(familiar['nome'])
            
            inscricao['familiares'] = familiares_atualizados
    
    save_data(data)
    
    return jsonify({"success": True, "deleted": deletados})

@app.route('/lista')
def lista():
    data = load_data()
    total_pessoas = 0
    for inscricao in data['inscricoes']:
        total_pessoas += 1 + len(inscricao.get('familiares', []))
    
    return render_template('lista.html', inscricoes=data['inscricoes'], total=total_pessoas)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
