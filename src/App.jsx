import { useState, useEffect, useRef, useCallback } from "react";


// ─── Utility: random between ─────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;

// ─── Film grain overlay ───────────────────────────────────────────────────────
function FilmGrain() {
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      opacity:0.35,mixBlendMode:"overlay"
    }}/>
  );
}

// ─── Floating particles ───────────────────────────────────────────────────────
function Particles() {
  const particles = useRef(
    Array.from({length:55},(_,i)=>({
      id:i,x:rand(0,100),y:rand(-10,110),
      size:rand(1.5,4),opacity:rand(0.08,0.35),
      dur:rand(18,40),delay:rand(0,20),
      drift:rand(-2,2),
      type: i%7===0?"heart":i%11===0?"star":"dot"
    }))
  ).current;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",overflow:"hidden"}}>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,
          animation:`floatUp ${p.dur}s ${p.delay}s infinite linear`,
          opacity:p.opacity
        }}>
          {p.type==="heart"?
            <span style={{fontSize:`${p.size*4}px`,color:"#c4637a",filter:"blur(0.3px)"}}>♥</span>:
          p.type==="star"?
            <span style={{fontSize:`${p.size*3}px`,color:"#d4a96a",filter:"blur(0.2px)"}}>✦</span>:
            <div style={{width:p.size,height:p.size,borderRadius:"50%",background:`rgba(212,169,106,${p.opacity*2})`,boxShadow:`0 0 ${p.size*3}px rgba(212,169,106,0.4)`}}/>
          }
        </div>
      ))}
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen({onDone}) {
  const [opacity,setOpacity]=useState(1);
  const [text,setText]=useState("");
  const full="A token of love only for my reemi...";
  useEffect(()=>{
    let i=0;
    const t=setInterval(()=>{
      if(i<=full.length){setText(full.slice(0,i));i++;}
      else clearInterval(t);
    },55);
    const timer=setTimeout(()=>{
      setOpacity(0);
      setTimeout(onDone,900);
    },3200);
    return()=>{clearInterval(t);clearTimeout(timer);};
  },[]);
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:10000,
      background:"#0a0608",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
      transition:"opacity 0.9s ease",opacity,gap:"1.5rem"
    }}>
      <div style={{
        width:1,height:60,background:"linear-gradient(to bottom,transparent,#c4637a,transparent)",
        animation:"pulseBar 2s ease-in-out infinite"
      }}/>
      <p style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(1rem,3vw,1.35rem)",
        color:"rgba(212,169,106,0.85)",letterSpacing:"0.15em",textAlign:"center",
        padding:"0 2rem",fontStyle:"italic"
      }}>{text}<span style={{animation:"blink 0.8s step-end infinite"}}>|</span></p>
      <div style={{width:1,height:60,background:"linear-gradient(to bottom,transparent,#c4637a,transparent)",animation:"pulseBar 2s 1s ease-in-out infinite"}}/>
    </div>
  );
}

// ─── Music toggle ─────────────────────────────────────────────────────────────
function MusicToggle({playing,toggle}) {
  return (
    <button onClick={toggle} style={{
      position:"fixed",bottom:"2rem",right:"2rem",zIndex:500,
      background:"rgba(15,6,10,0.7)",border:"0.5px solid rgba(196,99,122,0.4)",
      borderRadius:"50%",width:48,height:48,cursor:"pointer",
      backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",
      transition:"all 0.3s ease",color:"#d4a96a",fontSize:"18px"
    }}>
      {playing?"♫":"♪"}
    </button>
  );
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text,speed=55,delay=0){
  const [displayed,setDisplayed]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    let i=0;setDisplayed("");setDone(false);
    const t1=setTimeout(()=>{
      const t=setInterval(()=>{
        if(i<=text.length){setDisplayed(text.slice(0,i));i++;}
        else{clearInterval(t);setDone(true);}
      },speed);
      return()=>clearInterval(t);
    },delay);
    return()=>clearTimeout(t1);
  },[text,delay]);
  return{displayed,done};
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({id,children,style={}}) {
  const ref=useRef();
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.08});
    obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return (
    <section id={id} ref={ref} style={{
      transition:"opacity 0.9s ease, transform 0.9s ease",
      opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(40px)",
      ...style
    }}>{children}</section>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const {displayed,done}=useTypewriter("Every version of my future somehow has you in it.",60,400);
  const [showName,setShowName]=useState(false);
  const [showScroll,setShowScroll]=useState(false);
  useEffect(()=>{if(done){setTimeout(()=>setShowName(true),600);setTimeout(()=>setShowScroll(true),2000);}},[ done]);
  return (
    <section style={{
      minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",position:"relative",padding:"2rem",
      background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(100,20,40,0.35) 0%,transparent 70%)"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:"radial-gradient(circle at 30% 70%,rgba(212,169,106,0.04) 0%,transparent 50%), radial-gradient(circle at 70% 20%,rgba(196,99,122,0.06) 0%,transparent 50%)"
      }}/>
      <p style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",
        fontSize:"clamp(0.8rem,2vw,1rem)",color:"rgba(212,169,106,0.5)",
        letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:"2.5rem",
        animation:"fadeIn 1.5s ease forwards"
      }}>for you, always</p>
      <h1 style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:"clamp(1.4rem,4vw,2.1rem)",fontWeight:300,
        color:"rgba(245,235,225,0.9)",textAlign:"center",maxWidth:720,
        letterSpacing:"0.06em",lineHeight:1.65,minHeight:"3em",
        marginBottom:"2.5rem"
      }}>
        {displayed}<span style={{opacity:done?0:1,transition:"opacity 0.3s"}}>|</span>
      </h1>
      <div style={{
        transition:"opacity 1.2s ease, transform 1.2s ease",
        opacity:showName?1:0,transform:showName?"scale(1)":"scale(0.92)",
        textAlign:"center"
      }}>
        <div style={{
          width:60,height:0.5,background:"linear-gradient(to right,transparent,rgba(212,169,106,0.6),transparent)",
          margin:"0 auto 1.2rem"
        }}/>
        <p style={{
          fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:"clamp(3rem,9vw,6.5rem)",fontWeight:600,
          background:"linear-gradient(135deg,#d4a96a 0%,#f0d5a8 40%,#c4637a 70%,#d4a96a 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          backgroundClip:"text",letterSpacing:"0.08em",
          filter:"drop-shadow(0 0 30px rgba(212,169,106,0.25))",
          animation:showName?"glowPulse 4s ease-in-out infinite":undefined,lineHeight:1.1
        }}>My Reemi</p>
        <div style={{
          width:60,height:0.5,background:"linear-gradient(to right,transparent,rgba(212,169,106,0.6),transparent)",
          margin:"1.2rem auto 0"
        }}/>
      </div>
      <p style={{
  marginTop:"4rem",
  maxWidth:"720px",
  textAlign:"center",
  fontFamily:"'Cormorant Garamond',Georgia,serif",
  fontSize:"1.2rem",
  fontStyle:"italic",
  letterSpacing:"0.12em",
  color:"rgba(212,169,106,0.55)",
  lineHeight:1.9,
  opacity:showScroll?1:0,
  transition:"opacity 1.5s ease"
}}>
  you my everything, in every lifetime. meri jaan, my princess, my honeybun, my shortie
