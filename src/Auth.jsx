import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const switchMode = login => {
    setIsLogin(login);
    setMessage("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) setMessage(error.message);
      } else {
        if (!name.trim()) { setMessage("Please enter your name."); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() } }
        });
        if (error) setMessage(error.message);
        else if (data?.session) setMessage("Account created successfully.");
        else setMessage("Account created. Check your email to confirm your account.");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-premium-page">
      <div className="auth-orb auth-orb-one"/><div className="auth-orb auth-orb-two"/><div className="auth-grid"/>
      <div className="auth-premium-shell">
        <div className="auth-showcase-premium">
          <div className="auth-brand-premium"><div className="auth-brand-mark"><Sparkles size={18}/></div><span>LIFEOS</span></div>
          <div className="auth-live-badge"><span/> PERSONAL OPERATING SYSTEM</div>
          <h1>Run your life<br/><span>with intention.</span></h1>
          <p>One calm workspace for your goals, habits, study, money, notes, and everyday momentum.</p>
          <div className="auth-feature-grid"><div><TargetDot/><b>Track progress</b><small>Make growth visible.</small></div><div><ShieldCheck/><b>Stay consistent</b><small>Keep your routines close.</small></div><div><Sparkles/><b>Keep it simple</b><small>Less friction, more action.</small></div><div><LockKeyhole/><b>Private by design</b><small>Your account stays yours.</small></div></div>
        </div>

        <div className="auth-premium-card">
          <div className="auth-card-top"><div><p className="eyebrow">WELCOME TO LIFEOS</p><h2>{isLogin ? "Welcome back." : "Start your LifeOS."}</h2><p>{isLogin ? "Pick up where you left off." : "Create your personal workspace in seconds."}</p></div></div>
          <div className="auth-mode-toggle"><button className={isLogin?'active':''} onClick={()=>switchMode(true)}>Login</button><button className={!isLogin?'active':''} onClick={()=>switchMode(false)}>Create account</button></div>
          <form onSubmit={handleSubmit} className="auth-premium-form">
            {!isLogin && <label><span>Name</span><div className="auth-input-wrap"><UserRound size={16}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></div></label>}
            <label><span>Email</span><div className="auth-input-wrap"><Mail size={16}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div></label>
            <label><span>Password</span><div className="auth-input-wrap"><LockKeyhole size={16}/><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={isLogin?'current-password':'new-password'} minLength={6} required/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>
            {message && <div className="auth-premium-message">{message}</div>}
            <button className="auth-submit" disabled={loading}>{loading ? "Please wait..." : <>{isLogin?'Enter LifeOS':'Create my LifeOS'} <ArrowRight size={16}/></>}</button>
          </form>
          <div className="auth-trust"><ShieldCheck size={14}/> Secure authentication through Supabase</div>
        </div>
      </div>
      <div className="auth-footer">LifeOS · Build your life with intention.</div>
    </div>
  );
}

function TargetDot() { return <span className="auth-feature-icon"><span/></span>; }
