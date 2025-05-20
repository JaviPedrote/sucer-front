import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.webp';
import { handlelogin } from '../services/authServices';
import { ThemeToggle } from '../components/ThemeToogle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loginUser } = useContext(AuthContext);

  /* redirect if already logged */
  useEffect(() => { if (user) navigate('/home', { replace: true }); }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await handlelogin({ email, password });
      loginUser(u);
      navigate('/home');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Credenciales incorrectas');
    } finally { setLoading(false); }
  }

  return (
    <main className="
        grid min-h-screen -mt-8 sm:mt-0 place-items-center bg-gradient-to-br from-secondary-200 via-secondary-900 to-secondary-200 px-4
        dark:bg-gradient-to-br dark:from-primary-800 dark:via-primary-900 dark:to-primary-900
      ">
        <info className="absolute top-0 left-0 z-10 mt-4 ml-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span className="text-amber-500 dark:text-amber-400">Usuarios de Prueba</span> de Sucer
        <br />
        -adminejemplo@gmail.com
        <br />
        -tutorejemplo@gmail.com
        <br />
        -alumnoejemplo@gmail.com
        <br />
        Y la  contraseña de todos es "12345678"
        <br />
        </info>
      
      <div aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 w-1/2 origin-top-left -skew-x-12
                      shadow-xl blur-sm
                      hidden lg:block dark:hidden" />


      <motion.section
        className="
          relative z-10 mx-auto w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl
          ring-1 ring-secondary-200/70 dark:ring-white/10
          bg-secondary-50/90 backdrop-blur-md bg-gradient-to-br from-secondary-100 via-secondary-50 to-white
            dark:bg-gradient-to-br dark:from-primary-800 dark:via-primary-900 dark:to-primary-800
        "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .45 }}
      >
        <header className="
            flex flex-col items-center gap-3 px-10 pb-0 sm:pb-8 pt-10
            
          ">
          <ThemeToggle className='absolute right-5 top-5 ' />
          <img src={logo} alt="Sucer" className="h-20 w-20 rounded-2xl shadow" />
          <p className="max-w-xs text-center text-sm text-slate-600 dark:text-slate-300">
            Tablón de anuncios para tu centro educativo
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 px-10 pb-10 pt-8">
        

          <Field
            id="email" type="email" label="Correo electrónico"
            value={email} onChange={setEmail} placeholder="email@ejemplo.com"
            autoComplete="email"
            />
          
          <Field
            id="password" type="password" label="Contraseña"
            value={password} onChange={setPassword} placeholder="********"
          />

          {/* <div className="flex justify-end text-xs">
            <a href="#" className="text-brand-600 hover:underline dark:text-amber-400">
              ¿Olvidaste tu contraseña?
            </a>
          </div> */}

          <button
            type="submit" disabled={loading}
            className="
              w-full rounded-lg bg-secondary-700 hover:bg-secondary-500 py-3 text-primary-700 font-semibold dark:text-white shadow-md transition
              active:scale-95 disabled:opacity-60 dark:bg-amber-500 dark:hover:bg-amber-600
            ">
            {loading ? 'Iniciando sesion...' : 'Entrar'}
          </button>

          {/* <p className="pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            ¿Eres nuevo en Sucer?&nbsp;
            <a href="#" className="font-medium text-brand-600 hover:underline dark:text-amber-400">
              Regístrate aquí
            </a>
          </p> */}
        </form>
      </motion.section>
    </main>
  );
}

/* ---------- Campo input reutilizable ---------- */
function Field({ id, label, type, placeholder, value, onChange }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        id={id} type={type} required placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
        value={value} onChange={e => onChange(e.target.value)}
        className="
          w-full rounded-lg border border-secondary-200 bg-white/70 px-4 py-2
          shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary-400
          dark:border-slate-600 dark:bg-slate-200 dark:text-primary-800 dark:placeholder:text-slate-500
        "
      />
    </div>
  );
}
