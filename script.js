document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value;
  
  if (!keyword) {
    alert('Por favor, insira uma palavra-chave');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${keyword}`);
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    alert('Ocorreu um erro ao buscar os dados. Por favor, tente novamente.');
  }
});

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (data.length === 0) {
    resultsDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  data.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const img = document.createElement('img');
    img.src = product.imgUrl;
    productDiv.appendChild(img);

    const title = document.createElement('p');
    title.textContent = product.title;
    productDiv.appendChild(title);

    const rating = document.createElement('p');
    rating.textContent = `Classificação: ${product.rating}/5 (${product.numReviews} avaliações)`;
    productDiv.appendChild(rating);

    resultsDiv.appendChild(productDiv);
  });
}