</p>
      <div style={{
        position:"absolute",bottom:"2.5rem",left:"50%",transform:"translateX(-50%)",
        animation:"scrollBounce 2.5s ease-in-out infinite",opacity:showScroll?0.5:0,
        transition:"opacity 1s ease",color:"rgba(212,169,106,0.7)",fontSize:"1.2rem"
      }}>↓</div>
    </section>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
const galleryItems=[
  {img: "/photos/her1.JPG" , caption:"how beautiful our kids would be girl",compliment:"Elegante"},
  {img: "/photos/her2.jpeg" , caption:"shortie nice and pretty u a full package",compliment:"Serene"},
  {img: "/photos/her3.jpg" , caption:"got me feeling all kinds of stuff",compliment:"My favourite thing"},
  {img: "/photos/her4.JPG" , caption:"you can have it all, all to yourself",compliment:"Pure gold"},
  {img: "/photos/her5.JPG" , caption:"want to start family with you",compliment:"Everything"},
  {img: "/photos/her6.JPG" , caption:"coming out of my body for you babygirl",compliment:"Breathtaking"},
  {img: "/photos/her7.jpg" , caption:"fine shyt got the inner loverboy out of me n its been a long time",compliment:"My gem"},
  {img: "/photos/her8.jpg" , caption:"i love dis girl so much",compliment:"Sexy"},

];

function GalleryCard({item,index}) {
  const [hov,setHov]=useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative",aspectRatio:"4/5",borderRadius:4,overflow:"hidden",cursor:"pointer",
        transition:"transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease",
        transform:hov?"scale(1.03) translateY(-6px)":"scale(1)",
        boxShadow:hov?"0 30px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(196,99,122,0.4)":"0 8px 24px rgba(0,0,0,0.4)",
        animationDelay:`${index*0.1}s`
      }}
    >
     
      <img
  src={item.img}
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }}
/>
      <div style={{
        position:"absolute",inset:0,
        background:"linear-gradient(to top,rgba(5,2,4,0.92) 0%,rgba(5,2,4,0.2) 50%,transparent 100%)",
        transition:"opacity 0.4s ease",opacity:hov?1:0.7
      }}/>
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem 1.25rem",
        transform:hov?"translateY(0)":"translateY(6px)",transition:"transform 0.4s ease"
      }}>
        {hov&&<p style={{
          fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"0.75rem",
          color:"#c4637a",letterSpacing:"0.2em",textTransform:"uppercase",
          marginBottom:"0.5rem",opacity:1,animation:"fadeInUp 0.3s ease"
        }}>{item.compliment}</p>}
        <p style={{
          fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",
          fontSize:"clamp(0.85rem,1.5vw,0.95rem)",color:"rgba(245,235,225,0.88)",
          lineHeight:1.55,margin:0
        }}>{item.caption}</p>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <Section id="gallery" style={{padding:"8rem 2rem",maxWidth:1200,margin:"0 auto"}}>
      <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",color:"#c4637a",letterSpacing:"0.3em",textTransform:"uppercase",fontSize:"0.75rem",textAlign:"center",marginBottom:"1rem"}}>i</p>
      <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:300,color:"rgba(245,235,225,0.9)",textAlign:"center",marginBottom:"1rem",letterSpacing:"0.04em"}}>shes very attractive</h2>
      <p style={{textAlign:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",color:"rgba(212,169,106,0.5)",fontSize:"1.2rem",marginBottom:"4rem",letterSpacing:"0.08em"}}>shortie fuck all dat makeup u fine asfuh </p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.5rem"}}>
        {galleryItems.map((item,i)=><GalleryCard key={i} item={item} index={i}/>)}
      </div>
    </Section>
  );
}
//  OUR GALLERY -----------
// ─── DROP THIS ENTIRE BLOCK INTO YOUR SINGLE FILE ────────────────────────────
// Place it after your existing Section component definition
// Replace your old Timeline/Gallery component with this
// ─────────────────────────────────────────────────────────────────────────────

