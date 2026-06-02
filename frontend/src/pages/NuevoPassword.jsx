import {Link} from "react-router-dom";

const NuevoPassword = () => {
  return (
      <>
    <h1 className={'text-sky-600 text-5xl font-black capitalize text-center'}>Restablece tu password</h1>
        <form className={'my-10 bg-white shadow rounded p-10'}>

          <div className="my-5">
            <label
                htmlFor="password"
                className="uppercase text-gray-600 block font-bold"
            >
              Password
            </label>
            <input
                id="password"
                type="password"
                placeholder="Escribe tu nuevo password"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "

            />
          </div>

          <input
              type="submit"
              value="Guardar nuevo password"
              className="bg-sky-700 mb-5 w-full rounded py-3 text-white font-bold
            uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>

          <Link to={'/'} className={'block text-center my-5 text-slate-500 uppercase text-sm'}>
            Inicia sesion
          </Link>

  </>
  )
}

export default NuevoPassword