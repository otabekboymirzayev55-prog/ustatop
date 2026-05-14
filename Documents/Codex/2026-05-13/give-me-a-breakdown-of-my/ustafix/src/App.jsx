import { useEffect, useState } from "react";
import {
  login as firebaseLogin,
  logout as firebaseLogout,
  register as firebaseRegister,
  updateUserProfile,
  watchAuth,
} from "./firebase/auth";
import { createDeal } from "./firebase/deals";
import { isFirebaseReady } from "./firebase/config";
import { addWorker, getWorkers } from "./firebase/workers";

const WORKERS = [
  { id: 1, name: "Jasur Toshmatov", specialty: "Santexnik", emoji: "🔧", color: "#FF6B35", price: "50,000", rating: 4.9, reviews: 87, location: "Chilonzor", available: true, desc: "Quvur, kran, unitaz ta'mirlash. 10 yillik tajriba." },
  { id: 2, name: "Bobur Yusupov", specialty: "Elektrik", emoji: "⚡", color: "#FFB703", price: "30,000", rating: 4.8, reviews: 64, location: "Yunusobod", available: true, desc: "Rozetka, svet, щit ta'mirlash. Xavfsizlik kafolati." },
  { id: 3, name: "Sardor Nazarov", specialty: "Mebel", emoji: "🪑", color: "#2EC4B6", price: "40,000", rating: 4.7, reviews: 43, location: "Mirzo Ulug'bek", available: false, desc: "Divan, stul, shkaf ta'mirlash. Uyga kelaman." },
  { id: 4, name: "Otabek Karimov", specialty: "Qurilish", emoji: "🏗️", color: "#8338EC", price: "70,000", rating: 4.6, reviews: 31, location: "Shayxontohur", available: true, desc: "Devor suvoq, plitka, bo'yash. Narx kelishiladi." },
  { id: 5, name: "Dilshod Ergashev", specialty: "Konditsioner", emoji: "❄️", color: "#06D6A0", price: "60,000", rating: 4.9, reviews: 112, location: "Yakkasaroy", available: true, desc: "Konditsioner o'rnatish, ta'mirlash, gaz to'ldirish." },
  { id: 6, name: "Firdavs Mirzayev", specialty: "Santexnik", emoji: "🚿", color: "#FB5607", price: "45,000", rating: 4.5, reviews: 29, location: "Uchtepa", available: true, desc: "Vannaxona jihozlari. Tez kelaman, kafolatli." },
];

const CATEGORIES = [
  { label: "Hammasi", emoji: "🔍" },
  { label: "Santexnik", emoji: "🔧" },
  { label: "Elektrik", emoji: "⚡" },
  { label: "Qurilish", emoji: "🏗️" },
  { label: "Konditsioner", emoji: "❄️" },
  { label: "Mebel", emoji: "🪑" },
];

const STEPS = [
  { n: "01", emoji: "📝", title: "E'lon qidiring", desc: "O'zingizga kerakli usta turini tanlang va yaqiningizdagilarni ko'ring." },
  { n: "02", emoji: "❤️", title: "Yoqtiring", desc: "Ustaning profili, reytingi va narxini o'rganib, yoqsa belgilang." },
  { n: "03", emoji: "🤝", title: "Deal qiling", desc: "Usta bilan to'g'ridan-to'g'ri bog'laning va ish boshlang." },
];

const STATS = [
  { val: "2,400+", label: "Ro'yxatdan o'tgan usta" },
  { val: "18,000+", label: "Bajarilgan buyurtma" },
  { val: "4.8★", label: "O'rtacha reyting" },
  { val: "98%", label: "Mijozlar mamnun" },
];

const normalizePhone = (phone) => phone.replace(/\D/g, "");

const phoneToEmail = (phone) => `${normalizePhone(phone)}@ustafix.local`;

const getPhoneFromEmail = (email) => {
  if (!email) return "";
  return email.endsWith("@ustafix.local")
    ? email.replace("@ustafix.local", "")
    : email;
};

