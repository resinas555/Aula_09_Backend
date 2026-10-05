const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');//importa a conexão com supabase
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware essenciais

app.use(cors()); // Permite que o frontend acesse este backend sem erros de CORS
app.use(express.json()); // Permite que o Express entenda requisições com corpo em JSON

// Passo 1 memória ram do servidor

let produtosEmMemoria = [
    { id: 1, nome: 'Teclado Mecânico RGB', preco: 150.00 },
    { id: 2, nome: 'Mouse Gamer 3200 DPI', preco: 85.50 },
];

// Rota GET

app.get('/produtos', async (req, res) => {
    console.log('[GET /produtos] Enviando produtos em memória...');
    // res.json(produtosEmMemoria);
    const {data, error} = await supabase
    .from('produtos')
    .select('*')
    .order('id' , {ascending: true});
    if (error){
        return res.status(500).json([error.message]);
   }
   res.json(data);
});

// Rota POST

app.post('/produtos', (req, res) => {
    const { nome, preco } = req.body;
    if (!nome || !preco) {
        return res.status(400).json({
            erro: 'Nome e preço são obrigatórios!'
        });
    }
    const novoProduto = {
        id: Date.now(), // Gera um id temporário baseado no timestamp
        nome,
        preco: parseFloat(preco)

    };
    produtosEmMemoria.push(novoProduto);
    console.log(`[POST /produtos] Produto adicionado na RAM: ${novoProduto.nome}`);
    res.status(201).json(novoProduto);

});

// Rota PUT: alterar um produto

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, preco } = req.body;
    const produto = produtosEmMemoria.find(produto => produto.id === id);
    if (!produto) {
        return res.status(404).json({
            erro: 'Produto não encontrado!'});
    }
    if (nome) {
        produto.nome = nome;
    }
    if (preco) {
        produto.preco = parseFloat(preco);
    }
    console.log(`[PUT /produtos/${id}] Produto atualizado.`);
    res.json(produto);
});


// Rota DELETE: remover um produto

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = produtos.findIndex(produto => produto.id === id);
    if (indice === -1) {
        return res.status(404).json({
            mensagem : 'Produto não encontrado!'});
    }

    const [produtoRemovido] = produtos.splice(indice, 1); 
    res.json(produtoRemovido);
});

// listen Iniciar o servidor

app.listen(PORT, () => {

    console.log('=====================================================');
    console.log(`Servidor Back-End rodando em http://localhost:${PORT}`);
    console.log(`Rota de produtos ativa em: http://localhost:${PORT}/produtos`);
    console.log('Status: MODO MEMÓRIA RAM ATIVO');
    console.log('=====================================================');

});