import { useState, useEffect, useContext, createContext, useReducer } from "react";

// ─── CART CONTEXT ────────────────────────────────────────────────────────────
const CartContext = createContext();
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const ex = state.find(i => i.id === action.item.id);
      if (ex) return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + (action.qty || 1) } : i);
      return [...state, { ...action.item, qty: action.qty || 1 }];
    }
    case "REMOVE": return state.filter(i => i.id !== action.id);
    case "UPDATE_QTY": return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case "CLEAR": return [];
    default: return state;
  }
}
function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return <CartContext.Provider value={{ cart, dispatch, total, count }}>{children}</CartContext.Provider>;
}
const useCart = () => useContext(CartContext);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --ink:#2b1a2f;--paper:#fdf7fa;--cream:#f5eaf0;
      --gold:#b5547a;--gold-light:#e8b4c8;--rust:#8c2f52;
      --muted:#9a7585;--border:#e8d5de;
      --ff-display:'Plus Jakarta Sans',sans-serif;
      --ff-body:'Manrope',sans-serif;
      --ease:cubic-bezier(.4,0,.2,1);
    }
    html,body,#root{width:100%;max-width:100%;margin:0;padding:0;overflow-x:hidden}
    html{scroll-behavior:smooth}
    body{font-family:var(--ff-body);background:var(--paper);color:var(--ink);font-size:15px;line-height:1.6}
    #root{display:block !important;place-items:unset !important;text-align:unset !important}
    a{color:inherit;text-decoration:none}
    img{max-width:100%;display:block}
    button{cursor:pointer;font-family:var(--ff-body);border:none;background:none}
    input,select,textarea{font-family:var(--ff-body)}

    /* NAV */
    nav{position:sticky;top:0;z-index:100;background:var(--paper);border-bottom:1px solid var(--border);
      display:flex;align-items:center;justify-content:space-between;padding:0 5vw;height:64px;
      width:100%;box-shadow:0 1px 12px rgba(0,0,0,.04)}
    .nav-logo{font-family:var(--ff-display);font-size:1.6rem;font-weight:300;letter-spacing:.05em;color:var(--ink)}
    .nav-logo span{color:var(--gold)}
    .nav-links{display:flex;gap:2.5rem;list-style:none}
    .nav-links a{font-size:.8rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;
      color:var(--muted);transition:color .2s}
    .nav-links a:hover,.nav-links a.active{color:var(--ink)}
    .nav-right{display:flex;align-items:center;gap:1.5rem}
    .cart-btn{position:relative;display:flex;align-items:center;gap:.5rem;background:var(--ink);
      color:var(--paper);padding:.5rem 1.1rem;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;
      font-weight:500;transition:background .2s}
    .cart-btn:hover{background:var(--gold)}
    .cart-badge{background:var(--rust);color:#fff;border-radius:50%;width:18px;height:18px;
      display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;
      position:absolute;top:-6px;right:-6px}

    /* HERO */
    .hero{background:var(--cream);padding:5rem 5vw;text-align:center;border-bottom:1px solid var(--border)}
    .hero-kicker{font-size:.72rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:1rem}
    .hero-h1{font-family:var(--ff-display);font-size:clamp(2.5rem,5vw,4.5rem);font-weight:300;line-height:1.1;
      color:var(--ink);margin-bottom:1rem}
    .hero-h1 em{font-style:italic;color:var(--gold)}
    .hero-sub{font-size:1rem;color:var(--muted);max-width:480px;line-height:1.8;margin:0 auto 2rem}
    .hero-actions{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center}
    .btn-primary{background:var(--ink);color:var(--paper);padding:.75rem 2rem;font-size:.8rem;
      letter-spacing:.12em;text-transform:uppercase;font-weight:500;transition:all .25s;border:1px solid var(--ink)}
    .btn-primary:hover{background:var(--gold);border-color:var(--gold)}
    .btn-outline{background:transparent;color:var(--ink);padding:.75rem 2rem;font-size:.8rem;
      letter-spacing:.12em;text-transform:uppercase;font-weight:500;border:1px solid var(--ink);transition:all .25s}
    .btn-outline:hover{background:var(--ink);color:var(--paper)}

    /* SECTION */
    .section{padding:5rem 5vw}
    .section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:3rem}
    .section-title{font-family:var(--ff-display);font-size:clamp(2rem,4vw,3rem);font-weight:300;color:var(--ink)}
    .section-title em{font-style:italic;color:var(--gold)}
    .section-link{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;font-weight:500;
      color:var(--muted);border-bottom:1px solid var(--border);padding-bottom:2px;transition:color .2s}
    .section-link:hover{color:var(--gold);border-color:var(--gold)}

    /* PRODUCT GRID */
    .product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:2rem}
    .product-card{background:#fff;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s;
      border:1px solid var(--border);cursor:pointer}
    .product-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.1)}
    .product-card-img{position:relative;overflow:hidden;aspect-ratio:3/4;background:var(--cream)}
    .product-card-img img{width:100%;height:100%;object-fit:contain;padding:1.5rem;
      transition:transform .5s var(--ease)}
    .product-card:hover .product-card-img img{transform:scale(1.04)}
    .product-card-quick{position:absolute;bottom:0;left:0;right:0;background:var(--ink);color:var(--paper);
      padding:.65rem;text-align:center;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;
      font-weight:500;transform:translateY(100%);transition:transform .3s var(--ease)}
    .product-card:hover .product-card-quick{transform:translateY(0)}
    .product-card-body{padding:1.1rem 1rem 1.2rem}
    .product-cat{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);font-weight:500}
    .product-name{font-family:var(--ff-display);font-size:1.1rem;font-weight:400;margin:.3rem 0 .5rem;
      line-height:1.3;color:var(--ink)}
    .product-footer{display:flex;align-items:center;justify-content:space-between}
    .product-price{font-size:1rem;font-weight:500;color:var(--ink)}
    .product-rating{display:flex;align-items:center;gap:.3rem;font-size:.75rem;color:var(--muted)}
    .stars{color:var(--gold)}

    /* CATEGORIES */
    .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
    .cat-card{position:relative;overflow:hidden;aspect-ratio:3/4;cursor:pointer;
      background:var(--cream);border:1px solid var(--border)}
    .cat-card img{width:100%;height:100%;object-fit:cover;transition:transform .5s var(--ease);filter:saturate(.7)}
    .cat-card:hover img{transform:scale(1.06)}
    .cat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,13,.7) 30%,transparent);
      display:flex;align-items:flex-end;padding:1.5rem}
    .cat-name{font-family:var(--ff-display);font-size:1.4rem;font-weight:300;color:#fff;
      letter-spacing:.03em}

    /* FILTERS */
    .filter-bar{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:2.5rem;padding-bottom:1.5rem;
      border-bottom:1px solid var(--border)}
    .filter-label{font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;font-weight:500;color:var(--muted)}
    .filter-btn{padding:.4rem 1rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;
      border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .2s;font-weight:500}
    .filter-btn.active,.filter-btn:hover{border-color:var(--ink);background:var(--ink);color:var(--paper)}
    .search-input{margin-left:auto;padding:.45rem 1rem;border:1px solid var(--border);background:var(--cream);
      font-size:.82rem;color:var(--ink);outline:none;width:220px;transition:border-color .2s}
    .search-input:focus{border-color:var(--gold)}
    .products-count{font-size:.78rem;color:var(--muted);letter-spacing:.05em}

    /* PRODUCT DETAIL */
    .detail-layout{display:grid;grid-template-columns:1fr 1fr;gap:5vw;padding:4rem 5vw;min-height:80vh;align-items:start}
    .detail-img-wrap{position:sticky;top:80px;background:var(--cream);aspect-ratio:1;
      display:flex;align-items:center;justify-content:center;border:1px solid var(--border)}
    .detail-img-wrap img{max-height:480px;object-fit:contain;padding:3rem}
    .detail-kicker{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:.5rem}
    .detail-h1{font-family:var(--ff-display);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;
      line-height:1.15;color:var(--ink);margin-bottom:1rem}
    .detail-rating{display:flex;align-items:center;gap:.5rem;margin-bottom:1.5rem;font-size:.85rem;color:var(--muted)}
    .detail-price{font-size:2rem;font-weight:500;color:var(--ink);margin-bottom:1.5rem}
    .detail-divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0}
    .detail-desc{font-size:.9rem;line-height:1.9;color:var(--muted);margin-bottom:2rem}
    .qty-row{display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem}
    .qty-label{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500}
    .qty-ctrl{display:flex;align-items:center;border:1px solid var(--border)}
    .qty-ctrl button{width:38px;height:38px;display:flex;align-items:center;justify-content:center;
      font-size:1.1rem;color:var(--ink);transition:background .2s}
    .qty-ctrl button:hover{background:var(--cream)}
    .qty-ctrl span{width:44px;text-align:center;font-weight:500;font-size:.9rem}
    .add-to-cart-btn{width:100%;background:var(--ink);color:var(--paper);padding:1rem;font-size:.82rem;
      letter-spacing:.15em;text-transform:uppercase;font-weight:500;border:1px solid var(--ink);
      transition:all .25s;margin-bottom:.75rem}
    .add-to-cart-btn:hover{background:var(--gold);border-color:var(--gold)}
    .add-to-cart-btn.added{background:var(--rust);border-color:var(--rust)}
    .detail-meta{display:flex;flex-direction:column;gap:.4rem;margin-top:2rem;font-size:.8rem;color:var(--muted)}
    .detail-meta span{display:flex;gap:.5rem}
    .detail-meta strong{color:var(--ink);font-weight:500}

    /* CART */
    .cart-layout{display:grid;grid-template-columns:1fr 360px;gap:3rem;padding:4rem 5vw;align-items:start}
    .cart-items{display:flex;flex-direction:column;gap:0}
    .cart-item{display:grid;grid-template-columns:100px 1fr auto;gap:1.5rem;align-items:center;
      padding:1.5rem 0;border-bottom:1px solid var(--border)}
    .cart-item-img{aspect-ratio:1;background:var(--cream);border:1px solid var(--border);
      display:flex;align-items:center;justify-content:center;overflow:hidden}
    .cart-item-img img{width:80px;height:80px;object-fit:contain;padding:.5rem}
    .cart-item-cat{font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);font-weight:500}
    .cart-item-name{font-family:var(--ff-display);font-size:1.1rem;font-weight:400;margin:.2rem 0 .5rem;line-height:1.3}
    .cart-item-price{font-size:.9rem;color:var(--muted)}
    .cart-item-right{display:flex;flex-direction:column;align-items:flex-end;gap:.8rem}
    .cart-item-total{font-size:1.1rem;font-weight:500}
    .cart-remove{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);
      text-decoration:underline;text-underline-offset:2px;cursor:pointer;background:none;border:none;
      transition:color .2s}
    .cart-remove:hover{color:var(--rust)}
    .cart-summary{background:var(--cream);border:1px solid var(--border);padding:2rem;position:sticky;top:80px}
    .summary-title{font-family:var(--ff-display);font-size:1.4rem;font-weight:400;margin-bottom:1.5rem}
    .summary-row{display:flex;justify-content:space-between;font-size:.85rem;color:var(--muted);
      padding:.5rem 0;border-bottom:1px solid var(--border)}
    .summary-row.total{font-size:1.1rem;font-weight:500;color:var(--ink);border-bottom:none;margin-top:.5rem}
    .checkout-btn{width:100%;background:var(--ink);color:var(--paper);padding:.9rem;font-size:.8rem;
      letter-spacing:.12em;text-transform:uppercase;font-weight:500;margin-top:1.5rem;border:1px solid var(--ink);
      transition:all .25s}
    .checkout-btn:hover{background:var(--gold);border-color:var(--gold)}
    .empty-cart{text-align:center;padding:6rem 2rem}
    .empty-cart-icon{font-size:3.5rem;margin-bottom:1rem}
    .empty-title{font-family:var(--ff-display);font-size:2rem;font-weight:300;margin-bottom:.5rem}
    .empty-sub{color:var(--muted);margin-bottom:2rem}

    /* CHECKOUT */
    .checkout-layout{display:grid;grid-template-columns:1fr 380px;gap:3rem;padding:4rem 5vw;align-items:start}
    .checkout-form{display:flex;flex-direction:column;gap:2rem}
    .form-section-title{font-family:var(--ff-display);font-size:1.4rem;font-weight:400;margin-bottom:1.2rem;
      padding-bottom:.8rem;border-bottom:1px solid var(--border)}
    .form-group{display:flex;flex-direction:column;gap:.4rem}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .form-label{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;color:var(--muted)}
    .form-input{padding:.75rem 1rem;border:1px solid var(--border);background:#fff;
      font-size:.88rem;color:var(--ink);outline:none;transition:border-color .2s}
    .form-input:focus{border-color:var(--gold)}
    .form-select{padding:.75rem 1rem;border:1px solid var(--border);background:#fff;
      font-size:.88rem;color:var(--ink);outline:none;appearance:none;cursor:pointer}
    .payment-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .payment-opt{border:1px solid var(--border);padding:1rem;text-align:center;cursor:pointer;
      transition:all .2s;background:#fff}
    .payment-opt.selected{border-color:var(--ink);background:var(--ink);color:var(--paper)}
    .payment-opt-icon{font-size:1.4rem;margin-bottom:.4rem}
    .payment-opt-label{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;font-weight:500}
    .order-btn{width:100%;background:var(--ink);color:var(--paper);padding:1.1rem;font-size:.85rem;
      letter-spacing:.15em;text-transform:uppercase;font-weight:500;border:1px solid var(--ink);
      transition:all .25s;margin-top:.5rem}
    .order-btn:hover{background:var(--gold);border-color:var(--gold)}

    /* SUCCESS */
    .success-page{min-height:70vh;display:flex;flex-direction:column;align-items:center;
      justify-content:center;text-align:center;padding:4rem 2rem;gap:1.2rem}
    .success-icon{font-size:4rem;animation:pop .4s ease}
    @keyframes pop{0%{transform:scale(0)}80%{transform:scale(1.2)}100%{transform:scale(1)}}
    .success-h{font-family:var(--ff-display);font-size:2.5rem;font-weight:300}
    .success-sub{color:var(--muted);max-width:400px;line-height:1.8}
    .order-num{background:var(--cream);border:1px solid var(--border);padding:.6rem 1.5rem;
      font-size:.85rem;color:var(--muted)}



    /* PAGE TITLE */
    .page-title-bar{background:var(--cream);padding:3rem 5vw 2.5rem;border-bottom:1px solid var(--border)}
    .page-kicker{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);
      font-weight:500;margin-bottom:.4rem}
    .page-h{font-family:var(--ff-display);font-size:clamp(2rem,5vw,3.5rem);font-weight:300;color:var(--ink)}

    /* TOAST */
    .toast{position:fixed;bottom:2rem;right:2rem;background:var(--ink);color:var(--paper);
      padding:.9rem 1.5rem;font-size:.8rem;letter-spacing:.06em;z-index:999;
      animation:slideUp .3s var(--ease),fadeOut .3s ease 1.7s forwards;pointer-events:none}
    @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes fadeOut{to{opacity:0}}

    /* BACK BTN */
    .back-btn{display:inline-flex;align-items:center;gap:.5rem;font-size:.75rem;letter-spacing:.1em;
      text-transform:uppercase;color:var(--muted);cursor:pointer;background:none;border:none;
      padding:1rem 5vw;border-bottom:1px solid var(--border);width:100%;transition:color .2s}
    .back-btn:hover{color:var(--ink)}

    /* LOADING */
    .loading{display:flex;align-items:center;justify-content:center;min-height:40vh;
      font-family:var(--ff-display);font-size:1.5rem;font-weight:300;color:var(--muted);
      font-style:italic}

     RESPONSIVE 
    @media(max-width:900px){
      .cat-grid{grid-template-columns:repeat(2,1fr)}
      .detail-layout,.cart-layout,.checkout-layout{grid-template-columns:1fr}
      .detail-img-wrap{position:relative;top:auto}
      .cart-summary,.checkout-layout>div:last-child{position:relative;top:auto}
    }
    @media(max-width:600px){
      .nav-links{display:none}
      .product-grid{grid-template-columns:repeat(2,1fr);gap:1rem}
      .cat-grid{grid-template-columns:repeat(2,1fr)}
      .form-row{grid-template-columns:1fr}
    }
  `}</style>
);

// ─── UTILS ───────────────────────────────────────────────────────────────────
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const fmt = (n) => `$${n.toFixed(2)}`;
const CAT_LABELS = { "men's clothing": "Men", "women's clothing": "Women", "electronics": "Electronics", "jewelery": "Jewellery" };
const CAT_IMGS = {
  "men's clothing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "women's clothing": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
  "electronics": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=400&q=80",
  "jewelery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
};


// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2100); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const { count } = useCart();
  return (
    <nav>
      <div className="nav-logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
        Couture<span>·</span>Corner
      </div>
      <ul className="nav-links">
        {[["home", "Home"], ["products", "Shop"], ["cart", "Cart"]].map(([p, l]) => (
          <li key={p}><a className={page === p ? "active" : ""} onClick={() => setPage(p)} style={{ cursor: "pointer" }}>{l}</a></li>
        ))}
      </ul>
      <div className="nav-right">
        <button className="cart-btn" onClick={() => setPage("cart")}>
          Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
    </nav>
  );
}



// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ p, onView, onAdd }) {
  return (
    <div className="product-card" onClick={() => onView(p.id)}>
      <div className="product-card-img">
        <img src={p.image} alt={p.title} loading="lazy" />
        <div className="product-card-quick" onClick={e => { e.stopPropagation(); onAdd(p); }}>
           Add to Cart
        </div>
      </div>
      <div className="product-card-body">
        <div className="product-cat">{CAT_LABELS[p.category] || p.category}</div>
        <div className="product-name">{p.title.length > 50 ? p.title.slice(0, 50) + "…" : p.title}</div>
        <div className="product-footer">
          <div className="product-price">{fmt(p.price)}</div>
          <div className="product-rating">
            <span className="stars">{stars(p.rating?.rate || 4)}</span>
            <span>({p.rating?.count || 0})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ products, setPage, setDetailId, showToast }) {
  const { dispatch } = useCart();
  const featured = products.slice(0, 8);
  const addToCart = (p) => { dispatch({ type: "ADD", item: p }); showToast(`Added "${p.title.slice(0, 30)}…"`); };
  const cats = ["men's clothing", "women's clothing", "electronics", "jewelery"];
  return (
    <>
      <section className="hero">
        <p className="hero-kicker">New Season · 2026 Collection</p>
        <h1 className="hero-h1">Create your <em>perfect</em> wardrobe.</h1>
        <p className="hero-sub">Discover handpicked essentials — from elevated everyday wear to statement pieces.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage("products")}>Shop Now</button>
          <button className="btn-outline" onClick={() => setPage("products")}>View All Products</button>
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured <em>Products</em></h2>
          <a className="section-link" onClick={() => setPage("products")} style={{ cursor: "pointer" }}>View All →</a>
        </div>
        <div className="product-grid">
          {featured.map(p => <ProductCard key={p.id} p={p}
            onView={id => { setDetailId(id); setPage("detail"); }}
            onAdd={addToCart} />)}
        </div>
      </section>
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="section-header">
          <h2 className="section-title">Shop by <em>Category</em></h2>
        </div>
        <div className="cat-grid">
          {cats.map(c => (
            <div className="cat-card" key={c} onClick={() => setPage("products")}>
              <img src={CAT_IMGS[c]} alt={c} loading="lazy" />
              <div className="cat-overlay">
                <div className="cat-name">{CAT_LABELS[c]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage({ products, setPage, setDetailId, showToast }) {
  const { dispatch } = useCart();
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const cats = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p =>
    (cat === "all" || p.category === cat) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const addToCart = (p) => { dispatch({ type: "ADD", item: p }); showToast(`Added to cart!`); };
  return (
    <>
      <div className="page-title-bar">
        <p className="page-kicker">Our Collection</p>
        <h1 className="page-h">All Products</h1>
      </div>
      <section className="section">
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          {cats.map(c => (
            <button key={c} className={`filter-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
              {c === "all" ? "All" : CAT_LABELS[c] || c}
            </button>
          ))}
          <span className="products-count">{filtered.length} items</span>
          <input className="search-input" placeholder="Search products…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="product-grid">
          {filtered.map(p => <ProductCard key={p.id} p={p}
            onView={id => { setDetailId(id); setPage("detail"); }}
            onAdd={addToCart} />)}
        </div>
      </section>
    </>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
