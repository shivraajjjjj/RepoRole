export default function Navbar(){
  return <>
  <nav 
      style = {{fontFamily : "'monospace',sans-serif"}}
      className= "fixed top-0 left-0 right-0 z-50 flex item-center justify-between px-6 md:px-12 py-5">
      
      <div className = "abslute inset-0 backdrop-blur-md" style ={{background : "rgba(7,7,26,0.82)", borderbottom : "1px solid rgba(255,255,255,0.0)"}}/>
      <button 
      OnClick = {() => windows.scrollTo({top : 0, behavior : "smooth"})}
      className = "relative flex items-center gap-2.5 group">
        <div className = "w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            boxShadow: "0 0 18px rgba(99,102,241,0.45)",
          }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "14px", color: "#fff", letterSpacing: "-0.5px" }}>
            RR
          </span>
        </div>
          </button>

        <div className="relative hidden md:flex items-center gap-8">
        {["About Us", "How It Works", "Samples"].map((label) => (
          <button
            key={label}
            onClick={() => scrollTo(label.toLowerCase().replace(/\s+/g, "-"))}
            className="text-sm transition-colors duration-200"
            style={{ color: "#7678a0", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e4ef")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7678a0")}
          >
            {label}
          </button>
        ))}
      </div>
      </nav>
  </>
}