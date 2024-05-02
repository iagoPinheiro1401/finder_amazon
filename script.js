document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    
    if (!keyword) {
      alert('Por favor, insira uma palavra-chave');
      return;
    }
  });  