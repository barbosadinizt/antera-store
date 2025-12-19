document.addEventListener("DOMContentLoaded", () => {
  console.log("JS carregado");

  let carrinho = [];

  // ===============================
  // CARREGAR PRODUTOS
  // ===============================
  fetch("/produtos.json")
    .then(res => res.json())
    .then(produtos => {
      const grid = document.getElementById("produtosGrid");
      if (!grid) return;

      grid.innerHTML = "";

      produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto-card";

        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
          <button class="btn-add">Adicionar ao carrinho</button>
        `;

        card.querySelector(".btn-add").addEventListener("click", () => {
          carrinho.push(produto);
          atualizarCarrinho();
        });

        grid.appendChild(card);
      });
    })
    .catch(err => console.error("Erro ao carregar produtos:", err));

  // ===============================
  // ATUALIZAR CARRINHO
  // ===============================
  function atualizarCarrinho() {
    document.querySelector(".cart-count").innerText = carrinho.length;

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    if (carrinho.length === 0) {
      cartItems.innerHTML = "<p>Seu carrinho está vazio</p>";
      cartTotal.innerText = "0.00";
      return;
    }

    let total = 0;

    carrinho.forEach(item => {
      total += item.preco;
      const div = document.createElement("div");
      div.innerText = `${item.nome} — R$ ${item.preco.toFixed(2)}`;
      cartItems.appendChild(div);
    });

    cartTotal.innerText = total.toFixed(2);
  }

  // ===============================
  // ABRIR / FECHAR CARRINHO
  // ===============================
  document.getElementById("cartButton")?.addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "flex";
  });

  document.querySelector(".close-cart")?.addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
  });

  // ===============================
  // FINALIZAR PEDIDO
  // ===============================
  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio");
      return;
    }

    alert("Redirecionando para pagamento...");
    // aqui depois entra Mercado Pago / WhatsApp definitivo
  });
});