const US_PHOTOS = [
  { src: "/photos/us1.jpg", caption: "first photo we took together alone, didnt know we'd be here", label: "first one with shortie", rot: -4, size: "large" },
  { src: "/photos/us2.jpg", caption: "the first time I realised I was keeping all your words", label: "Had the boy feeling", rot: 3, size: "small" },
  { src: "/photos/us4.jpg", caption: "i remember this day vividly, strong connection with shortie", label: "strong bond", rot: 5, size: "small" },
  { src: "/photos/us12.jpeg", caption: "dis ghost kitchen dine-in. just me and you. real close", label: "Iconic", rot: 5, size: "small" },
  { src: "/photos/us3.jpg", caption: "came to uni just to see your pretty face and hangout with someone special", label: "strong bond", rot: -2, size: "small" },

  { src: "/photos/us7.jpg", caption: "our cig runs hahahaahaha. u made a shitty spot feel special", label: "attachment", rot: 2, size: "small" },
  { src: "/photos/us9.jpg", caption: "dis girl wearing black hot asfuh. my trim princess", label: "All Black Protocol", rot: 5, size: "small" },
  { src: "/photos/us8.JPG", caption: "dis girl got me feeling some type of way everyday", label: "real close", rot: -2, size: "small" },
  { src: "/photos/us10.jpg", caption: "Last day of the semester. shortie in my arms. loved doing ur birthday n making u happy. #motto", label: "All to myself", rot: -5, size: "small" },
  { src: "/photos/us11.jpg", caption: "i love dis girl so much. my favorite addiction. u so precious to me. id go immeasurable depths for you ", label: "meri jaan", rot: 5, size: "medium" },





];

const US_SIZE_MAP = {
  large:  { w: "clamp(240px,30vw,380px)", h: "clamp(300px,38vw,480px)" },
  medium: { w: "clamp(200px,24vw,300px)", h: "clamp(260px,30vw,380px)" },
  small:  { w: "clamp(170px,20vw,250px)", h: "clamp(220px,26vw,320px)" },
};

function UsPhotoCard({ photo, scrollY, depth }) {
  const [hovered, setHovered] = useState(false);
  const { w, h } = US_SIZE_MAP[photo.size];
  const parallaxOffset = scrollY * depth * 0.04;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        transform: `rotate(${hovered ? 0 : photo.rot}deg) translateY(${parallaxOffset}px) scale(${hovered ? 1.04 : 1})`,
        transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s ease",
        zIndex: hovered ? 10 : 1,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <div style={{
        background: "#111018",
        padding: "0.55rem 0.55rem 2.8rem",
        boxShadow: hovered
          ? "0 32px 80px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(196,99,122,0.35)"
          : "0 12px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.55s ease",
      }}>
        <div style={{ width: w, height: h, overflow: "hidden", position: "relative" }}>
          <img
            src={photo.src}
            alt={photo.label}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              filter: `contrast(1.06) brightness(${hovered ? 1 : 0.88}) saturate(0.9)`,
              transition: "filter 0.55s ease, transform 0.55s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
          {/* vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}/>
          {/* caption on hover */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(5,2,8,0.88) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            display: "flex", alignItems: "flex-end", padding: "1rem",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic",
              fontSize: "clamp(0.78rem,1.4vw,0.9rem)", color: "rgba(245,235,225,0.9)",
              lineHeight: 1.55, margin: 0,
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "transform 0.4s ease",
            }}>{photo.caption}</p>
          </div>
        </div>

        {/* label strip */}
        <div style={{ paddingTop: "0.7rem", paddingLeft: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#c4637a", fontSize: "0.7rem" }}>✦</span>
          <p style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(212,169,106,0.65)", margin: 0,
          }}>{photo.label}</p>
        </div>
      </div>
    </div>
  );
}

function UsGallery() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef();

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      setScrollY(-sectionRef.current.getBoundingClientRect().top);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const perRow = Math.ceil(US_PHOTOS.length / 4);
const row1 = US_PHOTOS.slice(0, perRow);
const row2 = US_PHOTOS.slice(perRow, perRow * 2);
const row3 = US_PHOTOS.slice(perRow * 2, perRow * 3);
const row4 = US_PHOTOS.slice(perRow * 3);

  return (
    <Section id="us" style={{ padding: "8rem 2rem", overflow: "hidden" }}>
      <div ref={sectionRef}>
        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic", color: "#c4637a", letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.75rem", textAlign: "center", marginBottom: "1rem" }}>ii</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, color: "rgba(245,235,225,0.9)", textAlign: "center", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>me n my princess</h2>
        <p style={{ textAlign: "center", fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic", color: "rgba(212,169,106,0.4)", fontSize: "1.2rem", letterSpacing: "0.1em", marginBottom: "5rem" }}>hover to remember. click on the music button if you haven't</p>

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          {/* ambient glow */}
          <div style={{
            position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
            width: "60%", height: "60%",
            background: "radial-gradient(ellipse, rgba(100,15,40,0.2) 0%, transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
          }}/>

          {/* row 1 */}
<div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:"clamp(1.5rem,4vw,4rem)", marginBottom:"clamp(1.5rem,3vw,3rem)", position:"relative", zIndex:1, paddingLeft:"clamp(0px,8vw,120px)" }}>
  {row1.map((photo,i) => <UsPhotoCard key={i} photo={photo} scrollY={scrollY} depth={i%2===0?1:-1}/>)}
</div>

{/* row 2 — middle raised */}
<div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"clamp(1.5rem,4vw,4rem)", marginBottom:"clamp(1.5rem,3vw,3rem)", position:"relative", zIndex:1, paddingRight:"clamp(0px,6vw,80px)" }}>
  {row2.map((photo,i) => (
    <div key={i} style={{ marginTop: i===1 ? "clamp(-50px,-5vw,-70px)" : "0" }}>
      <UsPhotoCard photo={photo} scrollY={scrollY} depth={i%2===0?-1:1}/>
    </div>
  ))}
</div>

{/* row 3 */}
<div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:"clamp(1.5rem,4vw,4rem)", marginBottom:"clamp(1.5rem,3vw,3rem)", position:"relative", zIndex:1, paddingLeft:"clamp(0px,6vw,90px)" }}>
  {row3.map((photo,i) => (
    <div key={i} style={{ marginTop: i===0 ? "clamp(-40px,-4vw,-60px)" : "0" }}>
      <UsPhotoCard photo={photo} scrollY={scrollY} depth={i%2===0?1:-1}/>
    </div>
  ))}
