document.addEventListener("DOMContentLoaded", () => {
  console.log("JS carregado");
});

// ===============================
// VARIÁVEIS
// ===============================
let carrinho = [];

// ===============================
// CARREGAR PRODUTOS
// ===============================
fetch("produtos.json")
  .then(response => response.json())
  .then(produtos => {
    const grid = document.getElementById("produtosGrid");
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
        adicionarAoCarrinho(produto);
      });

      grid.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar produtos:", error);
  });

// ===============================
// CARRINHO
// ===============================
function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  document.querySelector(".cart-count").innerText = carrinho.length;

  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  if (carrinho.length === 0) {
    cartItems.innerHTML = "<p class='empty-cart'>Seu carrinho está vazio</p>";
    document.getElementById("cartTotal").innerText = "0.00";
    return;
  }

  let total = 0;

  carrinho.forEach(item => {
    total += item.preco;

    const div = document.createElement("div");
    div.innerHTML = `<p>${item.nome} — R$ ${item.preco.toFixed(2)}</p>`;
    cartItems.appendChild(div);
  });

  document.getElementById("cartTotal").innerText = total.toFixed(2);
}

// ===============================
// ABRIR / FECHAR CARRINHO
// ===============================
document.getElementById("cartButton").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "flex";
});

document.querySelector(".close-cart").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "none";
});

// ===============================
// FINALIZAR PEDIDO → MERCADO PAGO
// ===============================
document.getElementById("checkoutBtn").addEventListener("click", async () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio");
    return;
  }

  const itens = carrinho.map(item => ({
    title: item.nome,
    quantity: 1,
    unit_price: item.preco
  }));

  try {
    const response = await fetch("/create_preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itens })
    });

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Erro ao iniciar pagamento");
    }

  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com o pagamento");
  }
});