const makeUser = (firebaseUser, fallback = {}) => ({
  uid: firebaseUser.uid,
  name: firebaseUser.displayName || fallback.name || getPhoneFromEmail(firebaseUser.email) || "Foydalanuvchi",
  phone: fallback.phone || getPhoneFromEmail(firebaseUser.email),
  email: firebaseUser.email || "",
});

const getAuthErrorMessage = (error) => {
  if (error?.code === "auth/email-already-in-use") return "Bu telefon bilan account bor. Kirish bo'limidan kiring.";
  if (error?.code === "auth/invalid-credential") return "Telefon yoki parol noto'g'ri.";
  if (error?.code === "auth/operation-not-allowed") return "Firebase Console'da Email/Password auth yoqilmagan.";
  if (error?.code === "auth/weak-password") return "Parol kamida 6 ta belgi bo'lishi kerak.";
  return "Auth xato berdi. Ma'lumotlarni tekshirib qayta urinib ko'ring.";
};

export default function App() {
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("Hammasi");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState([]);
  const [modal, setModal] = useState(null); // null | "login" | "register" | "post" | worker
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", password: "", specialty: "", desc: "", price: "", location: "" });
  const [authStep, setAuthStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [posted, setPosted] = useState([]);
  const [remoteWorkers, setRemoteWorkers] = useState([]);
  const [dealed, setDealed] = useState([]);
  const [dealDone, setDealDone] = useState(false);
  const [dealMessage, setDealMessage] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    if (!isFirebaseReady) return;

    getWorkers()
      .then(setRemoteWorkers)
      .catch((error) => {
        console.error(error);
        setSyncMessage("Firebase workers o'qishda xato chiqdi");
      });
  }, []);

  useEffect(() => {
    if (!isFirebaseReady) return;

    const unsubscribe = watchAuth((firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      setUser((currentUser) => currentUser?.uid === firebaseUser.uid
        ? currentUser
        : makeUser(firebaseUser));
    });

    return unsubscribe;
  }, []);

  const allWorkers = [...WORKERS, ...remoteWorkers, ...posted];

  const filtered = allWorkers.filter(w => {
    const matchCat = filter === "Hammasi" || w.specialty === filter;
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.specialty.toLowerCase().includes(search.toLowerCase()) ||
      w.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleLike = (id) => setLiked(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);

  const handleLogin = async () => {
    setAuthError("");
    const normalizedPhone = normalizePhone(form.phone);

    if (!isFirebaseReady) return setAuthError("Firebase config topilmadi");
    if (!normalizedPhone || !form.password) return setAuthError("Barcha maydonlarni to'ldiring");

    setLoading(true);

    try {
      const credential = await firebaseLogin(phoneToEmail(form.phone), form.password);
      setUser(makeUser(credential.user, { phone: normalizedPhone }));
      setModal(null);
      setForm({ ...form, phone: normalizedPhone, password: "" });
    } catch (error) {
      console.error(error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setAuthError("");
    const normalizedPhone = normalizePhone(form.phone);

    if (authStep === 1 && !form.name) return setAuthError("Ismingizni kiriting");
    if (authStep === 1) return setAuthStep(2);
    if (authStep === 2 && normalizedPhone.length < 9) return setAuthError("To'g'ri telefon kiriting");
    if (authStep === 2) return setAuthStep(3);
    if (!isFirebaseReady) return setAuthError("Firebase config topilmadi");
    if (!form.password || form.password.length < 6) return setAuthError("Parol kamida 6 ta belgi");

    setLoading(true);

    try {
      const credential = await firebaseRegister(phoneToEmail(form.phone), form.password);
      await updateUserProfile({ displayName: form.name });
      setUser(makeUser(credential.user, { name: form.name, phone: normalizedPhone }));
      setModal(null);
      setAuthStep(1);
      setForm({ ...form, phone: normalizedPhone, password: "" });
    } catch (error) {
      console.error(error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!form.specialty || !form.name) return;
    const colors = ["#FF6B35","#FFB703","#2EC4B6","#8338EC","#06D6A0","#FB5607"];
    const emojis = { Santexnik:"🔧", Elektrik:"⚡", Qurilish:"🏗️", Konditsioner:"❄️", Mebel:"🪑" };
    const worker = {
      id: Date.now(),
      name: form.name,
      specialty: form.specialty,
      emoji: emojis[form.specialty] || "🛠️",
      color: colors[Math.floor(Math.random()*colors.length)],
      price: form.price || "Kelishiladi", rating: 5.0, reviews: 0,
      location: form.location || "Toshkent", available: true,
      desc: form.desc || "Yangi usta",
      ownerId: user?.uid || null,
      ownerPhone: user?.phone || "",
    };

    if (isFirebaseReady) {
      try {
        const docRef = await addWorker(worker);
        worker.id = docRef.id;
        setSyncMessage("E'lon Firestore'ga saqlandi");
      } catch (error) {
        console.error(error);
        setSyncMessage("Firebase xato berdi, e'lon faqat local qo'shildi");
      }
    }

    setPosted(p => [...p, worker]);
    setModal(null);
    setForm({ name:"", phone:"", password:"", specialty:"", desc:"", price:"", location:"" });
  };

  const handleDeal = (w) => {
    setDealDone(false);
    setDealMessage("");
    setModal({ type: "deal", worker: w });
  };

  const confirmDeal = async (w) => {
    if (isFirebaseReady) {
      try {
        await createDeal({
          workerId: String(w.id),
          workerName: w.name,
          specialty: w.specialty,
          clientId: user?.uid || user?.phone || "guest",
          clientName: user?.name || "Guest",
          clientPhone: user?.phone || "",
          message: dealMessage.trim(),
          priceOffer: w.price,
        });
        setSyncMessage("Deal Firestore'ga saqlandi");
      } catch (error) {
        console.error(error);
        setSyncMessage("Firebase xato berdi, deal faqat local belgilandi");
      }
    }

    setDealDone(true);
    setDealed(d => [...d, w.id]);
    setTimeout(() => { setModal(null); setDealDone(false); }, 2000);
  };

  const handleLogout = async () => {
    if (isFirebaseReady) {
      try {
        await firebaseLogout();
      } catch (error) {
        console.error(error);
      }
    }

    setUser(null);
    setPage("home");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0D0D0D", color:"#fff", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#111;}::-webkit-scrollbar-thumb{background:#333;border-radius:3px;}
        a{text-decoration:none;color:inherit;cursor:pointer;}
        .btn{padding:12px 24px;border-radius:12px;border:none;cursor:pointer;font-weight:600;font-size:14px;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
        .btn:active{transform:scale(0.97);}
        .btn-orange{background:linear-gradient(135deg,#FF6B35,#FF8C42);color:#fff;}
        .btn-orange:hover{box-shadow:0 8px 24px #FF6B3540;transform:translateY(-1px);}
        .btn-ghost{background:transparent;border:1.5px solid #333;color:#aaa;}
        .btn-ghost:hover{border-color:#FF6B35;color:#FF6B35;}
        .card{background:#1a1a1a;border:1px solid #252525;border-radius:20px;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;}
        .card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.4);}
        .input{background:#1e1e1e;border:1.5px solid #2a2a2a;border-radius:12px;padding:12px 16px;color:#fff;font-size:14px;width:100%;outline:none;transition:border 0.2s;font-family:'DM Sans',sans-serif;}
        .input:focus{border-color:#FF6B35;box-shadow:0 0 0 3px #FF6B3515;}
        .input::placeholder{color:#444;}
        .label{color:#555;font-size:11px;font-weight:600;letter-spacing:0.08em;margin-bottom:6px;display:block;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pop{0%{transform:scale(0.6);opacity:0;}70%{transform:scale(1.05);}100%{transform:scale(1);opacity:1;}}
        @keyframes spin{to{transform:rotate(360deg);}}
        .fade-in{animation:fadeIn 0.4s ease;}
        .slide-up{animation:slideUp 0.4s ease;}
        .pop{animation:pop 0.4s ease;}
        .spin{animation:spin 0.8s linear infinite;display:inline-block;width:18px;height:18px;border:2px solid #fff4;border-top-color:#fff;border-radius:50%;}
        .nav-link{color:#666;font-size:14px;font-weight:500;transition:color 0.2s;cursor:pointer;}
        .nav-link:hover{color:#fff;}
        .stat-card{background:#1a1a1a;border:1px solid #252525;border-radius:16px;padding:24px;text-align:center;}
        .tag{background:#FF6B3518;border:1px solid #FF6B3530;color:#FF6B35;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;}
        .overlay{position:fixed;inset:0;background:#000000cc;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal{background:#161616;border:1px solid #252525;border-radius:24px;padding:32px;width:100%;max-width:440px;max-height:90vh;overflow-y:auto;}
        .step-dot{width:10px;height:10px;border-radius:50%;transition:all 0.3s;}
        @media(max-width:768px){.hide-mobile{display:none!important;}.desktop-only{display:none!important;}}
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"#0D0D0Dee", backdropFilter:"blur(20px)", borderBottom:"1px solid #1a1a1a" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Logo */}
          <div onClick={() => setPage("home")} style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, cursor:"pointer" }}>
            Usta<span style={{ color:"#FF6B35" }}>Top</span>
          </div>
          {/* Links */}
          <div className="hide-mobile" style={{ display:"flex", gap:32, alignItems:"center" }}>
            <span className="nav-link" onClick={() => setPage("home")}>Bosh sahifa</span>
            <span className="nav-link" onClick={() => setPage("ustalar")}>Ustalar</span>
            <span className="nav-link" onClick={() => setPage("qanday")}>Qanday ishlaydi</span>
            {user && <span className="nav-link" onClick={() => setPage("profil")}>Profil</span>}
          </div>
          {/* Auth */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {user ? (
              <>
                <button className="btn btn-ghost" onClick={() => { setModal("post"); setForm({...form,name:user.name}); }}>+ E'lon</button>
                <div onClick={() => setPage("profil")} style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#FF6B35,#FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16 }}>
                  {user.name[0].toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <button className="btn btn-ghost hide-mobile" onClick={() => { setModal("login"); setAuthTab("login"); setAuthError(""); }}>Kirish</button>
                <button className="btn btn-orange" onClick={() => { setModal("login"); setAuthTab("register"); setAuthStep(1); setAuthError(""); }}>Ro'yxatdan</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {syncMessage && (
        <div style={{ maxWidth:1200, margin:"14px auto 0", padding:"0 24px" }}>
          <div style={{ background:"#1a1a1a", border:"1px solid #252525", borderRadius:12, padding:"10px 14px", color:"#888", fontSize:13 }}>
            {syncMessage}
          </div>
        </div>
      )}

      {/* ── HOME PAGE ── */}
      {page === "home" && (
        <div>
          {/* Hero */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 60px", textAlign:"center" }}>
            <div className="tag" style={{ display:"inline-block", marginBottom:20 }}>🔧 O'zbekistondagi №1 usta platformasi</div>
            <h1 className="fade-in" style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.1, marginBottom:20, letterSpacing:-2 }}>
              Ta'mirlash ustasini<br /><span style={{ color:"#FF6B35" }}>1 daqiqada</span> toping
            </h1>
            <p className="fade-in" style={{ color:"#666", fontSize:18, maxWidth:540, margin:"0 auto 40px", lineHeight:1.7 }}>
              Santexnik, elektrik, qurilish va boshqa mutaxassislar — barchasi bir joyda. Bepul, tez, ishonchli.
            </p>
            {/* Search bar */}
            <div className="fade-in" style={{ maxWidth:600, margin:"0 auto 20px", display:"flex", gap:10, background:"#1a1a1a", border:"1px solid #252525", borderRadius:16, padding:8 }}>
              <input className="input" placeholder="🔍  Qidirish... (santexnik, elektrik, Chilonzor...)" value={search} onChange={e => setSearch(e.target.value)}
                style={{ border:"none", background:"transparent", flex:1 }} onKeyDown={e => e.key === "Enter" && setPage("ustalar")} />
              <button className="btn btn-orange" onClick={() => setPage("ustalar")} style={{ padding:"12px 28px", whiteSpace:"nowrap" }}>Qidirish</button>
            </div>
            <div style={{ color:"#444", fontSize:13 }}>Mashhur: <span style={{ color:"#FF6B35", cursor:"pointer" }} onClick={() => { setFilter("Santexnik"); setPage("ustalar"); }}>Santexnik</span> · <span style={{ color:"#FF6B35", cursor:"pointer" }} onClick={() => { setFilter("Elektrik"); setPage("ustalar"); }}>Elektrik</span> · <span style={{ color:"#FF6B35", cursor:"pointer" }} onClick={() => { setFilter("Konditsioner"); setPage("ustalar"); }}>Konditsioner</span></div>
          </div>

          {/* Stats */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 80px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
              {STATS.map((s,i) => (
                <div key={i} className="stat-card fade-in" style={{ animationDelay:`${i*0.1}s` }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:"#FF6B35", marginBottom:6 }}>{s.val}</div>
                  <div style={{ color:"#555", fontSize:13 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 80px" }}>
            <div style={{ marginBottom:32 }}>
              <div className="tag" style={{ marginBottom:12 }}>Kategoriyalar</div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800 }}>Qanday usta kerak?</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14 }}>
              {CATEGORIES.filter(c => c.label !== "Hammasi").map((c,i) => (
                <div key={i} className="card" onClick={() => { setFilter(c.label); setPage("ustalar"); }} style={{ padding:24, textAlign:"center", cursor:"pointer" }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>{c.emoji}</div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{c.label}</div>
                  <div style={{ color:"#555", fontSize:12, marginTop:4 }}>
                    {allWorkers.filter(w => w.specialty === c.label).length} usta
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ background:"#111", borderTop:"1px solid #1a1a1a", borderBottom:"1px solid #1a1a1a", padding:"80px 24px" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:48 }}>
                <div className="tag" style={{ marginBottom:12 }}>Jarayon</div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800 }}>Qanday ishlaydi?</h2>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:24 }}>
                {STEPS.map((s,i) => (
                  <div key={i} className="card" style={{ padding:28 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:48, fontWeight:800, color:"#FF6B3520", marginBottom:8 }}>{s.n}</div>
                    <div style={{ fontSize:32, marginBottom:12 }}>{s.emoji}</div>
                    <div style={{ fontWeight:700, fontSize:18, marginBottom:8, fontFamily:"'Syne',sans-serif" }}>{s.title}</div>
                    <div style={{ color:"#666", fontSize:14, lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured workers */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32, flexWrap:"wrap", gap:12 }}>
              <div>
                <div className="tag" style={{ marginBottom:12 }}>Eng yaxshilar</div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800 }}>Top ustalar</h2>
              </div>
              <button className="btn btn-ghost" onClick={() => setPage("ustalar")}>Hammasini ko'rish →</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {allWorkers.slice(0,3).map(w => <WorkerCard key={w.id} w={w} liked={liked} dealed={dealed} onLike={toggleLike} onDeal={handleDeal} />)}
            </div>
          </div>

          {/* CTA */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 80px" }}>
            <div style={{ background:"linear-gradient(135deg,#FF6B3520,#FF8C4210)", border:"1px solid #FF6B3530", borderRadius:24, padding:"48px 32px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔧</div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, marginBottom:12 }}>Siz ham usta misiz?</h2>
              <p style={{ color:"#888", fontSize:15, marginBottom:28, maxWidth:400, margin:"0 auto 28px" }}>
                Xizmatingizni e'lon qiling va minglab mijozlarga yeting. Ro'yxatdan o'tish — bepul!
              </p>
              <button className="btn btn-orange" style={{ padding:"14px 36px", fontSize:16 }}
                onClick={() => user ? setModal("post") : (setModal("login"), setAuthTab("register"), setAuthStep(1))}>
                E'lon qilish — Bepul
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer style={{ background:"#0a0a0a", borderTop:"1px solid #1a1a1a", padding:"32px 24px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:8 }}>
              Usta<span style={{ color:"#FF6B35" }}>Top</span>
            </div>
            <div style={{ color:"#444", fontSize:13 }}>© 2025 UstaTop. Barcha huquqlar himoyalangan.</div>
          </footer>
        </div>
      )}

      {/* ── USTALAR PAGE ── */}
      {page === "ustalar" && (
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 24px" }}>
          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, marginBottom:8 }}>Ustalar</h1>
            <div style={{ color:"#555", fontSize:14 }}>{filtered.length} ta usta topildi</div>
          </div>

          {/* Search + Filter */}
          <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200, position:"relative" }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}>🔍</span>
              <input className="input" placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft:40 }} />
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c.label} className="btn" onClick={() => setFilter(c.label)} style={{
                  padding:"10px 16px", background: filter === c.label ? "#FF6B35" : "#1a1a1a",
                  color: filter === c.label ? "#fff" : "#666",
                  border: filter === c.label ? "none" : "1px solid #252525",
                  borderRadius:10, fontSize:13,
                }}>{c.emoji} {c.label}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="fade-in" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
            {filtered.map(w => <WorkerCard key={w.id} w={w} liked={liked} dealed={dealed} onLike={toggleLike} onDeal={handleDeal} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 0", color:"#444" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
                <div style={{ fontSize:18 }}>Hech narsa topilmadi</div>
              </div>
            )}
          </div>

          {/* Post CTA */}
          {user && (
            <div style={{ marginTop:48, textAlign:"center" }}>
              <button className="btn btn-orange" style={{ padding:"14px 36px", fontSize:15 }} onClick={() => setModal("post")}>
                ➕ O'z e'loningizni qo'shing
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── QANDAY ISHLAYDI ── */}
      {page === "qanday" && (
        <div style={{ maxWidth:800, margin:"0 auto", padding:"60px 24px" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="tag" style={{ marginBottom:16 }}>Yo'riqnoma</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:42, fontWeight:800, marginBottom:16 }}>Qanday ishlaydi?</h1>
            <p style={{ color:"#666", fontSize:16, lineHeight:1.7 }}>UstaTop orqali xizmat topish juda oson. 3 ta qadam — va usta uyingizda.</p>
          </div>
          {STEPS.map((s,i) => (
            <div key={i} className="card fade-in" style={{ padding:32, marginBottom:16, display:"flex", gap:24, alignItems:"flex-start", animationDelay:`${i*0.15}s` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:56, fontWeight:800, color:"#FF6B3525", lineHeight:1, flexShrink:0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize:32, marginBottom:10 }}>{s.emoji}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, marginBottom:8 }}>{s.title}</div>
                <div style={{ color:"#666", lineHeight:1.7, fontSize:15 }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ textAlign:"center", marginTop:40 }}>
            <button className="btn btn-orange" style={{ padding:"14px 36px", fontSize:16 }} onClick={() => setPage("ustalar")}>
              Hozir boshlash →
            </button>
          </div>
        </div>
      )}

      {/* ── PROFIL ── */}
      {page === "profil" && user && (
        <div style={{ maxWidth:700, margin:"0 auto", padding:"60px 24px" }}>
          <div className="card fade-in" style={{ padding:32, marginBottom:24, textAlign:"center" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#FF6B35,#FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px" }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, marginBottom:4 }}>{user.name}</div>
            <div style={{ color:"#555", fontSize:14 }}>{user.phone}</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
            {[["❤️", "Yoqtirilgan", liked.length],["🤝","Deal qilingan",dealed.length],["📝","E'lonlar",posted.length],["⭐","Reyting","—"]].map(([e,l,v]) => (
              <div key={l} className="stat-card">
                <div style={{ fontSize:28, marginBottom:8 }}>{e}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#FF6B35" }}>{v}</div>
                <div style={{ color:"#555", fontSize:13, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost" style={{ width:"100%", padding:14 }} onClick={handleLogout}>
            Chiqish (Logout)
          </button>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && (setModal(null), setDealDone(false))}>
          <div className="modal slide-up">

            {/* LOGIN/REGISTER */}
            {(modal === "login") && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>
                    {authTab === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
                  </div>
                  <button onClick={() => setModal(null)} style={{ background:"#1e1e1e", border:"none", borderRadius:10, width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>✕</button>
                </div>

                <div style={{ display:"flex", background:"#1a1a1a", borderRadius:12, padding:3, marginBottom:24 }}>
                  {[["login","Kirish"],["register","Ro'yxatdan"]].map(([k,l]) => (
                    <button key={k} onClick={() => { setAuthTab(k); setAuthStep(1); setAuthError(""); }} style={{
                      flex:1, padding:"10px", border:"none", cursor:"pointer", borderRadius:10,
                      background: authTab===k ? "#FF6B35" : "transparent",
                      color: authTab===k ? "#fff" : "#555", fontWeight:600, fontSize:13, transition:"all 0.2s",
                    }}>{l}</button>
                  ))}
                </div>

                {authTab === "login" ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div><label className="label">TELEFON</label><input className="input" placeholder="+998 90 123 45 67" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
                    <div><label className="label">PAROL</label><input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></div>
                    {authError && <div style={{ background:"#FF6B3518", border:"1px solid #FF6B3540", borderRadius:10, padding:"10px 14px", color:"#FF6B35", fontSize:13 }}>⚠️ {authError}</div>}
                    <button className="btn btn-orange" style={{ padding:14, marginTop:4 }} onClick={handleLogin}>
                      {loading ? <span className="spin" /> : "Kirish →"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ display:"flex", gap:6, marginBottom:4 }}>
                      {[1,2,3].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:4, background: authStep>=s ? "#FF6B35" : "#2a2a2a", transition:"background 0.3s" }} />)}
                    </div>
                    {authStep===1 && <><div><label className="label">TO'LIQ ISM</label><input className="input" placeholder="Jasur Toshmatov" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div></>}
                    {authStep===2 && <><div><label className="label">TELEFON</label><input className="input" placeholder="+998 90 123 45 67" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div></>}
                    {authStep===3 && <>
                      <div><label className="label">PAROL</label><input className="input" type="password" placeholder="Kamida 6 belgi" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></div>
                    </>}
                    {authError && <div style={{ background:"#FF6B3518", border:"1px solid #FF6B3540", borderRadius:10, padding:"10px 14px", color:"#FF6B35", fontSize:13 }}>⚠️ {authError}</div>}
                    <div style={{ display:"flex", gap:10 }}>
                      {authStep > 1 && <button className="btn btn-ghost" style={{ flex:1, padding:13 }} onClick={() => { setAuthStep(s=>s-1); setAuthError(""); }}>← Orqaga</button>}
                      <button className="btn btn-orange" style={{ flex:2, padding:13 }} onClick={handleRegister}>
                        {loading ? <span className="spin" /> : authStep < 3 ? "Keyingisi →" : "Ro'yxatdan ✓"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* POST */}
            {modal === "post" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>E'lon qo'shish</div>
                  <button onClick={() => setModal(null)} style={{ background:"#1e1e1e", border:"none", borderRadius:10, width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>✕</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div><label className="label">ISMINGIZ</label><input className="input" placeholder="To'liq ismingiz" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div>
                  <div>
                    <label className="label">MUTAXASSISLIK</label>
                    <select className="input" value={form.specialty} onChange={e => setForm({...form,specialty:e.target.value})}>
                      <option value="">Tanlang...</option>
                      {["Santexnik","Elektrik","Qurilish","Konditsioner","Mebel"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className="label">TAVSIF</label><textarea className="input" rows={3} placeholder="Xizmatingiz haqida..." value={form.desc} onChange={e => setForm({...form,desc:e.target.value})} style={{ resize:"none" }} /></div>
                  <div><label className="label">NARX</label><input className="input" placeholder="masalan: 50,000 so'mdan" value={form.price} onChange={e => setForm({...form,price:e.target.value})} /></div>
                  <div><label className="label">MANZIL</label><input className="input" placeholder="masalan: Toshkent, Chilonzor" value={form.location} onChange={e => setForm({...form,location:e.target.value})} /></div>
                  <button className="btn btn-orange" style={{ padding:14 }} onClick={handlePost}>✅ E'lon qilish</button>
                </div>
              </>
            )}

            {/* DEAL */}
            {modal?.type === "deal" && (
              <>
                {!dealDone ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>Deal qilish</div>
                      <button onClick={() => setModal(null)} style={{ background:"#1e1e1e", border:"none", borderRadius:10, width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>✕</button>
                    </div>
                    <div style={{ textAlign:"center", padding:"16px 0 24px" }}>
                      <div style={{ fontSize:56, marginBottom:12 }}>{modal.worker.emoji}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>{modal.worker.name}</div>
                      <div style={{ color:modal.worker.color, fontWeight:600, marginBottom:20 }}>{modal.worker.specialty}</div>
                      <div style={{ background:"#1a1a1a", border:"1px solid #252525", borderRadius:14, padding:16, textAlign:"left", marginBottom:20 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                          <span style={{ color:"#666" }}>Narx:</span><span style={{ color:"#FFB703", fontWeight:700 }}>{modal.worker.price} so'mdan</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ color:"#666" }}>Reyting:</span><span style={{ color:"#FFB703", fontWeight:700 }}>⭐ {modal.worker.rating} ({modal.worker.reviews} izoh)</span>
                        </div>
                      </div>
                      <textarea className="input" rows={3} placeholder="Muammoni tushuntiring... (masalan: vannaxonamda kran tomchilayapti)" value={dealMessage} onChange={e => setDealMessage(e.target.value)} style={{ marginBottom:16, resize:"none" }} />
                      <button className="btn btn-orange" style={{ width:"100%", padding:14, fontSize:15 }} onClick={() => confirmDeal(modal.worker)}>
                        🤝 Tasdiqlash — Deal!
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pop" style={{ textAlign:"center", padding:"40px 0" }}>
                    <div style={{ fontSize:72, marginBottom:16 }}>🤝</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, marginBottom:8 }}>Deal qilindi!</div>
                    <div style={{ color:"#06D6A0", fontSize:15 }}>{modal.worker.name} bilan bog'landingiz</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkerCard({ w, liked, dealed, onLike, onDeal }) {
  return (
    <div className="card fade-in" style={{ display:"flex", flexDirection:"column" }}>
      <div style={{ height:4, background:w.color }} />
      <div style={{ padding:24, flex:1 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14 }}>
          <div style={{ width:56, height:56, borderRadius:18, background:w.color+"22", border:`2px solid ${w.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{w.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:2 }}>{w.name}</div>
            <div style={{ color:w.color, fontSize:13, fontWeight:600 }}>{w.specialty}</div>
          </div>
          <div style={{ background: w.available ? "#06D6A018" : "#66666618", border:`1px solid ${w.available?"#06D6A040":"#66666640"}`, borderRadius:8, padding:"4px 10px", color:w.available?"#06D6A0":"#666", fontSize:11, fontWeight:700, flexShrink:0 }}>
            {w.available ? "Bo'sh" : "Band"}
          </div>
        </div>
        <div style={{ color:"#666", fontSize:13, lineHeight:1.6, marginBottom:14 }}>{w.desc}</div>
        <div style={{ display:"flex", gap:14, marginBottom:14, fontSize:13 }}>
          <span style={{ color:"#666" }}>📍 {w.location}</span>
          <span style={{ color:"#FFB703" }}>⭐ {w.rating} ({w.reviews})</span>
        </div>
        <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:16 }}>💰 {w.price} so'mdan</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => onLike(w.id)} style={{
            flex:1, padding:"10px", borderRadius:12, cursor:"pointer",
            background: liked.includes(w.id) ? "#FF6B3520" : "#1e1e1e",
            color: liked.includes(w.id) ? "#FF6B35" : "#666",
            border: liked.includes(w.id) ? "1px solid #FF6B3540" : "1px solid #252525",
            fontWeight:600, fontSize:13, transition:"all 0.2s",
          }}>{liked.includes(w.id) ? "❤️ Yoqdi" : "🤍 Yoqdi"}</button>
          {!dealed.includes(w.id) ? (
            <button onClick={() => onDeal(w)} style={{ flex:1.5, padding:"10px", borderRadius:12, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#FF6B35,#FF8C42)", color:"#fff", fontWeight:700, fontSize:13, transition:"all 0.2s" }}>🤝 Deal</button>
          ) : (
            <div style={{ flex:1.5, padding:"10px", borderRadius:12, background:"#06D6A018", border:"1px solid #06D6A040", color:"#06D6A0", fontWeight:700, fontSize:13, textAlign:"center" }}>✅ Dealed</div>
          )}
        </div>
      </div>
    </div>
  );
}