</div>

{/* row 4 — middle raised */}
<div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"clamp(1.5rem,4vw,4rem)", position:"relative", zIndex:1, paddingRight:"clamp(0px,8vw,110px)" }}>
  {row4.map((photo,i) => (
    <div key={i} style={{ marginTop: i===1 ? "clamp(-50px,-5vw,-70px)" : "0" }}>
      <UsPhotoCard photo={photo} scrollY={scrollY} depth={i%2===0?-1:1}/>
    </div>
  ))}
</div>
          
        </div>

        {/* bottom quote */}
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom,transparent,rgba(196,99,122,0.35),transparent)", margin: "0 auto 2rem" }}/>
          <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic", fontSize: "clamp(1rem,2.5vw,1.3rem)", color: "rgba(245,235,225,0.45)", letterSpacing: "0.06em", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
            "show me your broken heart and all your scars<br/>baby ill take ill take ill take you as you are"
          </p>
        </div>
      </div>
    </Section>
  );
}


const moments=[
  {icon:"✦",label:"The First Message",text:"That day you texted me. it was like, 'Mubarak ho new dates 🥳🥳🥳 still nowhere near us tho AHAHAHAHAH' 11th September 2025. I didn't have a clue we'd make it this far together. Im super glad we did."},
  {icon:"♡",label:"Common Interests w/ shortie",text:"I bonded with you really fast, even before meeting physically. Shared interests, music taste, and humor. it all just clicked."},
  {icon:"✿",label:"First Photo",text:"It'll forever have a special place in my heart. I remember telling you that you looked like a comgirl, now we're dating. its crazy to me girl. attached above."},
  {icon:"◈",label:"That one night shortie",text:"I remember dat day you was working on your assingment n we had a spotify jam sesh going on. We shared alot of things. I told you things i never told anyone. You've been special ever since."},
  {icon:"❋",label:"That ghost kitchen day wearing manto",text:"That day set the base, really. me n shorty started hanging out together a lot after dat. im glad that happened. you're everything dis boy need."},
  {icon:"♡",label:"our first kiss",text:"you was in my arms, we was comfy and close. nahi huwa control mujhse meri jaan. ur my weakness. im glad i was your first. n ill make sure youll always be safe."},
  {icon:"❋",label:"Highs and Lows",text:"our good moments outweigh the bad ones by a billion. i cherish every single one of them. we've had arguments but i love the fact that we're able to communicate it out and dont let our egos get involved. i love communicating wid you, i learn more about you everytime we do."},
  {icon:"❋",label:"our motion",text:"smoking runs, cafe runs, classroom cuddling, sneak bullying the white hair boy (he has no idea n the semesters over) etc. its the small things with you, n you being in them makes a huge difference."},
  {icon:"♡",label:"My fate",text:"Nothing compares to you shortie. im in too deeep love wid u. ur my destiny. i want to be with you forever, be there for you."},
  {icon:"❋",label:"my remorse",text:"shortie our future seems bright to me. i hope we continue like dis. i wanna continue like dis. im sorry for everytime i made you feel less than you are. im sorry for all the times i said something hurtful. you deserve the best. n ill try my best to give you the best "},
];
 
