import { createConnection } from 'mysql2/promise';

// Função para conectar no MySQL
async function connectToDatabase() {
    return createConnection({
        port: 3306, // só se a porta for diferente de 3306
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'teste-api',   
    });
}

// Rota da API Update de user
export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405). json({ error: 'Metodo não permitido' });
    }

    const { id, name, email } = req.body;
    console.log(req.body);

    if (!id || !name || !email) {
        return res.status(400).json({ error: 'id, name, and e email são obrigatórios no request body.'});
    }

    try {
        // Connect to the database
        const connection = await connectToDatabase();

        // Executa query para atualizar a tabela "users"
        const [result] = await connection.execute('UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
    
    );

    
    // Fecha conexão com o banco
    await connection.end();

     // Check se o update teve sucesso
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado.   '}); 
    }

    // Respostas de Sucesso
    res.status(200).json({ message: 'Usuário atualizado com sucesso!'}); 
  } catch (error) {
    console.error('Erro de conexão com o banco:', error);
    res.status(500).json({ error: 'Erro interno de servidor' });

  }

}