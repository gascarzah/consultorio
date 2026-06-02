import {Link} from "react-router-dom";

const OlvidePassword = () => {
  return (
    <>
    <h1 className={'text-sky-600 font-black text-6xl capitalize'}>Recupera tu acceso</h1>

      <form className={'my-10 bg-white shadow rounded p-10'}>
        <div className={'my-5'}>
          <label
              htmlFor={'email'}
              className={'uppercase text-gray-600 block font-bold'}
          >Email</label>

          <input
              id="email"
              type="email"
              placeholder={'Email de Registro'}
              className={'w-full mt-3 p-3 border rounded-xl bg-gray-50' }
          />
        </div>


        <input
            type="submit"
            value="Enviar instrucciones"
            className="bg-sky-700 mb-5 w-full rounded py-3 text-white font-bold
            uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
            to="/"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          Ya tienes una cuenta? Inicia Sesion
        </Link>
        <Link
            to="/registrar"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          No tienes una cuenta? Registrate
        </Link>
      </nav>

    </>

  )
}

export default OlvidePassword