function Timeline() {
  return (
    <Section id="timeline" style={{padding:"8rem 2rem",maxWidth:860,margin:"0 auto"}}>
      <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",color:"#c4637a",letterSpacing:"0.3em",textTransform:"uppercase",fontSize:"0.75rem",textAlign:"center",marginBottom:"1rem"}}>ii</p>
      <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:300,color:"rgba(245,235,225,0.9)",textAlign:"center",marginBottom:"5rem",letterSpacing:"0.04em"}}>i fell in love</h2>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:0.5,background:"linear-gradient(to bottom,transparent,rgba(196,99,122,0.3) 10%,rgba(196,99,122,0.3) 90%,transparent)",transform:"translateX(-50%)"}}/>
        {moments.map((m,i)=>{
          const left=i%2===0;
          return (
            <div key={i} style={{
              display:"flex",justifyContent:left?"flex-end":"flex-start",
              paddingRight:left?"calc(50% + 2rem)":"0",
              paddingLeft:left?"0":"calc(50% + 2rem)",
              marginBottom:"3.5rem",position:"relative"
            }}>
              <div style={{
                position:"absolute",left:"50%",top:"1.2rem",
                width:10,height:10,borderRadius:"50%",
                background:"#c4637a",boxShadow:"0 0 12px rgba(196,99,122,0.6)",
                transform:"translateX(-50%)"
              }}/>
              <div style={{
                background:"rgba(20,8,14,0.7)",border:"0.5px solid rgba(196,99,122,0.18)",
                borderRadius:6,padding:"1.5rem",maxWidth:340,backdropFilter:"blur(8px)",
                boxShadow:"0 4px 24px rgba(0,0,0,0.3)",
                transition:"transform 0.4s ease, box-shadow 0.4s ease"
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.3)";}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem"}}>
                  <span style={{color:"#c4637a",fontSize:"1rem"}}>{m.icon}</span>
                  <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"0.75rem",color:"rgba(212,169,106,0.7)",letterSpacing:"0.2em",textTransform:"uppercase",margin:0}}>{m.label}</p>
                </div>
                <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",fontSize:"0.95rem",color:"rgba(245,235,225,0.8)",lineHeight:1.7,margin:0}}>{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}


// ─── LETTERS ──────────────────────────────────────────────────────────────────
// ─── REPLACE YOUR ENTIRE Letters() FUNCTION WITH THIS ────────────────────────

const LETTER_SIDE_PHOTOS = [
  "/photos/care2.jpg",
  "/photos/care1.jpg",
  "/photos/care3.jpg",
];

function Letters() {
  const ref = useRef();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(
          1,
          (-rect.top + window.innerHeight * 0.2) / (rect.height * 0.8)
        )
      );
      setProgress(p);
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const letter = `My princess,

I never write letters but u shortie got me feeling sum way. The inner loverboy is out. I love you. I aint gaf if this is corny. I guess my emotions are corny then.

I luv u so much its an addiction thing. You a real ass woman n i love dat. You my everything girl. You my weakness. 

Theres places where I gotta stay careful and not leave myself vulnerable. When im with my princess, all dat fades away. You're my safe n comfort place. You just understand meri jaan.

I love the way you exist amd live life. I admire your positivity very much so. I love how you still manage to put on a smile. Its one of my favorite things about you, and i feel like you're changing me too. 

I don't say this enough. I'm not always good with words or expressing my feelings. But I want you to know that the boy loves you more than anything on dis mf planet and thats word to my mom. I mean it.

You changed something in me, something permanent. I used to be numb about my emotions. I literally wouldn't show any emotion. But then i met you. When you were in pain that day, the gallbladder stone, n you were crying, seeing you in pain crying hurt me a lot, like a lot. Its still geting me in my feelings. That was the first time i ever shed a tear in like 3 years.

I'd love to have a future with you. I really want you to mother my children, really. I want to be all yours n i want you to be all mine.

I want to take mad care of you n be always dere for u, through your everything. And on your birthday, more than anything, I want you to feel what it means to be loved by someone who means every single word.

You are the one for me. You've always been the one. You will always be the one. 

Happy birthday, meri pyaari jaan. more love hareem. more life. i'm so proud of you. i'm so glad you exist. you know i love so much meri jaan.

Yours, completely,
the boy. `;

  const words = letter.split(" ");
  const revealedCount = Math.floor(progress * words.length);

  // only 3 photos total
  const sidePhotos = LETTER_SIDE_PHOTOS;

  // alternating slight rotations
  const sideRots = [-3, 2, -1.5];

  return (
    <Section
      id="letters"
      style={{
        padding: "8rem 2rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontStyle: "italic",
          color: "#c4637a",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        iii
      </p>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: "clamp(2rem,5vw,3.5rem)",
          fontWeight: 300,
          color: "rgba(245,235,225,0.9)",
          textAlign: "center",
          marginBottom: "4rem",
          letterSpacing: "0.04em",
        }}
      >
        love letter 4 my love
      </h2>

      {/* outer wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "clamp(1.5rem,4vw,3rem)",
          position: "relative",
        }}
      >
        {/* ── LARGE PHOTO STRIP ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.8rem",
            flexShrink: 0,
            paddingTop: "3rem",
          }}
        >
          {sidePhotos.map((src, i) => (
            <div
              key={i}
              style={{
                transform: `rotate(${sideRots[i]}deg)`,
                transition: "transform 0.4s ease, opacity 0.4s ease",
                opacity: 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform =
                  "rotate(0deg) scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.transform = `rotate(${sideRots[i]}deg) scale(1)`;
              }}
            >
              <div
                style={{
                  background: "#0d0810",
                  padding: "0.5rem 0.5rem 2.2rem",
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(212,169,106,0.08)",
                  width: "clamp(140px,14vw,190px)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter:
                        "brightness(0.72) saturate(0.78) sepia(0.12)",
                      display: "block",
                    }}
                  />
                </div>

                {/* film strip holes */}
                <div
                  style={{
                    position: "absolute",
                    top: "0.3rem",
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "0 0.3rem",
                  }}
                >
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      style={{
                        width: 6,
                        height: 5,
                        background: "rgba(212,169,106,0.12)",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── LETTER ── */}
        <div
          ref={ref}
          style={{
            flex: 1,
            minWidth: 0,
            background: "rgba(18,7,12,0.6)",
            border: "0.5px solid rgba(212,169,106,0.12)",
            borderRadius: 8,
            padding: "clamp(2rem,5vw,4rem)",
            backdropFilter: "blur(16px)",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.5), inset 0 0 60px rgba(100,20,40,0.05)",
          }}
        >
          {/* corner glow */}
          <div
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(212,169,106,0.06) 0%,transparent 70%)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />

          {/* bottom glow */}
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: 60,
              background:
                "radial-gradient(ellipse,rgba(196,99,122,0.07) 0%,transparent 70%)",
              filter: "blur(12px)",
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "clamp(0.95rem,2vw,1.1rem)",
              lineHeight: 1.95,
              color: "rgba(245,235,225,0.85)",
              whiteSpace: "pre-wrap",
              margin: 0,
              fontStyle: "italic",
              letterSpacing: "0.015em",
              position: "relative",
              zIndex: 1,
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  transition: "opacity 0.6s ease",
                  opacity: i < revealedCount ? 0.88 : 0.08,
                  color:
                    i < revealedCount
                      ? "rgba(245,235,225,0.88)"
                      : "rgba(245,235,225,0.06)",
                }}
              >
                {word}{" "}
              </span>
            ))}
          </p>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              background:
                "linear-gradient(to top,rgba(18,7,12,0.8),transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontStyle: "italic",
          color: "rgba(212,169,106,0.35)",
          fontSize: "0.8rem",
          marginTop: "1.5rem",
          letterSpacing: "0.15em",
        }}
      >
        meri pyaari jaan.
      </p>

      {/* hide photo strip on mobile */}
      <style>{`
        @media (max-width: 640px) {
          #letters [style*="flexShrink: 0"] {
            display: none !important;
          }
        }
      `}</style>
    </Section>
  );
}

// ─── TINY THINGS ─────────────────────────────────────────────────────────────
const tinyThings=[
  "the way she says my name, the way she extends her words",
  "her sleepy, tired but beautiful voice",
  "how excited n happy she gets sometimes",
  "her smile got me weak as fuck",
  "how thoughtful she is",
  "the way she never lets me get bored",
  "i love her nakhre",
  "her calls n our conversations",
  "she tries her best in everything n im so proud of her",
  "how she remembers small things I said weeks ago",
  "the little things she does to make me feel better",
  "the way i have her in my arms",
  "when shes ragebaited hahahhahaha",
  "the way she got me feeling dese days",
  "the way she tries to keep a smile even though shes not feeling it",
  "i love her lips n eyes n cheeks n everything ",
];