function DetailPage({ products, id, setPage, showToast }) {
  const { dispatch } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const p = products.find(x => x.id === id);
  if (!p) return <div className="loading">Loading…</div>;
  const handleAdd = () => {
    dispatch({ type: "ADD", item: p, qty });
    setAdded(true);
    showToast(`${qty}× "${p.title.slice(0, 28)}…" added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  return (
    <>
      <button className="back-btn" onClick={() => setPage("products")}>← Back to Products</button>
      <div className="detail-layout">
        <div className="detail-img-wrap">
          <img src={p.image} alt={p.title} />
        </div>
        <div>
          <div className="detail-kicker">{CAT_LABELS[p.category] || p.category}</div>
          <h1 className="detail-h1">{p.title}</h1>
          <div className="detail-rating">
            <span className="stars" style={{ color: "var(--gold)", fontSize: "1rem" }}>{stars(p.rating?.rate || 4)}</span>
            <span>{p.rating?.rate} · {p.rating?.count} reviews</span>
          </div>
          <div className="detail-price">{fmt(p.price)}</div>
          <hr className="detail-divider" />
          <p className="detail-desc">{p.description}</p>
          <div className="qty-row">
            <span className="qty-label">Quantity</span>
            <div className="qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>
          <button className={`add-to-cart-btn ${added ? "added" : ""}`} onClick={handleAdd}>
            {added ? "✓ Added to Cart" : "+ Add to Cart"}
          </button>
          <button className="btn-outline" style={{ width: "100%" }} onClick={() => { handleAdd(); setPage("cart"); }}>
            Buy Now
          </button>
          <div className="detail-meta">
            <span><strong>Category:</strong>{CAT_LABELS[p.category] || p.category}</span>
            <span><strong>SKU:</strong>MXL-{String(p.id).padStart(4, "0")}</span>
            <span><strong>Availability:</strong>In Stock</span>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section" style={{ background: "var(--cream)" }}>
          <div className="section-header">
            <h2 className="section-title">You May <em>Also Like</em></h2>
          </div>
          <div className="product-grid">
            {related.map(rp => <ProductCard key={rp.id} p={rp}
              onView={rid => { window.scrollTo(0, 0); setPage("detail"); }}
              onAdd={item => { dispatch({ type: "ADD", item }); showToast("Added to cart!"); }} />)}
          </div>
        </section>
      )}
    </>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────
function CartPage({ setPage }) {
  const { cart, dispatch, total } = useCart();
  if (cart.length === 0) return (
    <div className="empty-cart">
      <div className="empty-cart-icon">🛒</div>
      <h2 className="empty-title">Your cart is empty</h2>
      <p className="empty-sub">Looks like you haven't added anything yet. Explore our collection.</p>
      <button className="btn-primary" onClick={() => setPage("products")}>Start Shopping</button>
    </div>
  );
  return (
    <>
      <div className="page-title-bar">
        <p className="page-kicker">Review Order</p>
        <h1 className="page-h">Shopping Cart</h1>
      </div>
      <div className="cart-layout">
        <div>
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img"><img src={item.image} alt={item.title} /></div>
                <div>
                  <div className="cart-item-cat">{CAT_LABELS[item.category] || item.category}</div>
                  <div className="cart-item-name">{item.title.length > 55 ? item.title.slice(0, 55) + "…" : item.title}</div>
                  <div className="cart-item-price">{fmt(item.price)} each</div>
                  <div className="qty-ctrl" style={{ marginTop: ".6rem" }}>
                    <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty - 1 })}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty + 1 })}>+</button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-total">{fmt(item.price * item.qty)}</div>
                  <button className="cart-remove" onClick={() => dispatch({ type: "REMOVE", id: item.id })}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="cart-summary">
            <div className="summary-title">Order Summary</div>
            {cart.map(i => (
              <div className="summary-row" key={i.id}>
                <span>{i.title.slice(0, 28)}… ×{i.qty}</span>
                <span>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="summary-row"><span>Shipping</span><span>Free</span></div>
            <div className="summary-row total"><span>Total</span><span>{fmt(total)}</span></div>
            <button className="checkout-btn" onClick={() => setPage("checkout")}>Proceed to Checkout →</button>
            <button className="btn-outline" style={{ width: "100%", marginTop: ".75rem" }} onClick={() => setPage("products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────
function CheckoutPage({ setPage }) {
  const { cart, total, dispatch } = useCart();
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", phone: "", payment: "card" });
  const [errors, setErrors] = useState({});
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    return e;
  };
  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    dispatch({ type: "CLEAR" });
    setPage("success");
  };
  const fi = (key, label, type = "text", placeholder = "") => (
    <div className="form-group">
      <label className="form-label">{label}{errors[key] && <span style={{ color: "var(--rust)", marginLeft: ".5rem" }}>{errors[key]}</span>}</label>
      <input className="form-input" type={type} placeholder={placeholder} value={form[key]}
        onChange={e => { up(key, e.target.value); setErrors(er => ({ ...er, [key]: undefined })); }}
        style={errors[key] ? { borderColor: "var(--rust)" } : {}} />
    </div>
  );
  const payments = [{ id: "card", icon: "💳", label: "Card" }, { id: "paypal", icon: "🅿️", label: "PayPal" }, { id: "cod", icon: "💵", label: "Cash" }];
  return (
    <>
      <button className="back-btn" onClick={() => setPage("cart")}>← Back to Cart</button>
      <div className="page-title-bar" style={{ paddingTop: "2rem" }}>
        <p className="page-kicker">Almost There</p>
        <h1 className="page-h">Checkout</h1>
      </div>
      <div className="checkout-layout">
        <div className="checkout-form">
          <div>
            <div className="form-section-title">Personal Details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-row">{fi("name", "Full Name", "text", "Jane Smith")}{fi("email", "Email", "email", "jane@email.com")}</div>
              {fi("phone", "Phone Number", "tel", "+1 234 567 8900")}
            </div>
          </div>
          <div>
            <div className="form-section-title">Shipping Address</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {fi("address", "Street Address", "text", "123 Main St")}
              <div className="form-row">{fi("city", "City", "text", "New York")}{fi("zip", "ZIP Code", "text", "10001")}</div>
            </div>
          </div>
          <div>
            <div className="form-section-title">Payment Method</div>
            <div className="payment-opts">
              {payments.map(p => (
                <div key={p.id} className={`payment-opt ${form.payment === p.id ? "selected" : ""}`}
                  onClick={() => up("payment", p.id)}>
                  <div className="payment-opt-icon">{p.icon}</div>
                  <div className="payment-opt-label">{p.label}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="order-btn" onClick={handleSubmit}>Place Order · {fmt(total)}</button>
        </div>
        <div>
          <div className="cart-summary" style={{ position: "sticky", top: "80px" }}>
            <div className="summary-title">Your Order ({cart.length} items)</div>
            {cart.map(i => (
              <div className="summary-row" key={i.id}>
                <span style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {i.title.slice(0, 28)}… ×{i.qty}
                </span>
                <span>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="summary-row"><span>Shipping</span><span>Free</span></div>
            <div className="summary-row total"><span>Total</span><span>{fmt(total)}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SUCCESS PAGE ─────────────────────────────────────────────────────────────
function SuccessPage({ setPage }) {
  const orderId = Math.random().toString(36).slice(2, 10).toUpperCase();
  return (
    <div className="success-page">
      <div className="success-icon">✅</div>
      <h2 className="success-h">Order Confirmed!</h2>
      <p className="success-sub">Thank you for your purchase. Your order is being prepared and will be shipped shortly.</p>
      <div className="order-num">Order #{orderId}</div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn-primary" onClick={() => setPage("products")}>Continue Shopping</button>
        <button className="btn-outline" onClick={() => setPage("home")}>Back to Home</button>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)", padding: "3rem 5vw", marginTop: "4rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontFamily: "var(--ff-display)", fontSize: "1.6rem", fontWeight: 300, marginBottom: ".8rem" }}>
            Couture<span style={{ color: "var(--gold)" }}>·</span>Corner
          </div>
          <p style={{ fontSize: ".82rem", color: "#888", lineHeight: 1.8, maxWidth: "260px" }}>
            Curated fashion and lifestyle products for the discerning individual.
          </p>
        </div>
        {[["Shop", ["All Products", "New Arrivals", "Sale"]], ["Help", ["FAQ", "Shipping", "Returns"]], ["Company", ["About", "Careers", "Press"]]].map(([title, links]) => (
          <div key={title}>
            <div style={{ fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: "1rem" }}>{title}</div>
            {links.map(l => <div key={l} style={{ fontSize: ".82rem", color: "#888", marginBottom: ".5rem", cursor: "pointer" }} onClick={() => setPage("products")}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #222", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", fontSize: ".75rem", color: "#555" }}>
        <span>© 2025 Couture·Corner. All rights reserved.</span>
        <span>Built with React & Fake Store API</span>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(null); setTimeout(() => setToast(msg), 10); };

  const pageComponents = {
    home: <HomePage products={products} setPage={setPage} setDetailId={setDetailId} showToast={showToast} />,
    products: <ProductsPage products={products} setPage={setPage} setDetailId={setDetailId} showToast={showToast} />,
    detail: <DetailPage products={products} id={detailId} setPage={setPage} showToast={showToast} />,
    cart: <CartPage setPage={setPage} />,
    checkout: <CheckoutPage setPage={setPage} />,
    success: <SuccessPage setPage={setPage} />,
  };

  return (
    <CartProvider>
      <G />
      <Nav page={page} setPage={setPage} />
      {loading ? <div className="loading" style={{ minHeight: "60vh" }}>Loading products…</div> : pageComponents[page]}
      <Footer setPage={setPage} />
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </CartProvider>
  );
}
