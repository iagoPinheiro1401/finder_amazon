import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();

// Permitir solicitações CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Rota para realizar scraping dos dados da Amazon
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Palavra-chave não fornecida' });
  }

  try {
    // Realiza uma requisição para a página de busca da Amazon com a palavra-chave fornecida
    const response = await axios.get(`https://www.amazon.com.br/s?k=${keyword}`);
    const { document } = new JSDOM(response.data).window;
    
    // Mapeia os itens de resultado da busca
    const products = Array.from(document.querySelectorAll('.s-result-item')).map(item => {
      // Extrai o título do produto
      const titleElement = item.querySelector('h2');
      const title = titleElement ? titleElement.textContent.trim() : 'N/A';
      
      // Extrai a nota de avaliação do produto
      const ratingElement = item.querySelector('.a-icon-star-small .a-icon-alt');
      const rating = ratingElement ? ratingElement.textContent.split(' ')[0] : 'N/A';
      
      // Extrai o número de avaliações do produto
      const numReviewsElement = item.querySelector('.a-size-small');
      const numReviews = numReviewsElement ? numReviewsElement.textContent.split(' ')[0] : 'N/A';
      
      // Extrai a URL da imagem do produto
      const imgUrlElement = item.querySelector('.s-image');
      const imgUrl = imgUrlElement ? imgUrlElement.getAttribute('src') : 'N/A';

      // Retorna um objeto com os dados do produto
      return { title, rating, numReviews, imgUrl };
    }).filter(product => product.title !== 'N/A' && product.rating !== 'N/A' && product.numReviews !== 'N/A' && product.imgUrl !== 'N/A');
    
    // Se nenhum produto for encontrado, lança um erro
    if (products.length === 0) {
      throw new Error('Nenhum produto encontrado');
    }
    
    // Retorna os dados dos produtos em formato JSON
    res.json(products);
  } catch (error) {
    console.error('Erro ao raspar os dados da Amazon:', error);
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 3000;

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});