function TinyThings() {
  const [revealed,setRevealed]=useState(new Set());
  const positions=useRef(tinyThings.map((_,i)=>({
    x:rand(5,85),y:rand(10,80),
    rot:rand(-15,15),delay:i*0.06
  }))).current;
  const toggle=(i)=>{
    setRevealed(prev=>{
      const n=new Set(prev);
      n.has(i)?n.delete(i):n.add(i);
      return n;
    });
  };
  return (
    <Section id="tiny" style={{padding:"8rem 2rem"}}>
      <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",color:"#c4637a",letterSpacing:"0.3em",textTransform:"uppercase",fontSize:"0.75rem",textAlign:"center",marginBottom:"1rem"}}>iv</p>
      <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:300,color:"rgba(245,235,225,0.9)",textAlign:"center",marginBottom:"1rem",letterSpacing:"0.04em"}}>Tiny Things I Love About You</h2>
      <p style={{textAlign:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",color:"rgba(212,169,106,0.5)",fontSize:"1rem",marginBottom:"2rem",letterSpacing:"0.08em"}}>click the stars to uncover them</p>
      <div style={{position:"relative",height:"clamp(400px,60vh,600px)",maxWidth:1000,margin:"0 auto"}}>
        {tinyThings.map((thing,i)=>{
          const p=positions[i];
          const rev=revealed.has(i);
          return (
            <div key={i} onClick={()=>toggle(i)} style={{
              position:"absolute",
              left:`${p.x}%`,top:`${p.y}%`,
              transform:`rotate(${p.rot}deg)`,
              cursor:"pointer",
              animation:`fadeIn 0.5s ${p.delay}s ease both`,
              transition:"all 0.4s cubic-bezier(0.23,1,0.32,1)",
              zIndex:rev?10:1
            }}>
              {!rev?(
                <span style={{
                  fontSize:rand(1.2,1.8)+"rem",
                  color:`rgba(212,169,106,${rand(0.3,0.7)})`,
                  textShadow:`0 0 ${rand(8,20)}px rgba(212,169,106,0.5)`,
                  transition:"all 0.3s ease",display:"block"
                }}
                onMouseEnter={e=>{e.target.style.transform="scale(1.4)";e.target.style.color="rgba(212,169,106,1)";}}
                onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.color=`rgba(212,169,106,${rand(0.3,0.7)})`;}}
                >✦</span>
              ):(
                <div style={{
                  background:"rgba(18,7,12,0.85)",border:"0.5px solid rgba(196,99,122,0.4)",
                  borderRadius:6,padding:"0.6rem 1rem",backdropFilter:"blur(12px)",
                  maxWidth:220,boxShadow:"0 8px 30px rgba(0,0,0,0.5)",
                  animation:"fadeInUp 0.3s ease"
                }}>
                  <p style={{
                    fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",
                    fontSize:"0.85rem",color:"rgba(245,235,225,0.88)",margin:0,
                    lineHeight:1.5,textAlign:"center"
                  }}>{thing}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── LOVE METER ───────────────────────────────────────────────────────────────
const reasons=[
  "Because shes so pretty n elegant.",
  "Because she listens to what i listen to",
  "Because shes my trim little girl",
  "Because she stays, even when it's hard.",
  "Because she exists, yeah her existence a 10.",
  "Because she takes care n actually cares.",
  "Because she's the first person I want to tell things to.",
  "Because shes got a lovable personality.",
  "Because i like her freak. my freaky gf.",
  "Because she communicates properly.",
  "Because her happiness matters more to me than I can explain.",
  "Because she is genuinely, deeply amazing."
];



function FunSection() {
  const [reason, setReason] = useState(reasons[0]);
  const [missMsg, setMissMsg] = useState(false);
  const [loveAnim, setLoveAnim] = useState(false);

  const rollReason = () => {
    setReason(reasons[Math.floor(Math.random() * reasons.length)]);
  };

  const pressMiss = () => {
    setMissMsg(true);
    setTimeout(() => setMissMsg(false), 5000);
  };

  // ── POLAROIDS ─────────────────────────────────────────
  const polaroids = [
    {
      img: "/photos/letter2.JPG",
      label: "my pretty girl",
      rot: -6,
    },
    {
      img: "/photos/letter.JPG",
      label: "us forever",
      rot: 4,
    },
    {
      img: "/photos/us10.jpg",
      label: "angel energy",
      rot: -3,
    },
    {
      img: "/photos/us2.jpg",
      label: "my safe place",
      rot: 5,
    },
  ];

  return (
    <Section
      id="fun"
      style={{
        padding: "8rem 2rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontStyle: "italic",
          color: "#c4637a",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        v
      </p>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: "clamp(2rem,5vw,3.5rem)",
          fontWeight: 300,
          color: "rgba(245,235,225,0.9)",
          textAlign: "center",
          marginBottom: "4rem",
          letterSpacing: "0.04em",
        }}
      >
        love, love and
      </h2>

      {/* Grid of interactive items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "1.5rem",
          marginBottom: "4rem",
        }}
      >
        {/* Love meter */}
        <div
          style={{
            background: "rgba(18,7,12,0.7)",
            border: "0.5px solid rgba(196,99,122,0.2)",
            borderRadius: 8,
            padding: "2rem",
            backdropFilter: "blur(12px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              color: "rgba(212,169,106,0.6)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              marginBottom: "1.5rem",
            }}
          >
            Love Meter™
          </p>

          <div
            style={{
              fontSize: "3.5rem",
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontWeight: 600,
              background: "linear-gradient(135deg,#c4637a,#d4a96a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1rem",
            }}
          >
            100%
          </div>

          <div
            style={{
              height: 6,
              background: "rgba(212,169,106,0.12)",
              borderRadius: 3,
              overflow: "hidden",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(to right,#c4637a,#d4a96a)",
                animation: "fillBar 2s ease forwards",
              }}
            />
          </div>

          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontStyle: "italic",
              color: "rgba(245,235,225,0.5)",
              fontSize: "0.8rem",
              margin: 0,
            }}
          >
            stuck here. permanently.
          </p>
        </div>

        {/* Reasons generator */}
        <div
          style={{
            background: "rgba(18,7,12,0.7)",
            border: "0.5px solid rgba(196,99,122,0.2)",
            borderRadius: 8,
            padding: "2rem",
            backdropFilter: "blur(12px)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              color: "rgba(212,169,106,0.6)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              margin: 0,
            }}
          >
            Why I Adore You
          </p>

          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "rgba(245,235,225,0.88)",
              lineHeight: 1.6,
              margin: 0,
              minHeight: 70,
              transition: "opacity 0.4s ease",
            }}
          >
            {reason}
          </p>

          <button
            onClick={rollReason}
            style={{
              background: "transparent",
              border: "0.5px solid rgba(212,169,106,0.35)",
              color: "rgba(212,169,106,0.7)",
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.6rem 1.5rem",
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "rgba(212,169,106,0.8)";
              e.target.style.color = "rgba(212,169,106,1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(212,169,106,0.35)";
              e.target.style.color = "rgba(212,169,106,0.7)";
            }}
          >
            another one →
          </button>
        </div>

        {/* Miss me button */}
        <div
          style={{
            background: "rgba(18,7,12,0.7)",
            border: "0.5px solid rgba(196,99,122,0.2)",
            borderRadius: 8,
            padding: "2rem",
            backdropFilter: "blur(12px)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              color: "rgba(212,169,106,0.6)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              margin: 0,
            }}
          >
            for when you need it
          </p>

          {!missMsg ? (
            <button
              onClick={pressMiss}
              style={{
                background:
                  "linear-gradient(135deg,rgba(100,15,35,0.6),rgba(60,10,25,0.6))",
                border: "0.5px solid rgba(196,99,122,0.5)",
                color: "rgba(245,235,225,0.9)",
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: "0.95rem",
                letterSpacing: "0.12em",
                fontStyle: "italic",
                padding: "0.85rem 2rem",
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 0 20px rgba(196,99,122,0.15)",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow =
                  "0 0 30px rgba(196,99,122,0.35)";
                e.target.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow =
                  "0 0 20px rgba(196,99,122,0.15)";
                e.target.style.transform = "scale(1)";
              }}
            >
              press when you miss me
            </button>
          ) : (
            <p
              style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontStyle: "italic",
                fontSize: "1.05rem",
                color: "rgba(245,235,225,0.88)",
                lineHeight: 1.7,
                margin: 0,
                animation: "fadeInUp 0.4s ease",
              }}
            >
              Hey. I miss you too. I always do. Come back soon, okay? ♡
            </p>
          )}
        </div>
      </div>

      {/* ── POLAROIDS ───────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          marginBottom: "5rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontStyle: "italic",
            color: "rgba(212,169,106,0.4)",
            fontSize: "0.8rem",
            textAlign: "center",
            marginBottom: "2rem",
            letterSpacing: "0.12em",
          }}
        >
          digital polaroids
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {polaroids.map((pol, i) => (
            <div
              key={i}
              style={{
                transform: `rotate(${pol.rot}deg)`,
                background: "#f5ede4",
                padding: "0.7rem 0.7rem 2.2rem",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.5), 2px 2px 8px rgba(0,0,0,0.3)",
                width: 140,
                transition:
                  "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "rotate(0deg) scale(1.08) translateY(-8px)";
                e.currentTarget.style.zIndex = 10;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${pol.rot}deg)`;
                e.currentTarget.style.zIndex = 1;
              }}
            >
              {/* actual photo */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  overflow: "hidden",
                  marginBottom: "0.5rem",
                  background: "#111",
                }}
              >
                <img
                  src={pol.img}
                  alt={pol.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter:
                      "brightness(0.88) contrast(1.02) saturate(0.92)",
                  }}
                />
              </div>

              {/* handwritten caption */}
              <p
                style={{
                  fontFamily: "'Dancing Script',cursive,Georgia",
                  fontSize: "0.7rem",
                  color: "rgba(40,10,20,0.65)",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {pol.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Heart constellation */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontStyle: "italic",
            color: "rgba(212,169,106,0.4)",
            fontSize: "0.8rem",
            marginBottom: "1.5rem",
            letterSpacing: "0.12em",
          }}
        >
          our constellation
        </p>

        <svg
          viewBox="0 0 300 200"
          style={{
            width: "min(300px,80vw)",
            margin: "0 auto",
            display: "block",
          }}
        >
          {[
            [150, 40],
            [174, 68],
            [200, 60],
            [183, 85],
            [192, 113],
            [150, 100],
            [108, 113],
            [117, 85],
            [100, 60],
            [126, 68],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2.5" fill="#d4a96a" opacity="0.7">
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>

              <circle cx={x} cy={y} r="5" fill="rgba(212,169,106,0.1)">
                <animate
                  attributeName="r"
                  values="5;9;5"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {[
            [150, 40, 174, 68],
            [174, 68, 200, 60],
            [200, 60, 183, 85],
            [183, 85, 192, 113],
            [192, 113, 150, 100],
            [150, 100, 108, 113],
            [108, 113, 117, 85],
            [117, 85, 100, 60],
            [100, 60, 126, 68],
            [126, 68, 150, 40],
            [150, 40, 150, 100],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(212,169,106,0.2)"
              strokeWidth="0.5"
            />
          ))}

          <text
            x="150"
            y="155"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond',Georgia,serif"
            fontSize="10"
            fill="rgba(212,169,106,0.4)"
            fontStyle="italic"
          >
            named after you
          </text>
        </svg>
      </div>
    </Section>
  );
}

// ─── ENDING ───────────────────────────────────────────────────────────────────
function Ending() {
  const [phase,setPhase]=useState(0);
  const ref=useRef();
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        setTimeout(()=>setPhase(1),300);
        setTimeout(()=>setPhase(2),1800);
        setTimeout(()=>setPhase(3),3500);
        setTimeout(()=>setPhase(4),5500);
      }
    },{threshold:0.3});
    obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return (
    <section id="ending" ref={ref} style={{
      minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"4rem 2rem",position:"relative",
      background:"radial-gradient(ellipse 100% 80% at 50% 50%,rgba(80,10,30,0.4) 0%,transparent 70%)",
      textAlign:"center",gap:"2rem"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:"radial-gradient(circle at 50% 50%,rgba(196,99,122,0.08) 0%,transparent 60%)",
        animation:"glowPulse 6s ease-in-out infinite"
      }}/>
      <p style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",
        color:"rgba(212,169,106,0.5)",letterSpacing:"0.3em",textTransform:"uppercase",fontSize:"0.75rem",
        transition:"opacity 1.2s ease",opacity:phase>=1?1:0
      }}>vi</p>
      <h2 style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(1.5rem,4vw,2.5rem)",fontWeight:300,
        color:"rgba(245,235,225,0.9)",letterSpacing:"0.05em",maxWidth:680,lineHeight:1.55,
        transition:"opacity 1.5s ease, transform 1.5s ease",
        opacity:phase>=1?1:0,transform:phase>=1?"translateY(0)":"translateY(30px)"
      }}>In every lifetime, I think I would still search for you.</h2>
      <div style={{
        width:40,height:0.5,background:"linear-gradient(to right,transparent,rgba(212,169,106,0.6),transparent)",
        transition:"opacity 1.5s ease",opacity:phase>=2?1:0
      }}/>
      <p style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:"clamp(2.5rem,7vw,5rem)",fontWeight:600,
        background:"linear-gradient(135deg,#d4a96a 0%,#f0d5a8 35%,#c4637a 65%,#d4a96a 100%)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
        letterSpacing:"0.06em",lineHeight:1.2,
        transition:"opacity 1.5s ease, transform 1.5s ease",
        opacity:phase>=2?1:0,transform:phase>=2?"scale(1)":"scale(0.9)",
        filter:phase>=2?"drop-shadow(0 0 40px rgba(212,169,106,0.3))":"none"
      }}>Happy Birthday,<br/>my love.</p>
      <div style={{
        transition:"opacity 2s ease",opacity:phase>=3?1:0,
        display:"flex",gap:"0.6rem",fontSize:"1.2rem",
        color:"rgba(196,99,122,0.7)"
      }}>
        {"♡ ♡ ♡".split(" ").map((h,i)=>(
          <span key={i} style={{animation:`heartBeat ${1.2+i*0.2}s ${i*0.15}s ease-in-out infinite`}}>{h}</span>
        ))}
      </div>
      <p style={{
        fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",
        fontSize:"clamp(1rem,2.5vw,1.35rem)",color:"rgba(245,235,225,0.45)",
        letterSpacing:"0.12em",
        transition:"opacity 2s ease",opacity:phase>=4?1:0,
        maxWidth:400,lineHeight:1.8
      }}>Thank you for existing.</p>
      <div style={{
        marginTop:"2rem",
        transition:"opacity 2s ease",opacity:phase>=4?1:0
      }}>
        {Array.from({length:7}).map((_,i)=>(
          <span key={i} style={{
            fontSize:rand(0.8,1.4)+"rem",
            color:`rgba(212,169,106,${rand(0.2,0.6)})`,
            margin:`0 ${rand(4,12)}px`,
            animation:`heartBeat ${rand(1.5,3)}s ${rand(0,1)}s ease-in-out infinite`
          }}>✦</span>
        ))}
      </div>
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded,setLoaded]=useState(false);
  const [music,setMusic]=useState(false);

  const audioRef = useRef(null);

