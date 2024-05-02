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

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Palavra-chave não fornecida' });
  }

  try {
    const response = await axios.get(`https://www.amazon.com.br/s?k=${keyword}`);
    const { document } = new JSDOM(response.data).window;
    
    const products = Array.from(document.querySelectorAll('.s-result-item')).map(item => {
      const titleElement = item.querySelector('h2');
      const title = titleElement ? titleElement.textContent.trim() : 'N/A';
      
      const ratingElement = item.querySelector('.a-icon-star-small .a-icon-alt');
      const rating = ratingElement ? ratingElement.textContent.split(' ')[0] : 'N/A';
      
      const numReviewsElement = item.querySelector('.a-size-small');
      const numReviews = numReviewsElement ? numReviewsElement.textContent.split(' ')[0] : 'N/A';
      
      const imgUrlElement = item.querySelector('.s-image');
      const imgUrl = imgUrlElement ? imgUrlElement.getAttribute('src') : 'N/A';

      return { title, rating, numReviews, imgUrl };
    }).filter(product => product.title !== 'N/A' && product.rating !== 'N/A' && product.numReviews !== 'N/A' && product.imgUrl !== 'N/A');
    
    if (products.length === 0) {
      throw new Error('Nenhum produto encontrado');
    }
    
    res.json(products);
  } catch (error) {
    console.error('Erro ao raspar os dados da Amazon:', error);
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});