import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { loadAuthProfile, login } from "../slices/authSlice";
import { VALIDATION_MESSAGES } from "../utils/ValidationMessages";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED.EMAIL),
  password: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.PASSWORD),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const { password } = values;

    if (password.length < 6) {
      toast.error(VALIDATION_MESSAGES.ERROR.PASSWORD_CORTO);
      return;
    }

    dispatch(login(values))
      .unwrap()
      .then(() => dispatch(loadAuthProfile(values.email)).unwrap())
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => {
        toast.error(VALIDATION_MESSAGES.ERROR.USUARIO_NO_EXISTE);
      });
  };

  return (
    <>
      <h1 className="text-sky-600 text-center font-black text-6xl ">
        Inicia Sesión
      </h1>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validationSchema={loginSchema}
      >
        {() => (
            <Form className={"my-10 bg-white shadow rounded p-10"}>

              <div className="my-5">
                <label
                  htmlFor="email"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Email
                </label>
                <Field
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name={"email"}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="my-5">
                <label
                  htmlFor="password"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Password
                </label>
                <Field
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  name={"password"}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <input
                type="submit"
                value="Iniciar Sesión"
                className="bg-sky-700 mb-5 w-full rounded py-3 text-white font-bold
                uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
              />
            </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
