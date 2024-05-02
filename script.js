// Adiciona um listener de evento ao botão "scrapeBtn"
document.getElementById('scrapeBtn').addEventListener('click', async () => {
  // Obtém a palavra-chave digitada pelo usuário
  const keyword = document.getElementById('keyword').value;
  
  // Verifica se a palavra-chave foi inserida
  if (!keyword) {
    alert('Por favor, insira uma palavra-chave');
    return;
  }
  
  try {
    // Faz uma requisição para a API de scraping
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${keyword}`);
    // Extrai os dados da resposta
    const data = await response.json();
    // Exibe os resultados na página
    displayResults(data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    alert('Ocorreu um erro ao buscar os dados. Por favor, tente novamente.');
  }
});

// Função para exibir os resultados na página
function displayResults(data) {
  // Seleciona o elemento onde os resultados serão exibidos
  const resultsDiv = document.getElementById('results');
  // Limpa qualquer conteúdo anterior
  resultsDiv.innerHTML = '';

  // Verifica se nenhum produto foi encontrado
  if (data.length === 0) {
    // Exibe uma mensagem indicando que nenhum produto foi encontrado
    resultsDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  // Itera sobre os dados dos produtos
  data.forEach(product => {
    // Cria um elemento de div para cada produto
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    // Adiciona a imagem do produto
    const img = document.createElement('img');
    img.src = product.imgUrl;
    productDiv.appendChild(img);

    // Adiciona o título do produto
    const title = document.createElement('p');
    title.textContent = product.title;
    productDiv.appendChild(title);

    // Adiciona a classificação e o número de avaliações do produto
    const rating = document.createElement('p');
    rating.textContent = `Classificação: ${product.rating}/5 (${product.numReviews} avaliações)`;
    productDiv.appendChild(rating);

    // Adiciona o produto à lista de resultados
    resultsDiv.appendChild(productDiv);
  });
}