useEffect(() => {
  audioRef.current = new Audio("../public/music/asyouare.mp3");
  audioRef.current.loop = true;
  audioRef.current.volume = 0.5;

  return () => {
    audioRef.current.pause();
  };
}, []);

const toggleMusic = () => {
  if (!audioRef.current) return;

  if (music) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }

  setMusic(!music);
};
  
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#0a0608;color:#f5ebe1;font-family:'Cormorant Garamond',Georgia,serif;overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:rgba(10,6,8,0.5);}
        ::-webkit-scrollbar-thumb{background:rgba(196,99,122,0.3);border-radius:2px;}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes floatUp{0%{transform:translateY(110vh) translateX(0);}100%{transform:translateY(-10vh) translateX(var(--drift,0px));}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes pulseBar{0%,100%{opacity:0.3;}50%{opacity:1;}}
        @keyframes glowPulse{0%,100%{opacity:0.6;}50%{opacity:1;}}
        @keyframes scrollBounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(8px);}}
        @keyframes heartBeat{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes fillBar{from{width:0%;}to{width:100%;}}
      `}</style>
      <FilmGrain/>
      <Particles/>
      {!loaded&&<LoadingScreen onDone={()=>setLoaded(true)}/>}
      <div style={{opacity:loaded?1:0,transition:"opacity 0.8s ease"}}>
        <Hero/>
        <Gallery/>
        <UsGallery />
        <Timeline/>
        <Letters/>
        <TinyThings/>
        <FunSection/>
        <Ending/>
        <MusicToggle playing={music} toggle={toggleMusic}/>
        <div style={{height:"0.5px",background:"linear-gradient(to right,transparent,rgba(196,99,122,0.15),transparent)",margin:"0"}}/>
        <footer style={{
          textAlign:"center",padding:"3rem 2rem",
          fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:"italic",
          color:"rgba(212,169,106,0.25)",fontSize:"0.75rem",letterSpacing:"0.2em"
        }}>made with real feelings, by the boy himself.</footer>
      </div>
    </>
  );
}